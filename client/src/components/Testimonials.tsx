"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Target, MessageSquare, TrendingUp, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export default function Testimonials() {
  const outcomes = [
    {
      icon: Zap,
      title: "High-Performance Web Infrastructure",
      desc: "Clean modern code, sub-second load times, and structured SEO foundations designed to turn passive visitors into qualified enquiries.",
      points: [
        "Sub-second Core Web Vitals",
        "Mobile-first responsive layouts",
        "High-converting CTA hierarchy"
      ],
      color: "from-blue-500/20 to-cyan-500/10",
      iconColor: "text-cyan-400"
    },
    {
      icon: Target,
      title: "Precision Growth Marketing",
      desc: "Targeted ad funnels across Meta and Google that eliminate wasted ad spend, reach high-intent buyers, and optimize conversion pathways.",
      points: [
        "High-intent audience targeting",
        "Conversion API tracking & attribution",
        "Continuous creative iteration"
      ],
      color: "from-violet-500/20 to-purple-500/10",
      iconColor: "text-violet-400"
    },
    {
      icon: MessageSquare,
      title: "Lead Generation Systems",
      desc: "Integrated WhatsApp capture, responsive enquiry funnels, and CRM routing that connect high-intent prospects straight to your team.",
      points: [
        "Direct 1-tap WhatsApp handoffs",
        "Frictionless qualification forms",
        "Fast response lead pipelines"
      ],
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400"
    },
    {
      icon: TrendingUp,
      title: "Revenue-Focused Execution",
      desc: "End-to-end digital architecture focused on measurable commercial growth, transparent reporting, and ongoing performance optimization.",
      points: [
        "Transparent performance insights",
        "Data-backed strategy decisions",
        "Dedicated ongoing partner support"
      ],
      color: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400"
    }
  ];

  return (
    <section id="outcomes" className="py-24 relative overflow-hidden bg-slate-900/[0.02] dark:bg-white/[0.01]">
      <span id="testimonials" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Methodology</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built Around <span className="text-gradient">Business Outcomes</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            We measure our success by tangible commercial value created for your business: speed to market, qualified prospect flow, and clean digital infrastructure.
          </p>
        </div>

        {/* 4 Outcomes Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-900/10 dark:border-white/10 hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl relative overflow-hidden group"
              >
                {/* Background Ambient Glow */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${item.color} rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {item.desc}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Commercial Standard
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-400 transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
