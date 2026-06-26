import React from "react";
import { useWebsite } from "../context/WebsiteContext";
import { ArrowRight, Code } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Predefined Icon Map for fast lookup
import { Search, Megaphone, Target, MessageCircle, Palette, Mail, FileText, BarChart3, Cpu } from "lucide-react";

const IconMap = {
  Search,
  Megaphone,
  Target,
  MessageCircle,
  Code,
  Palette,
  Mail,
  FileText,
  BarChart3,
  Cpu
};

function Services({ onOpenModal }) {
  const { services, trackEvent } = useWebsite();

  const handleBookService = (serviceName) => {
    trackEvent("lead_click", `Booked Service: ${serviceName}`);
    onOpenModal(serviceName);
  };

  return (
    <section id="services" className="bg-cardBg border-y border-borderBg relative py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16" data-reveal="fade-in">
          <span className="font-headings font-bold text-xs uppercase tracking-[2px] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Our Expertise
          </span>
          <h2 className="font-headings font-extrabold text-3xl sm:text-4xl text-dark mb-4 tracking-tight leading-tight">
            Result-Driven Digital Marketing Services
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed font-normal">
            We deploy advanced growth strategies to optimize your brand's digital presence, capture high-intent leads, and maximize marketing ROI.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            // Find icon matching string name, fallback to Code
            const IconComponent = IconMap[service.icon] || LucideIcons[service.icon] || Code;
            const colorClass = service.color || (index % 2 === 0 
              ? "from-blue-500/10 to-blue-500/5 text-blue-600" 
              : "from-purple-500/10 to-purple-500/5 text-purple-600");

            return (
              <div
                key={service._id || service.name}
                className="bg-white border border-borderBg rounded-xl p-8 shadow-sm relative group overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-primary/25 flex flex-col justify-between"
                data-reveal="slide-up"
              >
                {/* Visual hover border indicator */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-headings font-bold text-lg text-dark mb-3 group-hover:text-primary transition-colors duration-250">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted text-[13px] leading-[1.65] font-normal mb-8">
                    {service.description}
                  </p>
                </div>

                {/* Book Link Button */}
                <button
                  onClick={() => handleBookService(service.name)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-all duration-200"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Services;
