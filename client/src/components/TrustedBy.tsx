"use client";

import React from "react";
import { motion } from "framer-motion";
import { TRUSTED_CLIENTS } from "@/data/portfolioData";

const TRUST_STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "25+", label: "Happy Clients" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "5+", label: "Years Experience" },
];

export default function TrustedBy() {
  const marqueeList = [...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS];

  return (
    <section className="relative z-10 bg-[#060816] text-white border-t border-white/10 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Trust Bar Counter Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-[#0b0f24] border border-white/10 mb-20 shadow-2xl"
        >
          {TRUST_STATS.map((stat, idx) => (
            <div key={stat.label} className="flex flex-col items-center text-center p-3 border-r last:border-r-0 border-white/5">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent mb-2">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#94A3B8] tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Client Logos Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
            Trusted By Growing Enterprises, Medical Networks & Tech Leaders
          </p>
        </div>

        {/* Minimal Grayscale Client Logos Marquee (Hover becomes full color) */}
        <div className="flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-8 shrink-0 animate-marquee items-center">
            {marqueeList.map((client, idx) => (
              <div
                key={`${client.name}-${idx}`}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0b0f24] border border-white/10 hover:border-[#7C5CFF]/60 transition-all duration-300 group shrink-0 filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${client.color} flex items-center justify-center text-white font-extrabold text-xs shadow-md group-hover:scale-105 transition-transform`}>
                  {client.logoText}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading font-bold text-sm text-white group-hover:text-[#7C5CFF] transition-colors">
                    {client.name}
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    {client.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
