"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Compass, 
  Palette, 
  Code2, 
  CheckSquare, 
  Rocket, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { WORK_PROCESS_STEPS, ProcessStep } from "@/data/portfolioData";

export default function WorkProcess() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Search": return Search;
      case "Compass": return Compass;
      case "Palette": return Palette;
      case "Code2": return Code2;
      case "CheckSquare": return CheckSquare;
      case "Rocket": return Rocket;
      case "ShieldCheck": return ShieldCheck;
      default: return Sparkles;
    }
  };

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Seamless <span className="text-gradient">Execution Roadmap</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            From initial strategy alignment to zero-downtime deployment and ongoing 24/7 technical optimization.
          </p>
        </div>

        {/* Horizontal Process Steps Bar */}
        <div className="hidden lg:grid grid-cols-7 gap-3 mb-12 relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-8 left-10 right-10 h-0.5 bg-slate-900/10 dark:bg-white/10 -z-0" />

          {WORK_PROCESS_STEPS.map((step: ProcessStep, idx: number) => {
            const Icon = getIcon(step.iconName);
            const isActive = activeStep === idx;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-tr from-brand-600 to-accent-violet text-white shadow-glow-primary scale-110"
                      : "glass-card border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-slate-400 group-hover:border-brand-500/50"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold text-brand-500 mt-3 uppercase tracking-wider">
                  {step.stepNumber}
                </span>
                <span className={`text-xs font-bold mt-1 text-center transition-colors ${
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                }`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 sm:p-10 rounded-3xl border border-brand-500/30 max-w-4xl mx-auto shadow-2xl relative"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-900/10 dark:border-white/10 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-heading text-4xl font-extrabold text-gradient">
                {WORK_PROCESS_STEPS[activeStep].stepNumber}
              </span>
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                  {WORK_PROCESS_STEPS[activeStep].title}
                </h3>
                <p className="text-xs font-semibold text-brand-500 dark:text-brand-400">
                  Phase {activeStep + 1} of 7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={activeStep === WORK_PROCESS_STEPS.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(WORK_PROCESS_STEPS.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold disabled:opacity-30 flex items-center gap-1"
              >
                <span>Next Phase</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
            {WORK_PROCESS_STEPS[activeStep].detail}
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
            Summary: {WORK_PROCESS_STEPS[activeStep].shortDesc}
          </p>
        </motion.div>

        {/* Mobile Vertical Step Accordion List */}
        <div className="lg:hidden mt-8 space-y-3">
          {WORK_PROCESS_STEPS.map((step: ProcessStep, idx: number) => (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl glass-card border cursor-pointer ${
                activeStep === idx ? "border-brand-500 bg-brand-500/10" : "border-slate-900/10 dark:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                  {step.stepNumber}. {step.title}
                </span>
                <span className="text-xs font-bold text-brand-500">
                  {activeStep === idx ? "Active" : "View"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
