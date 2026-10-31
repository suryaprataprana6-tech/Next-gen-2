import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const provider = (process.env.JARVIS_TTS_PROVIDER || 'browser').toLowerCase().trim();
  const apiKey = (process.env.JARVIS_TTS_API_KEY || '').trim();
  const isConfigured = Boolean(apiKey && provider !== 'browser');

  return NextResponse.json({
    success: true,
    serverTtsEnabled: isConfigured,
    provider: isConfigured ? provider : 'browser',
  });
}

export async function POST(request: Request) {
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text, voice } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, message: 'Text is required for TTS' }, { status: 400 });
    }

    const provider = (process.env.JARVIS_TTS_PROVIDER || 'browser').toLowerCase().trim();
    const apiKey = (process.env.JARVIS_TTS_API_KEY || '').trim();

    // If server TTS is not configured, inform client to use high-quality browser voice
    if (!apiKey || provider === 'browser') {
      return NextResponse.json({
        success: false,
        useBrowserTts: true,
        message: 'Server TTS not configured. Using high-fidelity browser voice engine.',
      });
    }

    // 1. ELEVENLABS PROVIDER (Natural Female Voice)
    if (provider === 'elevenlabs') {
      // Default to "Rachel" (21m00Tcm4TlvDq8ikWAM) - warm, calm, professional female executive assistant
      const voiceId = process.env.JARVIS_TTS_VOICE_ID || voice || '21m00Tcm4TlvDq8ikWAM';
      const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.85,
            style: 0.15,
            use_speaker_boost: true,
          },
        }),
      });

      if (!elevenRes.ok) {
        console.warn(`ElevenLabs TTS failed with HTTP ${elevenRes.status}. Falling back to browser TTS.`);
        return NextResponse.json({ success: false, useBrowserTts: true });
      }

      const audioBuffer = await elevenRes.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // 2. OPENAI PROVIDER (Natural Female Voice)
    if (provider === 'openai') {
      // Default to "nova" (warm, expressive female) or "shimmer"
      const openAiVoice = process.env.JARVIS_TTS_VOICE_ID || voice || 'nova';
      const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: openAiVoice,
          input: text,
          speed: 1.0,
        }),
      });

      if (!openaiRes.ok) {
        console.warn(`OpenAI TTS failed with HTTP ${openaiRes.status}. Falling back to browser TTS.`);
        return NextResponse.json({ success: false, useBrowserTts: true });
      }

      const audioBuffer = await openaiRes.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // 3. GOOGLE CLOUD TTS PROVIDER
    if (provider === 'google') {
      const googleRes = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: 'en-US',
              name: process.env.JARVIS_TTS_VOICE_ID || 'en-US-Neural2-F',
              ssmlGender: 'FEMALE',
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: 1.0,
              pitch: 0.0,
            },
          }),
        }
      );

      if (googleRes.ok) {
        const data = await googleRes.json();
        if (data.audioContent) {
          const buffer = Buffer.from(data.audioContent, 'base64');
          return new Response(buffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'no-cache',
            },
          });
        }
      }

      return NextResponse.json({ success: false, useBrowserTts: true });
    }

    return NextResponse.json({ success: false, useBrowserTts: true });
  } catch (err) {
    console.warn('Server-side TTS execution error:', err);
    return NextResponse.json({ success: false, useBrowserTts: true });
  }
}

