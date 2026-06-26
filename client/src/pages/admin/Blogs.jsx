import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, FileText, Globe, Upload, AlertCircle, Sparkles } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editId, setEditId] = useState(null); // null if creating
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
    category: "Digital Marketing",
    tags: "",
    status: "Draft"
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/blogs/all`);
      if (response.data?.success) {
        setBlogs(response.data.blogs);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blog records from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      featuredImage: "",
      category: "Digital Marketing",
      tags: "",
      status: "Draft"
    });
    setUploadError("");
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      featuredImage: blog.featuredImage || "",
      category: blog.category || "Digital Marketing",
      tags: blog.tags ? blog.tags.join(", ") : "",
      status: blog.status || "Draft"
    });
    setUploadError("");
    setIsEditorOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate URL slug from Title if creating/modifying title
      if (name === "title" && !editId) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  // Upload featured image
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
          featuredImage: response.data.url
        }));
      }
    } catch (err) {
      setUploadError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.slug) return;

    // Convert tags string to array
    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      tags: tagArray,
      metaTitle: formData.metaTitle || formData.title,
      metaDescription: formData.metaDescription || formData.content.slice(0, 150)
    };

    try {
      if (editId) {
        // Edit request
        const res = await axios.put(`${API_BASE_URL}/blogs/${editId}`, payload);
        if (res.data?.success) {
          setBlogs((prev) => prev.map((b) => (b._id === editId ? res.data.blog : b)));
        }
      } else {
        // Create request
        const res = await axios.post(`${API_BASE_URL}/blogs`, payload);
        if (res.data?.success) {
          setBlogs((prev) => [res.data.blog, ...prev]);
        }
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert("Failed to save blog article.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/blogs/${id}`);
      if (res.data?.success) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      alert("Failed to delete blog article");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            Blogs Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Publish educational articles and write metadata keywords to boost website organic SEO
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Article</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── BLOGS LIST ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading articles index...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileText className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Articles Published</p>
          <p className="text-xs text-slate-450 max-w-xs">Write your first case study or educational post to start engaging leads.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  {blog.featuredImage ? (
                    <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No cover image</div>
                  )}
                  <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm ${
                    blog.status === "Published" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                  }`}>
                    {blog.status}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-full mb-3 inline-block">
                    {blog.category}
                  </span>
                  <h4 className="font-headings font-bold text-base text-slate-850 dark:text-white leading-snug mb-2 line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider font-mono mb-3">Slug: /{blog.slug}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/10">
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
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

      {/* ─── BLOG ARTICLE EDITOR POPUP MODAL ──────────────────────────── */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div
            className="w-full max-w-[680px] max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <h3 className="font-headings font-extrabold text-lg text-slate-850 dark:text-white leading-none">
                {editId ? "Edit Blog Article" : "Write New Blog Article"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-855 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Blogs Editor Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Row 1: Title + Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. SEO Trends for 2026"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">URL Slug (Auto from Title) *</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. seo-trends-for-2026"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Category + Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  >
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="PPC Advertising">PPC Advertising</option>
                    <option value="Website Development">Website Development</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Branding & Design">Branding & Design</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. marketing, seo, sales"
                    className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Cover image upload */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Featured Cover Image</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Cover Image</span>
                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </label>
                  {formData.featuredImage && (
                    <span className="text-[10px] text-slate-500 font-bold truncate max-w-xs">✓ Loaded: {formData.featuredImage.slice(-25)}</span>
                  )}
                  {uploading && <span className="text-[10px] text-slate-400 font-medium">Uploading...</span>}
                </div>
              </div>

              {/* Content textarea */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Article Body Content *</label>
                <textarea
                  name="content"
                  required
                  rows="6"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Start writing the blog post body content..."
                  className="w-full text-xs py-2.5 px-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all resize-none dark:text-white"
                ></textarea>
              </div>

              {/* SEO Meta Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> SEO Search Index Configuration</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">SEO Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Title shown in google search results"
                      className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">SEO Meta Description</label>
                    <input
                      type="text"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Snippet shown in google search results"
                      className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status radios */}
              <div className="flex items-center gap-6 py-1 select-none border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-750 dark:text-slate-400">
                  <span>Status:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Draft"
                      checked={formData.status === "Draft"}
                      onChange={handleInputChange}
                    />
                    <span>Draft</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Published"
                      checked={formData.status === "Published"}
                      onChange={handleInputChange}
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button
                  type="submit"
                  className="flex-grow bg-primary hover:bg-primary/90 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                >
                  Save Article
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

export default Blogs;
