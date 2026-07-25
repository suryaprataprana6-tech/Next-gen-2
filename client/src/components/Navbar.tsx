"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Calendar, Download, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function Navbar() {
  const { theme, toggleTheme, openConsultationModal, openLeadModal } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Process", href: "#process" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3.5 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="NextGen Digital Solutions Logo"
              width={160}
              height={48}
              className="h-11 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors leading-tight">
              NextGen
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-brand-500 dark:text-brand-400 uppercase">
              Digital Solutions
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 p-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Book Consultation */}
          <button
            onClick={openConsultationModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-900/10 dark:hover:bg-white/10 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <span>Consultation</span>
          </button>

          {/* Hire Me CTA */}
          <button
            onClick={() => openLeadModal("General Growth & Development")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-accent-violet text-white hover:shadow-glow-primary hover:scale-[1.02] active:scale-100 transition-all"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl glass-card text-slate-700 dark:text-slate-300"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl glass-card text-slate-900 dark:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-t border-slate-900/10 dark:border-white/10 mt-3 px-6 py-6"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold py-2 text-slate-700 dark:text-slate-200 hover:text-brand-500"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openConsultationModal();
                  }}
                  className="w-full py-2.5 rounded-xl border border-brand-500/30 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span>Book Free Consultation</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLeadModal("Mobile Menu Direct Hire");
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>Hire Me Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
