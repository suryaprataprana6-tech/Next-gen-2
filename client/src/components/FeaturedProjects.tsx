"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Github, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { PROJECTS_DATA, ProjectCaseStudy } from "@/data/portfolioData";

export default function FeaturedProjects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const categories = ["All", "Websites", "SEO", "AI", "CRM", "Travel", "Healthcare", "Real Estate"];

  const filteredProjects = selectedCategory === "All"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" className="py-28 relative overflow-hidden bg-[#060816] text-white border-t border-white/10">
      <span id="projects" className="absolute -top-24" />
      
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-[#A855F7]/10 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#7C5CFF] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selected Client Work</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Featured Projects <br />
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent">
              Built for Measurable Growth
            </span>
          </h2>
          <p className="mt-4 text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Explore category architectures showing business challenges solved, custom tech stack applied, and systematic conversion funnels deployed.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] text-white shadow-lg scale-105"
                  : "bg-[#0b0f24] border border-white/10 text-[#94A3B8] hover:border-[#7C5CFF]/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Apple-style Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: ProjectCaseStudy, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group bg-[#0b0f24] rounded-3xl overflow-hidden border border-white/10 hover:border-[#7C5CFF]/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-2xl"
            >
              <div>
                {/* Image Showcase Frame */}
                <div className="relative h-56 w-full overflow-hidden bg-[#060816]">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#060816]/90 backdrop-blur-md text-white border border-white/20">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-7">
                  <div className="text-xs font-bold text-[#7C5CFF] mb-1">
                    Sector: {project.clientName}
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-white group-hover:text-[#7C5CFF] transition-colors mb-3">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-slate-400">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Measurable ROI Metric Banner */}
                  <div className="grid grid-cols-2 gap-2 p-3.5 rounded-2xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 mb-2">
                    {project.resultsAchieved.slice(0, 2).map((res) => (
                      <div key={res.label} className="text-center">
                        <span className="font-heading text-sm font-extrabold text-[#7C5CFF] block">
                          {res.metric}
                        </span>
                        <span className="text-[9px] font-medium text-[#94A3B8]">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="px-7 pb-7 pt-3 flex items-center justify-between border-t border-white/5">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#7C5CFF] transition-colors"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-4 h-4 text-[#7C5CFF]" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Detailed Case Study Storytelling Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#060816]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 p-6 sm:p-8 bg-[#0b0f24] text-white shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/30 uppercase tracking-widest inline-block mb-3">
                  {activeModalProject.category} Case Study
                </span>
                <h3 className="font-heading text-3xl font-extrabold text-white mb-1">
                  {activeModalProject.title}
                </h3>
                <p className="text-sm font-semibold text-[#94A3B8]">
                  Client: {activeModalProject.clientName}
                </p>
              </div>

              {/* Screenshot Banner */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img
                  src={activeModalProject.heroImage}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ROI Results Grid */}
              <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                {activeModalProject.resultsAchieved.map((res) => (
                  <div key={res.label} className="text-center">
                    <span className="font-heading text-2xl font-extrabold bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] bg-clip-text text-transparent block">
                      {res.metric}
                    </span>
                    <span className="text-xs font-medium text-[#94A3B8]">
                      {res.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Storytelling Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Business Problem</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalProject.businessProblem}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
                    <Lightbulb className="w-4 h-4" />
                    <span>Engineering Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalProject.solutionImplemented}
                  </p>
                </div>
              </div>

              {/* Features & Tech Stack */}
              <div className="mb-8">
                <h4 className="font-heading text-sm font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
                  Applied Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white/10 text-white border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Link */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#A855F7] text-white font-bold text-xs hover:shadow-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Live Application</span>
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
