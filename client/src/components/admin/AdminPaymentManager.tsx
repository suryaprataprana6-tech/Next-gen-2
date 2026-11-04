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
} from "lucide-react";
import { PaymentRecord, ServiceCategory } from "@/lib/paymentsDb";

interface AdminPaymentManagerProps {
  token: string | null;
}

export default function AdminPaymentManager({ token }: AdminPaymentManagerProps) {
  // Navigation sub-tab: 'transactions' | 'pricing'
  const [activeSubTab, setActiveSubTab] = useState<"transactions" | "pricing">("transactions");

  // Transactions State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    cancelledCount: 0,
  });
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editMinAmount, setEditMinAmount] = useState<number>(500);
  const [editDescription, setEditDescription] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editBreakdown, setEditBreakdown] = useState<{ label: string; amount: number }[]>([]);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [pricingFeedback, setPricingFeedback] = useState("");

  // Fetch payments with active filters
  const fetchPayments = async () => {
    if (!token) return;
    setIsLoadingPayments(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.append("search", searchTerm);
      if (serviceFilter !== "all") query.append("service", serviceFilter);
      if (statusFilter !== "all") query.append("status", statusFilter);
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

  // Fetch all service catalog items
  const fetchServices = async () => {
    if (!token) return;
    setIsLoadingServices(true);
    try {
      const res = await fetch("/api/admin/payments/pricing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
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
    fetchServices();
  }, [token, serviceFilter, statusFilter, startDate, endDate]);

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
      "Amount (INR)",
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
      p.amount,
      p.status.toUpperCase(),
      p.gateway,
      p.gatewayOrderId,
      p.gatewayPaymentId || "N/A",
      `"${(p.statusReason || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NextGen_Payments_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit verified gateway evidence (Strict Security Guard)
  const handleVerifyWithEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    setVerifyError("");
    setVerifySuccess("");
    setIsVerifyingEvidence(true);

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
        setVerifySuccess(data.message || "Payment verified with Razorpay API.");
        setSelectedPayment(data.payment);
        fetchPayments();
        setTimeout(() => {
          setIsVerifyingModalOpen(false);
          setEvidencePaymentId("");
          setVerifySuccess("");
        }, 1800);
      } else {
        setVerifyError(data.message || "Verification failed. Gateway did not validate this payment.");
      }
    } catch (err: any) {
      setVerifyError(err.message || "Network error submitting gateway evidence.");
    } finally {
      setIsVerifyingEvidence(false);
    }
  };

  // Open Edit Service Pricing Modal
  const openEditService = (service: ServiceCategory) => {
    setEditingService(service);
    setEditPrice(service.amount);
    setEditMinAmount(service.minAmount || 500);
    setEditDescription(service.shortDescription);
    setEditEnabled(service.enabled);
    setEditBreakdown(service.breakdown ? [...service.breakdown] : []);
    setPricingFeedback("");
  };

  // Save Service Pricing
  const handleSaveServicePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
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
          amount: editPrice,
          minAmount: editMinAmount,
          shortDescription: editDescription,
          enabled: editEnabled,
          breakdown: editBreakdown,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPricingFeedback("Service pricing updated successfully!");
        fetchServices();
        setTimeout(() => {
          setEditingService(null);
          setPricingFeedback("");
        }, 1500);
      } else {
        setPricingFeedback(data.message || "Could not update service pricing.");
      }
    } catch (e: any) {
      setPricingFeedback(e.message || "Network error updating service.");
    } finally {
      setIsSavingPricing(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub-Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("transactions")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "transactions"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "text-slate-400 hover:text-white bg-slate-900/60"
            }`}
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Transactions & Records ({payments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("pricing")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "pricing"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                : "text-slate-400 hover:text-white bg-slate-900/60"
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Service Pricing & Options ({services.length})</span>
          </button>
        </div>

        {activeSubTab === "transactions" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={fetchPayments}
              disabled={isLoadingPayments}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingPayments ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* VIEW 1: TRANSACTIONS & REVENUE STATS                 */}
      {/* ==================================================== */}
      {activeSubTab === "transactions" && (
        <div className="space-y-6">
          
          {/* Revenue & Transaction Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Verified Revenue */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900/90 border border-cyan-500/30 flex items-center justify-between shadow-[0_0_30px_rgba(0,240,255,0.08)]">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Verified Revenue</span>
                <h3 className="text-2xl font-heading font-extrabold text-cyan-300 mt-1">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">Captured in Razorpay</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Successful Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Completed</span>
                <h3 className="text-2xl font-heading font-extrabold text-emerald-400 mt-1">
                  {stats.successfulCount}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Paid & Verified</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Pending Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Pending</span>
                <h3 className="text-2xl font-heading font-extrabold text-amber-400 mt-1">
                  {stats.pendingCount}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Awaiting Settlement</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Failed / Cancelled Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Failed / Cancelled</span>
                <h3 className="text-2xl font-heading font-extrabold text-rose-400 mt-1">
                  {stats.failedCount + stats.cancelledCount}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">Declined or Closed</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, mobile, receipt, order or payment ID..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filters */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                title="Start Date"
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                title="End Date"
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            {(searchTerm || serviceFilter !== "all" || statusFilter !== "all" || startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setServiceFilter("all");
                  setStatusFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Receipt & Customer</th>
                    <th className="py-3 px-4">Service Package</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Gateway IDs</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        {isLoadingPayments ? "Loading transaction records..." : "No payment records found matching criteria."}
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => {
                      const cleanPhone = p.customerMobile.replace(/[^0-9]/g, "");
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        p.customerName
                      )}%2C%20regarding%20your%20NextGen%20payment%20${p.receiptNumber}...`;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* Receipt & Customer */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block text-sm">{p.customerName}</span>
                            <span className="text-cyan-400 font-bold text-[11px]">{p.receiptNumber}</span>
                            <span className="text-slate-400 block text-[10px] mt-0.5">
                              {p.customerMobile} • {p.customerEmail}
                            </span>
                            {p.businessName && (
                              <span className="text-slate-500 text-[10px] block">{p.businessName}</span>
                            )}
                          </td>

                          {/* Service Package */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-200 block">{p.serviceName}</span>
                            <span className="text-slate-400 text-[10px] block max-w-xs truncate" title={p.projectDescription}>
                              {p.projectDescription}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4">
                            <span className="font-heading font-extrabold text-sm text-white">
                              ₹{p.amount.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-slate-500 block uppercase">{p.currency}</span>
                          </td>

                          {/* Gateway IDs */}
                          <td className="py-3.5 px-4 text-[10px]">
                            {p.gatewayPaymentId ? (
                              <span className="text-cyan-300 font-bold block">
                                Pay: {p.gatewayPaymentId}
                              </span>
                            ) : (
                              <span className="text-slate-500 block">Pay: Not Generated</span>
                            )}
                            <span className="text-slate-400 block truncate max-w-[130px]" title={p.gatewayOrderId}>
                              Ord: {p.gatewayOrderId}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === "successful"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                  : p.status === "pending"
                                  ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                  : p.status === "cancelled"
                                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                                  : "bg-red-950 text-red-300 border border-red-500/40"
                              }`}
                            >
                              {p.status === "successful" && <CheckCircle2 className="w-3 h-3" />}
                              {p.status === "pending" && <Clock className="w-3 h-3" />}
                              {p.status === "failed" && <XCircle className="w-3 h-3" />}
                              {p.status === "cancelled" && <AlertTriangle className="w-3 h-3" />}
                              <span>{p.status}</span>
                            </span>
                            <span className="text-[9px] text-slate-500 block mt-1">
                              {p.paymentTimestamp
                                ? new Date(p.paymentTimestamp).toLocaleDateString("en-IN")
                                : new Date(p.createdAt).toLocaleDateString("en-IN")}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                type="button"
                                onClick={() => setSelectedPayment(p)}
                                title="View Complete Record"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* WhatsApp Contact */}
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Customer"
                                className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* View Receipt Link if Successful */}
                              {p.status === "successful" && (
                                <a
                                  href={`/payment-success?receiptNumber=${encodeURIComponent(p.receiptNumber)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open Public Receipt"
                                  className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
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

        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW 2: SERVICE PRICING & OPTIONS MANAGEMENT         */}
      {/* ==================================================== */}
      {activeSubTab === "pricing" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>
                Admin Service Pricing Control: Modifying values updates public checkout prices and server-side validation immediately.
              </span>
            </div>
            <button
              type="button"
              onClick={fetchServices}
              disabled={isLoadingServices}
              className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingServices ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => (
              <div
                key={svc.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  svc.enabled
                    ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    : "bg-slate-950/70 border-red-950/60 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        svc.enabled
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-red-950 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {svc.enabled ? "Active for Online Booking" : "Disabled"}
                    </span>

                    {svc.pricingType === "custom" && (
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Custom Scope</span>
                    )}
                  </div>

                  <h4 className="font-heading font-bold text-white text-base mb-1">{svc.name}</h4>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{svc.shortDescription}</p>

                  {svc.breakdown && svc.breakdown.length > 0 && (
                    <div className="mb-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Breakdown:</span>
                      {svc.breakdown.map((b, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>{b.label}</span>
                          <span className="text-cyan-400 font-bold">₹{b.amount.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Configured Price</span>
                    <span className="text-lg font-heading font-extrabold text-white">
                      {svc.pricingType === "custom" ? (
                        <span className="text-xs font-mono text-cyan-400">Min ₹{svc.minAmount || 500}</span>
                      ) : (
                        `₹${svc.amount.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditService(svc)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TRANSACTION DETAILS MODAL                            */}
      {/* ==================================================== */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-mono text-xs">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Transaction File</span>
                <h3 className="text-base font-bold text-white">{selectedPayment.receiptNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Amount */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Total Amount</span>
                <span className="text-xl font-heading font-extrabold text-cyan-400">
                  ₹{selectedPayment.amount.toLocaleString("en-IN")} {selectedPayment.currency}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Status</span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
                    selectedPayment.status === "successful"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : selectedPayment.status === "pending"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : "bg-red-950 text-red-300 border border-red-500/40"
                  }`}
                >
                  {selectedPayment.status}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Information</span>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name:</span>
                  <span className="text-white font-bold">{selectedPayment.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile:</span>
                  <span>{selectedPayment.customerMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span>{selectedPayment.customerEmail}</span>
                </div>
                {selectedPayment.businessName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Business:</span>
                    <span>{selectedPayment.businessName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service & Scope */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service & Scope</span>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="text-white font-bold">{selectedPayment.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Project Description:</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900 p-2 rounded-lg text-[11px]">
                    {selectedPayment.projectDescription}
                  </p>
                </div>
                {selectedPayment.breakdown && selectedPayment.breakdown.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Breakdown:</span>
                    {selectedPayment.breakdown.map((b, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span>• {b.label}</span>
                        <span className="text-cyan-300 font-bold">₹{b.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Gateway References */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gateway Cryptographic Reference</span>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Razorpay Order ID:</span>
                  <span className="text-white">{selectedPayment.gatewayOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Razorpay Payment ID:</span>
                  <span className="text-cyan-400 font-bold">{selectedPayment.gatewayPaymentId || "None recorded"}</span>
                </div>
                {selectedPayment.statusReason && (
                  <div>
                    <span className="text-slate-500 block">Status Audit Note:</span>
                    <span className="text-slate-300 block text-[10px] italic">{selectedPayment.statusReason}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {selectedPayment.status !== "successful" ? (
                <button
                  type="button"
                  onClick={() => setIsVerifyingModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verify with Gateway Evidence</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Cryptographically Verified
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VERIFY WITH EVIDENCE MODAL (STRICT AUDIT POLICY)     */}
      {/* ==================================================== */}
      {isVerifyingModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-cyan-500/50 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Verify Gateway Evidence</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsVerifyingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              To prevent accidental or unauthorized status changes, entering a valid Razorpay Payment ID (e.g.{" "}
              <code className="text-cyan-400">pay_...</code>) is required. NextGen servers will verify funds directly with Razorpay before confirming.
            </p>

            {verifyError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-[11px]">
                {verifyError}
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px]">
                {verifySuccess}
              </div>
            )}

            <form onSubmit={handleVerifyWithEvidence} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Razorpay Payment ID (pay_...)
                </label>
                <input
                  type="text"
                  required
                  placeholder="pay_xxxxxxxxxxxxxx"
                  value={evidencePaymentId}
                  onChange={(e) => setEvidencePaymentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifyingModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingEvidence}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifyingEvidence ? "Validating with Gateway..." : "Verify & Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT SERVICE PRICING MODAL                           */}
      {/* ==================================================== */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Edit Catalog Service</span>
                <h3 className="text-sm font-bold text-white">{editingService.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {pricingFeedback && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px]">
                {pricingFeedback}
              </div>
            )}

            <form onSubmit={handleSaveServicePricing} className="space-y-4">
              {/* Enabled Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold">Online Booking Status</span>
                <button
                  type="button"
                  onClick={() => setEditEnabled(!editEnabled)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    editEnabled
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-950 text-red-300 border border-red-500/40"
                  }`}
                >
                  {editEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Price Input */}
              {editingService.pricingType === "fixed" ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Package Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Minimum Custom Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={editMinAmount}
                    onChange={(e) => setEditMinAmount(parseFloat(e.target.value) || 500)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              )}

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Card Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Breakdown List for multi-component services */}
              {editingService.breakdown && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Itemized Cost Breakdown
                  </span>
                  {editBreakdown.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...editBreakdown];
                          updated[idx].label = e.target.value;
                          setEditBreakdown(updated);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => {
                          const updated = [...editBreakdown];
                          updated[idx].amount = parseFloat(e.target.value) || 0;
                          setEditBreakdown(updated);
                        }}
                        className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-right"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPricing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSavingPricing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
