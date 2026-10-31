"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface DoubleClapOptions {
  onDoubleClap?: () => void;
  minIntervalMs?: number; // default 300ms
  maxIntervalMs?: number; // default 750ms
  thresholdMultiplier?: number; // multiplier over ambient noise
  minThreshold?: number; // absolute minimum threshold (0.0 to 1.0)
  cooldownMs?: number; // default 2500ms
}

export type ClapDetectionStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "first_clap"
  | "detected"
  | "cooldown"
  | "denied"
  | "unsupported";

export function useDoubleClap(options: DoubleClapOptions = {}) {
  const {
    onDoubleClap,
    minIntervalMs = 300,
    maxIntervalMs = 750,
    thresholdMultiplier = 3.5,
    minThreshold = 0.38,
    cooldownMs = 2500,
  } = options;

  const [status, setStatus] = useState<ClapDetectionStatus>("idle");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [clapCount, setClapCount] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Audio Context & Stream Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Detection Algorithm State Refs
  const ambientNoiseRef = useRef<number>(0.05);
  const lastClapTimeRef = useRef<number>(0);
  const waitingForSecondClapRef = useRef<boolean>(false);
  const inCooldownRef = useRef<boolean>(false);
  const hasFallenBelowThresholdRef = useRef<boolean>(true);

  // Check support on mount
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
      !!(window.AudioContext || (window as any).webkitAudioContext);
    setIsSupported(supported);
  }, []);

  // Stop listening and release hardware resources cleanly
  const stopClapDetection = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      streamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        if (audioCtxRef.current.state !== "closed") {
          audioCtxRef.current.close();
        }
      } catch (e) {
        // ignore
      }
      audioCtxRef.current = null;
    }

    waitingForSecondClapRef.current = false;
    inCooldownRef.current = false;
    setClapCount(0);
    setAudioLevel(0);
    setStatus("idle");
  }, []);

  // Start listening with explicit opt-in
  const startClapDetection = useCallback(async () => {
    if (!isSupported) {
      setStatus("unsupported");
      return false;
    }

    stopClapDetection();
    setStatus("requesting");

    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      // Ensure audio context is running (handles browser autoplay policies)
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // Request microphone stream without automatic gain/noise suppression to preserve raw transient spikes (claps)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.1; // Fast response for transients
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setStatus("listening");

      const processAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate peak amplitude deviation from center (128)
        let maxDeviation = 0;
        for (let i = 0; i < bufferLength; i++) {
          const deviation = Math.abs(dataArray[i] - 128);
          if (deviation > maxDeviation) {
            maxDeviation = deviation;
          }
        }

        const normalizedLevel = maxDeviation / 128; // 0.0 to 1.0
        setAudioLevel(Math.round(normalizedLevel * 100));

        // Smooth running estimate of ambient room noise
        ambientNoiseRef.current =
          ambientNoiseRef.current * 0.95 + normalizedLevel * 0.05;

        const dynamicThreshold = Math.max(
          minThreshold,
          ambientNoiseRef.current * thresholdMultiplier
        );

        const now = performance.now();

        // Check if we are in cooldown
        if (inCooldownRef.current) {
          if (now - lastClapTimeRef.current > cooldownMs) {
            inCooldownRef.current = false;
            setStatus("listening");
            setClapCount(0);
          }
          animFrameRef.current = requestAnimationFrame(processAudio);
          return;
        }

        // Check timeout for waiting for second clap
        if (waitingForSecondClapRef.current) {
          const elapsedSinceFirst = now - lastClapTimeRef.current;
          if (elapsedSinceFirst > maxIntervalMs) {
            // Timed out: reset
            waitingForSecondClapRef.current = false;
            setClapCount(0);
            setStatus("listening");
          }
        }

        // Reset threshold barrier when sound dips back down
        if (normalizedLevel < dynamicThreshold * 0.5) {
          hasFallenBelowThresholdRef.current = true;
        }

        // Detect Peak Spike
        if (
          normalizedLevel > dynamicThreshold &&
          hasFallenBelowThresholdRef.current
        ) {
          hasFallenBelowThresholdRef.current = false;

          if (!waitingForSecondClapRef.current) {
            // First clap detected!
            waitingForSecondClapRef.current = true;
            lastClapTimeRef.current = now;
            setClapCount(1);
            setStatus("first_clap");
          } else {
            // Potential second clap
            const interval = now - lastClapTimeRef.current;

            if (interval >= minIntervalMs && interval <= maxIntervalMs) {
              // VALID DOUBLE CLAP DETECTED!
              waitingForSecondClapRef.current = false;
              inCooldownRef.current = true;
              lastClapTimeRef.current = now;
              setClapCount(2);
              setStatus("detected");

              if (onDoubleClap) {
                onDoubleClap();
              }
            } else if (interval < minIntervalMs) {
              // Too quick (echo or sustained noise artifact) - ignore
            } else {
              // Too late, treat this as new first clap
              waitingForSecondClapRef.current = true;
              lastClapTimeRef.current = now;
              setClapCount(1);
              setStatus("first_clap");
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(processAudio);
      };

      animFrameRef.current = requestAnimationFrame(processAudio);
      return true;
    } catch (err: any) {
      console.warn("Microphone access declined or unavailable:", err);
      setStatus("denied");
      stopClapDetection();
      return false;
    }
  }, [
    isSupported,
    minIntervalMs,
    maxIntervalMs,
    minThreshold,
    thresholdMultiplier,
    cooldownMs,
    onDoubleClap,
    stopClapDetection,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopClapDetection();
    };
  }, [stopClapDetection]);

  return {
    isListening: status === "listening" || status === "first_clap",
    status,
    audioLevel,
    clapCount,
    isSupported,
    startClapDetection,
    stopClapDetection,
  };
}

