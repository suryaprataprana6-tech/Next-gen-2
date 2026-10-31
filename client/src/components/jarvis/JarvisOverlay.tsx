"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Power,
  Sparkles,
  Send,
  Radio,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import JarvisOrb from "./JarvisOrb";
import JarvisWaveform from "./JarvisWaveform";
import { useJarvisVoice, TranscriptItem } from "@/hooks/useJarvisVoice";
import { useDoubleClap } from "@/hooks/useDoubleClap";

interface JarvisOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  authToken?: string;
}

export default function JarvisOverlay({
  isOpen,
  onClose,
  authToken,
}: JarvisOverlayProps) {
  const [textInput, setTextInput] = useState("");
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize JARVIS Voice Engine
  const {
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
    toggleMute,
    startListening,
  } = useJarvisVoice(authToken);

  // Initialize Double-Clap Wake Detector
  const {
    isListening: isClapListening,
    status: clapStatus,
    audioLevel,
    clapCount,
    startClapDetection,
    stopClapDetection,
  } = useDoubleClap({
    onDoubleClap: () => {
      console.log("⚡ Double clap detected by browser engine! Waking JARVIS...");
      if (state === "sleeping") {
        wakeUp();
      }
    },
  });

  // Auto-scroll transcript window on new messages
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, interimText]);

  // When overlay opens, wake up JARVIS
  useEffect(() => {
    if (isOpen && state === "sleeping") {
      wakeUp();
    }
  }, [isOpen, state, wakeUp]);

  // Handle manual command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput;
    setTextInput("");
    sendCommand(query);
  };

  if (!isOpen) return null;

  const quickChips = [
    { label: "Pending Leads", query: "Summarize pending leads" },
    { label: "Meta Ad Blueprint", query: "Draft Meta ad for luxury travel" },
    { label: "Google PPC Search", query: "Draft Google Ads for web development" },
    { label: "WhatsApp Follow-up", query: "Draft a WhatsApp follow-up for latest lead" },
    { label: "System Health", query: "Run system health and telemetry check" },
    { label: "Standby", query: "JARVIS, go to sleep" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04060a]/90 backdrop-blur-xl font-sans"
      >
        {/* Holographic Matrix Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Ambient Top & Bottom Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />

        {/* Main HUD Window Container */}
        <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-[#090d16]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden">
          
          {/* Top HUD Header Bar */}
          <header className="px-5 py-3.5 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between select-none">
            {/* Left: Branding & Status */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <Cpu className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
                    NextGen JARVIS <span className="text-cyan-400 text-xs">v4.2</span>
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ADMIN SECURE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <span>Operator: <span className="text-slate-200">Surya Pratap Rana</span></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400" />
                    Neural Link Active
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Hardware & Audio Controls */}
            <div className="flex items-center gap-2">
              {/* Double Clap Status Pill */}
              <button
                type="button"
                onClick={() => {
                  if (isClapListening) {
                    stopClapDetection();
                  } else {
                    startClapDetection();
                  }
                }}
                title={
                  isClapListening
                    ? "Double-clap wake-up active. Click to disable."
                    : "Double-clap wake-up paused. Click to enable."
                }
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                  isClapListening
                    ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isClapListening ? "bg-cyan-400 animate-ping" : "bg-slate-500"
                  }`}
                />
                <span>Clap Wake: {isClapListening ? "ON" : "OFF"}</span>
                {clapCount > 0 && (
                  <span className="ml-1 px-1 rounded bg-cyan-400 text-slate-950 text-[10px] font-bold">
                    {clapCount}
                  </span>
                )}
              </button>

              {/* Mute Button */}
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
                className={`p-2 rounded-lg border transition-all ${
                  isMuted
                    ? "bg-red-950/40 border-red-500/40 text-red-400"
                    : "bg-slate-900 border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40"
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Close / Sleep HUD Button */}
              <button
                type="button"
                onClick={() => {
                  goToSleep();
                  onClose();
                }}
                title="Close JARVIS HUD"
                className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-red-500/40 hover:bg-red-950/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Central Body: Orb Visualizer + Interactive Transcript */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            
            {/* Left Column (Desktop 5 cols): Central Holographic Core & Telemetry */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-cyan-500/20 bg-gradient-to-b from-slate-950/40 to-[#070b13] p-6 flex flex-col items-center justify-between select-none">
              
              {/* State Status Pill */}
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  CORE STATE:
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${
                    state === "listening"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 animate-pulse"
                      : state === "thinking"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/50 animate-pulse"
                      : state === "speaking"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-400/50"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {state}
                </span>
              </div>

              {/* Central Glowing Orb Component */}
              <div className="py-4 my-auto flex flex-col items-center">
                <JarvisOrb
                  state={state}
                  audioLevel={audioLevel}
                  onClick={() => {
                    if (state === "sleeping") wakeUp();
                    else if (state === "speaking") stopSpeaking();
                    else startListening();
                  }}
                  size="lg"
                />

                {/* Subtitle / Voice Status */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-slate-300 font-mono">
                    {state === "listening" && "Awaiting voice command..."}
                    {state === "thinking" && "Processing neural command..."}
                    {state === "speaking" && "Responding..."}
                    {state === "sleeping" && "Standby — tap orb or double-clap"}
                  </p>
                  {interimText && (
                    <p className="mt-1 text-xs text-cyan-400 font-mono italic max-w-xs truncate">
                      "{interimText}"
                    </p>
                  )}
                </div>

                {/* Dynamic Waveform Visualizer */}
                <div className="mt-2 w-full max-w-xs">
                  <JarvisWaveform state={state} audioLevel={audioLevel} />
                </div>
              </div>

              {/* Bottom Telemetry Arc Readout */}
              <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] font-mono border-t border-cyan-500/10 pt-3 text-slate-400">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-cyan-400 font-bold">LATENCY</div>
                  <div>12ms</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-cyan-400 font-bold">AUDIO LEVEL</div>
                  <div>{audioLevel}%</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-cyan-400 font-bold">VOICE ENGINE</div>
                  <div>ONLINE</div>
                </div>
              </div>
            </div>

            {/* Right Column (Desktop 7 cols): Live Transcript Stream & Action Hub */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#070b13]/80">
              
              {/* Transcript Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-mono text-xs sm:text-sm">
                {transcript.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                    <Sparkles className="w-8 h-8 text-cyan-500/40 mb-3 animate-bounce" />
                    <p className="font-semibold text-slate-300">JARVIS is ready for your instruction.</p>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Speak naturally or select a quick directive below to query incoming leads, review ad funnels, or monitor server uptime.
                    </p>
                  </div>
                ) : (
                  transcript.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col ${
                        item.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-400 uppercase">
                          {item.role === "user" ? "Surya" : "JARVIS"}
                        </span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[92%] p-3.5 rounded-xl border leading-relaxed whitespace-pre-wrap ${
                          item.role === "user"
                            ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-100 rounded-tr-none shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                            : "bg-slate-900/90 border-slate-700/70 text-slate-200 rounded-tl-none shadow-md"
                        }`}
                      >
                        {item.text}

                        {/* Interactive Confirmation Action */}
                        {item.action === "confirm_required" && item.data && (
                          <div className="mt-3 pt-3 border-t border-red-500/30 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                sendCommand(`Confirm delete lead ${item.data.targetLeadId}`, true)
                              }
                              className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" /> Confirm Deletion
                            </button>
                            <button
                              type="button"
                              onClick={() => sendCommand("Cancel deletion request")}
                              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>

              {/* Quick Command Chips */}
              <div className="px-4 py-2 border-t border-cyan-500/10 bg-slate-950/40 overflow-x-auto flex items-center gap-2 scrollbar-none">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase shrink-0">
                  Quick Directives:
                </span>
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendCommand(chip.query)}
                    className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Bottom Interactive Command Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-3 sm:p-4 border-t border-cyan-500/20 bg-slate-950/80 flex items-center gap-2"
              >
                {/* Voice Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (state === "listening") {
                      goToSleep();
                    } else {
                      wakeUp();
                    }
                  }}
                  title={state === "listening" ? "Stop Listening" : "Start Voice Input"}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                    state === "listening"
                      ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40"
                  }`}
                >
                  {state === "listening" ? (
                    <Mic className="w-5 h-5 animate-pulse" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Speak to JARVIS or type executive directive..."
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

