import React, { useState, useEffect } from "react";
import { useWebsite } from "../context/WebsiteContext";
import { Star, ExternalLink, X, Heart, Compass, MapPin, ShoppingBag, BookOpen, Globe, GraduationCap, Award } from "lucide-react";
import * as LucideIcons from "lucide-react";

const IconMap = {
  Heart,
  Compass,
  MapPin,
  ShoppingBag,
  BookOpen,
  Globe,
  GraduationCap,
  Award
};

function Testimonials() {
  const { testimonials } = useWebsite();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedTestimonial(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedTestimonial) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedTestimonial]);

  return (
    <section id="testimonials" className="relative py-20 md:py-28 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl -z-10 animate-float-1" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl -z-10 animate-float-2" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16" data-reveal="fade-in">
          <span className="font-headings font-bold text-xs uppercase tracking-[2px] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Success Stories
          </span>
          <h2 className="font-headings font-extrabold text-3xl sm:text-4xl text-dark mb-4 tracking-tight leading-tight">
            Our Successful Project Deliveries
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed font-normal">
            Read feedback from our successful live deployments.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-reveal="slide-up">
          {testimonials.map((item, idx) => {
            return (
              <div
                key={item._id || idx}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-borderBg hover:border-primary/20 rounded-[18px] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-auto md:h-[290px] group relative overflow-hidden"
              >
                {/* Top Section */}
                <div className="flex items-center justify-between gap-4">
                  {/* Stars */}
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                    ))}
                  </div>
                  {/* Industry Badge */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-borderBg/50 px-2.5 py-1 rounded-full">
                    {item.industry}
                  </span>
                </div>

                {/* Middle Section */}
                <div className="flex-grow flex flex-col justify-center py-4 text-left">
                  {/* Company Name */}
                  <h3 className="font-headings font-extrabold text-base sm:text-lg text-dark mb-1.5 group-hover:text-primary transition-colors truncate">
                    {item.name}
                  </h3>
                  {/* Review Preview */}
                  <p className="text-sm text-muted/90 italic truncate mb-2">
                    "{item.feedback}"
                  </p>
                  {/* Read More */}
                  <div>
                    <button
                      onClick={() => setSelectedTestimonial(item)}
                      className="text-xs font-bold text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors group/link"
                    >
                      <span>Read More</span>
                      <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="w-full">
                  <a
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-borderBg hover:border-primary bg-white text-muted hover:text-primary text-xs font-bold transition-all duration-200 shadow-sm"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Popup */}
        {selectedTestimonial && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-md transition-all duration-300"
            onClick={() => setSelectedTestimonial(null)}
          >
            <div
              className="relative w-full max-w-[520px] bg-white border border-borderBg rounded-[20px] p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Icon Button */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-4 right-4 text-muted hover:text-dark p-2 rounded-full hover:bg-borderBg/30 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Stars */}
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 stroke-yellow-500" />
                ))}
              </div>

              {/* Project Title Block with Dynamic Badge */}
              <div className="flex items-center gap-4 mb-4">
                {/* Dynamic initials logo badge */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold font-headings text-xs shadow-inner bg-gradient-to-br ${selectedTestimonial.gradient || "from-blue-500 to-indigo-600"} flex-shrink-0`}>
                  {selectedTestimonial.initials || selectedTestimonial.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <h3 className="font-headings font-extrabold text-xl sm:text-2xl text-dark leading-tight">
                    {selectedTestimonial.name}
                  </h3>
                  <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mt-1">
                    {selectedTestimonial.industry}
                  </span>
                </div>
              </div>

              {/* Full Review */}
              <blockquote className="text-dark/90 text-sm sm:text-base leading-relaxed italic mb-8 border-l-4 border-primary/20 pl-4 py-1.5 bg-cardBg/30 pr-2 rounded-r-lg text-left">
                "{selectedTestimonial.feedback}"
              </blockquote>

              {/* Modal Buttons */}
              <div className="flex gap-3">
                <a
                  href={selectedTestimonial.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-sm shadow-md shadow-primary/15 transition-all"
                >
                  <span>Visit Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="px-5 py-3 rounded-xl border border-borderBg hover:border-dark hover:bg-dark hover:text-white text-muted font-bold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
