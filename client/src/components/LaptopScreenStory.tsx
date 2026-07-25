"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code2, Globe, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";

interface LaptopScreenStoryProps {
  onStageChange?: (stage: "A" | "B" | "C" | "D") => void;
}

export default function LaptopScreenStory({ onStageChange }: LaptopScreenStoryProps) {
  // Stage: 'A' = VS Code, 'B' = Typing, 'C' = Terminal, 'D' = Live NextGen Web Preview
  const [stage, setStage] = useState<"A" | "B" | "C" | "D">("A");
  const [typedCode, setTypedCode] = useState("");
  const [terminalStep, setTerminalStep] = useState(0);

  const fullCodeText = [
    `import React from "react"`,
    ``,
    `const NextGenApp = () => {`,
    `  return (`,
    `    <div className="hero">`,
    `      <h1>Engineering Scalable Digital Experiences</h1>`,
    `    </div>`,
    `  )`,
    `}`,
    ``,
    `export default NextGenApp`
  ].join("\n");

  // Story Stage Timeline: A (0-1.5s) -> B (1.5-5s) -> C (5-8.5s) -> D (8.5s+)
  useEffect(() => {
    // Stage A: VS Code opens
    setStage("A");
    if (onStageChange) onStageChange("A");

    // Stage B (at 1.5s): Code is typed
    const tB = setTimeout(() => {
      setStage("B");
      if (onStageChange) onStageChange("B");
    }, 1500);

    // Stage C (at 5.0s): Terminal compilation
    const tC = setTimeout(() => {
      setStage("C");
      if (onStageChange) onStageChange("C");
      setTerminalStep(1);
      setTimeout(() => setTerminalStep(2), 700);
      setTimeout(() => setTerminalStep(3), 1400);
      setTimeout(() => setTerminalStep(4), 2100);
      setTimeout(() => setTerminalStep(5), 2800);
    }, 5000);

    // Stage D (at 9.0s): Editor transforms into Live NextGen Website Preview
    const tD = setTimeout(() => {
      setStage("D");
      if (onStageChange) onStageChange("D");
    }, 9000);

    return () => {
      clearTimeout(tB);
      clearTimeout(tC);
      clearTimeout(tD);
    };
  }, []);

  // Stage B: Syntax-highlighted code typing effect
  useEffect(() => {
    if (stage === "B") {
      let charIdx = 0;
      setTypedCode("");
      const typeInterval = setInterval(() => {
        if (charIdx <= fullCodeText.length) {
          setTypedCode(fullCodeText.slice(0, charIdx));
          charIdx += 2;
        } else {
          clearInterval(typeInterval);
        }
      }, 25);
      return () => clearInterval(typeInterval);
    }
  }, [stage, fullCodeText]);

  return (
    <div className="relative w-full h-full bg-[#0d1117] text-white font-mono overflow-hidden select-none">
      
      {/* STAGES A, B & C: VS Code Editor & Terminal */}
      {stage !== "D" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full flex flex-col bg-[#0d1117] text-[11px]"
        >
          {/* VS Code Title Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-semibold text-slate-200 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-brand-400" /> NextGen.tsx
              </span>
            </div>
            <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {stage === "A" ? "VS Code Ready" : stage === "B" ? "Typing Code..." : "Compiling & Deploying"}
            </span>
          </div>

          {/* Code Workspace */}
          <div className="flex-1 p-3 font-mono leading-relaxed overflow-hidden relative">
            <pre className="text-slate-200">
              <code>
                {(stage === "A" ? "import React from \"react\"" : typedCode).split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-5 text-slate-600 select-none text-[10px]">{i + 1}</span>
                    <span className="flex-1">
                      {line.includes("import") ? <span className="text-purple-400">import </span> : null}
                      {line.includes("const") ? <span className="text-blue-400">const </span> : null}
                      {line.includes("return") ? <span className="text-pink-400">return </span> : null}
                      {line.includes("export") ? <span className="text-purple-400">export default </span> : null}
                      <span className="text-slate-200">
                        {line
                          .replace("import ", "")
                          .replace("const ", "")
                          .replace("return ", "")
                          .replace("export default ", "")}
                      </span>
                    </span>
                  </div>
                ))}
              </code>
            </pre>
            <span className="inline-block w-2 h-3.5 bg-brand-400 animate-pulse ml-5" />
          </div>

          {/* STAGE C: Terminal Compilation Overlay */}
          <AnimatePresence>
            {stage === "C" && (
              <motion.div
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-36 bg-[#090d16] border-t border-slate-800 p-3 font-mono text-[10px] space-y-1"
              >
                <div className="flex items-center gap-1.5 text-slate-400 border-b border-slate-800 pb-1">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-slate-200">zsh - bash terminal</span>
                </div>

                {terminalStep >= 1 && (
                  <div className="text-slate-300">❯ npm install</div>
                )}
                {terminalStep >= 2 && (
                  <div className="text-slate-300">❯ npm run build</div>
                )}
                {terminalStep >= 3 && (
                  <div className="text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Compiling Next.js App Router...
                  </div>
                )}
                {terminalStep >= 4 && (
                  <div className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Build Successful
                  </div>
                )}
                {terminalStep >= 5 && (
                  <div className="text-cyan-400 flex items-center gap-1 font-bold animate-pulse">
                    🚀 Deploying... Deployment Complete!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* STAGE D: Smooth Transformation into Actual NextGen Website Preview */}
      {stage === "D" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full flex flex-col bg-slate-950 overflow-hidden"
        >
          {/* Browser Navigation Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-[9px] w-60 justify-center">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>https://nextgendigital.com</span>
            </div>

            <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Live App
            </span>
          </div>

          {/* Actual NextGen Portfolio Screen Representation */}
          <div className="flex-1 p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-dark-bg flex flex-col justify-between overflow-hidden relative">
            
            {/* Header Mini Branding */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  N
                </div>
                <span className="font-heading font-extrabold text-xs text-white">NextGen</span>
              </div>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                Digital Solutions
              </span>
            </div>

            {/* Live Hero Content Representation */}
            <div className="my-auto space-y-1.5 py-1">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Deployed Live System
              </div>

              <h4 className="font-heading text-xs sm:text-sm font-extrabold text-white leading-snug">
                Engineering Scalable <span className="text-gradient">Digital Experiences</span>
              </h4>

              <p className="text-[8px] text-slate-400 line-clamp-2">
                Building premium websites, AI-powered applications, CRM systems and digital experiences.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-brand-500 text-white font-bold text-[8px]">
                  Hire Me
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-300 font-bold text-[8px]">
                  View Projects
                </span>
              </div>
            </div>

            {/* Live Metrics bar */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[8px] text-slate-400">
              <span>Traffic: 48,290+</span>
              <span className="text-emerald-400 font-bold">Lighthouse 98/100</span>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
