import React, { useState, useEffect } from "react";
import { useWebsite } from "../context/WebsiteContext";
import { X, User, Mail, Phone, FileText, MessageSquare, ChevronRight } from "lucide-react";

function LeadModal({ isOpen, onClose, prefilledInterest }) {
  const { submitLead, trackEvent } = useWebsite();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // Sync pre-selected interest dropdown option
  useEffect(() => {
    if (prefilledInterest) {
      setFormData((prev) => ({ ...prev, interest: prefilledInterest }));
    }
  }, [prefilledInterest, isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your work email.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }

    if (!formData.interest) {
      newErrors.interest = "Please select a service interest.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // 1. Submit lead details to our backend database
      await submitLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.interest,
        message: formData.message.trim() || "N/A"
      });
      
      // 2. Fire analytics conversion event
      trackEvent("lead_submission", `Lead: ${formData.name} for ${formData.interest}`);
    } catch (err) {
      console.warn("Failed to register lead on the database. Proceeding directly to WhatsApp redirect.", err.message);
    }

    // Build WhatsApp message
    const message = [
      "Hello NextGen Digital,",
      "",
      "I would like to discuss my project.",
      "",
      `Full Name: ${formData.name.trim()}`,
      `Work Email: ${formData.email.trim()}`,
      `Phone Number: ${formData.phone.trim()}`,
      `Primary Growth Interest: ${formData.interest}`,
      `Project Details: ${formData.message.trim() || "N/A"}`,
      "",
      "Please contact me regarding my project requirements."
    ].join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/916209424989?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Close modal after redirecting
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[560px] max-h-[90vh] bg-white border border-borderBg rounded-2xl p-5 sm:p-8 shadow-2xl overflow-y-auto transform transition-transform duration-300 scale-100 z-10">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 bg-cardBg rounded-full flex items-center justify-center text-muted hover:bg-dark hover:text-white transition-all duration-200"
          aria-label="Close Modal"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3 h-3" />
            <span>Free Consultation</span>
          </div>
          <h3 className="font-headings font-extrabold text-xl sm:text-2xl text-dark mb-1.5 tracking-tight text-left">
            Get Your Free Growth Strategy
          </h3>
          <p className="text-[13px] text-muted leading-relaxed font-normal text-left">
            Tell us about your project and our strategists will design a custom marketing roadmap for your business.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-dark uppercase tracking-wide">Full Name *</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-muted absolute left-3.5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className={`w-full text-sm py-2.5 pl-10 pr-3 rounded-lg bg-cardBg border ${
                    errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-borderBg focus:border-primary focus:ring-primary/20"
                  } focus:bg-white focus:ring-[3px] outline-none transition-all duration-200`}
                />
              </div>
              {errors.name && <span className="text-[10px] font-semibold text-red-500">{errors.name}</span>}
            </div>

            {/* Work Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-dark uppercase tracking-wide">Work Email *</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-muted absolute left-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className={`w-full text-sm py-2.5 pl-10 pr-3 rounded-lg bg-cardBg border ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-borderBg focus:border-primary focus:ring-primary/20"
                  } focus:bg-white focus:ring-[3px] outline-none transition-all duration-200`}
                />
              </div>
              {errors.email && <span className="text-[10px] font-semibold text-red-500">{errors.email}</span>}
            </div>
          </div>

          {/* Row 2: Phone + Interest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-dark uppercase tracking-wide">Phone Number *</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-muted absolute left-3.5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full text-sm py-2.5 pl-10 pr-3 rounded-lg bg-cardBg border ${
                    errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-borderBg focus:border-primary focus:ring-primary/20"
                  } focus:bg-white focus:ring-[3px] outline-none transition-all duration-200`}
                />
              </div>
              {errors.phone && <span className="text-[10px] font-semibold text-red-500">{errors.phone}</span>}
            </div>

            {/* Primary Growth Interest */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-dark uppercase tracking-wide">Growth Interest *</label>
              <div className="relative flex items-center">
                <FileText className="w-4 h-4 text-muted absolute left-3.5" />
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  className={`w-full text-sm py-2.5 pl-10 pr-8 rounded-lg bg-cardBg border ${
                    errors.interest ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-borderBg focus:border-primary focus:ring-primary/20"
                  } focus:bg-white focus:ring-[3px] outline-none transition-all duration-200 appearance-none`}
                >
                  <option value="" disabled>Select service...</option>
                  <option value="Search Engine Optimization (SEO)">📈 SEO</option>
                  <option value="Google Ads">📢 Google Ads</option>
                  <option value="Meta Ads">🎯 Meta Ads</option>
                  <option value="Social Media Marketing">📱 Social Media</option>
                  <option value="Website Development">💻 Web Development</option>
                  <option value="Branding">🎨 Branding</option>
                  <option value="Email Marketing">📧 Email Marketing</option>
                  <option value="Content Marketing">📝 Content Strategy</option>
                  <option value="Analytics & Reporting">📊 Analytics</option>
                  <option value="AI Automation">🤖 AI Automation</option>
                  <option value="Full Suite">🚀 Full-Suite Growth</option>
                </select>
                <div className="pointer-events-none absolute right-3 text-muted">
                  <ChevronRight className="w-3.5 h-3.5 transform rotate-90" />
                </div>
              </div>
              {errors.interest && <span className="text-[10px] font-semibold text-red-500">{errors.interest}</span>}
            </div>
          </div>

          {/* Row 3: Message (Optional) */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[11px] font-bold text-dark uppercase tracking-wide">
              Project Details <span className="text-muted font-normal normal-case">(Optional)</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="2"
              placeholder="Briefly describe your project goals or requirements..."
              className="w-full text-sm py-2.5 px-3.5 rounded-lg bg-cardBg border border-borderBg focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/20 outline-none transition-all duration-200 resize-none"
            ></textarea>
          </div>

          {/* Submit Button — opens WhatsApp */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-[15px] py-3.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 mt-1"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Generate My Growth Plan</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Trust indicator */}
          <p className="text-[10px] text-muted text-center font-normal leading-relaxed">
            🔒 Your details are safe. Clicking the button will open WhatsApp to connect you directly with our team.
          </p>

        </form>

      </div>
    </div>
  );
}

export default LeadModal;
