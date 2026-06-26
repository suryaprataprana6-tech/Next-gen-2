import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  MessageSquare,
  Cpu,
  Bot,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  User
} from "lucide-react";

function AdminLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("admin_theme") === "dark"
  );
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("admin_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("admin_theme", "light");
    }
  }, [isDarkMode]);

  // Protected route checkpoint
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads (CRM)", path: "/admin/leads", icon: Inbox },
    { name: "Portfolio", path: "/admin/portfolio", icon: Briefcase },
    { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
    { name: "Services", path: "/admin/services", icon: Cpu },
    { name: "AI Chat Logs", path: "/admin/chatlogs", icon: Bot },
    { name: "Blogs", path: "/admin/blogs", icon: FileText },
    { name: "Team Users", path: "/admin/users", icon: Users, adminOnly: true },
    { name: "Settings", path: "/admin/settings", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const currentPath = location.pathname;

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      
      {/* ─── SIDEBAR ──────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link to="/admin/dashboard" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
                <LayoutDashboard className="w-4.5 h-4.5" />
              </span>
              <span className="font-headings font-extrabold text-base tracking-tight text-dark dark:text-white">
                NGD <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin</span>
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-500 hover:text-dark dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {menuItems.map((item) => {
              if (item.adminOnly && user?.role !== "Admin") return null;
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-none mb-1">
                {user?.name}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        
        {/* Header Navigation */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold capitalize text-slate-800 dark:text-white hidden sm:block">
              {currentPath.split("/").pop()} Portal
            </h1>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Popover Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border border-white dark:border-slate-900 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-xl p-4 z-50 text-left">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">Recent Notifications</h4>
                      <span className="text-[10px] text-primary font-semibold hover:underline cursor-pointer">Clear</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/60 dark:hover:bg-slate-800 cursor-pointer">
                        <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5 leading-tight">New Lead Received</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">NGD-1009 submitted by Sarah Miller for SEO Services</p>
                        <span className="text-[9px] text-primary/80 font-bold block mt-1.5">2 minutes ago</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/60 dark:hover:bg-slate-800 cursor-pointer">
                        <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5 leading-tight">AI Chat Session Started</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Visitor from Mumbai clicked Call Button</p>
                        <span className="text-[9px] text-primary/80 font-bold block mt-1.5">15 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 relative">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;
