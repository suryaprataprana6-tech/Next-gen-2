"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, MessageSquare, ArrowRight, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function ChatBot() {
  const { openLeadModal, openConsultationModal } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: "Hello! I am Surya's AI Portfolio Assistant. How can I help you accelerate your web project today?",
      time: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    "What services do you offer?",
    "Show me client case studies",
    "What is your pricing starting rate?",
    "Book a 1-on-1 consultation",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Surya specializes in Next.js 15 App Router applications, full-stack web platforms, SEO schemas, and AI lead automations. Would you like to view project case studies or request a custom quote?";

      const lower = query.toLowerCase();
      if (lower.includes("service") || lower.includes("offer")) {
        botResponse = "Surya offers 9 core engineering & growth services: Website Development, Full Stack Apps, Next.js 15, Technical SEO, Meta Ads, AI Automation, CRM Platforms, UI/UX Design, and Performance Revamps.";
      } else if (lower.includes("case study") || lower.includes("project") || lower.includes("portfolio")) {
        botResponse = "Check out our Featured Projects section above! Highlight builds include Kamakhya Yatra (+310% traffic), Anjan Hospital, Goodluck Properties, and AIT Research Centre.";
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing")) {
        botResponse = "Custom website developments start from $999, Next.js Applications from $1,499, and Full Stack enterprise systems from $1,999. Would you like to request a tailored quote?";
      } else if (lower.includes("book") || lower.includes("consultation") || lower.includes("call")) {
        botResponse = "Great! You can click the 'Book Consultation' button to pick a convenient 30-minute slot directly.";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-600 via-accent-violet to-accent-rose text-white font-bold text-xs shadow-glow-primary hover:shadow-lg transition-all"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">AI Assistant</span>
        </motion.button>
      </div>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm sm:max-w-md glass-card rounded-3xl border border-white/20 p-5 bg-slate-900 text-white shadow-2xl flex flex-col h-[520px]"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-glow-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white">
                    Surya's AI Assistant
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online 24/7
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-xl bg-brand-500 flex items-center justify-center text-white shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-brand-600 text-white rounded-br-none"
                        : "bg-white/10 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] font-semibold text-slate-400 mt-1 block text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <Bot className="w-4 h-4 animate-spin-slow text-brand-500" />
                  <span>AI Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="py-2 flex flex-wrap gap-1.5 border-t border-white/10 mt-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-300 hover:bg-brand-500 hover:text-white transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about projects, rates, stack..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-brand-500 outline-none text-xs text-white placeholder:text-slate-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
