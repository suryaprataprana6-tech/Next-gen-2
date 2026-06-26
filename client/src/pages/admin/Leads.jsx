import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, Eye, Trash2, Download, AlertCircle, Calendar, MessageSquare, Phone, Mail, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/leads`);
      if (response.data?.success) {
        setLeads(response.data.leads);
        setFilteredLeads(response.data.leads);
      } else {
        setError("Failed to fetch lead listings");
      }
    } catch (err) {
      console.error("Fetch leads error:", err);
      setError("Server connection failure. Please confirm backend API is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...leads];

    // Apply Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.leadId.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.phone && l.phone.includes(q))
      );
    }

    // Apply Status Filter
    if (statusFilter !== "All") {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Apply Service Filter
    if (serviceFilter !== "All") {
      result = result.filter((l) => l.service === serviceFilter);
    }

    setFilteredLeads(result);
  }, [searchQuery, statusFilter, serviceFilter, leads]);

  // Update lead status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/leads/${id}`, { status: newStatus });
      if (response.data?.success) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead._id === id) {
          setSelectedLead((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Delete lead
  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/leads/${id}`);
      if (response.data?.success) {
        setLeads((prev) => prev.filter((l) => l._id !== id));
        setSelectedLead(null);
      }
    } catch (err) {
      alert("Failed to delete lead");
    }
  };

  // Direct CSV Export
  const handleExportCSV = () => {
    const headers = ["Lead ID", "Name", "Email", "Phone", "Growth Service", "Message Detail", "Status", "Date Captured"];
    const rows = filteredLeads.map((l) => [
      l.leadId,
      l.name,
      l.email,
      l.phone || "N/A",
      l.service || "General",
      l.message ? l.message.replace(/\n/g, " ").replace(/"/g, '""') : "N/A",
      l.status,
      new Date(l.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nextgen_digital_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    const badges = {
      New: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50",
      Contacted: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50",
      "Proposal Sent": "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50",
      Won: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50",
      Lost: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/50"
    };
    return badges[status] || badges.New;
  };

  const serviceOptions = [
    "Search Engine Optimization (SEO)",
    "Google Ads",
    "Meta Ads",
    "Social Media Marketing",
    "Website Development",
    "Branding",
    "Email Marketing",
    "Content Marketing",
    "Analytics & Reporting",
    "AI Automation"
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Leads Management (CRM)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Monitor and track consultation inquiries submitted by website visitors
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleExportCSV}
          disabled={!filteredLeads.length}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md disabled:opacity-50 disabled:shadow-none transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export filtered CSV</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── SEARCH & FILTER BOARD ────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm text-left">
        
        {/* Search Input */}
        <div className="relative flex-grow max-w-md flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone or Lead ID..."
            className="w-full text-xs py-3 pl-10 pr-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none rounded-xl transition-all dark:text-white"
          />
        </div>

        {/* Dropdowns filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-xl outline-none text-slate-650 dark:text-slate-350 focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Service Dropdown */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-xl outline-none text-slate-650 dark:text-slate-350 focus:border-primary max-w-xs"
          >
            <option value="All">All Services</option>
            {serviceOptions.map(opt => (
              <option key={opt} value={opt}>{opt.split(" (")[0]}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ─── LEADS DATA TABLE ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Loading leads database...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Leads Found</p>
            <p className="text-xs text-slate-450 max-w-xs">No records matching the selected search parameters are available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-4 px-6">Lead ID</th>
                  <th className="py-4 px-6">Contact Name</th>
                  <th className="py-4 px-6">Required Service</th>
                  <th className="py-4 px-6">Date Submitted</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-primary">{lead.leadId}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-850 dark:text-slate-200">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-300">
                      {lead.service ? lead.service.split(" (")[0] : "General"}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer ${getStatusBadge(lead.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── LEAD DETAIL MODAL POPUP ──────────────────────────────────── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none mb-1.5">
                  Lead Info: {selectedLead.leadId}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusBadge(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Profile fields */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Name */}
              <div className="flex gap-3">
                <User className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Full Name</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedLead.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <Mail className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Work Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-xs font-bold text-primary hover:underline">{selectedLead.email}</a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <Phone className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Phone Number</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-xs font-bold text-slate-800 dark:text-slate-250 hover:underline">{selectedLead.phone || "N/A"}</a>
                </div>
              </div>

              {/* Service */}
              <div className="flex gap-3">
                <FileText className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Growth Interest</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedLead.service || "General Inquiry"}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex gap-3">
                <Calendar className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Received Date</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {new Date(selectedLead.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-1">
                <MessageSquare className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1.5">Project Details</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                    {selectedLead.message || "No project description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded-lg outline-none cursor-pointer ${getStatusBadge(selectedLead.status)}`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <button
                onClick={() => handleDeleteLead(selectedLead._id)}
                className="bg-red-50 hover:bg-red-100 text-red-500 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
              >
                Delete Inquire
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Leads;
