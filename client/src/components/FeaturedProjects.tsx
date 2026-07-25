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
  Layers, 
  TrendingUp, 
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
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-900/[0.02] dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Case Studies</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High-Converting <span className="text-gradient">Portfolio & Systems</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Explore detailed client case studies highlighting business problems solved, custom tech stack, and measurable growth metrics.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-glow-primary scale-105"
                  : "glass-card border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: ProjectCaseStudy, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group glass-card rounded-3xl overflow-hidden border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Hero Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-extrabold text-brand-500 dark:text-brand-400 mb-1">
                    Client: {project.clientName}
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors mb-3">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-900/5 dark:bg-white/5 text-slate-400">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Key Metrics Banner */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-brand-500/5 border border-brand-500/15 mb-4">
                    {project.resultsAchieved.slice(0, 2).map((res) => (
                      <div key={res.label} className="text-center">
                        <span className="font-heading text-sm font-extrabold text-brand-500 block">
                          {res.metric}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-900/10 dark:border-white/10">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-brand-500 transition-colors"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-brand-500"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-brand-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl border border-white/20 p-6 sm:p-8 bg-slate-900 text-white shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Hero Header */}
              <div className="mb-8">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-widest inline-block mb-3">
                  {activeModalProject.category} Case Study
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  {activeModalProject.title}
                </h3>
                <p className="text-sm font-semibold text-slate-400">
                  Client Partner: {activeModalProject.clientName}
                </p>
              </div>

              {/* Main Screenshot Banner */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img
                  src={activeModalProject.heroImage}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                {activeModalProject.resultsAchieved.map((res) => (
                  <div key={res.label} className="text-center">
                    <span className="font-heading text-xl sm:text-2xl font-extrabold text-gradient block">
                      {res.metric}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {res.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Business Problem & Solution */}
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
                    <span>Solution Implemented</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalProject.solutionImplemented}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <h4 className="font-heading text-lg font-bold text-white mb-4">
                  Key System Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalProject.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h4 className="font-heading text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Tech Stack Applied
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Links */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white font-bold text-xs hover:shadow-glow-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Live Application</span>
                </a>

                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
