"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageSquare, Sparkles } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-brand-500 via-accent-violet to-accent-rose transition-all duration-150 ease-out shadow-[0_0_10px_#6366f1]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[999]">
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-500/60 bg-brand-500/10 backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovered ? 1.8 : 1,
          borderColor: isHovered ? '#ec4899' : 'rgba(99, 102, 241, 0.6)',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brand-500"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
    </div>
  );
}

export function FloatingWhatsAppButton() {
  return (
    <a
      href={PERSONAL_INFO.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group hover:scale-105"
    >
      <MessageSquare className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform duration-300" />
      <span className="hidden sm:inline font-semibold text-xs tracking-wide uppercase">
        Quick Chat
      </span>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
    </a>
  );
}

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > 300) {
        setIsVisible(true);
        if (totalHeight > 0) {
          setScrollPercent(Math.round((window.scrollY / totalHeight) * 100));
        }
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-11 h-11 rounded-full glass-card border border-brand-500/30 text-brand-500 dark:text-brand-400 hover:bg-brand-500 hover:text-white shadow-lg transition-all duration-300 group"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          <span className="absolute -top-7 text-[10px] font-bold px-1.5 py-0.5 rounded bg-dark-card text-brand-400 border border-brand-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
            {scrollPercent}%
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-bg text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-accent-violet flex items-center justify-center shadow-[0_0_30px_#6366f1] animate-pulse">
              <Sparkles className="w-9 h-9 text-white animate-spin-slow" />
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-gradient">
              NextGen
            </h2>
            <p className="text-xs text-dark-muted tracking-widest uppercase animate-pulse">
              Digital Solutions
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
