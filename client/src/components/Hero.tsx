"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Briefcase, 
  Star,
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import AppleHeroBrowser from "./AppleHeroBrowser";

export default function Hero() {
  const { openLeadModal } = useTheme();

  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-[#060816] text-white">
      
      {/* Background Animated Aurora Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-[#7C5CFF]/20 via-[#A855F7]/15 to-transparent blur-[160px] animate-pulse-glow" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full bg-[#06b6d4]/10 blur-[130px] animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[540px]">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Small Agency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 mb-8 backdrop-blur-md shadow-sm">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>5.0</span>
              </span>
              <span className="text-slate-500">•</span>
              <span>Premium Digital Agency</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white mb-6">
              Building Digital Products <br />
              <span className="bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent">
                Powered by AI
              </span> <br />
              Designed for Growth.
            </h1>

            {/* Subtitle (20px body scale) */}
            <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mb-10 leading-relaxed font-normal">
              We build premium websites, AI automation, CRM systems, SEO strategies and digital experiences that help businesses grow.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              {/* Primary Button */}
              <button
                onClick={() => openLeadModal("Hero Primary CTA")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] text-white font-bold text-sm shadow-glow-primary hover:scale-[1.02] active:scale-100 transition-all duration-200"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-4.5 h-4.5" />
              </button>

              {/* Secondary Button */}
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-sm hover:border-[#7C5CFF]/60 hover:bg-white/10 transition-all duration-200"
              >
                <span>View Portfolio</span>
              </a>
            </div>

            {/* Client Rating & Trust Signals */}
            <div className="flex items-center gap-4 text-xs font-semibold text-[#94A3B8] pt-2 border-t border-white/10 w-full max-w-md">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>50+ Projects Delivered</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% Satisfaction</span>
            </div>
          </motion.div>

          {/* Right Hero Visual (Single Apple-Style Floating Browser) */}
          <div className="lg:col-span-5 flex justify-center relative w-full">
            <AppleHeroBrowser />
          </div>

        </div>

      </div>
    </section>
  );
}
