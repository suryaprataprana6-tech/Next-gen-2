"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS_DATA, TestimonialItem } from "@/data/portfolioData";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-900/[0.02] dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Feedback & Endorsements</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by <span className="text-gradient">Founders & Directors</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Read how custom web applications, Next.js architecture, and AI automation helped our clients accelerate growth.
          </p>
        </div>

        {/* Testimonial Carousel Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-900/10 dark:border-white/10 shadow-2xl relative"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                  5.0 Rating • {current.projectTag}
                </span>
              </div>

              {/* Quote Review */}
              <blockquote className="font-heading text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed mb-8">
                "{current.review}"
              </blockquote>

              {/* Author Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-900/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                        {current.name}
                      </h3>
                      {current.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Verified Client
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {current.role}, <span className="text-brand-500">{current.company}</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="p-3 rounded-2xl glass-card text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="p-3 rounded-2xl glass-card text-slate-700 dark:text-slate-300 hover:text-brand-500 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-brand-500" : "w-2.5 bg-slate-400/40"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
