import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Globe, Sparkles, Upload, AlertCircle, Eye } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    url: "",
    category: "",
    description: "",
    images: [],
    completionDate: "",
    featured: false,
    status: "Active"
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/portfolio/all`);
      if (response.data?.success) {
        setProjects(response.data.portfolio);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch project listings from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      name: "",
      clientName: "",
      url: "",
      category: "Website Development",
      description: "",
      images: [],
      completionDate: new Date().toISOString().split("T")[0],
      featured: false,
      status: "Active"
    });
    setUploadError("");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditId(project._id);
    setFormData({
      name: project.name,
      clientName: project.clientName || "",
      url: project.url || "",
      category: project.category || "Website Development",
      description: project.description || "",
      images: project.images || [],
      completionDate: project.completionDate 
        ? new Date(project.completionDate).toISOString().split("T")[0] 
        : "",
      featured: !!project.featured,
      status: project.status || "Active"
    });
    setUploadError("");
    setIsEditorOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Upload Project Image
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      setUploading(true);
      setUploadError("");
      const response = await axios.post(`${API_BASE_URL}/media/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data?.success && response.data?.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, response.data.url]
        }));
      }
    } catch (err) {
      setUploadError("Image upload failed. Upload file locally fallback.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    try {
      if (editId) {
        // Edit request
        const res = await axios.put(`${API_BASE_URL}/portfolio/${editId}`, formData);
        if (res.data?.success) {
          setProjects((prev) => prev.map((p) => (p._id === editId ? res.data.project : p)));
        }
      } else {
        // Create request
        const res = await axios.post(`${API_BASE_URL}/portfolio`, formData);
        if (res.data?.success) {
          setProjects((prev) => [res.data.project, ...prev]);
        }
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert("Failed to save project records.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/portfolio/${id}`);
      if (res.data?.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Portfolio Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage projects displayed in the landing page's Success deliveries grid
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Project</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── PROJECTS LIST ────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading project catalog...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Globe className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Projects Found</p>
          <p className="text-xs text-slate-450 max-w-xs">Create your first client deployment card to update the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Mock address preview */}
                <div className="bg-slate-50 dark:bg-slate-850 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">{proj.category}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    proj.status === "Active" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                  }`}>{proj.status}</span>
                </div>
                {/* Project display thumbnail */}
                <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  {proj.images?.[0] ? (
                    <img src={proj.images[0]} alt={proj.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No screenshot</div>
                  )}
                  {proj.featured && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <div className="p-5 text-left">
                  <h4 className="font-headings font-bold text-base text-slate-800 dark:text-white leading-snug mb-1">{proj.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mb-3">Client: {proj.clientName || "N/A"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{proj.description}</p>
                </div>
              </div>

              {/* Card Footer Tools */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/10">
                <a
                  href={proj.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-primary hover:text-secondary inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview site</span>
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PROJECT EDITOR POPUP MODAL ───────────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div
            className="w-full max-w-[600px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none">
                {editId ? "Edit Project Details" : "Create New Project Card"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1: Name + Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Project Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. India One Matrimony"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="e.g. India One Inc"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Website URL + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Website URL</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="e.g. https://example.com"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="Travel & Tourism">Travel & Tourism</option>
                    <option value="Religious Tourism">Religious Tourism</option>
                    <option value="Fashion & Retail">Fashion & Retail</option>
                    <option value="Research & Education">Research & Education</option>
                    <option value="Events & Pageants">Events & Pageants</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Completion Date + Icon Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Completion Date</label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Industry Icon (Lucide)</label>
                  <select
                    name="iconName"
                    value={formData.iconName}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  >
                    <option value="Globe">🌐 Globe</option>
                    <option value="Heart">❤️ Heart</option>
                    <option value="Plane">✈️ Travel Plane</option>
                    <option value="Compass">🧭 Compass</option>
                    <option value="Sparkles">✨ Sparkles</option>
                    <option value="BookOpen">📖 Open Book</option>
                    <option value="GraduationCap">🎓 Graduation</option>
                    <option value="Award">🏆 Award Cup</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Project Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe details about the client delivery..."
                  className="w-full text-xs py-2.5 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all resize-none dark:text-white"
                ></textarea>
              </div>

              {/* Upload Images */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Project Images</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image file</span>
                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </label>
                  {uploading && <span className="text-[10px] text-slate-400 font-medium">Uploading file...</span>}
                  {uploadError && <span className="text-[10px] text-red-500 font-medium">⚠️ {uploadError}</span>}
                </div>

                {/* Uploaded thumbnails */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-2 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 group">
                        <img src={img} alt="project preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px]"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes row */}
              <div className="flex items-center gap-6 py-1 select-none">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-slate-350 dark:border-slate-700 text-primary"
                  />
                  <span>Featured Project</span>
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
                  Save Project
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

export default Portfolio;
