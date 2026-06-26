import React, { useState, useEffect, useRef } from "react";
import { useWebsite } from "../context/WebsiteContext";
import { ExternalLink, Heart, Plane, Compass, Sparkles, BookOpen, Globe, GraduationCap, Award } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Localized animated counter
function StatCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          let current = 0;
          const duration = 2000;
          const stepTime = 16;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return (
    <span ref={ref} className="font-headings font-extrabold text-4xl sm:text-5xl text-dark tracking-tight">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const IconMap = {
  Heart,
  Plane,
  Compass,
  Sparkles,
  BookOpen,
  Globe,
  GraduationCap,
  Award
};

function Portfolio() {
  const { portfolio, trackEvent } = useWebsite();

  const stats = [
    { target: portfolio.length || 8, suffix: "+", label: "Websites Delivered" },
    { target: 100, suffix: "%", label: "Client Satisfaction" },
    { target: 7, suffix: "+", label: "Industries Served" },
    { target: 24, suffix: "/7", label: "Support Active" }
  ];

  const handleVisitProject = (name) => {
    trackEvent("portfolio_view", name);
  };

  return (
    <section id="portfolio" className="bg-cardBg border-y border-borderBg relative py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16" data-reveal="fade-in">
          <span className="font-headings font-bold text-xs uppercase tracking-[2px] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Success Stories
          </span>
          <h2 className="font-headings font-extrabold text-3xl sm:text-4xl text-dark mb-4 tracking-tight leading-tight">
            Our Success Deliveries
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed font-normal">
            Trusted by brands and organizations across multiple industries. We build premium digital ecosystems that drive real metrics.
          </p>
        </div>

        {/* Animated Counters Block */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-borderBg bg-white/60 backdrop-blur-md rounded-2xl p-8 mb-16 shadow-sm" data-reveal="fade-in">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <StatCounter target={stat.target} suffix={stat.suffix} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2 block font-headings">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((project) => {
            // Find custom Lucide icon matching the database icon name
            const IconComponent = IconMap[project.iconName] || LucideIcons[project.iconName] || Globe;
            const projectUrl = project.url || "#";
            const cleanUrl = projectUrl.replace("https://", "").replace("http://", "");

            return (
              <div
                key={project._id || project.name}
                className="bg-white border border-borderBg rounded-[20px] overflow-hidden shadow-sm flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20"
                data-reveal="slide-up"
              >
                
                {/* Simulated Web Browser screenshot mockup frame */}
                <div className="border-b border-borderBg bg-cardBg">
                  {/* Browser dots & Address Bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    {/* Address Bar mock */}
                    <div className="flex-1 bg-white border border-borderBg/70 rounded px-3 py-0.5 text-[9px] text-muted truncate text-center select-none font-medium ml-4 max-w-[220px]">
                      {cleanUrl}
                    </div>
                  </div>
                  
                  {/* Screen Shot image */}
                  <div className="h-[180px] w-full overflow-hidden relative">
                    <img
                      src={project.screenshot}
                      alt={`${project.name} Website Screenshot`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Floating industry tag */}
                    <div className="absolute bottom-4 left-4 bg-dark/95 backdrop-blur-sm text-white font-headings font-bold text-[10px] px-3.5 py-1 rounded-full shadow-md">
                      {project.category || "General"}
                    </div>
                  </div>
                </div>

                {/* Card Content body */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  
                  {/* Header Title with industry icon */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <IconComponent className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-headings font-bold text-base text-dark tracking-tight">
                      {project.name}
                    </h3>
                  </div>
                  
                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted leading-relaxed mb-5 flex-grow font-normal">
                    {project.description}
                  </p>

                  {/* Technologies tags */}
                  <div className="border-t border-borderBg/70 pt-4 mb-5">
                    <span className="text-[9px] font-bold text-dark uppercase tracking-wider block mb-2">
                      Technologies Used
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-[9px] font-medium text-muted bg-cardBg border border-borderBg px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visit Link Button */}
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisitProject(project.name)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-cardBg border border-borderBg hover:border-dark hover:bg-dark hover:text-white font-bold text-xs py-3 px-4 rounded-lg transition-all duration-200 mt-auto text-center"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Portfolio;
