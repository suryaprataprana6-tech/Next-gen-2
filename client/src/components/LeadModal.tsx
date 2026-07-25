"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Briefcase, CheckCircle2, Sparkles, Send } from "lucide-react";
import confetti from "canvas-confetti";
import { useTheme } from "@/context/ThemeContext";

export default function LeadModal() {
  const { 
    isLeadModalOpen, 
    prefilledService, 
    closeLeadModal,
    isConsultationModalOpen,
    closeConsultationModal
  } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: prefilledService || "Website Development",
    budget: "$1,000 - $3,000",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isOpen = isLeadModalOpen || isConsultationModalOpen;
  const isConsultation = isConsultationModalOpen;

  const handleClose = () => {
    if (isLeadModalOpen) closeLeadModal();
    if (isConsultationModalOpen) closeConsultationModal();
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg glass-card rounded-3xl border border-white/20 p-6 sm:p-8 bg-slate-900 text-white shadow-2xl my-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-2xl font-extrabold text-white">
                {isConsultation ? "Consultation Scheduled!" : "Proposal Received!"}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm">
                {isConsultation
                  ? "Thank you! I will email you a Calendar invite link and meeting details shortly."
                  : "Thank you for sharing your project details. I will review your requirements and send a full proposal within 4 hours."}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors mt-4"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                  {isConsultation ? <Calendar className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                  {isConsultation ? "Book 1-on-1 Consultation" : "Start Project / Hire Me"}
                </span>
              </div>

              <h3 className="font-heading text-2xl font-extrabold text-white mb-2">
                {isConsultation ? "Schedule Strategy Call" : "Request Custom Proposal"}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill in your contact info below. All inquiries receive direct developer responses.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-500 outline-none text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-500 outline-none text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-500 outline-none text-white placeholder:text-slate-500"
                  />
                </div>

                {!isConsultation && (
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Estimated Project Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-brand-500 outline-none text-white"
                    >
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                      <option value="$3,000 - $7,000">$3,000 - $7,000</option>
                      <option value="$7,000+">$7,000+</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Project Notes & Timeline
                  </label>
                  <textarea
                    rows={3}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Briefly describe your goals, required features, or preferred launch date..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-500 outline-none text-white placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-accent-violet to-accent-rose text-white font-extrabold text-xs shadow-glow-primary hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isConsultation ? "Confirm Consultation Request" : "Submit Project Inquiry"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
