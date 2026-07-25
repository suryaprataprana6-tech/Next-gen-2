"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Bot, 
  Database, 
  TrendingUp, 
  Target, 
  Layout, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const BENTO_SERVICES = [
  {
    id: "web-dev",
    title: "Website Development",
    category: "Core Engineering",
    description: "Sub-second Next.js 15 web applications engineered with React 19, Server Components, TypeScript and Tailwind CSS.",
    icon: Globe,
    gradient: "from-[#7C5CFF] to-[#A855F7]",
    highlights: ["Sub-second page speed", "100% SEO scores", "Conversion architecture"],
    colSpan: "lg:col-span-2",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    category: "Intelligent Workflows",
    description: "Custom AI agents, automated lead nurturing, chatbot integration, and AI-driven CRM workflows.",
    icon: Bot,
    gradient: "from-[#A855F7] to-[#ec4899]",
    highlights: ["AI Chatbots & Agents", "Workflow Automation", "API Integration"],
    colSpan: "lg:col-span-1",
  },
  {
    id: "crm",
    title: "CRM Systems",
    category: "Lead Pipeline",
    description: "Custom CRM portals built with Supabase and real-time analytics to capture, track and close leads.",
    icon: Database,
    gradient: "from-[#06b6d4] to-[#3b82f6]",
    highlights: ["Supabase Realtime", "Lead Scoring", "Dashboard Analytics"],
    colSpan: "lg:col-span-1",
  },
  {
    id: "seo",
    title: "SEO Strategies",
    category: "Organic Reach",
    description: "Technical SEO, automated structured data, keyword optimization, and high-authority backlink strategies.",
    icon: TrendingUp,
    gradient: "from-[#10b981] to-[#059669]",
    highlights: ["Schema Markup", "Technical Speed Audit", "Keyword Rank Tracking"],
    colSpan: "lg:col-span-1",
  },
  {
    id: "meta-ads",
    title: "Meta Ads & Paid Acquisition",
    category: "Performance Marketing",
    description: "High-ROI Facebook & Instagram ad campaigns with dynamic retargeting and creative testing.",
    icon: Target,
    gradient: "from-[#f43f5e] to-[#e11d48]",
    highlights: ["Ad Creative Strategy", "Funnel Optimization", "Conversion API"],
    colSpan: "lg:col-span-1",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    category: "Product Design",
    description: "Apple and Vercel-inspired minimal interfaces crafted in Figma with precise typography and motion design.",
    icon: Layout,
    gradient: "from-[#8b5cf6] to-[#6366f1]",
    highlights: ["Figma Design Systems", "Interactive Prototypes", "Responsive Layouts"],
    colSpan: "lg:col-span-2",
  },
];

export default function Services() {
  const { openLeadModal } = useTheme();

  return (
    <section id="services" className="py-28 relative overflow-hidden bg-[#060816] text-white border-t border-white/10">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] rounded-full bg-[#7C5CFF]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#7C5CFF] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            High-Impact Services <br />
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent">
              Engineered for Growth
            </span>
          </h2>
          <p className="mt-4 text-[#94A3B8] text-lg max-w-2xl mx-auto">
            From Next.js web applications to AI lead automations—tailored for maximum performance and revenue impact.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BENTO_SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`${service.colSpan} group relative bg-[#0b0f24] p-8 rounded-3xl border border-white/10 hover:border-[#7C5CFF]/60 transition-all duration-300 hover:-translate-y-1 shadow-2xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-extrabold text-white group-hover:text-[#7C5CFF] transition-colors mb-3">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-8 border-t border-white/5 pt-4">
                    {service.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openLeadModal(service.title)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#7C5CFF] hover:text-[#A855F7] group-hover:translate-x-1 transition-all pt-2 border-t border-white/5"
                >
                  <span>Discuss Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
