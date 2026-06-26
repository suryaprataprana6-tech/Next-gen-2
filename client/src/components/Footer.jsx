import React from "react";
import { useWebsite } from "../context/WebsiteContext";
import { Mail, Phone, MessageSquare, Facebook, BarChart3, PhoneCall, Linkedin, Instagram, Twitter } from "lucide-react";

function Footer({ onOpenModal }) {
  const { settings, trackEvent } = useWebsite();
  const currentYear = new Date().getFullYear();

  const services = [
    "SEO",
    "Google Ads",
    "Meta Ads",
    "Website Development",
    "AI Automation"
  ];

  const serviceModalNames = [
    "Search Engine Optimization (SEO)",
    "Google Ads",
    "Meta Ads",
    "Website Development",
    "AI Automation"
  ];

  const companyLinks = [
    { name: "Why Choose Us", href: "#why-choose-us" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "About NextGen", href: "#home" }
  ];

  const handlePhoneClick = () => {
    trackEvent("phone_click", settings.contactDetails.phone);
  };

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_click", settings.contactDetails.phone);
  };

  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-12 lg:py-14">

          {/* Column 1: Brand */}
          <div className="flex flex-col text-left">
            <a href="#home" className="flex items-center gap-2 mb-4 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/20">
                <BarChart3 className="w-4 h-4" />
              </span>
              <span className="font-headings font-extrabold text-[15px] tracking-tight text-white">
                {settings.websiteName.split(" ")[0]} <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">{settings.websiteName.split(" ").slice(1).join(" ")}</span>
              </span>
            </a>
            <p className="text-[13px] text-[#94A3B8] leading-[1.7] mb-5 font-normal">
              Helping businesses grow digitally with modern websites, digital marketing and performance-driven strategies.
            </p>

            {/* Social Links Grid */}
            <div className="flex flex-wrap gap-2.5">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-[#2563EB] flex items-center justify-center transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-[#94A3B8] hover:text-white" />
                </a>
              )}
              {settings.socialLinks.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-blue-700 flex items-center justify-center transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-[#94A3B8] hover:text-white" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-pink-600 flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-[#94A3B8] hover:text-white" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-sky-500 flex items-center justify-center transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-[#94A3B8] hover:text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="flex flex-col text-left">
            <h4 className="font-headings font-semibold text-[11px] uppercase tracking-[2px] text-[#CBD5E1] mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-[10px]">
              {services.map((service, idx) => (
                <li key={service}>
                  <button
                    onClick={() => onOpenModal(serviceModalNames[idx])}
                    className="text-[13px] text-[#94A3B8] hover:text-white transition-colors duration-200 text-left"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col text-left">
            <h4 className="font-headings font-semibold text-[11px] uppercase tracking-[2px] text-[#CBD5E1] mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-[10px]">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[#94A3B8] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col text-left">
            <h4 className="font-headings font-semibold text-[11px] uppercase tracking-[2px] text-[#CBD5E1] mb-5">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-3 mb-5">
              <li>
                <a href={`mailto:${settings.contactDetails.email}`} className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors duration-200">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                  <span className="truncate">{settings.contactDetails.email}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${settings.contactDetails.phone.replace(/\s+/g, "")}`} 
                  onClick={handlePhoneClick}
                  className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                  <span>{settings.contactDetails.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={settings.contactDetails.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={handleWhatsAppClick}
                  className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors duration-200"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex gap-2">
              <a
                href={`tel:${settings.contactDetails.phone.replace(/\s+/g, "")}`}
                onClick={handlePhoneClick}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[11px] py-2.5 px-3 rounded-lg transition-all duration-200 text-center"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={settings.contactDetails.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-[11px] py-2.5 px-3 rounded-lg transition-all duration-200 text-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-[#1E293B]"></div>

        {/* Copyright */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#64748B] text-left">
            {settings.footerText.replace("{year}", currentYear)}
          </p>
          <p className="text-[11px] text-[#475569]">
            Built for conversion performance.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
