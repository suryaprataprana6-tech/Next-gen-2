"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Code2, 
  Globe, 
  CheckCircle2, 
  RefreshCw, 
  Folder, 
  FileCode, 
  FileText,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles
} from "lucide-react";

interface LaptopScreenStoryProps {
  onStageChange?: (stage: "A" | "B" | "C" | "D") => void;
}

export default function LaptopScreenStory({ onStageChange }: LaptopScreenStoryProps) {
  // Stage: 'A' = VS Code, 'B' = Typewriter, 'C' = Terminal, 'D' = Live Web Preview
  const [stage, setStage] = useState<"A" | "B" | "C" | "D">("A");
  const [typedCode, setTypedCode] = useState("");
  const [terminalStep, setTerminalStep] = useState(0);

  const fullCodeText = [
    `import React from "react";`,
    `import { NextGenPlatform } from "@nextgen/core";`,
    ``,
    `export default function App() {`,
    `  return (`,
    `    <NextGenPlatform`,
    `      performance="99/100"`,
    `      aiEngine={true}`,
    `      revenueDriven={true}`,
    `    />`,
    `  );`,
    `}`
  ].join("\n");

  // Endless 14-second looping cycle controller
  useEffect(() => {
    const runCycle = () => {
      // Stage A (0s - 1.5s): VS Code opens & loads workspace
      setStage("A");
      setTypedCode("");
      if (onStageChange) onStageChange("A");

      // Stage B (1.5s - 5.5s): Typewriter code animation
      const tB = setTimeout(() => {
        setStage("B");
        if (onStageChange) onStageChange("B");
      }, 1500);

      // Stage C (5.5s - 9.0s): Terminal execution
      const tC = setTimeout(() => {
        setStage("C");
        if (onStageChange) onStageChange("C");
        setTerminalStep(1);
        setTimeout(() => setTerminalStep(2), 600);
        setTimeout(() => setTerminalStep(3), 1200);
        setTimeout(() => setTerminalStep(4), 1800);
        setTimeout(() => setTerminalStep(5), 2400);
      }, 5500);

      // Stage D (9.0s - 14.0s): Live website preview
      const tD = setTimeout(() => {
        setStage("D");
        if (onStageChange) onStageChange("D");
      }, 9000);

      return [tB, tC, tD];
    };

    const initialTimers = runCycle();
    const cycleInterval = setInterval(() => {
      runCycle();
    }, 14000);

    return () => {
      clearInterval(cycleInterval);
      initialTimers.forEach(clearTimeout);
    };
  }, []);

  // Stage B Typewriter Effect
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
    <div className="relative w-full h-full bg-[#0b0e14] text-white font-mono overflow-hidden select-none">
      
      {/* STAGES A, B & C: VS Code Editor */}
      {stage !== "D" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full flex flex-col bg-[#0b0e14] text-[10px]"
        >
          {/* Top Title Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#121722] border-b border-slate-800 text-[9px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-semibold text-slate-200 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-brand-400" /> NextGen.tsx — VS Code
              </span>
            </div>
            <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {stage === "A" ? "Ready" : stage === "B" ? "Writing Code..." : "Building..."}
            </span>
          </div>

          {/* Main VS Code Layout (Sidebar + Editor) */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* VS Code File Explorer Sidebar */}
            <div className="w-28 bg-[#090c12] border-r border-slate-800/80 p-2 flex flex-col gap-1 text-[9px] text-slate-400 hidden sm:flex">
              <div className="flex items-center gap-1 text-[8px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                <Layers className="w-3 h-3 text-brand-400" /> Explorer
              </div>

              <div className="flex items-center gap-1 text-slate-300 font-medium">
                <ChevronDown className="w-3 h-3 text-slate-400" />
                <Folder className="w-3 h-3 text-amber-400" /> src
              </div>

              <div className="pl-3 space-y-1">
                <div className="flex items-center gap-1 text-brand-400 font-bold bg-brand-500/10 px-1.5 py-0.5 rounded">
                  <FileCode className="w-3 h-3 text-brand-400" /> App.tsx
                </div>
                <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                  <FileCode className="w-3 h-3 text-cyan-400" /> Hero.tsx
                </div>
                <div className="flex items-center gap-1 text-slate-400 hover:text-slate-200">
                  <FileText className="w-3 h-3 text-purple-400" /> globals.css
                </div>
              </div>
            </div>

            {/* Editor Active Code Canvas */}
            <div className="flex-1 flex flex-col bg-[#0b0e14]">
              {/* File Tabs Bar */}
              <div className="flex items-center bg-[#0d121c] border-b border-slate-800/80 px-2 text-[9px]">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0b0e14] text-brand-400 border-t-2 border-brand-500 font-bold">
                  <Code2 className="w-3 h-3" /> App.tsx
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 p-3 font-mono leading-relaxed overflow-hidden relative text-slate-200">
                <pre>
                  <code>
                    {(stage === "A" ? "import React from \"react\";" : typedCode).split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-4 text-slate-600 select-none text-[9px]">{i + 1}</span>
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
                <span className="inline-block w-1.5 h-3 bg-brand-400 animate-pulse ml-4" />
              </div>

              {/* STAGE C: Mini Terminal Output */}
              <AnimatePresence>
                {stage === "C" && (
                  <motion.div
                    initial={{ y: 70, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-28 bg-[#07090e] border-t border-slate-800 p-2 font-mono text-[9px] space-y-1"
                  >
                    <div className="flex items-center gap-1 text-slate-400 border-b border-slate-800 pb-1">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span className="font-bold text-slate-200">zsh terminal</span>
                    </div>

                    {terminalStep >= 1 && <div className="text-slate-300">❯ npm install</div>}
                    {terminalStep >= 2 && <div className="text-slate-300">❯ npm run build</div>}
                    {terminalStep >= 3 && (
                      <div className="text-amber-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Compiling Next.js App Router...
                      </div>
                    )}
                    {terminalStep >= 4 && (
                      <div className="text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Build Successful in 0.8s!
                      </div>
                    )}
                    {terminalStep >= 5 && (
                      <div className="text-cyan-400 flex items-center gap-1 font-bold animate-pulse">
                        🚀 Deployed Live System!
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      )}

      {/* STAGE D: Live Website Preview Screen */}
      {stage === "D" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full flex flex-col bg-slate-950 overflow-hidden"
        >
          {/* Browser Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[9px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-[8px] w-52 justify-center">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>https://nextgendigital.com</span>
            </div>

            <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Live Preview
            </span>
          </div>

          {/* Real NextGen Portfolio Canvas */}
          <div className="flex-1 p-3 bg-gradient-to-br from-slate-950 via-slate-900 to-dark-bg flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center text-white text-[9px] font-bold">
                  N
                </div>
                <span className="font-heading font-extrabold text-[11px] text-white">NextGen</span>
              </div>
              <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                Digital Solutions
              </span>
            </div>

            <div className="my-auto space-y-1 py-1">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[7px] font-semibold">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                Live Active System
              </div>

              <h4 className="font-heading text-xs font-extrabold text-white leading-snug">
                Engineering Scalable <span className="text-gradient">Digital Experiences</span>
              </h4>

              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 rounded bg-brand-500 text-white font-bold text-[7px]">
                  Hire Me
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold text-[7px]">
                  View Projects
                </span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[7px] text-slate-400">
              <span>Traffic: 48,290+</span>
              <span className="text-emerald-400 font-bold">Lighthouse 99/100</span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
