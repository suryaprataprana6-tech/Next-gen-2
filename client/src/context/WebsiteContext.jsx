import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WebsiteContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Default Static Fallbacks ───────────────────────────────────────

const DEFAULT_SETTINGS = {
  websiteName: "NextGen Digital",
  primaryColor: "#2563EB",
  secondaryColor: "#7C3AED",
  footerText: "© 2026 NextGen Digital. Redefining Growth with Premium Digital Marketing.",
  socialLinks: {
    facebook: "https://facebook.com/nextgendigital",
    instagram: "https://instagram.com/nextgendigital",
    twitter: "https://twitter.com/nextgendigital",
    linkedin: "https://linkedin.com/company/nextgendigital"
  },
  contactDetails: {
    phone: "+91 6209424989",
    whatsapp: "https://wa.me/916209424989",
    email: "contact@nextgendigital.com",
    address: "Mumbai, India"
  }
};

const DEFAULT_SERVICES = [
  {
    name: "Search Engine Optimization (SEO)",
    description: "Dominate search results, drive organic traffic, and capture high-intent customers with data-backed content optimization and ranking strategies.",
    icon: "Search",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
    featured: true
  },
  {
    name: "Google Ads",
    description: "Target buyers instantly. We set up, manage, and optimize performance-driven Google PPC campaigns designed to yield high conversions.",
    icon: "Megaphone",
    color: "from-purple-500/10 to-purple-500/5 text-purple-600",
    featured: true
  },
  {
    name: "Meta Ads",
    description: "Scale brand growth on Facebook and Instagram with visually compelling ad creatives and hyper-targeted custom audience segmentation.",
    icon: "Target",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
    featured: true
  },
  {
    name: "Social Media Marketing",
    description: "Build an active online community, enhance customer loyalty, and drive product virality across LinkedIn, TikTok, and Instagram.",
    icon: "MessageCircle",
    color: "from-purple-500/10 to-purple-500/5 text-purple-600",
    featured: false
  },
  {
    name: "Website Development",
    description: "Develop fast, responsive, and visually spectacular websites optimized for maximum user experience, speed, and sales conversion.",
    icon: "Code",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
    featured: true
  },
  {
    name: "Branding",
    description: "Craft a premium, memorable brand identity. We design logos, choose typography systems, and create brand strategy playbooks.",
    icon: "Palette",
    color: "from-purple-500/10 to-purple-500/5 text-purple-600",
    featured: false
  },
  {
    name: "Email Marketing",
    description: "Nurture leads and drive repeat revenue with custom, high-converting lifecycle emails, sequence automations, and weekly newsletters.",
    icon: "Mail",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
    featured: false
  },
  {
    name: "Content Marketing",
    description: "Establish ultimate industry authority. We research, write, and distribute SEO-optimized blog posts, case studies, and digital guides.",
    icon: "FileText",
    color: "from-purple-500/10 to-purple-500/5 text-purple-600",
    featured: false
  },
  {
    name: "Analytics & Reporting",
    description: "Gain complete visibility on performance. We build customized BI analytics dashboards tracking marketing spend and conversion funnels.",
    icon: "BarChart3",
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
    featured: false
  },
  {
    name: "AI Automation",
    description: "Reduce operational friction. We develop bespoke AI chatbots and streamline backend CRM systems to scale support and outbound sales.",
    icon: "Cpu",
    color: "from-purple-500/10 to-purple-500/5 text-purple-600",
    featured: true
  }
];

const DEFAULT_PORTFOLIO = [
  {
    name: "India One Matrimony",
    url: "https://indiaonematrimony.com",
    clientName: "India One Matrimony Inc",
    category: "Matrimony",
    description: "India's trusted matrimonial platform with verified profiles and AI-powered matchmaking solutions.",
    images: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop&q=80"],
    completionDate: "2025-08-15",
    featured: true
  },
  {
    name: "Honeymoon Safar",
    url: "https://honeymoonsafar.com",
    clientName: "Honeymoon Safar Travel Group",
    category: "Travel & Tourism",
    description: "Travel and honeymoon package booking platform designed for seamless trip planning and booking.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop&q=80"],
    completionDate: "2025-10-22",
    featured: true
  },
  {
    name: "Kamakhya Yatra",
    url: "https://kamakhyayatra.com",
    clientName: "Kamakhya Pilgrimages",
    category: "Religious Tourism",
    description: "Religious tourism platform focused on pilgrimage, packages, and spiritual travel experiences.",
    images: ["https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=600&fit=crop&q=80"],
    completionDate: "2025-12-05",
    featured: true
  },
  {
    name: "Label Raje",
    url: "https://labelraje.com",
    clientName: "Label Raje Designs",
    category: "Fashion & Retail",
    description: "Modern fashion, clothing line, and luxury apparel brand e-commerce website.",
    images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&fit=crop&q=80"],
    completionDate: "2026-01-20",
    featured: true
  },
  {
    name: "AIT Research Centre",
    url: "https://aitresearchcentre.in",
    clientName: "Academy of Information Technology",
    category: "Research & Education",
    description: "National academic and science research institute portal focused on educational studies.",
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&fit=crop&q=80"],
    completionDate: "2026-02-14",
    featured: true
  },
  {
    name: "AIT Research Centre Global",
    url: "https://aitresearchcentre.com",
    clientName: "AIT Global Foundations",
    category: "Research & Academic",
    description: "International academic exchange and research collaboration platform.",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&fit=crop&q=80"],
    completionDate: "2026-03-30",
    featured: true
  },
  {
    name: "World's Winner Education",
    url: "https://worldswinnereducation.com",
    clientName: "Worlds Winner Academy",
    category: "Education & Career",
    description: "Educational platform for student resources, courses, and digital career growth.",
    images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&fit=crop&q=80"],
    completionDate: "2026-04-10",
    featured: false
  },
  {
    name: "Miss Bharat Award",
    url: "https://missbharataward.com",
    clientName: "Miss Bharat Pageants",
    category: "Events & Pageants",
    description: "National beauty pageant platform focused on talent, leadership, and social impact.",
    images: ["https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&fit=crop&q=80"],
    completionDate: "2026-05-18",
    featured: false
  }
].map(p => ({
  ...p,
  screenshot: p.images?.[0] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&fit=crop&q=80",
  technologies: p.technologies || ["React", "Tailwind CSS"],
  tags: p.tags || [p.category || "Web Dev"]
}));

const DEFAULT_TESTIMONIALS = [
  {
    name: "India One Matrimony",
    url: "https://indiaonematrimony.com",
    industry: "Matrimonial & Matchmaking",
    initials: "IOM",
    gradient: "from-pink-500 to-rose-500",
    iconName: "Heart",
    feedback: "NextGen Digital delivered a modern, secure and user-friendly matrimonial platform. Their professionalism, communication and development quality exceeded our expectations."
  },
  {
    name: "Honeymoon Safar",
    url: "https://honeymoonsafar.com",
    industry: "Travel Booking",
    initials: "HS",
    gradient: "from-sky-400 to-blue-500",
    iconName: "Compass",
    feedback: "Our travel booking website is now faster, mobile-friendly and optimized for lead generation. The team provided an excellent experience from start to finish."
  },
  {
    name: "Kamakhya Yatra",
    url: "https://kamakhyayatra.com",
    industry: "Religious Tourism",
    initials: "KY",
    gradient: "from-amber-500 to-orange-600",
    iconName: "MapPin",
    feedback: "The website perfectly represents our religious tourism services. The booking flow and user experience have significantly improved."
  },
  {
    name: "Label Raje",
    url: "https://labelraje.com",
    industry: "Premium Fashion E-Commerce",
    initials: "LR",
    gradient: "from-purple-500 to-indigo-600",
    iconName: "ShoppingBag",
    feedback: "NextGen Digital created a premium fashion website with an elegant design and smooth shopping experience. Highly recommended."
  },
  {
    name: "AIT Research Centre",
    url: "https://aitresearchcentre.in",
    industry: "Education & Research",
    initials: "AIT",
    gradient: "from-emerald-500 to-teal-600",
    iconName: "BookOpen",
    feedback: "They developed a professional educational and research platform that reflects our organization's vision perfectly."
  },
  {
    name: "AIT Research Centre Global",
    url: "https://aitresearchcentre.com",
    industry: "International Research",
    initials: "AITG",
    gradient: "from-blue-600 to-indigo-700",
    iconName: "Globe",
    feedback: "Our international research portal now has a modern design, better performance and improved user engagement."
  },
  {
    name: "World's Winner Education",
    url: "https://worldswinnereducation.com",
    industry: "Educational Services",
    initials: "WWE",
    gradient: "from-cyan-500 to-teal-500",
    iconName: "GraduationCap",
    feedback: "The website is clean, responsive and easy for students to use. We are extremely satisfied with the final outcome."
  },
  {
    name: "Miss Bharat Award",
    url: "https://missbharataward.com",
    industry: "Event & Pageant Platform",
    initials: "MBA",
    gradient: "from-yellow-400 to-amber-500",
    iconName: "Award",
    feedback: "NextGen Digital delivered a premium event website with excellent branding, responsive design and smooth user experience."
  }
];

export const WebsiteProvider = ({ children }) => {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      // Fetch dynamic settings
      const settingsRes = await axios.get(`${API_BASE_URL}/settings`);
      if (settingsRes.data?.success && settingsRes.data?.settings) {
        setSettings(settingsRes.data.settings);
      }

      // Fetch dynamic services
      const servicesRes = await axios.get(`${API_BASE_URL}/services`);
      if (servicesRes.data?.success && servicesRes.data?.services?.length > 0) {
        // Map the colors (keep standard gradients)
        const mapped = servicesRes.data.services.map((s, index) => ({
          ...s,
          title: s.name,
          color: index % 2 === 0 
            ? "from-blue-500/10 to-blue-500/5 text-blue-600" 
            : "from-purple-500/10 to-purple-500/5 text-purple-600"
        }));
        setServices(mapped);
      }

      // Fetch dynamic portfolio
      const portfolioRes = await axios.get(`${API_BASE_URL}/portfolio`);
      if (portfolioRes.data?.success && portfolioRes.data?.portfolio?.length > 0) {
        // Map fields
        const mapped = portfolioRes.data.portfolio.map(p => ({
          ...p,
          screenshot: p.images?.[0] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&fit=crop&q=80",
          technologies: p.technologies || ["React", "Tailwind CSS"],
          tags: p.tags || [p.category]
        }));
        setPortfolio(mapped);
      }

      // Fetch dynamic testimonials
      const testimonialsRes = await axios.get(`${API_BASE_URL}/testimonials`);
      if (testimonialsRes.data?.success && testimonialsRes.data?.testimonials?.length > 0) {
        setTestimonials(testimonialsRes.data.testimonials);
      }
    } catch (err) {
      console.warn("Failed to load website content from database. Using static fallbacks.", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Lead CRM Handler
  const submitLead = async (leadData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/leads`, leadData);
      return response.data;
    } catch (err) {
      console.error("Lead submission error:", err);
      throw err;
    }
  };

  // Event Analytics Logger
  const trackEvent = async (eventType, eventDetails = "") => {
    try {
      // Get basic browser info
      const ua = navigator.userAgent;
      let browser = "Chrome";
      if (ua.indexOf("Firefox") > -1) browser = "Firefox";
      else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) browser = "Safari";
      else if (ua.indexOf("Edge") > -1) browser = "Edge";

      let device = "Desktop";
      if (/Mobi|Android|iPhone/i.test(ua)) device = "Mobile";
      else if (/Tablet|iPad/i.test(ua)) device = "Tablet";

      await axios.post(`${API_BASE_URL}/analytics/track`, {
        device,
        browser,
        path: window.location.pathname || "/",
        referrer: document.referrer || "Direct",
        eventType,
        eventDetails
      });
    } catch (err) {
      // Slient fail for tracker
    }
  };

  // Log chat conversation
  const logChat = async (visitorName, messages, duration, redirectedToWhatsApp) => {
    try {
      await axios.post(`${API_BASE_URL}/chatlogs`, {
        visitorName,
        messages,
        duration,
        redirectedToWhatsApp
      });
    } catch (err) {
      // Silent fail
    }
  };

  useEffect(() => {
    fetchWebsiteData();
    // Track initial pageview
    trackEvent("pageview", "Home page load");
  }, []);

  return (
    <WebsiteContext.Provider value={{ services, portfolio, testimonials, settings, loading, submitLead, trackEvent, logChat, refreshData: fetchWebsiteData }}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);
