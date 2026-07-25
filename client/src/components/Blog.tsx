"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Clock, ArrowRight, X, User } from "lucide-react";
import { BLOG_POSTS, BlogItem } from "@/data/portfolioData";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<BlogItem | null>(null);

  const categories = ["All", "Next.js", "React", "SEO", "AI", "Digital Marketing", "Web Development"];

  const filteredPosts = selectedCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((b) => b.category === selectedCategory);

  return (
    <section id="blog" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Insights & Guides</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Latest <span className="text-gradient">Articles & Engineering Insights</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            In-depth guides on Next.js 15, Technical SEO, AI Lead Engines, and conversion rate optimization.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-brand-600 to-accent-violet text-white shadow-glow-primary scale-105"
                  : "glass-card border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post: BlogItem, idx: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group glass-card rounded-3xl overflow-hidden border border-slate-900/10 dark:border-white/10 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-500" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-500" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Article Trigger */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> {post.author}
                </span>
                <button
                  onClick={() => setActiveArticle(post)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-400 group-hover:translate-x-1 transition-all"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl glass-card rounded-3xl border border-white/20 p-6 sm:p-10 bg-slate-900 text-white shadow-2xl my-8 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider inline-block mb-4">
                {activeArticle.category}
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-6 pb-4 border-b border-white/10">
                <span>By {activeArticle.author}</span>
                <span>• {activeArticle.date}</span>
                <span>• {activeArticle.readTime}</span>
              </div>

              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                <p>{activeArticle.content}</p>
                <p>
                  Implementing structured schemas and fast Server Component rendering guarantees sub-second Core Web Vitals and compound search rankings. For custom development inquiries, feel free to reach out via the contact form or WhatsApp consultation.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
