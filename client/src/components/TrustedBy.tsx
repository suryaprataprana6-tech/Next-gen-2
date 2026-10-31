"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Code2, Zap, Database, Shield, Smartphone } from "lucide-react";

const VALUE_PILLARS = [
  { title: "High-Performance", desc: "Websites & Applications", icon: Globe },
  { title: "Performance", desc: "Targeted Marketing", icon: Zap },
  { title: "Lead Generation", desc: "Automated Systems", icon: Smartphone },
  { title: "Revenue-Focused", desc: "Commercial Strategy", icon: Shield },
];

const PLATFORMS = [
  { name: "Next.js & React", category: "Modern Web Stack", icon: Code2, color: "from-blue-600 to-cyan-500" },
  { name: "Meta Ads Platform", category: "Audience Targeting", icon: Zap, color: "from-blue-700 to-indigo-600" },
  { name: "Google Search & Ads", category: "Commercial Intent", icon: Globe, color: "from-cyan-500 to-blue-600" },
  { name: "Edge Deployment", category: "Sub-Second Latency", icon: Database, color: "from-purple-600 to-indigo-500" },
  { name: "WhatsApp Direct", category: "Instant Lead Routing", icon: Smartphone, color: "from-emerald-500 to-teal-600" },
];

export default function TrustedBy() {
  return (
    <section className="relative z-10 bg-[#060816] text-white border-t border-white/10 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Pillars Grid (Non-Numerical Value Statements) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#0b0f24] border border-white/10 mb-20 shadow-2xl"
        >
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex flex-col items-center text-center p-3 border-r last:border-r-0 border-white/5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-heading text-lg sm:text-xl font-extrabold text-white mb-1">
                  {pillar.title}
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#94A3B8] tracking-wide">
                  {pillar.desc}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Technologies & Platforms We Deploy */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            MODERN PLATFORMS, CHANNELS &amp; TECHNOLOGIES WE DEPLOY
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex items-center gap-3 p-4 rounded-2xl bg-[#0b0f24] border border-white/10 hover:border-[#7C5CFF]/60 transition-all duration-300 group"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${platform.color} flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-heading font-bold text-xs text-white group-hover:text-[#7C5CFF] transition-colors truncate">
                    {platform.name}
                  </span>
                  <span className="text-[10px] text-[#64748B] truncate">
                    {platform.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
