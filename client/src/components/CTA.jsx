import React from "react";
import { Sparkles, Calendar } from "lucide-react";

function CTA({ onOpenModal }) {
  return (
    <section className="pb-20 md:pb-28">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div 
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-premium"
          data-reveal="slide-up"
        >
          {/* Subtle top-right ambient light overlay */}
          <div className="absolute inset-0 bg-radial-at-t from-white/10 to-transparent pointer-events-none" />
          
          <h2 className="font-headings font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-white leading-tight mb-4 tracking-tight">
            Ready To Build Your Next Digital Success Story?
          </h2>
          
          <p className="text-white/80 text-base sm:text-lg max-w-[680px] mx-auto leading-relaxed mb-10 font-normal">
            Partner with NextGen Digital to increase conversion traffic, capture quality inbound leads, and secure long-term revenue growth. Get your bespoke growth roadmap today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onOpenModal("New Project Integration")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold text-base px-8 py-4 rounded-full shadow-md hover:bg-cardBg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Start Your Project</span>
            </button>
            <button
              onClick={() => onOpenModal("General Consultation")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 bg-transparent text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-white/8 hover:border-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Free Consultation</span>
            </button>
          </div>
          
        </div>

      </div>
    </section>
  );
}

export default CTA;
