"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { CERTIFICATIONS_DATA, CertificationItem } from "@/data/portfolioData";

export default function Certifications() {
  if (!CERTIFICATIONS_DATA || CERTIFICATIONS_DATA.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-slate-900/[0.02] dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Industry <span className="text-gradient">Certifications & Accreditation</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Verified expertise from Vercel, Meta, Google, AWS, and MongoDB.
          </p>
        </div>

        {/* Certification Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATIONS_DATA.map((cert: CertificationItem, idx: number) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    Issued {cert.issueDate}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors mb-1">
                  {cert.title}
                </h3>
                <p className="text-xs font-semibold text-brand-500 mb-3">
                  {cert.issuer}
                </p>

                <div className="space-y-1 mb-4">
                  {cert.skillsVerified.map((sk) => (
                    <div key={sk} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{sk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">
                  ID: {cert.credentialId}
                </span>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-400"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
