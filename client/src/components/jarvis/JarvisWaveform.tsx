"use client";

import React, { useEffect, useState } from "react";
import { JarvisState } from "@/hooks/useJarvisVoice";

interface JarvisWaveformProps {
  state: JarvisState;
  audioLevel?: number; // 0 to 100
  barCount?: number;
}

export default function JarvisWaveform({
  state,
  audioLevel = 0,
  barCount = 28,
}: JarvisWaveformProps) {
  const [randomHeights, setRandomHeights] = useState<number[]>(
    Array(barCount).fill(4)
  );

  useEffect(() => {
    if (state === "sleeping") {
      setRandomHeights(Array(barCount).fill(4));
      return;
    }

    const interval = setInterval(() => {
      setRandomHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Center-weighted distribution
          const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
          const weight = 1 - distFromCenter * 0.6;

          if (state === "speaking") {
            const base = Math.random() * 32 + 12;
            return Math.max(4, Math.round(base * weight));
          }

          if (state === "listening") {
            const dynamicScale = Math.max(6, (audioLevel / 100) * 44);
            const variation = (Math.random() * 0.5 + 0.5) * dynamicScale;
            return Math.max(4, Math.round(variation * weight));
          }

          if (state === "thinking") {
            const sinVal = Math.sin(Date.now() / 200 + i * 0.4);
            return Math.max(4, Math.round((sinVal * 12 + 16) * weight));
          }

          return 4;
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, [state, audioLevel, barCount]);

  const getBarColor = (index: number) => {
    switch (state) {
      case "listening":
        return "bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.7)]";
      case "thinking":
        return "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]";
      case "speaking":
        return "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]";
      case "sleeping":
      default:
        return "bg-slate-700/60";
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 h-12 px-4 py-2 select-none">
      {randomHeights.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-75 ${getBarColor(i)}`}
          style={{
            height: `${h}px`,
          }}
        />
      ))}
    </div>
  );
}

