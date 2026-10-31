"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  LogOut,
  Radio,
  Activity,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Mic,
  MicOff,
  Trash2,
  Filter,
  RefreshCw,
  Sparkles,
  Cpu,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import JarvisOverlay from "@/components/jarvis/JarvisOverlay";
import JarvisOrb from "@/components/jarvis/JarvisOrb";
import { useDoubleClap } from "@/hooks/useDoubleClap";
import { Lead } from "@/lib/db";

export default function AdminPage() {
  const { admin, token, isAuthenticated, isLoading, login, logout } = useAdminAuth();

  // Login Form States (Unpopulated for Security)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    closed: 0,
  });
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // JARVIS Voice Assistant State
  const [isJarvisOpen, setIsJarvisOpen] = useState(false);

  // Double-Clap Background Listener
  const {
    isListening: isClapListening,
    status: clapStatus,
    audioLevel,
    clapCount,
    startClapDetection,
    stopClapDetection,
  } = useDoubleClap({
    onDoubleClap: () => {
      console.log("⚡ Double clap detected on Admin Dashboard! Activating JARVIS...");
      setIsJarvisOpen(true);
    },
  });

  // Fetch Leads & Telemetry Data
  const fetchData = async () => {
    if (!token && !isAuthenticated) return;
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setStats(data.stats || { total: 0, pending: 0, contacted: 0, closed: 0 });
      }

      // Fetch health
      const healthRes = await fetch("/api/admin/jarvis/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: "system health" }),
      });
      if (healthRes.ok) {
        const hData = await healthRes.json();
        if (hData.data) {
          setSystemHealth(hData.data);
        }
      }
    } catch (e) {
      console.warn("Could not load admin data:", e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    const res = await login(email, password);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || "Authentication failed. Check credentials.");
    }
  };

  // Handle Status Update
  const handleStatusChange = async (leadId: string, newStatus: "pending" | "contacted" | "closed") => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id: leadId, confirm: true }),
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "all") return true;
    return l.status === statusFilter;
  });

  // ----------------------------------------------------
  // LOADING SPLASH
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-cyan-400 tracking-wider">VERIFYING NEURAL SECURITY...</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // UNAUTHENTICATED: LOGIN PORTAL
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05070b] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Subtle Tech Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff06_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Card Border Glow */}
          <div className="p-8 rounded-2xl bg-[#090d16]/95 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.12)] backdrop-blur-xl">
            
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative h-12 w-48">
                  <Image
                    src="/logo.png"
                    alt="NextGen Digital Solutions"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RESTRICTED ACCESS • ADMIN ONLY</span>
              </div>
              <h1 className="text-xl font-heading font-extrabold text-white">
                JARVIS Command Core
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Authorized Personnel Authentication Required
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-6 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@nextgendigital.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Neural Access</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-cyan-400 font-mono transition-colors"
              >
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED: ADMIN WORKSPACE & JARVIS CORE
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans pb-16">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080c14]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Brand & Admin Identity */}
        <div className="flex items-center gap-4">
          <Link href="/" className="relative h-9 w-36 block">
            <Image
              src="/logo.png"
              alt="NextGen Digital Solutions"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <div className="hidden sm:block h-5 w-[1px] bg-slate-800" />
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-slate-300 font-bold">{admin?.name || "Surya Pratap Rana"}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
              SUPER ADMIN
            </span>
          </div>
        </div>

        {/* Right: Quick Actions & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ==================================================== */}
        {/* HERO JARVIS COMMAND CENTER CARD                      */}
        {/* ==================================================== */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#090e1a] via-[#0d1424] to-[#090e1a] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.12)] p-6 sm:p-8 overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col (7 cols): Greeting & Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NextGen JARVIS AI Command Station</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                Welcome back, <span className="text-gradient">Surya</span>.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
                Your proprietary AI assistant is standing by. Speak naturally to query incoming leads, generate high-converting Meta and Google Ads, draft client proposals, or monitor infrastructure telemetry.
              </p>

              {/* Hardware & Wake Controls */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* Manual Voice Launch Button */}
                <button
                  type="button"
                  onClick={() => setIsJarvisOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>Launch JARVIS Console</span>
                </button>

                {/* Double Clap Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isClapListening) {
                      stopClapDetection();
                    } else {
                      startClapDetection();
                    }
                  }}
                  className={`px-4 py-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                    isClapListening
                      ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isClapListening ? "bg-cyan-400 animate-ping" : "bg-slate-600"
                    }`}
                  />
                  <span>
                    Double-Clap Wake:{" "}
                    <strong className="text-white">
                      {isClapListening ? "ACTIVE" : "OFF"}
                    </strong>
                  </span>
                </button>
              </div>

              {/* Acoustic Status Note */}
              <div className="pt-1 flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  Mic Processing: <strong className="text-slate-200">100% Client-Side</strong>
                </span>
                <span>•</span>
                <span>Dual-Spike Window: 300–700ms</span>
                {clapCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">Claps Detected: {clapCount}/2</span>
                  </>
                )}
              </div>
            </div>

            {/* Right Col (5 cols): Interactive Mini Orb Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div
                onClick={() => setIsJarvisOpen(true)}
                className="cursor-pointer group relative flex flex-col items-center"
              >
                <JarvisOrb
                  state={isJarvisOpen ? "listening" : isClapListening ? "listening" : "sleeping"}
                  audioLevel={audioLevel}
                  size="md"
                />
                <span className="mt-3 text-xs font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Click orb to activate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* TELEMETRY & STATS TILES                               */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Leads */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Total Inquiries</p>
              <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                {stats.total}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Persisted in CRM</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Pending Follow-ups */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.06)]">
            <div>
              <p className="text-xs font-mono text-cyan-400 uppercase">Pending Review</p>
              <h3 className="text-2xl font-heading font-extrabold text-cyan-300 mt-1">
                {stats.pending}
              </h3>
              <p className="text-[11px] text-cyan-500/70 font-mono mt-0.5">Requires follow-up</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          {/* Contacted / Pipeline */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">In Negotiation</p>
              <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                {stats.contacted}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Contacted leads</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Closed / Won */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-emerald-400 uppercase">Closed / Active</p>
              <h3 className="text-2xl font-heading font-extrabold text-emerald-300 mt-1">
                {stats.closed}
              </h3>
              <p className="text-[11px] text-emerald-500/70 font-mono mt-0.5">Retained clients</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* LIVE CRM LEADS DIRECTORY                             */}
        {/* ==================================================== */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Table Header & Filter Bar */}
          <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>NextGen CRM Pipeline</span>
                <span className="text-xs font-mono text-slate-400">({filteredLeads.length} records)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Client inquiries submitted via website & managed by JARVIS
              </p>
            </div>

            {/* Filter Tabs & Refresh */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                {["all", "pending", "contacted", "closed"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-md capitalize transition-colors ${
                      statusFilter === f
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={fetchData}
                disabled={isLoadingData}
                title="Refresh CRM Data"
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Lead</th>
                  <th className="py-3 px-4">Service & Budget</th>
                  <th className="py-3 px-4">Inquiry Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No client leads found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const waMessage = `Hello ${lead.name}, this is Surya from NextGen Digital Solutions regarding your inquiry for ${lead.service}.`;
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Name & Contact */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-sm">{lead.name}</div>
                          {lead.business && (
                            <div className="text-xs text-slate-400 font-mono">{lead.business}</div>
                          )}
                          <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                            {lead.phone} • {lead.email}
                          </div>
                        </td>

                        {/* Service & Budget */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs">
                            {lead.service}
                          </span>
                          {lead.budget && (
                            <div className="text-[11px] text-slate-400 mt-1">
                              Budget: <strong className="text-slate-300">{lead.budget}</strong>
                            </div>
                          )}
                        </td>

                        {/* Message */}
                        <td className="py-3.5 px-4 max-w-xs font-sans text-xs text-slate-300">
                          <p className="line-clamp-2" title={lead.message}>
                            "{lead.message}"
                          </p>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(
                                lead.id,
                                e.target.value as "pending" | "contacted" | "closed"
                              )
                            }
                            className={`px-2.5 py-1 rounded text-xs font-mono font-bold focus:outline-none border cursor-pointer ${
                              lead.status === "pending"
                                ? "bg-amber-950/40 text-amber-300 border-amber-500/40"
                                : lead.status === "contacted"
                                ? "bg-blue-950/40 text-blue-300 border-blue-500/40"
                                : "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                            }`}
                          >
                            <option value="pending" className="bg-slate-900 text-amber-300">
                              PENDING
                            </option>
                            <option value="contacted" className="bg-slate-900 text-blue-300">
                              CONTACTED
                            </option>
                            <option value="closed" className="bg-slate-900 text-emerald-300">
                              CLOSED / WON
                            </option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Follow-up */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Send WhatsApp Follow-up"
                              className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Delete Button */}
                            {deleteConfirmId === lead.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[10px]"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(lead.id)}
                                title="Delete Lead (Destructive)"
                                className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SYSTEM DIAGNOSTICS & TELEMETRY FOOTER CARD           */}
        {/* ==================================================== */}
        {systemHealth && (
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>
                Engine Health: <strong className="text-emerald-400">{systemHealth.status}</strong>
              </span>
              <span>•</span>
              <span>Uptime: {systemHealth.uptimeFormatted}</span>
              <span>•</span>
              <span>Memory: {systemHealth.memoryUsageMB} MB</span>
            </div>
            <div className="text-[11px] text-slate-500">
              NextGen Digital Solutions • Secure Telemetry Active
            </div>
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* JARVIS VOICE & HUD MODAL OVERLAY                     */}
      {/* ==================================================== */}
      <JarvisOverlay
        isOpen={isJarvisOpen}
        onClose={() => setIsJarvisOpen(false)}
        authToken={token || undefined}
      />

    </div>
  );
}

