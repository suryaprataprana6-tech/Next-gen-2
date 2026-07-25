"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Code2, 
  Globe, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Rocket, 
  ShieldCheck,
  Video,
  Sparkles,
  Layers,
  Coffee,
  Laptop
} from "lucide-react";

export default function CinematicCameraHeroVisual() {
  // Act Timeline: 
  // Act 1 (0s-4s): Wide shot of developer at desk room
  // Act 2 (4s-8.5s): Camera Dolly Zoom into Laptop Screen (VS Code & Terminal Compile)
  // Act 3 (8.5s-12.5s): Screen morphs into Live NextGen Website Preview
  // Act 4 (12.5s-15s): Camera Dolly Zoom back out to Wide Shot
  const [act, setAct] = useState<1 | 2 | 3 | 4>(1);
  const [typedCode, setTypedCode] = useState("");
  const [buildStep, setBuildStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fullCodeText = [
    `import React from "react";`,
    `import { NextGenPlatform } from "@nextgen/core";`,
    ``,
    `export default function App() {`,
    `  return (`,
    `    <NextGenPlatform`,
    `      performance="99/100"`,
    `      aiEngine={true}`,
    `      revenueEngine={true}`,
    `    />`,
    `  );`,
    `}`
  ].join("\n");

  // Mouse Parallax Handler
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

  // 15-Second Cinematic Camera Dolly Loop
  useEffect(() => {
    const runCinematicLoop = () => {
      // Act 1: Wide Shot Room Setup
      setAct(1);
      setTypedCode("");

      // Act 2 (at 4.0s): Dolly Zoom into Screen & Terminal
      const t2 = setTimeout(() => {
        setAct(2);
        setBuildStep(1);
        setTimeout(() => setBuildStep(2), 600);
        setTimeout(() => setBuildStep(3), 1200);
        setTimeout(() => setBuildStep(4), 1800);
      }, 4000);

      // Act 3 (at 8.5s): Live Website Morph
      const t3 = setTimeout(() => {
        setAct(3);
      }, 8500);

      // Act 4 (at 12.5s): Zoom Back Out to Wide Shot
      const t4 = setTimeout(() => {
        setAct(4);
      }, 12500);

      return [t2, t3, t4];
    };

    const initialTimers = runCinematicLoop();
    const cycleInterval = setInterval(() => {
      runCinematicLoop();
    }, 15000);

    return () => {
      clearInterval(cycleInterval);
      initialTimers.forEach(clearTimeout);
    };
  }, []);

  // Typewriter effect in Act 1 & 2
  useEffect(() => {
    if (act === 1 || act === 2) {
      let charIdx = 0;
      setTypedCode("");
      const typeInterval = setInterval(() => {
        if (charIdx <= fullCodeText.length) {
          setTypedCode(fullCodeText.slice(0, charIdx));
          charIdx += 2;
        } else {
          clearInterval(typeInterval);
        }
      }, 20);
      return () => clearInterval(typeInterval);
    }
  }, [act, fullCodeText]);

  // Subtle Mouse Parallax calculations
  const parallaxX = mousePos.x * 12;
  const parallaxY = mousePos.y * 10;

  // Camera Transformation per Act
  // Act 1: scale 1, position center
  // Act 2 & 3: scale 2.35, camera zooms directly into laptop screen (translateY -12%, scale 2.35)
  // Act 4: scale 1, return to wide shot
  const cameraScale = act === 2 || act === 3 ? 2.35 : 1;
  const cameraY = act === 2 || act === 3 ? "-14%" : "0%";
  const backgroundBlur = act === 2 || act === 3 ? "blur(4px)" : "blur(0px)";

  return (
    <div ref={containerRef} className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center select-none overflow-hidden rounded-3xl border border-white/15 shadow-2xl bg-slate-950">
      
      {/* ── LAYER 1: Background Room & Ambient Lighting ─────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-600/30 via-accent-violet/25 to-accent-rose/20 blur-[110px] animate-pulse-glow" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-500/20 blur-[90px] animate-float-slow" />
        
        {/* Soft Window Softlight Room Reflection */}
        <div className="absolute top-4 left-6 w-32 h-20 rounded-2xl bg-white/5 border border-white/10 blur-sm transform -skew-x-12" />
      </div>

      {/* ── CAMERA MOTION WRAPPER (Simulates Dolly Zoom) ─────────── */}
      <motion.div
        animate={{
          scale: cameraScale,
          y: cameraY,
          x: parallaxX,
        }}
        transition={{
          duration: 1.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ filter: backgroundBlur }}
        className="relative w-full h-full flex items-center justify-center z-10 origin-center"
      >
        
        {/* ── LAYER 2: Stylized Desk & Developer Character ───────── */}
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-4 z-10 pointer-events-none">
          
          {/* Developer Character Vector Silhouette */}
          <div className="relative w-64 h-36 flex justify-center items-end opacity-90 mb-[-12px]">
            {/* Developer Head & Headset */}
            <div className="absolute top-2 w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
              <span className="w-12 h-2 bg-brand-500 rounded-full absolute -top-1 shadow-glow-primary" />
              <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
            </div>

            {/* Shoulders & Torso */}
            <div className="w-48 h-20 rounded-t-3xl bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700 flex justify-between px-6 items-center">
              <span className="w-3 h-6 bg-slate-700 rounded-full transform -rotate-12" />
              <span className="w-3 h-6 bg-slate-700 rounded-full transform rotate-12" />
            </div>
          </div>

          {/* Desk Surface Line */}
          <div className="w-[90%] h-4 rounded-xl bg-slate-900 border-t border-slate-700/80 shadow-2xl flex items-center justify-between px-8 relative z-20">
            {/* Coffee Mug */}
            <div className="w-4 h-5 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] text-amber-400 font-bold">
              <Coffee className="w-2.5 h-2.5 text-amber-400" />
            </div>

            {/* Desk Lamp Glow */}
            <div className="w-6 h-3 rounded-full bg-amber-400/20 blur-sm" />
          </div>
        </div>

        {/* ── LAYER 3: Central Laptop & Screen Story ──────────────── */}
        <div className="relative z-30 w-[84%] sm:w-[420px] h-[260px] sm:h-[280px] flex flex-col items-center justify-center">
          
          {/* Laptop Lid (Display Display Frame) */}
          <div className="relative w-full h-[220px] sm:h-[240px] bg-slate-950 rounded-t-2xl border-4 border-slate-700 shadow-2xl overflow-hidden border-b-0 flex flex-col">
            
            {/* Bezel Camera */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-950 border border-slate-800 z-40 flex items-center justify-center">
              <span className="w-0.5 h-0.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Screen Content Switcher */}
            <div className="w-full h-full pt-3 bg-[#0b0e14]">
              <AnimatePresence mode="wait">
                
                {/* ACT 1 & 2: VS Code Editor & Terminal */}
                {(act === 1 || act === 2) && (
                  <motion.div
                    key="vscode-screen"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex flex-col font-mono text-[9px] text-slate-200"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-2.5 py-1 bg-[#121722] border-b border-slate-800 text-[8px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="ml-1.5 font-semibold text-slate-200 flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-brand-400" /> NextGen.tsx
                        </span>
                      </div>
                      <span className="text-[7px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {act === 1 ? "Typing Code" : "Compiling..."}
                      </span>
                    </div>

                    {/* Code workspace */}
                    <div className="flex-1 p-2.5 leading-relaxed overflow-hidden relative">
                      <pre className="text-[10px]">
                        <code>
                          {(typedCode || "import React from \"react\";").split("\n").map((line, i) => (
                            <div key={i} className="flex">
                              <span className="w-4 text-slate-600 select-none text-[8px]">{i + 1}</span>
                              <span className="flex-1">
                                {line.includes("import") && <span className="text-purple-400">import </span>}
                                {line.includes("from") && <span className="text-pink-400">from </span>}
                                {line.includes("export") && <span className="text-purple-400">export default </span>}
                                {line.includes("function") && <span className="text-blue-400">function </span>}
                                {line.includes("return") && <span className="text-pink-400">return </span>}
                                {line.includes("NextGenPlatform") && <span className="text-cyan-400 font-bold">NextGenPlatform </span>}
                                <span className="text-slate-200">
                                  {line
                                    .replace("import ", "")
                                    .replace("from ", "")
                                    .replace("export default ", "")
                                    .replace("function ", "")
                                    .replace("return ", "")}
                                </span>
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                      <span className="inline-block w-1.5 h-3 bg-brand-400 animate-pulse ml-3" />
                    </div>

                    {/* ACT 2 Terminal slide up */}
                    <AnimatePresence>
                      {act === 2 && (
                        <motion.div
                          initial={{ y: 60, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-24 bg-[#07090e] border-t border-slate-800 p-2 font-mono text-[8px] space-y-1"
                        >
                          <div className="flex items-center gap-1 text-slate-400 border-b border-slate-800 pb-1">
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            <span className="font-bold text-slate-200">zsh terminal</span>
                          </div>

                          {buildStep >= 1 && <div className="text-slate-300">❯ npm run build</div>}
                          {buildStep >= 2 && (
                            <div className="text-amber-400 flex items-center gap-1">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Compiling App Router...
                            </div>
                          )}
                          {buildStep >= 3 && (
                            <div className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Build Successful in 0.8s!
                            </div>
                          )}
                          {buildStep >= 4 && (
                            <div className="text-cyan-400 flex items-center gap-1 font-bold animate-pulse">
                              🚀 Deployed Live System!
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                )}

                {/* ACT 3 & 4: Live Website Preview Morph */}
                {(act === 3 || act === 4) && (
                  <motion.div
                    key="live-preview-screen"
                    initial={{ opacity: 0.85, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.85 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col bg-slate-950 text-white overflow-hidden"
                  >
                    {/* Browser Address Bar */}
                    <div className="flex items-center justify-between px-2.5 py-1 bg-slate-900 border-b border-slate-800 text-[8px]">
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-[8px] w-48 justify-center">
                        <Globe className="w-2.5 h-2.5 text-emerald-400" />
                        <span>https://nextgendigital.com</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[7px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Live
                      </span>
                    </div>

                    {/* Live Preview Canvas */}
                    <div className="flex-1 p-3 bg-gradient-to-br from-slate-950 via-slate-900 to-dark-bg flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center text-white text-[8px] font-bold">
                            N
                          </div>
                          <span className="font-heading font-extrabold text-[10px] text-white">NextGen</span>
                        </div>
                        <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                          Digital Solutions
                        </span>
                      </div>

                      <div className="my-auto space-y-1 py-1">
                        <h4 className="font-heading text-[11px] font-extrabold text-white leading-snug">
                          Engineering Scalable <span className="text-gradient">Digital Experiences</span>
                        </h4>
                        <p className="text-[8px] text-slate-300 line-clamp-2">
                          Building premium websites, AI lead engines, and CRM platforms.
                        </p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-bold text-[7px]">
                            Hire Me
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold text-[7px]">
                            View Projects
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[7px] text-slate-400">
                        <span>Traffic: 48,290+</span>
                        <span className="text-emerald-400 font-bold">Lighthouse 99/100</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            
            {/* Glass Screen Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50 z-30" />
          </div>

          {/* Laptop Hinge */}
          <div className="w-full h-2.5 bg-slate-800 border-x-4 border-slate-700 flex justify-center items-center">
            <div className="w-20 h-1 rounded-full bg-slate-950" />
          </div>

          {/* Laptop Base (Keyboard & Trackpad) */}
          <div className="relative w-[104%] h-[40px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-b-xl border-x-4 border-b-4 border-slate-700 shadow-2xl p-1.5 flex flex-col justify-between">
            <div className="w-full h-4 bg-slate-950 rounded border border-slate-800 p-0.5 flex gap-0.5 opacity-60">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-800/80 rounded-[1px]" />
              ))}
            </div>
            <div className="self-center w-16 h-3 rounded bg-slate-900 border border-slate-800" />
          </div>

        </div>
      </motion.div>

      {/* ── LAYER 4: Floating Camera HUD & Trust Signals ─────────── */}
      {/* Top Camera Status Indicator */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 border border-white/15 text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="font-bold text-white">CINEMATIC DOLLY</span>
        <span className="text-slate-400">|</span>
        <span className="text-brand-400 font-bold">
          {act === 1 ? "ACT 1: WIDE SHOT" : act === 2 ? "ACT 2: DOLLY ZOOM" : act === 3 ? "ACT 3: LIVE PREVIEW" : "ACT 4: RESET"}
        </span>
      </div>

      {/* Floating Trust Cards (Visible during Act 1 & 4) */}
      <AnimatePresence>
        {(act === 1 || act === 4) && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="absolute top-14 right-4 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-xs font-bold text-emerald-400 z-40"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>⚡ 99/100 PageSpeed</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl text-xs font-bold text-purple-300 z-40"
            >
              <Rocket className="w-3.5 h-3.5 text-accent-violet" />
              <span>🚀 Deployed in 0.8s</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
