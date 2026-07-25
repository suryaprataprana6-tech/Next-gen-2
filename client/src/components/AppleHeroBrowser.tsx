"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Code2, 
  Smartphone, 
  BarChart3, 
  Rocket,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Search,
  Lock
} from "lucide-react";

export default function AppleHeroBrowser() {
  // Screen mode: 'website' | 'vscode' | 'mobile' | 'analytics' | 'deploy'
  const [mode, setMode] = useState<"website" | "vscode" | "mobile" | "analytics" | "deploy">("website");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax (subtle 2° - 3° tilt max)
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

  // Smooth mode transition cycle (Website -> VS Code -> Mobile -> Analytics -> Deployment)
  useEffect(() => {
    const modes: Array<"website" | "vscode" | "mobile" | "analytics" | "deploy"> = [
      "website",
      "vscode",
      "mobile",
      "analytics",
      "deploy"
    ];
    let idx = 0;

    const interval = setInterval(() => {
      idx = (idx + 1) % modes.length;
      setMode(modes[idx]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Subtle 2°–3° perspective tilt
  const tiltX = mousePos.y * -5;
  const tiltY = mousePos.x * 6;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-xl aspect-[16/10] flex items-center justify-center select-none perspective-[1200px]"
    >
      {/* Background Soft Aurora Light Aura */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[#7C5CFF]/20 via-[#A855F7]/20 to-[#06b6d4]/10 blur-[130px] animate-pulse-glow" />
      </div>

      {/* Single Floating Apple/Vercel Style Browser Window */}
      <motion.div
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
          y: [0, -8, 0],
        }}
        transition={{
          rotateX: { type: "spring", stiffness: 120, damping: 25 },
          rotateY: { type: "spring", stiffness: 120, damping: 25 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative w-full h-full bg-[#060816] rounded-2xl border border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden z-10"
      >
        {/* Browser Top Navigation Chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0b0f24] border-b border-white/10 text-xs shrink-0">
          {/* macOS Dot Indicators */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>

          {/* Browser Address Bar */}
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[#060816] border border-white/10 text-slate-300 font-medium text-[11px] w-64 sm:w-72 justify-center shadow-inner">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="truncate">https://nextgendigital.com</span>
          </div>

          {/* Mode Switcher Indicator */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] animate-pulse" />
            <span className="uppercase tracking-wider">{mode}</span>
          </div>
        </div>

        {/* Browser Content Frame */}
        <div className="flex-1 relative overflow-hidden bg-[#060816]">
          <AnimatePresence mode="wait">
            
            {/* MODE 1: Actual Live NextGen Website Preview */}
            {mode === "website" && (
              <motion.div
                key="mode-website"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-5 sm:p-6 bg-gradient-to-br from-[#060816] via-[#0d122b] to-[#060816] flex flex-col justify-between"
              >
                {/* Header branding */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-[#A855F7] flex items-center justify-center text-white text-xs font-extrabold shadow-lg">
                      N
                    </div>
                    <span className="font-heading font-extrabold text-sm text-white tracking-tight">NextGen</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/30">
                    Digital Solutions
                  </span>
                </div>

                {/* Live Hero Content */}
                <div className="my-auto space-y-3 py-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Available for New Projects
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white leading-tight">
                    Building Digital Products <br />
                    <span className="bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent">
                      Powered by AI
                    </span>{" "}
                    Designed for Growth.
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 max-w-md">
                    We build premium websites, AI automation, CRM systems, SEO strategies and digital experiences that help businesses grow.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] text-white font-bold text-xs shadow-lg">
                      Start Your Project
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-slate-200 font-bold text-xs">
                      View Portfolio
                    </span>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>★★★★★ 5.0 Rating (50+ Projects)</span>
                  <span className="text-emerald-400 font-bold">Lighthouse 99/100</span>
                </div>
              </motion.div>
            )}

            {/* MODE 2: VS Code Editor View */}
            {mode === "vscode" && (
              <motion.div
                key="mode-vscode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-4 font-mono text-xs text-slate-200 bg-[#090d20] flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <Code2 className="w-4 h-4 text-[#7C5CFF]" />
                  <span className="text-white font-bold">NextGenHero.tsx</span>
                  <span className="ml-auto text-[10px] text-emerald-400 font-semibold">Clean Architecture</span>
                </div>

                <pre className="flex-1 py-3 text-[11px] leading-relaxed">
                  <code>
                    <div className="flex"><span className="w-6 text-slate-600">1</span><span className="text-purple-400">import </span><span className="text-white">React </span><span className="text-pink-400">from </span><span className="text-emerald-400">"react"</span>;</div>
                    <div className="flex"><span className="w-6 text-slate-600">2</span><span className="text-purple-400">import </span><span className="text-white">&#123; NextGenPlatform &#125; </span><span className="text-pink-400">from </span><span className="text-emerald-400">"@nextgen/core"</span>;</div>
                    <div className="flex"><span className="w-6 text-slate-600">3</span></div>
                    <div className="flex"><span className="w-6 text-slate-600">4</span><span className="text-purple-400">export default function </span><span className="text-blue-400">Hero</span>() &#123;</div>
                    <div className="flex"><span className="w-6 text-slate-600">5</span>  <span className="text-pink-400">return </span>(</div>
                    <div className="flex"><span className="w-6 text-slate-600">6</span>    <span className="text-cyan-400 font-bold">&lt;NextGenPlatform</span></div>
                    <div className="flex"><span className="w-6 text-slate-600">7</span>      <span className="text-purple-300">aiPowered</span>=<span className="text-amber-400">&#123;true&#125;</span></div>
                    <div className="flex"><span className="w-6 text-slate-600">8</span>      <span className="text-purple-300">growthDriven</span>=<span className="text-amber-400">&#123;true&#125;</span></div>
                    <div className="flex"><span className="w-6 text-slate-600">9</span>    <span className="text-cyan-400 font-bold">/&gt;</span></div>
                    <div className="flex"><span className="w-6 text-slate-600">10</span>  );</div>
                    <div className="flex"><span className="w-6 text-slate-600">11</span>&#125;</div>
                  </code>
                </pre>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#7C5CFF] animate-ping" />
                  <span>TypeScript 5.0 • Strict Quality Control</span>
                </div>
              </motion.div>
            )}

            {/* MODE 3: Mobile Responsive View */}
            {mode === "mobile" && (
              <motion.div
                key="mode-mobile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-4 bg-[#090d20] flex items-center justify-center"
              >
                {/* Simulated iPhone Preview Container */}
                <div className="w-48 h-full bg-[#060816] rounded-2xl border-2 border-slate-700 p-3 flex flex-col justify-between shadow-2xl relative">
                  <div className="w-12 h-2.5 rounded-full bg-slate-900 mx-auto mb-2" />
                  
                  <div className="space-y-1.5 text-center my-auto">
                    <div className="w-4 h-4 rounded bg-[#7C5CFF] mx-auto text-[9px] text-white font-bold flex items-center justify-center">N</div>
                    <h5 className="text-[10px] font-extrabold text-white leading-tight">
                      Building Digital Products <span className="text-[#A855F7]">Powered by AI</span>
                    </h5>
                    <div className="px-2 py-0.5 rounded bg-[#7C5CFF] text-[8px] font-bold text-white w-max mx-auto">
                      Start Project
                    </div>
                  </div>

                  <div className="text-[8px] text-emerald-400 text-center font-bold">
                    100% Mobile Responsive
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODE 4: Real-time Analytics View */}
            {mode === "analytics" && (
              <motion.div
                key="mode-analytics"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-5 bg-[#090d20] flex flex-col justify-between text-white"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-heading font-bold text-xs">
                    <BarChart3 className="w-4 h-4 text-[#7C5CFF]" />
                    <span>Real-time Client Performance</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +248% Revenue Growth
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-auto">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400">Avg Speed</span>
                    <div className="text-base font-extrabold text-white">0.4s</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400">SEO Score</span>
                    <div className="text-base font-extrabold text-emerald-400">100/100</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400">Conv. Rate</span>
                    <div className="text-base font-extrabold text-purple-400">+4.8%</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Data verified across 50+ clients</span>
                  <span className="text-slate-300 font-bold">Updated Live</span>
                </div>
              </motion.div>
            )}

            {/* MODE 5: Instant Deployment View */}
            {mode === "deploy" && (
              <motion.div
                key="mode-deploy"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full p-5 bg-[#060816] font-mono text-xs text-slate-200 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <Rocket className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Edge Global Deployment</span>
                </div>

                <div className="space-y-2 my-auto text-[11px]">
                  <div className="text-slate-300">❯ next build --production</div>
                  <div className="text-amber-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Optimizing global edge routes...</span>
                  </div>
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Deployed to Vercel Global Edge Network in 0.8s</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                  <span>Region: Global (300+ Edge Nodes)</span>
                  <span className="text-emerald-400 font-bold">100% Uptime SLA</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
