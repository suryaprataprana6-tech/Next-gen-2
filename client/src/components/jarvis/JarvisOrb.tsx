"use client";

import React from "react";
import { motion } from "framer-motion";
import { JarvisState } from "@/hooks/useJarvisVoice";

interface JarvisOrbProps {
  state: JarvisState;
  audioLevel?: number; // 0 to 100
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function JarvisOrb({
  state,
  audioLevel = 0,
  onClick,
  size = "lg",
}: JarvisOrbProps) {
  // Dimensions based on size
  const dim = size === "lg" ? 280 : size === "md" ? 200 : 120;

  // Color schemes based on state
  const getThemeColors = () => {
    switch (state) {
      case "listening":
        return {
          core: "from-cyan-400 via-blue-500 to-indigo-600",
          glow: "rgba(0, 240, 255, 0.45)",
          ring: "border-cyan-400/60",
          pulseSpeed: 1.2,
          scale: 1 + audioLevel * 0.003,
        };
      case "thinking":
        return {
          core: "from-violet-400 via-purple-500 to-indigo-700",
          glow: "rgba(168, 85, 247, 0.5)",
          ring: "border-purple-400/70",
          pulseSpeed: 0.6,
          scale: 1.05,
        };
      case "speaking":
        return {
          core: "from-cyan-300 via-sky-400 to-blue-600",
          glow: "rgba(56, 189, 248, 0.6)",
          ring: "border-sky-300/80",
          pulseSpeed: 0.8,
          scale: 1.08,
        };
      case "sleeping":
      default:
        return {
          core: "from-slate-700 via-cyan-950 to-slate-900",
          glow: "rgba(6, 182, 212, 0.15)",
          ring: "border-cyan-800/30",
          pulseSpeed: 4,
          scale: 0.95,
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={state === "sleeping" ? "Click to Wake JARVIS" : "JARVIS Core"}
      className="relative flex items-center justify-center cursor-pointer select-none group focus:outline-none"
      style={{ width: dim, height: dim }}
    >
      {/* Outer Ambient Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700"
        style={{
          background: theme.glow,
        }}
        animate={{
          scale: state === "speaking" ? [1, 1.25, 1] : state === "listening" ? [1, 1.15, 1] : [0.9, 1, 0.9],
          opacity: state === "sleeping" ? 0.25 : 0.75,
        }}
        transition={{
          duration: theme.pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Outer Gyro Ring (Rotating Clockwise) */}
      <motion.div
        className={`absolute inset-0 rounded-full border border-dashed ${theme.ring} opacity-60`}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {/* HUD Orbital Node Marker */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
      </motion.div>

      {/* Middle Gyro Ring (Counter-Clockwise with Segmented Ticks) */}
      <motion.div
        className={`absolute inset-3 rounded-full border-2 border-dotted ${theme.ring} opacity-75`}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
      </motion.div>

      {/* Inner Precision Radar Ring */}
      <motion.div
        className="absolute inset-6 rounded-full border border-cyan-500/40"
        animate={{
          scale: state === "thinking" ? [0.95, 1.05, 0.95] : [1, 1.02, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Compass Crosshairs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-400/80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-400/80" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-cyan-400/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-cyan-400/80" />
      </motion.div>

      {/* Central Holographic Core Orb */}
      <motion.div
        className={`relative z-10 w-2/3 h-2/3 rounded-full bg-gradient-to-tr ${theme.core} shadow-2xl flex items-center justify-center overflow-hidden border border-white/20`}
        animate={{
          scale: theme.scale,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Internal Neural Vortex / Energy Core */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-black/60"
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Central HUD Reactor Iris */}
        <motion.div
          className="relative z-20 w-1/3 h-1/3 rounded-full bg-slate-950/80 border border-cyan-300/70 flex items-center justify-center shadow-[inset_0_0_12px_rgba(0,240,255,0.8)]"
          animate={{
            scale: state === "speaking" ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: theme.pulseSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Micro Arc Reactor Dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
        </motion.div>

        {/* State Label overlay when sleeping */}
        {state === "sleeping" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-full group-hover:bg-black/20 transition-colors">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold px-2 py-0.5 rounded bg-black/70 border border-cyan-500/30">
              STANDBY
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

