"use client";

import React from "react";
import { TRUSTED_CLIENTS } from "@/data/portfolioData";

export default function TrustedBy() {
  // Duplicate array to ensure seamless infinite looping
  const marqueeList = [...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS];

  return (
    <section className="py-12 relative overflow-hidden border-y border-slate-900/5 dark:border-white/5 bg-slate-900/[0.02] dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Trusted By Industry Leaders, Hospitals & Growing Enterprises
        </p>
      </div>

      {/* Marquee Track */}
      <div className="flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-8 shrink-0 animate-marquee items-center">
          {marqueeList.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 group shrink-0"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${client.color} flex items-center justify-center text-white font-extrabold text-xs shadow-md group-hover:scale-110 transition-transform`}>
                {client.logoText}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {client.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {client.industry}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
