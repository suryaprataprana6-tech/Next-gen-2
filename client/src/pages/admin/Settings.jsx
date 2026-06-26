import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings as SettingsIcon, Shield, Phone, Globe, Palette, Save, AlertCircle, CheckCircle2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Settings() {
  const [formData, setFormData] = useState({
    websiteName: "NextGen Digital",
    logo: "",
    favicon: "",
    primaryColor: "#2563EB",
    secondaryColor: "#7C3AED",
    footerText: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    },
    contactDetails: {
      phone: "",
      whatsapp: "",
      email: "",
      address: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/settings`);
      if (response.data?.success && response.data?.settings) {
        const s = response.data.settings;
        setFormData({
          websiteName: s.websiteName || "NextGen Digital",
          logo: s.logo || "",
          favicon: s.favicon || "",
          primaryColor: s.primaryColor || "#2563EB",
          secondaryColor: s.secondaryColor || "#7C3AED",
          footerText: s.footerText || "",
          socialLinks: {
            facebook: s.socialLinks?.facebook || "",
            instagram: s.socialLinks?.instagram || "",
            twitter: s.socialLinks?.twitter || "",
            linkedin: s.socialLinks?.linkedin || ""
          },
          contactDetails: {
            phone: s.contactDetails?.phone || "",
            whatsapp: s.contactDetails?.whatsapp || "",
            email: s.contactDetails?.email || "",
            address: s.contactDetails?.address || ""
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch settings from backend api");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const response = await axios.put(`${API_BASE_URL}/settings`, formData);
      if (response.data?.success) {
        setMessage("Website configuration updated successfully! Homepage dynamic values synchronized.");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      setError("Failed to save settings variables");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
          Website Settings (CMS)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Modify contact phone numbers, WhatsApp links, color choices, social profiles, and footer copyright notes dynamically
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-left">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── SETTINGS FORMS PANEL ────────────────────────────────────── */}
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Side: General Settings & Styling colors */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* General Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SettingsIcon className="w-4 h-4 text-primary" />
              <span>General Configurations</span>
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Website Name *</label>
              <input
                type="text"
                name="websiteName"
                required
                value={formData.websiteName}
                onChange={handleInputChange}
                className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Footer Copyright line</label>
              <input
                type="text"
                name="footerText"
                value={formData.footerText}
                onChange={handleInputChange}
                placeholder="Use {year} to render dynamic current year"
                className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Phone className="w-4 h-4 text-primary" />
              <span>Contact & Address Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactDetails.phone}
                  onChange={(e) => handleNestedInputChange("contactDetails", "phone", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">WhatsApp URL</label>
                <input
                  type="url"
                  value={formData.contactDetails.whatsapp}
                  onChange={(e) => handleNestedInputChange("contactDetails", "whatsapp", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={(e) => handleNestedInputChange("contactDetails", "email", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Address</label>
                <input
                  type="text"
                  value={formData.contactDetails.address}
                  onChange={(e) => handleNestedInputChange("contactDetails", "address", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Colors and Social Links */}
        <div className="flex flex-col gap-6">
          {/* Styling Color Scheme */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-primary" />
              <span>Branding Styling Colors</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="w-9 h-9 border border-slate-200 rounded cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    className="flex-1 text-xs py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 outline-none uppercase font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    className="w-9 h-9 border border-slate-200 rounded cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    className="flex-1 text-xs py-2 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 outline-none uppercase font-bold dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-primary" />
              <span>Social Accounts</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Facebook URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => handleNestedInputChange("socialLinks", "facebook", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Instagram URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleNestedInputChange("socialLinks", "instagram", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Twitter URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleNestedInputChange("socialLinks", "twitter", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleNestedInputChange("socialLinks", "linkedin", e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs py-3.5 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:-translate-y-0 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Save className="w-4.5 h-4.5" />
            <span>{saving ? "Saving Changes..." : "Save Website Settings"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

export default Settings;
