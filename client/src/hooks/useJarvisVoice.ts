"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type JarvisState = "sleeping" | "listening" | "thinking" | "speaking";

export interface TranscriptItem {
  id: string;
  role: "user" | "jarvis";
  text: string;
  timestamp: string;
  action?: string;
  data?: any;
}

// ----------------------------------------------------------------------
// High-Tech Ambient HUD Audio Synthesizer (Warm, Elegant Chords)
// ----------------------------------------------------------------------
class JarvisAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Warm, Ascending Futuristic Wake Tone
  playBoot() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Soft harmonic frequencies (E4, G#4, B4, E5)
      const freqs = [329.63, 415.3, 493.88, 659.25];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch (e) {}
  }

  // Gentle Executive Acknowledgment Ping
  playAcknowledge() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }

  // Calm Harmonic Power-Down Chord
  playSleep() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [659.25, 493.88, 415.3, 329.63];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.32);
      });
    } catch (e) {}
  }

  // Subtle Neural Processing Ping
  playPing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1174.66, now); // D6
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }
}

const jarvisSynth = new JarvisAudioSynthesizer();

// ----------------------------------------------------------------------
// Dynamic Natural Female Voice Selector Engine
// ----------------------------------------------------------------------
function pickBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().includes("en")
  );

  const pool = englishVoices.length > 0 ? englishVoices : voices;

  // Known preferred female voice keywords and names across OSs (Windows, Mac, Chrome, Edge)
  const femaleKeywords = [
    "jenny",
    "aria",
    "sonia",
    "libby",
    "neerja",
    "natasha",
    "clara",
    "samantha",
    "victoria",
    "karen",
    "serena",
    "moira",
    "tessa",
    "veena",
    "zira",
    "heera",
    "female",
  ];

  const maleKeywords = [
    "david",
    "george",
    "guy",
    "mark",
    "prabhat",
    "ravi",
    "james",
    "richard",
    "daniel",
    "oliver",
    "stefan",
    "male",
  ];

  const scored = pool.map((v) => {
    let score = 0;
    const nameLower = v.name.toLowerCase();
    const langLower = v.lang.toLowerCase();

    // English language preference
    if (langLower.startsWith("en")) score += 100;
    if (langLower.includes("en-in") || langLower.includes("en-gb") || langLower.includes("en-us")) {
      score += 20;
    }

    // Natural / Neural online voices (modern high-fidelity)
    if (nameLower.includes("natural") || nameLower.includes("neural") || nameLower.includes("online")) {
      score += 70;
    }

    // Top tier specific voices
    if (nameLower.includes("google uk english female")) score += 120;
    if (nameLower.includes("microsoft jenny")) score += 110;
    if (nameLower.includes("microsoft aria")) score += 110;
    if (nameLower.includes("microsoft sonia")) score += 105;
    if (nameLower.includes("microsoft neerja")) score += 105;
    if (nameLower.includes("samantha")) score += 95;
    if (nameLower.includes("victoria")) score += 95;

    // Female keyword check
    if (femaleKeywords.some((k) => nameLower.includes(k))) {
      score += 80;
    }

    // Penalize male voices heavily
    if (maleKeywords.some((k) => nameLower.includes(k))) {
      score -= 500;
    }

    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored.length > 0 && scored[0].score > 0) {
    return scored[0].voice;
  }

  return pool[0] || null;
}

export function useJarvisVoice(authToken?: string) {
  const [state, setState] = useState<JarvisState>("sleeping");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [interimText, setInterimText] = useState<string>("");
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isContinuousActiveRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const serverTtsAvailableRef = useRef<boolean | null>(null);

  // Initialize Voices & Test Server-Side TTS Availability
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const ttsSupported = "speechSynthesis" in window;
      setSpeechSupported(!!SpeechRecognitionClass && ttsSupported);

      const updateVoices = () => {
        if ("speechSynthesis" in window) {
          const voices = window.speechSynthesis.getVoices();
          const best = pickBestFemaleVoice(voices);
          selectedVoiceRef.current = best;
        }
      };

      updateVoices();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      // Check server-side TTS endpoint configuration
      if (authToken) {
        fetch("/api/admin/jarvis/tts", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && data.serverTtsEnabled) {
              serverTtsAvailableRef.current = true;
            } else {
              serverTtsAvailableRef.current = false;
            }
          })
          .catch(() => {
            serverTtsAvailableRef.current = false;
          });
      }
    }
  }, [authToken]);

  // Natural Speech Delivery with Conversational Cadence
  const speakText = useCallback(
    async (text: string, onEndCallback?: () => void) => {
      if (typeof window === "undefined") {
        if (onEndCallback) onEndCallback();
        return;
      }

      // Stop any existing speech or audio
      if (activeAudioElementRef.current) {
        try {
          activeAudioElementRef.current.pause();
          activeAudioElementRef.current = null;
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (isMuted) {
        if (onEndCallback) onEndCallback();
        return;
      }

      setState("speaking");

      // 1. ATTEMPT SERVER-SIDE HIGH-FIDELITY TTS (If Configured)
      if (serverTtsAvailableRef.current && authToken) {
        try {
          const res = await fetch("/api/admin/jarvis/tts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ text }),
          });

          if (res.ok && res.headers.get("content-type")?.includes("audio")) {
            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            activeAudioElementRef.current = audio;

            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              activeAudioElementRef.current = null;
              if (onEndCallback) {
                onEndCallback();
              } else if (isContinuousActiveRef.current) {
                startListening();
              } else {
                setState("sleeping");
              }
            };

            audio.onerror = () => {
              URL.revokeObjectURL(audioUrl);
              activeAudioElementRef.current = null;
              // Fallback to browser speech synthesis
              speakWithBrowserTts(text, onEndCallback);
            };

            await audio.play();
            return;
          }
        } catch (e) {
          console.warn("Server TTS play attempt fallback to browser:", e);
        }
      }

      // 2. HIGH-QUALITY BROWSER NATURAL FEMALE TTS
      speakWithBrowserTts(text, onEndCallback);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMuted, authToken]
  );

  // Browser TTS with Natural Sentence Chunking and Micro-Pacing
  const speakWithBrowserTts = useCallback(
    (text: string, onEndCallback?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (onEndCallback) onEndCallback();
        return;
      }

      window.speechSynthesis.cancel();

      // Split into natural sentences for conversational breathing and phrasing
      const sentences = text
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length === 0) {
        if (onEndCallback) onEndCallback();
        return;
      }

      let currentIndex = 0;

      const speakNextSentence = () => {
        if (currentIndex >= sentences.length) {
          if (onEndCallback) {
            onEndCallback();
          } else if (isContinuousActiveRef.current) {
            startListening();
          } else {
            setState("sleeping");
          }
          return;
        }

        const sentence = sentences[currentIndex];
        const utterance = new SpeechSynthesisUtterance(sentence);

        if (selectedVoiceRef.current) {
          utterance.voice = selectedVoiceRef.current;
        }

        // Natural, warm conversational female pitch & confident executive rate
        // Subtle micro-variation based on sentence position for natural melody
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === sentences.length - 1;

        utterance.pitch = isFirst ? 1.04 : isLast ? 1.01 : 1.02; // Warm, natural female inflection
        utterance.rate = 0.98; // Calm, poised conversational cadence (not rushed, not robotic)

        utterance.onend = () => {
          currentIndex++;
          // Conversational micro-pause (60ms) between sentences to breathe naturally
          setTimeout(speakNextSentence, 60);
        };

        utterance.onerror = (e) => {
          console.warn("Speech synthesis notice:", e);
          currentIndex++;
          setTimeout(speakNextSentence, 40);
        };

        window.speechSynthesis.speak(utterance);
      };

      speakNextSentence();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (activeAudioElementRef.current) {
      try {
        activeAudioElementRef.current.pause();
        activeAudioElementRef.current = null;
      } catch (e) {}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (state === "speaking") {
      setState("listening");
    }
  }, [state]);

  // Send Query to Secure Backend
  const sendCommand = useCallback(
    async (queryText: string, confirmedAction = false) => {
      const clean = queryText.trim();
      if (!clean) return;

      const userItemId = `msg-${Date.now()}`;
      const nowStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Append user entry to transcript
      setTranscript((prev) => [
        ...prev,
        {
          id: userItemId,
          role: "user",
          text: clean,
          timestamp: nowStr,
        },
      ]);

      setState("thinking");
      jarvisSynth.playPing();

      try {
        const response = await fetch("/api/admin/jarvis/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            message: clean,
            confirmedAction,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Admin authentication required.");
          }
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();
        const jarvisResponseText = data.reply || "Of course, Surya. Right away.";
        const speechText = data.speechReply || jarvisResponseText;

        const jarvisItemId = `jarvis-${Date.now()}`;
        setTranscript((prev) => [
          ...prev,
          {
            id: jarvisItemId,
            role: "jarvis",
            text: jarvisResponseText,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            action: data.action,
            data: data.data,
          },
        ]);

        if (data.action === "sleep") {
          jarvisSynth.playSleep();
          isContinuousActiveRef.current = false;
          speakText(speechText, () => {
            setState("sleeping");
          });
        } else {
          // Speak output aloud, then resume listening loop
          speakText(speechText, () => {
            if (isContinuousActiveRef.current) {
              startListening();
            } else {
              setState("listening");
            }
          });
        }
      } catch (err: any) {
        console.error("JARVIS Command Error:", err);
        setErrorMsg(err.message || "Failed to process voice command.");
        setState("listening");
        const errMsg = "I'm sorry, Surya. I ran into a brief connection issue.";
        speakText(errMsg);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authToken, speakText]
  );

  // Start Speech Recognition
  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMsg("Voice recognition is not supported in this browser.");
      setState("listening");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setState("listening");
        setErrorMsg(null);
        setInterimText("");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (final) {
          setInterimText("");
          jarvisSynth.playAcknowledge();
          sendCommand(final);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          if (isContinuousActiveRef.current && state === "listening") {
            try {
              recognition.start();
            } catch (e) {}
          }
          return;
        }
        console.warn("Speech recognition notice:", event.error);
        if (event.error !== "aborted") {
          setErrorMsg(`Voice input: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (isContinuousActiveRef.current && state === "listening") {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Could not start SpeechRecognition:", e);
    }
  }, [state, sendCommand]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setInterimText("");
  }, []);

  // Activate JARVIS (Wake-up Protocol)
  const wakeUp = useCallback(() => {
    jarvisSynth.playBoot();
    isContinuousActiveRef.current = true;
    setState("speaking");

    // Natural, polished female executive assistant greeting
    const greeting = "Welcome back, Surya. JARVIS is online. How can I help you?";

    setTranscript((prev) => [
      ...prev,
      {
        id: `greeting-${Date.now()}`,
        role: "jarvis",
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    ]);

    speakText(greeting, () => {
      startListening();
    });
  }, [speakText, startListening]);

  // Put JARVIS to sleep
  const goToSleep = useCallback(() => {
    jarvisSynth.playSleep();
    isContinuousActiveRef.current = false;
    stopListening();
    if (activeAudioElementRef.current) {
      try {
        activeAudioElementRef.current.pause();
        activeAudioElementRef.current = null;
      } catch (e) {}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState("sleeping");
  }, [stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isContinuousActiveRef.current = false;
      stopListening();
      if (activeAudioElementRef.current) {
        try {
          activeAudioElementRef.current.pause();
          activeAudioElementRef.current = null;
        } catch (e) {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopListening]);

  return {
    state,
    transcript,
    interimText,
    isMuted,
    speechSupported,
    errorMsg,
    wakeUp,
    goToSleep,
    sendCommand,
    stopSpeaking,
    toggleMute: () => setIsMuted((m) => !m),
    startListening,
    stopListening,
  };
}
