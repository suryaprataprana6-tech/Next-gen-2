"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Compass, 
  Award, 
  Briefcase, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { PERSONAL_INFO, ABOUT_STORY, CAREER_TIMELINE } from "@/data/portfolioData";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About NextGen</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Architecting <span className="text-gradient">High-Performing</span> Systems & Brands
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Combining deep full-stack engineering with performance marketing to create products that scale effortlessly.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          
          {/* Card 1: Main Introduction (Col 8) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 glass-card p-8 rounded-3xl border border-slate-900/10 dark:border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-xl">
                  👨‍💻
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                    {PERSONAL_INFO.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-500 dark:text-brand-400">
                    {PERSONAL_INFO.title}
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                {PERSONAL_INFO.bio}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {ABOUT_STORY.journey}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900/10 dark:border-white/10 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
                📍 {PERSONAL_INFO.location}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
                ⚡ {PERSONAL_INFO.experienceYears} Industry Experience
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300">
                🚀 50+ Enterprise Releases
              </span>
            </div>
          </motion.div>

          {/* Card 2: Mission Statement (Col 4) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 glass-card p-8 rounded-3xl border border-slate-900/10 dark:border-white/10 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-violet/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center mb-6 shadow-glow-primary">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3">
                My Mission
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "{ABOUT_STORY.mission}"
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-brand-500/20">
              <span className="text-xs font-bold text-brand-500 block mb-1">Target Standard</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                95+ Core Web Vitals & Zero Downtime
              </span>
            </div>
          </motion.div>

          {/* Card 3: Core Values (Col 12) */}
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ABOUT_STORY.coreValues.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-slate-900/10 dark:border-white/10 hover:border-brand-500/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    {val.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Professional Career Growth Timeline */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Professional Career Growth
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
              Evolution over 5+ years of shipping enterprise web software
            </p>
          </div>

          <div className="relative border-l-2 border-brand-500/30 ml-4 sm:ml-32 space-y-12">
            {CAREER_TIMELINE.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative pl-8 sm:pl-10 group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-500 border-4 border-slate-900 shadow-glow-primary group-hover:scale-125 transition-transform" />

                {/* Year tag for larger screens */}
                <span className="hidden sm:block absolute -left-36 top-1 text-xs font-extrabold tracking-wider text-brand-500 dark:text-brand-400 uppercase">
                  {item.year}
                </span>

                <div className="glass-card p-6 rounded-2xl border border-slate-900/10 dark:border-white/10">
                  <span className="sm:hidden text-xs font-extrabold text-brand-500 block mb-1">
                    {item.year}
                  </span>
                  <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    {item.role}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    {item.company}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.achievements.map((ach) => (
                      <span
                        key={ach}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20"
                      >
                        ✓ {ach}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
