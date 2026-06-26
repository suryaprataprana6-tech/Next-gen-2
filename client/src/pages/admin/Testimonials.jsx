import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, MessageSquare, Star, Sparkles, AlertCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    feedback: "",
    rating: 5,
    url: "",
    initials: "",
    gradient: "from-blue-500 to-indigo-600",
    iconName: "Globe",
    featured: false,
    status: "Active"
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/testimonials/all`);
      if (response.data?.success) {
        setTestimonials(response.data.testimonials);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch testimonials from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: "",
      industry: "",
      feedback: "",
      rating: 5,
      url: "",
      initials: "",
      gradient: "from-blue-500 to-indigo-600",
      iconName: "Globe",
      featured: false,
      status: "Active"
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (testimonial) => {
    setEditId(testimonial._id);
    setFormData({
      name: testimonial.name,
      industry: testimonial.industry || "",
      feedback: testimonial.feedback,
      rating: testimonial.rating || 5,
      url: testimonial.url || "",
      initials: testimonial.initials || "",
      gradient: testimonial.gradient || "from-blue-500 to-indigo-600",
      iconName: testimonial.iconName || "Globe",
      featured: !!testimonial.featured,
      status: testimonial.status || "Active"
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
    if (!formData.name || !formData.feedback) return;

    // Auto-generate initials if not specified
    let finalInitials = formData.initials;
    if (!finalInitials.trim()) {
      finalInitials = formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
    }

    const payload = { ...formData, initials: finalInitials };

    try {
      if (editId) {
        // Edit request
        const res = await axios.put(`${API_BASE_URL}/testimonials/${editId}`, payload);
        if (res.data?.success) {
          setTestimonials((prev) => prev.map((t) => (t._id === editId ? res.data.testimonial : t)));
        }
      } else {
        // Create request
        const res = await axios.post(`${API_BASE_URL}/testimonials`, payload);
        if (res.data?.success) {
          setTestimonials((prev) => [res.data.testimonial, ...prev]);
        }
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert("Failed to save testimonial details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/testimonials/${id}`);
      if (res.data?.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      alert("Failed to delete testimonial");
    }
  };

  // Gradient themes helper
  const gradients = [
    { label: "Ocean Blue", value: "from-blue-500 to-indigo-600" },
    { label: "Rose Petal", value: "from-pink-500 to-rose-500" },
    { label: "Emerald Mint", value: "from-emerald-500 to-teal-600" },
    { label: "Sunset Gold", value: "from-amber-500 to-orange-600" },
    { label: "Amethyst Glam", value: "from-purple-500 to-indigo-600" },
    { label: "Electric Cyan", value: "from-cyan-500 to-teal-500" }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Testimonials Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage success stories, review scores, and dynamic client icons for the landing page
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── TESTIMONIALS LIST ────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading testimonials records...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Testimonials Found</p>
          <p className="text-xs text-slate-450 max-w-xs">Create your first client testimonial card to populate reviews on the site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between group relative overflow-hidden text-left"
            >
              {/* Visual Top highlight */}
              <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${test.gradient || "from-blue-500 to-indigo-600"}`} />

              <div>
                {/* Header: Stars & Industry */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 stroke-yellow-500" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {test.industry}
                  </span>
                </div>

                {/* Feedback Review */}
                <blockquote className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-3 mb-5">
                  "{test.feedback}"
                </blockquote>
              </div>

              {/* Footer details row */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-[10px] bg-gradient-to-br ${test.gradient || "from-blue-500 to-indigo-600"}`}>
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-headings font-bold text-xs text-slate-800 dark:text-white leading-tight mb-0.5">{test.name}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{test.status}</span>
                  </div>
                </div>

                {/* Edit Tools */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(test)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TESTIMONIAL EDITOR POPUP MODAL ───────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div
            className="w-full max-w-[560px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none">
                {editId ? "Edit Testimonial Details" : "Create New Testimonial Card"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Testimonials Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1: Company Name + Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Company Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Honeymoon Safar"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Industry Tag *</label>
                  <input
                    type="text"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g. Travel Booking"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Website URL + Score Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Website Link</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="e.g. https://honeymoonsafar.com"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Stars Rating *</label>
                  <select
                    name="rating"
                    required
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Initials + Icon Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Badge Initials (Leave empty for auto)</label>
                  <input
                    type="text"
                    name="initials"
                    maxLength={3}
                    value={formData.initials}
                    onChange={handleInputChange}
                    placeholder="e.g. HS"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Overlaid Badge Icon</label>
                  <select
                    name="iconName"
                    value={formData.iconName}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  >
                    <option value="Globe">🌐 Globe</option>
                    <option value="Heart">❤️ Heart</option>
                    <option value="Compass">🧭 Compass</option>
                    <option value="ShoppingBag">🛍️ Shopping Bag</option>
                    <option value="BookOpen">📖 Open Book</option>
                    <option value="GraduationCap">🎓 Graduation</option>
                    <option value="Award">🏆 Award</option>
                    <option value="MapPin">📍 Map Pin</option>
                  </select>
                </div>
              </div>

              {/* Gradient selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Dynamic Logo Color theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {gradients.map((grad) => (
                    <label
                      key={grad.value}
                      className={`cursor-pointer border rounded-xl p-2 text-center text-[10px] font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        formData.gradient === grad.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      <input
                        type="radio"
                        name="gradient"
                        value={grad.value}
                        checked={formData.gradient === grad.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${grad.value} shadow-sm`} />
                      <span>{grad.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Feedback Review */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Customer Feedback Review *</label>
                <textarea
                  name="feedback"
                  required
                  rows="3"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  placeholder="Insert the review quote here..."
                  className="w-full text-xs py-2.5 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all resize-none dark:text-white"
                ></textarea>
              </div>

              {/* Radios status */}
              <div className="flex items-center gap-6 py-1 select-none">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-slate-350 dark:border-slate-700 text-primary"
                  />
                  <span>Featured Review</span>
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
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-xs text-slate-500 dark:text-slate-450 transition-all"
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

export default Testimonials;
