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
  ShieldCheck
} from "lucide-react";

export default function HeroLiveBuildVisual() {
  // Stage: 1 = Writing Code, 2 = Building & Compiling, 3 = Live Website Preview
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [typedCode, setTypedCode] = useState("");
  const [buildStep, setBuildStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fullCodeText = [
    `import React from "react";`,
    `import { NextGenApp } from "@nextgen/platform";`,
    ``,
    `export default function App() {`,
    `  return (`,
    `    <NextGenApp`,
    `      performance="99/100"`,
    `      aiAutomated={true}`,
    `      revenueEngine={true}`,
    `    />`,
    `  );`,
    `}`
  ].join("\n");

  // Parallax Mouse Handler
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

  // 3-Stage Looping Sequence (~4.5 seconds per stage, 13.5s total cycle)
  useEffect(() => {
    const runCycle = () => {
      // Stage 1: Code Writing
      setStage(1);
      setTypedCode("");

      // Stage 2 (at 4.5s): Terminal Build
      const t2 = setTimeout(() => {
        setStage(2);
        setBuildStep(1);
        setTimeout(() => setBuildStep(2), 700);
        setTimeout(() => setBuildStep(3), 1400);
        setTimeout(() => setBuildStep(4), 2100);
      }, 4500);

      // Stage 3 (at 9.0s): Live Website Preview
      const t3 = setTimeout(() => {
        setStage(3);
      }, 9000);

      return [t2, t3];
    };

    const initialTimers = runCycle();
    const cycleInterval = setInterval(() => {
      runCycle();
    }, 13500);

    return () => {
      clearInterval(cycleInterval);
      initialTimers.forEach(clearTimeout);
    };
  }, []);

  // Typewriter effect during Stage 1
  useEffect(() => {
    if (stage === 1) {
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
  }, [stage, fullCodeText]);

  // Gentle 3D Mouse Parallax tilt calculation
  const tiltX = mousePos.y * -8;
  const tiltY = mousePos.x * 10;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center select-none perspective-[1000px]">
      
      {/* Background Soft Glowing Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-brand-600/30 via-accent-violet/25 to-accent-rose/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-cyan-500/20 blur-[80px] animate-float-slow" />
      </div>

      {/* Main Window Card with CSS 3D Parallax Tilt */}
      <motion.div
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
          y: [0, -6, 0],
        }}
        transition={{
          rotateX: { type: "spring", stiffness: 150, damping: 20 },
          rotateY: { type: "spring", stiffness: 150, damping: 20 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-full h-[340px] sm:h-[370px] bg-slate-950/95 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden z-10"
      >
        {/* macOS Window Title Bar with Integrated Non-Overlapping Stage Indicator */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-white/10 text-xs shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            
            {/* Active File / Mode Title */}
            <span className="ml-2 font-mono text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
              {stage === 1 && <><Code2 className="w-3.5 h-3.5 text-brand-400" /> App.tsx — VS Code</>}
              {stage === 2 && <><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Terminal Build Engine</>}
              {stage === 3 && <><Globe className="w-3.5 h-3.5 text-cyan-400" /> Live Platform Preview</>}
            </span>
          </div>

          {/* Compact Stage Indicator Badge inside Header (Left-aligned relative to floating cards) */}
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-slate-300">
            {stage === 1 ? "STAGE 1" : stage === 2 ? "STAGE 2" : "STAGE 3"}
          </span>
        </div>

        {/* Dynamic Canvas Content Switching (Fast 200ms Crisp Transition) */}
        <div className="flex-1 relative overflow-hidden bg-[#0b0e14]">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: VS Code Typewriter Editor */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0.85, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.85, y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30">
                    App.tsx
                  </span>
                  <span>src / components / App.tsx</span>
                </div>

                <pre className="flex-1 text-[11px]">
                  <code>
                    {(typedCode || "import React from \"react\";").split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-6 text-slate-600 select-none text-[10px]">{i + 1}</span>
                        <span className="flex-1">
                          {line.includes("import") && <span className="text-purple-400">import </span>}
                          {line.includes("from") && <span className="text-pink-400">from </span>}
                          {line.includes("export") && <span className="text-purple-400">export default </span>}
                          {line.includes("function") && <span className="text-blue-400">function </span>}
                          {line.includes("return") && <span className="text-pink-400">return </span>}
                          {line.includes("NextGenApp") && <span className="text-cyan-400 font-bold">NextGenApp </span>}
                          {line.includes("performance") && <span className="text-emerald-400">performance</span>}
                          {line.includes("aiAutomated") && <span className="text-emerald-400">aiAutomated</span>}
                          {line.includes("revenueEngine") && <span className="text-emerald-400">revenueEngine</span>}
                          <span className="text-slate-200">
                            {line
                              .replace("import ", "")
                              .replace("from ", "")
                              .replace("export default ", "")
                              .replace("function ", "")
                              .replace("return ", "")
                              .replace("NextGenApp", "")
                              .replace("performance", "")
                              .replace("aiAutomated", "")
                              .replace("revenueEngine", "")}
                          </span>
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                  <span>Typewriter Live Encoding Active</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: Terminal Build & Compile Animation (UNTOUCHED LOGIC) */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0.85, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.85, y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full p-4 font-mono text-xs bg-[#07090e] text-slate-200 flex flex-col justify-between"
              >
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">zsh — next build</span>
                  </div>

                  {buildStep >= 1 && (
                    <div className="text-slate-300">❯ npm run build</div>
                  )}

                  {buildStep >= 2 && (
                    <div className="text-amber-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling Next.js 15 App Router pages...</span>
                    </div>
                  )}

                  {buildStep >= 3 && (
                    <div className="text-emerald-400 flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>✓ Build Successful in 0.8s! (8/8 static pages)</span>
                    </div>
                  )}

                  {buildStep >= 4 && (
                    <div className="text-cyan-400 flex items-center gap-2 font-bold animate-pulse">
                      <Rocket className="w-4 h-4 text-cyan-400" />
                      <span>Deploying to Edge Network... Deployed Live!</span>
                    </div>
                  )}
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Compilation Progress</span>
                    <span className="text-emerald-400">{buildStep >= 4 ? "100%" : buildStep >= 3 ? "85%" : buildStep >= 2 ? "45%" : "15%"}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-500 via-accent-violet to-emerald-400 rounded-full"
                      initial={{ width: "10%" }}
                      animate={{ width: buildStep >= 4 ? "100%" : buildStep >= 3 ? "85%" : buildStep >= 2 ? "45%" : "15%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Polished Mini Website Preview (Optimized Margins & Fast Transition) */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0.85, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.85, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col bg-slate-950 text-white overflow-hidden"
              >
                {/* Mini Browser Address Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px]">
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-[9px] w-64 justify-center">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>https://clientsite.com</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
                  </span>
                </div>

                {/* Mini Site Preview Body */}
                <div className="flex-1 p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-dark-bg flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm">
                        N
                      </div>
                      <span className="font-heading font-extrabold text-xs text-white">NextGen</span>
                    </div>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      Digital Solutions
                    </span>
                  </div>

                  <div className="my-auto space-y-2 py-1 pr-6">
                    <h3 className="font-heading text-sm sm:text-base font-extrabold text-white leading-snug">
                      Engineering Scalable <span className="text-gradient">Digital Experiences</span>
                    </h3>
                    <p className="text-[9px] text-slate-300 line-clamp-2">
                      Building high-converting Next.js applications, AI lead engines, and CRM platforms.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-600 to-accent-violet text-white font-bold text-[9px] shadow-sm">
                        Get Started
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-slate-200 font-bold text-[9px]">
                        View Demo
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Active Traffic: 48,290+</span>
                    <span className="text-emerald-400 font-bold">Lighthouse 99/100</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Solid Opaque Floating Trust Cards around Main Window */}
      {/* 1. PageSpeed Badge (Top Right Offset) */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-7 -right-7 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-xs font-bold text-emerald-400 z-30"
      >
        <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
        <span>⚡ 99/100 PageSpeed</span>
      </motion.div>

      {/* 2. Deployed Speed Badge (Bottom Right Offset) */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        className="absolute -bottom-7 -right-7 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl text-xs font-bold text-purple-300 z-30"
      >
        <Rocket className="w-4 h-4 text-accent-violet" />
        <span>🚀 Deployed in 0.8s</span>
      </motion.div>

      {/* 3. SEO Badge (Top Left Offset) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
        className="absolute -top-7 -left-7 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-[11px] font-bold text-cyan-300 z-30"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>✓ SEO Optimized</span>
      </motion.div>

    </div>
  );
}
