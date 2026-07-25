"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { STATS_DATA } from "@/data/portfolioData";
import MacBookPro3DCanvas from "./MacBookPro3DCanvas";

export default function Hero() {
  const { openLeadModal, openConsultationModal } = useTheme();

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950 text-white">
      
      {/* Background Animated Gradient Aura & Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-brand-600/25 via-accent-violet/25 to-accent-rose/20 blur-[140px] animate-pulse-glow" />
        <div className="absolute top-10 right-10 w-[350px] h-[350px] rounded-full bg-cyan-500/15 blur-[110px] animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[520px]">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-400 mb-6 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Available for New Projects & Consultation</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12] text-white mb-6">
              Engineering Scalable <br className="hidden sm:inline" />
              <span className="text-gradient">Digital Experiences</span> <br />
              That Drive Real Revenue.
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
              Building premium websites, AI-powered applications, CRM systems and digital experiences that help businesses grow.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              {/* Hire Me CTA */}
              <button
                onClick={() => openLeadModal("Hero Hire Me")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-accent-violet to-accent-rose text-white font-bold text-sm shadow-glow-primary hover:scale-[1.03] active:scale-100 transition-all"
              >
                <Briefcase className="w-4.5 h-4.5" />
                <span>Hire Me</span>
                <ArrowUpRight className="w-4.5 h-4.5" />
              </button>

              {/* View Projects CTA */}
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass-card border border-white/15 text-white font-bold text-sm hover:border-brand-500 transition-all"
              >
                <span>View Projects</span>
              </a>

              {/* Book Consultation CTA */}
              <button
                onClick={openConsultationModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/15 text-slate-200 font-semibold text-sm hover:text-brand-400 hover:border-brand-500/50 transition-all"
              >
                <Calendar className="w-4.5 h-4.5 text-brand-400" />
                <span>Book Consultation</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Code Quality
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guaranteed 95+ PageSpeed
              </span>
            </div>
          </motion.div>

          {/* Right Hero Visual (Real 3D MacBook GLB via React Three Fiber) */}
          <div className="lg:col-span-5 flex justify-center relative w-full">
            <MacBookPro3DCanvas />
          </div>

        </div>

        {/* Animated Statistics Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl glass-card border border-white/10"
        >
          {STATS_DATA.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center p-3">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-gradient mb-1">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
