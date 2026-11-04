"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Edit2,
  Eye,
  Check,
  X,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Settings,
  MessageSquare,
  Sparkles,
  Server,
  FolderPlus,
  Sliders,
  History,
} from "lucide-react";
import { PaymentRecord, ServiceCategory, PaymentSettings, PricingAuditLog } from "@/lib/paymentsDb";

interface AdminPaymentManagerProps {
  token: string | null;
}

export default function AdminPaymentManager({ token }: AdminPaymentManagerProps) {
  // Navigation sub-tab: 'transactions' | 'pricing' | 'settings'
  const [activeSubTab, setActiveSubTab] = useState<"transactions" | "pricing" | "settings">("transactions");

  // Transactions State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    cancelledCount: 0,
    refundedCount: 0,
    customPaymentsCount: 0,
    customPaymentsRevenue: 0,
    tokenPaymentsCount: 0,
    tokenPaymentsRevenue: 0,
    serviceWiseList: [] as Array<{ serviceName: string; count: number; revenue: number }>,
  });
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Detailed Transaction View Modal
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Manual Gateway Evidence Verification Modal
  const [isVerifyingModalOpen, setIsVerifyingModalOpen] = useState(false);
  const [evidencePaymentId, setEvidencePaymentId] = useState("");
  const [isVerifyingEvidence, setIsVerifyingEvidence] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState("");

  // Service Pricing State
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Edit Service State
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("development");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMinAmount, setEditMinAmount] = useState<number>(500);
  const [editMaxAmount, setEditMaxAmount] = useState<number>(500000);
  const [editDescription, setEditDescription] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editPaymentType, setEditPaymentType] = useState<string>("full");
  const [editBillingCycle, setEditBillingCycle] = useState<string>("one-time");
  const [editBadge, setEditBadge] = useState("");
  const [editBreakdown, setEditBreakdown] = useState<{ label: string; amount: number }[]>([]);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [pricingFeedback, setPricingFeedback] = useState("");

  // Add New Service Modal State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("development");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState<number>(10000);
  const [newPaymentType, setNewPaymentType] = useState<"token" | "full" | "recurring" | "custom">("full");
  const [newBillingCycle, setNewBillingCycle] = useState<"one-time" | "monthly" | "custom">("one-time");
  const [newBadge, setNewBadge] = useState("");
  const [newBreakdown, setNewBreakdown] = useState<{ label: string; amount: number }[]>([]);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Global Settings State
  const [settings, setSettings] = useState<PaymentSettings>({
    tokenMoneyAmount: 5000,
    tokenOptionEnabled: true,
    domainRegistrationAmount: 1500,
    hostingAmount: 2000,
    additionalChargesAmount: 0,
    minCustomAmount: 500,
    maxCustomAmount: 500000,
    currency: "INR",
    requireApprovalAbove: 200000,
    updatedAt: new Date().toISOString(),
  });
  const [auditLogs, setAuditLogs] = useState<PricingAuditLog[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState("");

  // Fetch payments with active filters
  const fetchPayments = async () => {
    if (!token) return;
    setIsLoadingPayments(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append("search", searchTerm);
      if (serviceFilter !== "all") query.append("service", serviceFilter);
      if (statusFilter !== "all") query.append("status", statusFilter);
      if (paymentTypeFilter !== "all") query.append("paymentType", paymentTypeFilter);
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);

      const res = await fetch(`/api/admin/payments?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments || []);
          if (data.stats) setStats(data.stats);
        }
      }
    } catch (e) {
      console.error("Error fetching admin payments:", e);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  // Fetch all service catalog items & settings
  const fetchServicesAndSettings = async () => {
    if (!token) return;
    setIsLoadingServices(true);
    try {
      const res = await fetch("/api/admin/payments/pricing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.services)) setServices(data.services);
          if (data.settings) setSettings(data.settings);
          if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        }
      }
    } catch (e) {
      console.error("Error fetching pricing catalog:", e);
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchServicesAndSettings();
  }, [token, serviceFilter, statusFilter, paymentTypeFilter, startDate, endDate]);

  // Handle Search Input Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPayments();
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Export to CSV Function
  const exportToCSV = () => {
    if (payments.length === 0) {
      alert("No payment records to export.");
      return;
    }

    const headers = [
      "Receipt Number",
      "Date",
      "Customer Name",
      "Mobile",
      "Email",
      "Business Name",
      "Service",
      "Payment Type",
      "Amount Paid (INR)",
      "Total Project Amount (INR)",
      "Remaining Balance (INR)",
      "Purpose / Reference",
      "Status",
      "Gateway",
      "Order ID",
      "Payment ID",
      "Status Reason",
    ];

    const rows = payments.map((p) => [
      p.receiptNumber,
      p.paymentTimestamp ? new Date(p.paymentTimestamp).toISOString() : new Date(p.createdAt).toISOString(),
      `"${p.customerName.replace(/"/g, '""')}"`,
      `"${p.customerMobile}"`,
      `"${p.customerEmail}"`,
      `"${(p.businessName || "").replace(/"/g, '""')}"`,
      `"${p.serviceName}"`,
      (p.paymentType || "full").toUpperCase(),
      p.amount,
      p.totalProjectAmount || "N/A",
      p.remainingBalance || 0,
      `"${(p.purpose || p.projectReference || p.projectDescription || "").replace(/"/g, '""')}"`,
      p.status.toUpperCase(),
      p.gateway,
      p.gatewayOrderId,
      p.gatewayPaymentId || "N/A",
      `"${(p.statusReason || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nextgen_payment_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Edit Service Modal
  const handleEditClick = (service: ServiceCategory) => {
    setEditingService(service);
    setEditName(service.name);
    setEditCategory(service.category || "development");
    setEditPrice(service.amount);
    setEditMinAmount(service.minAmount || 500);
    setEditMaxAmount(service.maxAmount || 500000);
    setEditDescription(service.shortDescription);
    setEditEnabled(service.enabled);
    setEditPaymentType(service.paymentType || "full");
    setEditBillingCycle(service.billingCycle || "one-time");
    setEditBadge(service.badge || "");
    setEditBreakdown(service.breakdown ? JSON.parse(JSON.stringify(service.breakdown)) : []);
    setPricingFeedback("");
  };

  // Save Service Pricing Changes
  const handleSavePricing = async () => {
    if (!editingService || !token) return;
    setIsSavingPricing(true);
    setPricingFeedback("");

    try {
      const res = await fetch("/api/admin/payments/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingService.id,
          name: editName,
          category: editCategory,
          amount: editPrice,
          minAmount: editMinAmount,
          maxAmount: editMaxAmount,
          shortDescription: editDescription,
          enabled: editEnabled,
          paymentType: editPaymentType,
          billingCycle: editBillingCycle,
          badge: editBadge,
          breakdown: editBreakdown.length > 0 ? editBreakdown : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPricingFeedback("Service updated and saved successfully!");
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? data.service : s))
        );
        setTimeout(() => {
          setEditingService(null);
          setPricingFeedback("");
        }, 1200);
      } else {
        setPricingFeedback(data.message || "Failed to update pricing.");
      }
    } catch (e: any) {
      setPricingFeedback(e.message || "Network error while saving.");
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Handle Add New Service
  const handleCreateNewService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsCreatingService(true);

    try {
      const res = await fetch("/api/admin/payments/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          category: newCategory,
          shortDescription: newDescription,
          amount: newAmount,
          paymentType: newPaymentType,
          billingCycle: newBillingCycle,
          badge: newBadge || undefined,
          breakdown: newBreakdown.length > 0 ? newBreakdown : undefined,
          enabled: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setServices((prev) => [...prev, data.service]);
        setIsAddServiceOpen(false);
        setNewName("");
        setNewDescription("");
        setNewAmount(10000);
        setNewBreakdown([]);
        alert(`Service "${data.service.name}" created successfully!`);
      } else {
        alert(data.message || "Failed to create service.");
      }
    } catch (err: any) {
      alert(err.message || "Error creating service.");
    } finally {
      setIsCreatingService(false);
    }
  };

  // Handle Service Deletion
  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to permanently remove "${serviceName}" from the public catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/payments/pricing?id=${encodeURIComponent(serviceId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      } else {
        alert(data.message || "Failed to delete service.");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting service.");
    }
  };

  // Save Global Payment & Token Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingSettings(true);
    setSettingsFeedback("");

    try {
      const res = await fetch("/api/admin/payments/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        setSettingsFeedback("Settings synchronized across public checkout & server validation!");
        fetchServicesAndSettings();
        setTimeout(() => setSettingsFeedback(""), 3500);
      } else {
        setSettingsFeedback(data.message || "Failed to save settings.");
      }
    } catch (err: any) {
      setSettingsFeedback(err.message || "Error saving settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Manual Evidence Verification
  const handleVerifyEvidence = async () => {
    if (!selectedPayment || !evidencePaymentId.trim() || !token) {
      setVerifyError("Valid Razorpay Payment ID required (e.g. pay_...).");
      return;
    }

    setIsVerifyingEvidence(true);
    setVerifyError("");
    setVerifySuccess("");

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedPayment.id,
          action: "verify_with_evidence",
          verifiedGatewayPaymentId: evidencePaymentId.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVerifySuccess(data.message);
        fetchPayments();
        setTimeout(() => {
          setIsVerifyingModalOpen(false);
          setSelectedPayment(data.payment);
          setVerifySuccess("");
          setEvidencePaymentId("");
        }, 1500);
      } else {
        setVerifyError(data.message || "Verification failed.");
      }
    } catch (e: any) {
      setVerifyError(e.message || "Network error while connecting to gateway.");
    } finally {
      setIsVerifyingEvidence(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ==================================================== */}
      {/* SECTION TABS HEADER & QUICK ACTIONS                  */}
      {/* ==================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        
        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("transactions")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "transactions"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Transactions & Ledger ({payments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("pricing")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "pricing"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Service Catalog ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "settings"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Payment & Token Settings</span>
          </button>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          {activeSubTab === "transactions" && (
            <button
              type="button"
              onClick={exportToCSV}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          {activeSubTab === "pricing" && (
            <button
              type="button"
              onClick={() => setIsAddServiceOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              fetchPayments();
              fetchServicesAndSettings();
            }}
            title="Refresh Ledger & Pricing"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPayments || isLoadingServices ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>

      </div>

      {/* ==================================================== */}
      {/* SUB-TAB 1: TRANSACTIONS & LEDGER                     */}
      {/* ==================================================== */}
      {activeSubTab === "transactions" && (
        <div className="space-y-6">
          
          {/* Analytics Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Verified Revenue */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 flex items-center justify-between shadow-[0_0_25px_rgba(0,240,255,0.08)]">
              <div>
                <p className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">Verified Revenue</p>
                <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Captured in Razorpay</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Completed Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-emerald-400 tracking-wider">Completed</p>
                <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                  {stats.successfulCount}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Paid & Verified</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Pending Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">Pending</p>
                <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                  {stats.pendingCount}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Awaiting Settlement</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Custom Payments Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-purple-400 tracking-wider">Custom Payments</p>
                <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                  {stats.customPaymentsCount}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  ₹{stats.customPaymentsRevenue.toLocaleString("en-IN")} collected
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Failed / Cancelled Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-rose-400 tracking-wider">Failed / Cancelled</p>
                <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                  {stats.failedCount + stats.cancelledCount}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">Declined or Closed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Service-Wise Revenue Breakdown Pill Bar */}
          {stats.serviceWiseList.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Service Collections:</span>
              </span>
              {stats.serviceWiseList.map((item) => (
                <div
                  key={item.serviceName}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono flex items-center gap-2"
                >
                  <span className="text-slate-300">{item.serviceName}:</span>
                  <strong className="text-cyan-400">₹{item.revenue.toLocaleString("en-IN")}</strong>
                  <span className="text-[10px] text-slate-500">({item.count})</span>
                </div>
              ))}
            </div>
          )}

          {/* Table Container & Filter Suite */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
            
            {/* Filter Suite Bar */}
            <div className="p-4 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              
              {/* Search Bar (4 cols) */}
              <div className="lg:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, mobile, receipt, order or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Service Filter (2 cols) */}
              <div className="lg:col-span-2">
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Type Filter (2 cols) */}
              <div className="lg:col-span-2">
                <select
                  value={paymentTypeFilter}
                  onChange={(e) => setPaymentTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Payment Types</option>
                  <option value="token">Token / Kickoff</option>
                  <option value="full">Full Package</option>
                  <option value="recurring">Monthly Retainer</option>
                  <option value="custom">Custom Milestone</option>
                </select>
              </div>

              {/* Status Filter (2 cols) */}
              <div className="lg:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="successful">Successful Only</option>
                  <option value="pending">Pending Only</option>
                  <option value="failed">Failed / Declined</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Filters (2 cols) */}
              <div className="lg:col-span-2 flex items-center gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Receipt & Customer</th>
                    <th className="py-3 px-4">Service & Type</th>
                    <th className="py-3 px-4">Amount & Balance</th>
                    <th className="py-3 px-4">Gateway Reference</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        {isLoadingPayments ? (
                          <div className="flex items-center justify-center gap-2 text-cyan-400">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Loading payments ledger...</span>
                          </div>
                        ) : (
                          "No transactions match the selected filters."
                        )}
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => {
                      const isSuccess = payment.status === "successful";
                      const isPending = payment.status === "pending";
                      const isFailed = payment.status === "failed" || payment.status === "cancelled";
                      const isCustom = payment.paymentType === "custom" || payment.serviceId === "custom_payment";

                      return (
                        <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                          
                          {/* Receipt & Customer */}
                          <td className="py-3 px-4">
                            <div className="font-sans font-bold text-white flex items-center gap-2">
                              <span>{payment.customerName}</span>
                              {payment.businessName && (
                                <span className="text-[10px] font-normal text-slate-400">
                                  ({payment.businessName})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-cyan-400 mt-0.5">
                              {payment.receiptNumber}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {payment.customerMobile} • {payment.customerEmail}
                            </div>
                          </td>

                          {/* Service Package & Type */}
                          <td className="py-3 px-4 font-sans">
                            <div className="text-slate-200 font-medium flex items-center gap-1.5">
                              <span>{payment.serviceName}</span>
                              {isCustom && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  CUSTOM
                                </span>
                              )}
                              {payment.paymentType === "token" && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  TOKEN
                                </span>
                              )}
                            </div>
                            {payment.purpose ? (
                              <div className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                                "{payment.purpose}"
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {payment.projectDescription}
                              </div>
                            )}
                          </td>

                          {/* Amount & Balance */}
                          <td className="py-3 px-4">
                            <div className="text-sm font-bold text-white">
                              ₹{payment.amount.toLocaleString("en-IN")}
                            </div>
                            {typeof payment.remainingBalance === "number" && payment.remainingBalance > 0 ? (
                              <div className="text-[10px] text-amber-400 mt-0.5">
                                Due: ₹{payment.remainingBalance.toLocaleString("en-IN")}
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-500 uppercase mt-0.5">
                                {payment.currency}
                              </div>
                            )}
                          </td>

                          {/* Gateway Reference */}
                          <td className="py-3 px-4 text-[11px]">
                            {payment.gatewayPaymentId ? (
                              <div className="text-cyan-400 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{payment.gatewayPaymentId}</span>
                              </div>
                            ) : (
                              <div className="text-slate-500">Pay: Not Generated</div>
                            )}
                            <div className="text-[10px] text-slate-600 mt-0.5">
                              Ord: {payment.gatewayOrderId.slice(0, 16)}...
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isSuccess
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                                  : isPending
                                  ? "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                                  : "bg-rose-950/80 text-rose-300 border border-rose-500/30"
                              }`}
                            >
                              {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                              {isPending && <Clock className="w-3 h-3 text-amber-400" />}
                              {isFailed && <XCircle className="w-3 h-3 text-rose-400" />}
                              <span>{payment.status}</span>
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedPayment(payment)}
                                title="View Complete Transaction Audit"
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* WhatsApp Contact */}
                              <a
                                href={`https://wa.me/${payment.customerMobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `Hello ${payment.customerName}, this is Surya from NextGen Digital Solutions regarding your payment record ${payment.receiptNumber}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Message on WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
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

        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 2: SERVICE CATALOG & PRICING                 */}
      {/* ==================================================== */}
      {activeSubTab === "pricing" && (
        <div className="space-y-6">
          
          {/* Header Note */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>
                Admin Service Pricing Control: Modifying values updates public checkout prices and server-side validation immediately.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddServiceOpen(true)}
              className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md hover:bg-cyan-400 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Package</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["all", "kickoff", "marketing", "development", "maintenance", "creative", "custom"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  categoryFilter === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services
              .filter((s) => categoryFilter === "all" || s.category === categoryFilter)
              .map((service) => (
                <div
                  key={service.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    service.enabled
                      ? "bg-slate-900/70 border-slate-800 hover:border-cyan-500/30 shadow-lg"
                      : "bg-slate-950/50 border-slate-800/40 opacity-60"
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Badge & Status Switch */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            service.enabled
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {service.enabled ? "Active for Online Booking" : "Disabled / Hidden"}
                        </span>
                        {service.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        {service.paymentType}
                      </span>
                    </div>

                    {/* Service Name & Category */}
                    <div>
                      <h4 className="text-base font-bold text-white font-sans flex items-center justify-between">
                        <span>{service.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {service.category}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* Breakdown Preview */}
                    {service.breakdown && service.breakdown.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-[11px] font-mono">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Breakdown:
                        </span>
                        {service.breakdown.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-slate-400">
                            <span className="truncate pr-2">{item.label}</span>
                            <span className="text-slate-200">₹{item.amount.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Price & Edit Button */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-slate-500">
                        {service.pricingType === "custom" ? "Custom Range" : "Configured Price"}
                      </p>
                      <h5 className="text-lg font-mono font-extrabold text-cyan-400">
                        {service.pricingType === "custom"
                          ? `₹${(service.minAmount || 500).toLocaleString("en-IN")} - ₹${(service.maxAmount || 500000).toLocaleString("en-IN")}`
                          : `₹${service.amount.toLocaleString("en-IN")}`}
                        {service.billingCycle === "monthly" && (
                          <span className="text-xs text-slate-400 font-normal"> /mo</span>
                        )}
                      </h5>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditClick(service)}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {/* Delete button only for non-default services */}
                      {service.id.startsWith("srv_") || !DEFAULT_SERVICE_IDS.includes(service.id) ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id, service.name)}
                          title="Delete Service"
                          className="p-1.5 rounded-xl text-xs bg-red-950/50 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      ) : null}
                    </div>

                  </div>

                </div>
              ))}
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 3: PAYMENT & TOKEN SETTINGS                  */}
      {/* ==================================================== */}
      {activeSubTab === "settings" && (
        <div className="space-y-6">
          
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>
                Global Payment Engine Configuration: Changes are synchronized with server pricing authority and Razorpay checkout orders.
              </span>
            </div>
          </div>

          {settingsFeedback && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{settingsFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Card 1: Fixed Token Money Configuration */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Fixed Token Money Configuration</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Project initiation and kickoff deposit required from clients to lock calendar and start design.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.tokenOptionEnabled}
                    onChange={(e) => setSettings({ ...settings, tokenOptionEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span className="text-xs font-mono text-slate-300">Enable Token Booking</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Fixed Token Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min={500}
                      value={settings.tokenMoneyAmount}
                      onChange={(e) => setSettings({ ...settings, tokenMoneyAmount: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Customer cannot edit this amount. Server strictly overrides any client price changes.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Currency Specification
                  </label>
                  <input
                    type="text"
                    disabled
                    value="INR (Indian Rupee)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm font-mono text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Standard currency for domestic UPI, NetBanking, and Card gateways.
                  </p>
                </div>
              </div>

            </div>

            {/* Card 2: Token Money + Domain & Hosting Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Token Money + Domain & Hosting Bundle</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure the individual itemized components. Total payable is automatically calculated and shown to customer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Kickoff Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.tokenMoneyAmount}
                    disabled
                    className="w-full px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm font-mono text-slate-400 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">Linked to Token Money</span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Domain Registration (1 Year) (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settings.domainRegistrationAmount}
                    onChange={(e) => setSettings({ ...settings, domainRegistrationAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Cloud Hosting (1 Year) (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settings.hostingAmount}
                    onChange={(e) => setSettings({ ...settings, hostingAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Additional Charges (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settings.additionalChargesAmount}
                    onChange={(e) => setSettings({ ...settings, additionalChargesAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Calculated Total Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase">Calculated Bundle Total</span>
                  <p className="text-xs text-slate-500">Breakdown will appear transparently on the customer receipt</p>
                </div>
                <div className="text-xl font-mono font-extrabold text-cyan-400">
                  ₹{(
                    settings.tokenMoneyAmount +
                    settings.domainRegistrationAmount +
                    settings.hostingAmount +
                    (settings.additionalChargesAmount || 0)
                  ).toLocaleString("en-IN")}
                </div>
              </div>

            </div>

            {/* Card 3: Custom Payment Thresholds */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Custom Payment & Milestone Thresholds</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set safety boundaries to prevent invalid zero/negative amounts or untracked giant single transactions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Minimum Allowed Amount (INR)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={settings.minCustomAmount}
                    onChange={(e) => setSettings({ ...settings, minCustomAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Default: ₹500</span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                    Maximum Single Allowed Amount (INR)
                  </label>
                  <input
                    type="number"
                    min={settings.minCustomAmount}
                    value={settings.maxCustomAmount}
                    onChange={(e) => setSettings({ ...settings, maxCustomAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">Default: ₹5,00,000</span>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save All Payment Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Pricing Audit Log Table */}
          {auditLogs.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h4 className="text-base font-bold text-white">Pricing Audit Trail</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Action</th>
                      <th className="py-2 px-3">Target</th>
                      <th className="py-2 px-3">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 text-slate-500">
                          {new Date(log.timestamp).toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 px-3 text-cyan-400 uppercase font-bold">
                          {log.action}
                        </td>
                        <td className="py-2 px-3">
                          {log.serviceName || log.serviceId || "Global Settings"}
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {log.adminUser || "Super Admin"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT SERVICE PRICING                          */}
      {/* ==================================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-cyan-400" />
                  <span>Edit Service: {editingService.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: {editingService.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pricingFeedback && (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                {pricingFeedback}
              </div>
            )}

            <div className="space-y-4 text-xs font-mono">
              
              {/* Name & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Service Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="kickoff">Kickoff / Token</option>
                    <option value="development">Web Development</option>
                    <option value="marketing">Performance Marketing</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="creative">Creative & Design</option>
                    <option value="custom">Custom / Milestone</option>
                  </select>
                </div>
              </div>

              {/* Price or Custom Bounds */}
              {editingService.pricingType === "fixed" ? (
                <div>
                  <label className="block text-slate-400 uppercase mb-1">
                    Fixed Price Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Min Custom Amount (INR)</label>
                    <input
                      type="number"
                      min={100}
                      value={editMinAmount}
                      onChange={(e) => setEditMinAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 uppercase mb-1">Max Custom Amount (INR)</label>
                    <input
                      type="number"
                      min={editMinAmount}
                      value={editMaxAmount}
                      onChange={(e) => setEditMaxAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 font-sans text-xs"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Active for Online Booking</span>
                <button
                  type="button"
                  onClick={() => setEditEnabled(!editEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    editEnabled ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      editEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePricing}
                disabled={isSavingPricing}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 flex items-center gap-1.5 shadow-md"
              >
                {isSavingPricing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Service</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD NEW SERVICE                               */}
      {/* ==================================================== */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-cyan-400" />
                  <span>Add New Service Package</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Expand your agency offerings without modifying code
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddServiceOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewService} className="space-y-4 text-xs font-mono">
              
              <div>
                <label className="block text-slate-400 uppercase mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Workflow Automation"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="development">Web Development</option>
                    <option value="marketing">Performance Marketing</option>
                    <option value="creative">Creative & Design</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="kickoff">Kickoff / Token</option>
                    <option value="custom">Custom Scope</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Payment Type</label>
                  <select
                    value={newPaymentType}
                    onChange={(e) => setNewPaymentType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="full">Full Package</option>
                    <option value="token">Token / Kickoff</option>
                    <option value="recurring">Monthly Retainer</option>
                    <option value="custom">Custom Milestone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase mb-1">Price Amount (INR) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase mb-1">Billing Cycle</label>
                  <select
                    value={newBillingCycle}
                    onChange={(e) => setNewBillingCycle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="one-time">One-Time</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview of what is included in this package..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase mb-1">Badge Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Popular, Advanced, New"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingService}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 flex items-center gap-1.5 shadow-md"
                >
                  {isCreatingService ? "Creating..." : "Create & Add to Live Site"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: TRANSACTION DETAILS & AUDIT                   */}
      {/* ==================================================== */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {selectedPayment.receiptNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Transaction Audit Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Amount Hero */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Collected (INR)</p>
                <h4 className="text-3xl font-heading font-extrabold text-white mt-0.5">
                  ₹{selectedPayment.amount.toLocaleString("en-IN")}
                </h4>
                {typeof selectedPayment.remainingBalance === "number" && (
                  <p className="text-xs font-mono text-amber-400 mt-1">
                    Remaining Project Balance: ₹{selectedPayment.remainingBalance.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    selectedPayment.status === "successful"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      : selectedPayment.status === "pending"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                      : "bg-rose-950 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {selectedPayment.status}
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Type: {(selectedPayment.paymentType || "full").toUpperCase()}
                </p>
              </div>
            </div>

            {/* Customer & Package Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Client Information</span>
                <div>
                  <p className="text-slate-400">Name: <strong className="text-white">{selectedPayment.customerName}</strong></p>
                  {selectedPayment.businessName && <p className="text-slate-400">Business: <strong className="text-white">{selectedPayment.businessName}</strong></p>}
                  <p className="text-slate-400">Mobile: <strong className="text-white">{selectedPayment.customerMobile}</strong></p>
                  <p className="text-slate-400">Email: <strong className="text-white">{selectedPayment.customerEmail}</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Service Details</span>
                <div>
                  <p className="text-slate-400">Package: <strong className="text-white">{selectedPayment.serviceName}</strong></p>
                  {selectedPayment.purpose && <p className="text-slate-400">Purpose: <strong className="text-cyan-400">{selectedPayment.purpose}</strong></p>}
                  {selectedPayment.projectReference && <p className="text-slate-400">Reference: <strong className="text-slate-200">{selectedPayment.projectReference}</strong></p>}
                  <p className="text-slate-400">Description: <span className="text-slate-300">{selectedPayment.projectDescription}</span></p>
                </div>
              </div>
            </div>

            {/* Gateway Telemetry */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Gateway Audit Data</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p className="text-slate-500">Gateway: <span className="text-slate-300 uppercase">{selectedPayment.gateway}</span></p>
                  <p className="text-slate-500">Order ID: <span className="text-cyan-400">{selectedPayment.gatewayOrderId}</span></p>
                  <p className="text-slate-500">Payment ID: <span className="text-emerald-400">{selectedPayment.gatewayPaymentId || "None"}</span></p>
                </div>
                <div>
                  <p className="text-slate-500">Created: <span className="text-slate-400">{new Date(selectedPayment.createdAt).toLocaleString("en-IN")}</span></p>
                  {selectedPayment.paymentTimestamp && (
                    <p className="text-slate-500">Settled: <span className="text-emerald-400">{new Date(selectedPayment.paymentTimestamp).toLocaleString("en-IN")}</span></p>
                  )}
                  <p className="text-slate-500">Status Reason: <span className="text-slate-300">{selectedPayment.statusReason || "Standard checkout flow"}</span></p>
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              {selectedPayment.status === "pending" && (
                <button
                  type="button"
                  onClick={() => setIsVerifyingModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Verify with Gateway Evidence</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={`/payment-success?receiptNumber=${encodeURIComponent(selectedPayment.receiptNumber)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <span>Public Receipt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: STRICT GATEWAY EVIDENCE VERIFICATION          */}
      {/* ==================================================== */}
      {isVerifyingModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] p-6 space-y-5 font-sans">
            
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Enforce Gateway Evidence Verification
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Order ID: {selectedPayment.gatewayOrderId}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-amber-950/40 border border-amber-500/20 p-3 rounded-xl">
              <strong>Strict Security Policy:</strong> Manual confirmation is blocked without verified Razorpay evidence. You must input the genuine Razorpay payment ID (e.g. <code className="text-amber-300">pay_...</code>). Our backend will query the Razorpay REST API to verify that the transaction was captured and matches ₹{selectedPayment.amount.toLocaleString("en-IN")}.
            </p>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {verifyError}
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                {verifySuccess}
              </div>
            )}

            <div className="space-y-1.5 font-mono text-xs">
              <label className="block text-slate-400 uppercase">
                Razorpay Payment ID (from Gateway Dashboard)
              </label>
              <input
                type="text"
                placeholder="pay_xxxxxxxxxxxxxx"
                value={evidencePaymentId}
                onChange={(e) => setEvidencePaymentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsVerifyingModalOpen(false);
                  setVerifyError("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyEvidence}
                disabled={isVerifyingEvidence}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md"
              >
                {isVerifyingEvidence ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify & Confirm Payment</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const DEFAULT_SERVICE_IDS = [
  "token_money",
  "token_domain_hosting",
  "seo_services",
  "meta_ads",
  "google_ads",
  "smm",
  "web_dev",
  "web_maintenance",
  "graphic_design",
  "custom_payment",
];
