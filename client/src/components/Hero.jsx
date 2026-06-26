import React, { useState, useEffect } from "react";
import { ArrowUpRight, TrendingUp, Users, CheckCircle, Calendar, BarChart2 } from "lucide-react";

function Hero({ onOpenModal }) {
  const [traffic, setTraffic] = useState(48290);
  const [leads, setLeads] = useState(1842);
  const [conversion, setConversion] = useState(4.82);

  // Fluctuating dashboard metrics simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Fluctuate traffic around 48290
      setTraffic((prev) => prev + Math.floor(Math.random() * 40) - 18);
      
      // Occasionally increase leads by 1
      if (Math.random() > 0.75) {
        setLeads((prev) => prev + 1);
      }
      
      // Fluctuate conversion slightly
      if (Math.random() > 0.8) {
        const change = (Math.random() * 0.04) - 0.02;
        setConversion((prev) => parseFloat((prev + change).toFixed(2)));
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left" data-reveal="fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/15 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#2563EB]"></span>
            <span>Helping Businesses Grow Digitally</span>
          </div>
          
          <h1 className="font-headings font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-dark leading-[1.15] mb-6 tracking-tight">
            Grow Your Business With <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Smart Digital Marketing.
            </span>
          </h1>
          
          <p className="text-lg text-muted max-w-[580px] mb-8 leading-relaxed font-normal">
            We help startups, local businesses, and brands generate quality leads, increase traffic, and scale revenue using data-driven marketing strategies.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onOpenModal("General Consultation")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-base px-8 py-4 rounded-full hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>Get Free Consultation</span>
            </button>
            <a
              href="#portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-borderBg bg-white text-dark font-semibold text-base px-8 py-4 rounded-full hover:bg-cardBg hover:border-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>View Portfolio</span>
            </a>
          </div>
        </div>

        {/* Right Side Visual (Premium Dashboard Mockup) */}
        <div className="lg:col-span-5 flex justify-center w-full" data-reveal="slide-up">
          <div className="relative w-full max-w-[450px] bg-white/80 backdrop-blur-md border border-borderBg rounded-2xl p-5 shadow-premium transition-all duration-500 hover:-translate-y-1">
            
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-borderBg pb-4 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span className="font-headings font-semibold text-[10px] text-muted tracking-widest uppercase">
                NextGen Optimize Dashboard
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-muted font-medium">
                <span className="w-2 h-2 rounded-full bg-success relative">
                  <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75"></span>
                </span>
                <span>Optimized</span>
              </div>
            </div>

            {/* Dashboard grid widgets */}
            <div className="flex flex-col gap-4">
              {/* Widget 1: Traffic Chart */}
              <div className="bg-white border border-borderBg rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Website Traffic Overview
                    </span>
                    <h3 className="text-2xl font-bold text-dark mt-0.5">
                      {traffic.toLocaleString()}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+32.4%</span>
                  </span>
                </div>
                
                {/* SVG Graph */}
                <div className="h-[75px] mt-2 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(37, 99, 235, 0.15)" />
                        <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,90 Q 50,65 100,75 T 200,35 T 300,45 T 400,10 L 400,100 L 0,100 Z"
                      fill="url(#glow)"
                    />
                    <path
                      d="M 0,90 Q 50,65 100,75 T 200,35 T 300,45 T 400,10"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-dashboard-stroke"
                    />
                  </svg>
                </div>
              </div>

              {/* Flex Grid widgets */}
              <div className="grid grid-cols-2 gap-4">
                {/* Widget 2: Leads Generated */}
                <div className="bg-white border border-borderBg rounded-xl p-4 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Leads Generated
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-dark">{leads.toLocaleString()}</h4>
                  <div className="w-full h-1.5 bg-borderBg rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((leads / 2200) * 100))}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-muted font-medium mt-1.5">
                    Target Progress ({Math.min(100, Math.round((leads / 2200) * 100))}%)
                  </span>
                </div>

                {/* Widget 3: Conversion Rate */}
                <div className="bg-white border border-borderBg rounded-xl p-4 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Sales Conversion
                    </span>
                    <span className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-dark">{conversion}%</h4>
                  <div className="w-full h-1.5 bg-borderBg rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round((conversion / 8) * 100))}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-muted font-medium mt-1.5">
                    Industry Average: 2.1%
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Live Lead conversion pill */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-borderBg rounded-full py-2.5 px-4 shadow-md flex items-center gap-2 z-10 animate-[bounce_4s_infinite]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="font-headings font-bold text-[10px] text-dark flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                New Lead Converted!
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
