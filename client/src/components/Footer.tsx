"use client";

import React from "react";
import Image from "next/image";
import { Mail, Github, Linkedin, Twitter, MessageSquare, ArrowUpRight } from "lucide-react";
import { PERSONAL_INFO, FAQ_DATA, PROJECTS_DATA } from "@/data/portfolioData";

export default function Footer() {
  // Generate JSON-LD Schemas for Organization & FAQ Page
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NextGen Digital Solutions",
    "description": "NextGen Digital Solutions is a premier digital solutions and performance marketing agency engineering high-converting web applications, precision Meta & Google ad funnels, and automated lead systems.",
    "url": "https://nextgendigitalsolutions.com",
    "logo": "https://nextgendigitalsolutions.com/logo.png",
    "knowsAbout": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Technical SEO", "Meta Ads", "Google Ads", "Automated Lead Generation"]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <footer className="relative bg-slate-950 text-white pt-20 pb-12 border-t border-white/10 overflow-hidden">
      
      {/* Embedded JSON-LD SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-600/30 via-accent-violet/20 to-accent-rose/20 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 shadow-2xl">
          <div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Ready to Accelerate Your Web Presence?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Let's engineer a high-converting Next.js platform or custom AI lead workflow for your business.
            </p>
          </div>

          <a
            href="#contact"
            className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-xs hover:bg-brand-500 hover:text-white transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-14 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="NextGen Digital Solutions Logo"
                  width={180}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white leading-tight">
                  NextGen
                </span>
                <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">
                  Digital Solutions
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Digital Solutions & Growth Engineering. Crafting high-speed Next.js App Router applications, SEO engines, and automated business software.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href={PERSONAL_INFO.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href={`mailto:${PERSONAL_INFO.email}`} aria-label="Email" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold text-slate-300 uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="/#work" className="hover:text-white transition-colors">Selected Work</a></li>
              <li><a href="/pay-online" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1.5"><span>Pay Online</span><span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40">Portal</span></a></li>
              <li><a href="/#process" className="hover:text-white transition-colors">Process</a></li>
              <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold text-slate-300 uppercase tracking-widest">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Next.js 15 Applications</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Full Stack Web Architecture</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Technical SEO Optimization</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">AI Lead Chatbots & CRM</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Meta Ads & Conversions API</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold text-slate-300 uppercase tracking-widest">
              Direct Contact
            </h4>
            <p className="text-xs text-slate-400">
              Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white hover:underline">{PERSONAL_INFO.email}</a>
            </p>
            <p className="text-xs text-slate-400">
              Phone: <span className="text-white">{PERSONAL_INFO.phone}</span>
            </p>
            <p className="text-xs text-slate-400">
              Location: <span className="text-white">{PERSONAL_INFO.location}</span>
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NextGen Digital Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300">Terms of Service</a>
            <a href="#sitemap" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
