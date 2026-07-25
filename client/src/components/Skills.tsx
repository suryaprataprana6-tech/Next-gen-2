"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Code2, 
  FileCode, 
  Palette, 
  Server, 
  Database, 
  HardDrive, 
  Cloud, 
  TrendingUp, 
  Target, 
  Bot,
  Sparkles
} from "lucide-react";
import { SKILLS_DATA, SkillItem } from "@/data/portfolioData";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Frontend", "Backend & DB", "Cloud & DevOps", "Growth & AI"];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return Zap;
      case "Code2": return Code2;
      case "FileCode": return FileCode;
      case "Palette": return Palette;
      case "Server": return Server;
      case "Database": return Database;
      case "HardDrive": return HardDrive;
      case "Cloud": return Cloud;
      case "TrendingUp": return TrendingUp;
      case "Target": return Target;
      case "Bot": return Bot;
      default: return Code2;
    }
  };

  const filteredSkills = activeCategory === "All"
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Mastery</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive <span className="text-gradient">Tech Stack & Proficiency</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Modern tools and frameworks battle-tested across 50+ enterprise web builds and growth campaigns.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-glow-primary scale-105"
                  : "glass-card border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Animated Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill: SkillItem, idx: number) => {
            const Icon = getIcon(skill.iconName);
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {skill.category} • {skill.experienceYears}
                      </span>
                    </div>
                  </div>
                  <span className="font-heading text-lg font-extrabold text-gradient">
                    {skill.level}%
                  </span>
                </div>

                {/* Animated Progress Indicator Bar */}
                <div className="w-full h-2.5 bg-slate-900/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.05, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 via-accent-violet to-accent-rose shadow-[0_0_10px_#6366f1]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
