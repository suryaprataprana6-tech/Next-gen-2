"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Layers, 
  Zap, 
  TrendingUp, 
  Target, 
  Bot, 
  Database, 
  Layout, 
  Gauge, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SERVICES_DATA, ServiceItem } from "@/data/portfolioData";

export default function Services() {
  const { openLeadModal } = useTheme();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Globe": return Globe;
      case "Layers": return Layers;
      case "Zap": return Zap;
      case "TrendingUp": return TrendingUp;
      case "Target": return Target;
      case "Bot": return Bot;
      case "Database": return Database;
      case "Layout": return Layout;
      case "Gauge": return Gauge;
      default: return Zap;
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-900/[0.02] dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities & Services</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High-Impact Services <span className="text-gradient">Engineered to Scale</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            From Next.js 15 Web Applications to AI Lead Automations & Meta Ads campaigns—tailored for ultimate conversion.
          </p>
        </div>

        {/* 9 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service: ServiceItem, idx: number) => {
            const Icon = getIconComponent(service.iconName);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative glass-card p-8 rounded-3xl border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors mb-3">
                    {service.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 mb-6 border-t border-slate-900/10 dark:border-white/10 pt-4">
                    {service.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    From <span className="text-slate-900 dark:text-white font-extrabold text-sm">{service.pricingStarting}</span>
                  </span>
                  <button
                    onClick={() => openLeadModal(service.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-400 group-hover:translate-x-1 transition-all"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
