import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Eye,
  Inbox,
  Phone,
  MessageSquare,
  Award,
  Settings,
  ChevronRight,
  TrendingUp,
  Globe,
  Monitor,
  Compass,
  ArrowUpRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/analytics`);
      if (response.data?.success) {
        setData(response.data);
      } else {
        setError("Failed to retrieve dashboard records");
      }
    } catch (err) {
      console.error("Dashboard analytics error:", err);
      setError("Failed to contact API server. Please check database connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* Loading Header */}
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        {/* Loading Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        {/* Loading Charts Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[340px] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-[340px] bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Fallbacks if data fails
  const stats = data?.stats || {
    visitorsToday: 12,
    totalVisitors: 310,
    leads: 8,
    whatsappClicks: 24,
    phoneCalls: 9,
    portfolioViews: 142,
    testimonials: 8,
    activeServices: 10,
    bounceRate: "32.4%"
  };

  const chartData = data?.chartData || [
    { month: "Jan", visitors: 45, leads: 3 },
    { month: "Feb", visitors: 78, leads: 5 },
    { month: "Mar", visitors: 92, leads: 7 },
    { month: "Apr", visitors: 110, leads: 9 },
    { month: "May", visitors: 145, leads: 12 },
    { month: "Jun", visitors: 198, leads: 15 }
  ];

  const recentActivities = data?.recentActivities || [
    { _id: "1", activity: "Visitor checked Label Raje Project", time: new Date(), type: "portfolio_view" },
    { _id: "2", activity: "New Lead NGD-1002 submitted", time: new Date(), type: "lead_submission" },
    { _id: "3", activity: "AI Chat session initiated", time: new Date(), type: "pageview" }
  ];

  const distributions = data?.distributions || {
    countries: [{ _id: "India", count: 215 }, { _id: "USA", count: 42 }, { _id: "UK", count: 18 }],
    devices: [{ _id: "Desktop", count: 198 }, { _id: "Mobile", count: 105 }, { _id: "Tablet", count: 7 }],
    browsers: [{ _id: "Chrome", count: 210 }, { _id: "Safari", count: 65 }, { _id: "Firefox", count: 25 }, { _id: "Edge", count: 10 }]
  };

  const statCards = [
    { title: "Today's Visitors", value: stats.visitorsToday, icon: Users, color: "bg-blue-500 text-blue-500", desc: "Unique live visitors" },
    { title: "Total Traffic", value: stats.totalVisitors, icon: Eye, color: "bg-purple-500 text-purple-500", desc: "All pageviews" },
    { title: "Leads Submitted", value: stats.leads, icon: Inbox, color: "bg-emerald-500 text-emerald-500", desc: "CRM form captures" },
    { title: "WhatsApp Clicks", value: stats.whatsappClicks, icon: MessageSquare, color: "bg-green-500 text-green-500", desc: "Clicked contact link" },
    { title: "Phone Calls", value: stats.phoneCalls, icon: Phone, color: "bg-amber-500 text-amber-500", desc: "Clicked mobile call button" },
    { title: "Portfolio Clicks", value: stats.portfolioViews, icon: Award, color: "bg-pink-500 text-pink-500", desc: "Individual project clicks" },
    { title: "Active Testimonials", value: stats.testimonials, icon: MessageSquare, color: "bg-sky-500 text-sky-500", desc: "Published success stories" },
    { title: "Active Services", value: stats.activeServices, icon: Settings, color: "bg-rose-500 text-rose-500", desc: "Managed core expertises" }
  ];

  // Map device distribution to Recharts format
  const devicePieData = distributions.devices.map(d => ({
    name: d._id || "Unknown",
    value: d.count
  }));

  const browserBarData = distributions.browsers.slice(0, 4).map(b => ({
    name: b._id || "Chrome",
    count: b.count
  }));

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Overview Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Real-time analytics and dynamic content status of your website
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all"
        >
          Refresh Statistics
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-3 text-xs text-amber-600 dark:text-amber-400 text-left">
          ⚠️ {error} - Rendering static mock graphs for display.
        </div>
      )}

      {/* ─── STATS GRID ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    {card.title}
                  </span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none mb-2">
                    {card.value}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl ${card.color.split(" ")[0]}/10 ${card.color.split(" ")[1]}`}>
                  <CardIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ─── CHARTS SECTION ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visitor & Lead Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Traffic & Lead Acquisitions
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Visitors</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> CRM Leads</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVis)" />
                <Area type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLead)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device breakdown PieChart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider text-left mb-4">
            Device Distribution
          </h3>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devicePieData.length > 0 ? devicePieData : [{ name: "Desktop", value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(devicePieData.length > 0 ? devicePieData : [{ name: "Desktop", value: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Monitor className="w-5 h-5 text-slate-400 mb-0.5" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Devices</span>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4 text-[10px] font-semibold text-slate-500 mt-2">
            {(devicePieData.length > 0 ? devicePieData : [{ name: "Desktop", value: 1 }]).map((entry, idx) => (
              <span key={entry.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ─── BOTTOM BLOCK: RECENT ACTIVITY & COUNTRY BREAKDOWN ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5">
              Recent Visitor Activity Logs
            </h3>
            <div className="flex flex-col gap-3.5">
              {recentActivities.map((act) => (
                <div key={act._id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      act.type === "lead_submission" ? "bg-emerald-500" : act.type === "portfolio_view" ? "bg-pink-500" : "bg-blue-500"
                    }`}></span>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {act.activity}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5">
            <Link
              to="/admin/chatlogs"
              className="text-[11px] font-bold text-primary hover:text-secondary inline-flex items-center gap-1"
            >
              <span>View All Conversation Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Geographic Countries list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-left">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-5">
            Top Visitor Locations
          </h3>
          <div className="flex flex-col gap-4">
            {distributions.countries.slice(0, 5).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm">📍</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{c._id || "Unknown Country"}</p>
                    <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-350">{c.count} hits</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
