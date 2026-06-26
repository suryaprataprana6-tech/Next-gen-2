import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Cpu, Sparkles, AlertCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Search",
    featured: false,
    status: "Active"
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/services/all`);
      if (response.data?.success) {
        setServices(response.data.services);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch services list from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      icon: "Search",
      featured: false,
      status: "Active"
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditId(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon || "Search",
      featured: !!service.featured,
      status: service.status || "Active"
    });
    setIsEditorOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    try {
      if (editId) {
        // Edit request
        const res = await axios.put(`${API_BASE_URL}/services/${editId}`, formData);
        if (res.data?.success) {
          setServices((prev) => prev.map((s) => (s._id === editId ? res.data.service : s)));
        }
      } else {
        // Create request
        const res = await axios.post(`${API_BASE_URL}/services`, formData);
        if (res.data?.success) {
          setServices((prev) => [res.data.service, ...prev]);
        }
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert("Failed to save service records.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/services/${id}`);
      if (res.data?.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  // Supported icons list
  const iconOptions = [
    { label: "Search (SEO)", value: "Search" },
    { label: "Megaphone (Ads)", value: "Megaphone" },
    { label: "Target (Meta)", value: "Target" },
    { label: "MessageCircle (Socials)", value: "MessageCircle" },
    { label: "Code (Dev)", value: "Code" },
    { label: "Palette (Branding)", value: "Palette" },
    { label: "Mail (Email)", value: "Mail" },
    { label: "FileText (Content)", value: "FileText" },
    { label: "BarChart3 (Analytics)", value: "BarChart3" },
    { label: "Cpu (AI Automation)", value: "Cpu" }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Services Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage dynamic core marketing services offered to prospective clients
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Service</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── SERVICES LIST ────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading services checklist...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Cpu className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Services Found</p>
          <p className="text-xs text-slate-450 max-w-xs">Create your first service block card to render dynamic expertises on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = LucideIcons[service.icon] || LucideIcons.Code;
            return (
              <div
                key={service._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between group relative overflow-hidden text-left"
              >
                {/* Visual Top highlight */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary" />

                <div>
                  {/* Icon & Status */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {service.featured && (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        service.status === "Active" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                      }`}>{service.status}</span>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h4 className="font-headings font-bold text-base text-slate-800 dark:text-white leading-snug mb-2">
                    {service.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Edit Tools */}
                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3.5 mt-auto">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── SERVICE EDITOR POPUP MODAL ──────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div
            className="w-full max-w-[500px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none">
                {editId ? "Edit Service Details" : "Create New Service Block"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-855 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Service Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Service Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Service Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Meta Ads Management"
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              {/* Icon dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Lucide Icon Class *</label>
                <select
                  name="icon"
                  required
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Service Description *</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explain details about this dynamic service..."
                  className="w-full text-xs py-2.5 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all resize-none dark:text-white"
                ></textarea>
              </div>

              {/* Checkboxes status */}
              <div className="flex items-center gap-6 py-1 select-none">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-slate-355 dark:border-slate-700 text-primary"
                  />
                  <span>Featured Service</span>
                </label>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-750 dark:text-slate-400">
                  <span>Status:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === "Active"}
                      onChange={handleInputChange}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === "Inactive"}
                      onChange={handleInputChange}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <button
                  type="submit"
                  className="flex-grow bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-xs text-slate-500 dark:text-slate-455 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Services;
