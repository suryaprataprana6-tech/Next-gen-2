"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Code2, 
  Database, 
  Bot, 
  TrendingUp, 
  Target, 
  HardDrive, 
  Layers 
} from "lucide-react";
import LaptopScreenStory from "./LaptopScreenStory";

export default function CinematicHero3D() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax tilt tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Subtle 3D tilt calculation (Max 12 degrees tilt)
  const tiltX = mousePos.y * -10;
  const tiltY = mousePos.x * 12;

  // Floating Glass Cards around Laptop requested in prompt
  const floatingGlassCards = [
    { name: "Next.js", icon: Zap, pos: "-top-6 -left-4", gradient: "from-slate-900 to-slate-800 text-white border-white/20" },
    { name: "React", icon: Code2, pos: "-top-6 -right-4", gradient: "from-blue-900/80 to-slate-900 text-cyan-400 border-cyan-500/30" },
    { name: "TypeScript", icon: Code2, pos: "top-1/4 -right-10", gradient: "from-blue-950 to-slate-900 text-blue-400 border-blue-500/30" },
    { name: "Supabase", icon: HardDrive, pos: "bottom-1/4 -right-10", gradient: "from-emerald-950 to-slate-900 text-emerald-400 border-emerald-500/30" },
    { name: "AI Automation", icon: Bot, pos: "-bottom-6 -right-4", gradient: "from-purple-950 to-slate-900 text-purple-400 border-purple-500/30" },
    { name: "SEO", icon: TrendingUp, pos: "-bottom-6 -left-4", gradient: "from-teal-950 to-slate-900 text-teal-400 border-teal-500/30" },
    { name: "Meta Ads", icon: Target, pos: "bottom-1/4 -left-10", gradient: "from-rose-950 to-slate-900 text-rose-400 border-rose-500/30" },
    { name: "CRM", icon: Database, pos: "top-1/4 -left-10", gradient: "from-amber-950 to-slate-900 text-amber-400 border-amber-500/30" },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center perspective-[1200px] select-none">
      
      {/* Background Animated Gradient Mesh & Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-brand-600/30 via-accent-violet/30 to-accent-rose/20 blur-[90px] animate-pulse-glow" />
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-cyan-500/20 blur-[80px] animate-float-slow" />
      </div>

      {/* 3D Laptop Container - OPEN IMMEDIATELY ON LOAD */}
      <motion.div
        initial={{ y: 0, opacity: 1, rotateX: 6 }}
        animate={{
          rotateX: tiltX + 6,
          rotateY: tiltY,
          y: [0, -6, 0],
        }}
        transition={{
          rotateX: { type: "spring", stiffness: 120, damping: 22 },
          rotateY: { type: "spring", stiffness: 120, damping: 22 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-[92%] sm:w-[480px] h-[300px] sm:h-[320px] transform-style-3d z-10"
      >
        
        {/* Laptop Lid (Screen open at 0° relative angle, fully visible) */}
        <div className="relative w-full h-[230px] sm:h-[250px] bg-slate-900 rounded-t-2xl border-4 border-slate-700 shadow-2xl overflow-hidden border-b-0">
          
          {/* Bezel Web Camera */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-950 border border-slate-800 z-30 flex items-center justify-center">
            <span className="w-0.5 h-0.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Screen Content Story Loop */}
          <div className="w-full h-full pt-3">
            <LaptopScreenStory />
          </div>

          {/* Glass Reflection Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50 z-20" />
        </div>

        {/* Laptop Hinge */}
        <div className="w-full h-3 bg-slate-800 border-x-4 border-slate-700 flex justify-center items-center">
          <div className="w-24 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* Laptop Keyboard Base */}
        <div className="relative w-[104%] -left-[2%] h-[60px] sm:h-[70px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-b-2xl border-x-4 border-b-4 border-slate-700 shadow-2xl p-2 flex flex-col justify-between">
          
          {/* Soft Keyboard RGB reflections */}
          <div className="w-full h-7 bg-slate-950 rounded-lg border border-slate-800 p-1 flex flex-col gap-0.5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-accent-violet/30 to-accent-rose/20 blur-[2px] animate-pulse" />
            <div className="flex gap-0.5 h-full opacity-60">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-800/80 rounded-[2px]" />
              ))}
            </div>
          </div>

          {/* Trackpad */}
          <div className="self-center w-24 h-5 rounded-md bg-slate-900 border border-slate-800" />
        </div>

        {/* Floating Glass Badges around Laptop */}
        {floatingGlassCards.map((badge, idx) => {
          const IconComp = badge.icon;
          return (
            <motion.div
              key={badge.name}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: idx * 0.4,
                ease: "easeInOut",
              }}
              className={`absolute ${badge.pos} hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-card bg-gradient-to-r ${badge.gradient} shadow-lg text-xs font-bold border backdrop-blur-md z-30 hover:scale-110 transition-transform`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{badge.name}</span>
            </motion.div>
          );
        })}

      </motion.div>

    </div>
  );
}
