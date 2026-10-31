"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Download, 
  Linkedin, 
  Github, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { useTheme } from "@/context/ThemeContext";
import { PERSONAL_INFO } from "@/data/portfolioData";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid contact phone number"),
  service: z.string().min(1, "Please select a service interest"),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { openConsultationModal } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waUrl, setWaUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      service: "Website Development",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Build structured WhatsApp inquiry message
      const waMessage = 
`*CONSULTATION REQUEST — NextGen Digital Solutions*
---------------------------------------
👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'Not provided'}
🎯 *Service:* ${data.service}
💬 *Requirement:* ${data.message}
---------------------------------------
Sent via NextGen Digital Solutions Website`;

      const generatedWaUrl = `https://wa.me/918340424989?text=${encodeURIComponent(waMessage)}`;
      setWaUrl(generatedWaUrl);

      // Async log to internal CRM database
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email || 'not-provided@client.com',
          phone: data.phone,
          service: data.service,
          message: data.message,
        }),
      }).catch((err) => console.warn('Could not sync to CRM:', err));

      // Brief delay for UX feedback
      await new Promise((res) => setTimeout(res, 800));

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitted(true);
      reset();

      // Open WhatsApp directly
      setTimeout(() => {
        try {
          window.open(generatedWaUrl, "_blank");
        } catch (e) {
          console.warn("Popup blocked or not permitted", e);
        }
      }, 400);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/20 text-xs font-bold text-brand-500 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Let's Build Something Exceptional</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Start Your Next <span className="text-gradient">Growth Project Today</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base">
            Have a project idea, need a custom Next.js system, or want to audit your lead funnel? Send a direct message or book a consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Channels & Map */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Contact Details Card */}
            <div className="glass-card p-8 rounded-3xl border border-slate-900/10 dark:border-white/10 space-y-6">
              <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Direct Contact Information
              </h3>

              {/* Email */}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 hover:border-brand-500 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Direct Email</span>
                  <p className="font-heading font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {PERSONAL_INFO.email}
                  </p>
                </div>
              </a>

              {/* Phone / WhatsApp */}
              <a
                href={PERSONAL_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-500">Instant WhatsApp</span>
                  <p className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    {PERSONAL_INFO.phone}
                  </p>
                </div>
              </a>

              {/* Book Consultation Trigger */}
              <button
                onClick={openConsultationModal}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-violet text-white font-bold text-xs shadow-glow-primary hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div className="text-left">
                    <span className="block font-bold text-sm">Book Free 1-on-1 Consultation</span>
                    <span className="text-[10px] text-white/80 font-normal">30-minute strategy & tech audit</span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5" />
              </button>

              {/* Working Hours & Guarantee */}
              <div className="pt-4 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Mon–Sat: 9:00 AM – 8:00 PM IST</span>
                </div>
                <span className="font-semibold text-brand-400">100% Client IP Ownership</span>
              </div>
            </div>

            {/* Google Map Interactive Placeholder */}
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-900/10 dark:border-white/10 h-56 relative">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823377!2d72.74109995709657!3d19.08219783958721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale opacity-80 contrast-125 dark:opacity-60"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 glass-card px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: React Hook Form + Zod Form */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl border border-slate-900/10 dark:border-white/10 shadow-2xl relative"
          >
            <h3 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Send a Direct Project Inquiry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
              Fill out the form below. I respond to all business proposals within 4 hours.
            </p>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
                    Your Enquiry Is Ready!
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                    WhatsApp will open so you can send your project details directly to our team at +91 83404 24989.
                  </p>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors my-2"
                    >
                      <span>Click here if WhatsApp didn't open automatically</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors mt-2"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        {...register("name")}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 focus:border-brand-500 outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                      {errors.name && (
                        <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register("email")}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 focus:border-brand-500 outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                      {errors.email && (
                        <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Phone / WhatsApp *
                      </label>
                      <input
                        {...register("phone")}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 focus:border-brand-500 outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                      {errors.phone && (
                        <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Service Interest *
                      </label>
                      <select
                        {...register("service")}
                        className="w-full px-4 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 focus:border-brand-500 outline-none text-xs font-semibold text-slate-900 dark:text-white bg-slate-900 dark:bg-slate-900"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="Full Stack Development">Full Stack Development</option>
                        <option value="Next.js Applications">Next.js Applications</option>
                        <option value="SEO Optimization">SEO Optimization</option>
                        <option value="Meta Ads">Meta Ads</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="CRM Development">CRM Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Performance Optimization">Performance Optimization</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Project Details & Requirements *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Describe your project goals, desired features, timeline, or current bottlenecks..."
                      className="w-full px-4 py-3.5 rounded-2xl glass-card border border-slate-900/10 dark:border-white/10 focus:border-brand-500 outline-none text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    {errors.message && (
                      <span className="text-[10px] font-bold text-rose-500 mt-1 block">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-accent-violet to-accent-rose text-white font-extrabold text-sm shadow-glow-primary hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending Proposal...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Proposal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
