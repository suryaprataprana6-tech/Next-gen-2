export interface ProjectCaseStudy {
  id: string;
  title: string;
  clientName: string;
  clientLogo?: string;
  category: 'Websites' | 'SEO' | 'AI' | 'CRM' | 'Travel' | 'Healthcare' | 'Real Estate';
  description: string;
  heroImage: string;
  screenshots: string[];
  businessProblem: string;
  solutionImplemented: string;
  techStack: string[];
  features: string[];
  resultsAchieved: { metric: string; label: string }[];
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  gradient: string;
  highlights: string[];
  pricingStarting: string;
}

export interface SkillItem {
  name: string;
  level: number;
  iconName: string;
  category: 'Frontend' | 'Backend & DB' | 'Cloud & DevOps' | 'Growth & AI';
  experienceYears: string;
  color: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
  projectTag: string;
  verified: boolean;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  shortDesc: string;
  detail: string;
  iconName: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Next.js' | 'React' | 'SEO' | 'AI' | 'Digital Marketing' | 'Web Development';
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  badgeUrl: string;
  verifyUrl: string;
  skillsVerified: string[];
}

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
}

export const PERSONAL_INFO = {
  name: "Surya Pratap Rana",
  title: "Senior Full Stack Architect & Growth Specialist",
  tagline: "Building High-Converting Web Applications, Next.js Systems & AI Automations",
  headline: "Engineering Scalable Digital Experiences That Drive Real Revenue Growth",
  bio: "With over 5 years of full-stack engineering and digital strategy experience, I help ambitious brands, healthcare institutions, and high-growth startups build lightning-fast web applications, SEO engines, and automated sales systems.",
  experienceYears: "5+",
  projectsDelivered: "50+",
  happyClients: "25+",
  clientSatisfaction: "99%",
  location: "Mumbai, India / Remote Worldwide",
  email: "contact@nextgendigital.com",
  phone: "+91 6209424989",
  whatsapp: "https://wa.me/916209424989",
  github: "https://github.com/suryaprataprana6-tech",
  linkedin: "https://linkedin.com/in/suryaprataprana",
  twitter: "https://twitter.com/nextgendigital",
  resumeUrl: "#resume",
};

export const STATS_DATA = [
  { value: "50+", label: "Projects Delivered", suffix: "", icon: "CheckCircle2" },
  { value: "25+", label: "Happy Clients", suffix: "", icon: "Users" },
  { value: "5+", label: "Years Experience", suffix: "", icon: "Award" },
  { value: "99%", label: "Client Satisfaction", suffix: "", icon: "TrendingUp" }
];

export const TRUSTED_CLIENTS = [
  { name: "Kamakhya Yatra", domain: "kamakhyayatra.com", industry: "Religious Tourism", logoText: "KY", color: "from-amber-500 to-orange-600" },
  { name: "Anjan Hospital", domain: "anjanhospital.com", industry: "Healthcare & Care", logoText: "AH", color: "from-emerald-500 to-teal-600" },
  { name: "Goodluck Properties", domain: "goodluckproperties.com", industry: "Real Estate", logoText: "GP", color: "from-blue-600 to-cyan-500" },
  { name: "AIT Research Centre", domain: "aitresearchcentre.in", industry: "Research & Education", logoText: "AIT", color: "from-indigo-500 to-purple-600" },
  { name: "IndiaOne Matrimony", domain: "indiaonematrimony.com", industry: "Matchmaking & Social", logoText: "IOM", color: "from-pink-500 to-rose-600" },
  { name: "Honeymoon Safar", domain: "honeymoonsafar.com", industry: "Travel & Tours", logoText: "HS", color: "from-sky-400 to-blue-600" },
  { name: "Label Raje", domain: "labelraje.com", industry: "Fashion E-Commerce", logoText: "LR", color: "from-violet-500 to-fuchsia-600" }
];

export const ABOUT_STORY = {
  journey: "Started my coding journey building custom full-stack solutions and high-converting landing pages. Fast-forward to today: I architect enterprise Next.js application pipelines, AI automations, and custom CRM systems for businesses across travel, healthcare, real estate, and e-commerce.",
  mission: "To eliminate slow, bloated, low-converting software and replace it with ultra-fast, visually captivating, revenue-generating digital products.",
  coreValues: [
    { title: "Velocity & Precision", desc: "Shipping clean, maintainable code rapidly without sacrificing quality." },
    { title: "Conversion First Design", desc: "Every pixel, CTA, and micro-interaction is engineered for user engagement." },
    { title: "Architectural Integrity", desc: "Building scalable Next.js Server Components, clean API endpoints & secure DB schemas." },
    { title: "Measurable Impact", desc: "Tracking real business ROI—traffic multiplier, lead velocity, and load speeds under 1 second." }
  ]
};

export const CAREER_TIMELINE: TimelineItem[] = [
  {
    year: "2024 - Present",
    role: "Lead Full Stack & Next.js Solutions Architect",
    company: "NextGen Digital Agency",
    description: "Designing end-to-end web architectures, AI chatbot workflows, and Next.js 15 platforms. Managing high-intent lead campaigns and technical SEO for client platforms.",
    achievements: ["Engineered 20+ Next.js 15 App Router applications", "Increased client conversion rates by an average of 145%", "Built automated CRM pipelines reducing response time to under 1 minute"]
  },
  {
    year: "2022 - 2024",
    role: "Senior React & Full Stack Developer",
    company: "Digital Growth Labs",
    description: "Built scalable web platforms, customized CRM systems, and e-commerce applications with React, Node.js, MongoDB, and Tailwind CSS.",
    achievements: ["Architected multi-tenant matrimonial & travel booking platforms", "Optimized Lighthouse performance scores from 55 to 98+"]
  },
  {
    year: "2020 - 2022",
    role: "Frontend & SEO Engineer",
    company: "WebCraft Solutions",
    description: "Developed responsive web interfaces, crafted landing pages, and implemented structured data schemas and performance optimizations.",
    achievements: ["Ranked 15+ websites on Google Page 1 for high-intent keywords", "Built over 30 bespoke client websites with custom animations"]
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "website-dev",
    name: "Website Development",
    description: "Ultra-fast, visually spectacular, and mobile-responsive websites crafted to establish brand authority and convert visitors into high-paying clients.",
    iconName: "Globe",
    category: "Development",
    gradient: "from-blue-500 to-indigo-600",
    highlights: ["Custom Animations & Micro-interactions", "Responsive Mobile-First Architecture", "Conversion-Focused UX/UI", "95+ Lighthouse Score Guaranteed"],
    pricingStarting: "$999"
  },
  {
    id: "fullstack-dev",
    name: "Full Stack Development",
    description: "Robust Web Applications built with scalable Node.js/Python backends, relational & document databases, authentication systems, and API integrations.",
    iconName: "Layers",
    category: "Engineering",
    gradient: "from-violet-500 to-purple-600",
    highlights: ["Custom REST & GraphQL APIs", "Secure User Auth & RBAC", "MongoDB / PostgreSQL / Supabase Integration", "Real-Time WebSocket Features"],
    pricingStarting: "$1,999"
  },
  {
    id: "nextjs-apps",
    name: "Next.js Applications",
    description: "Enterprise-grade Next.js 15 App Router applications with Server Components, Incremental Static Regeneration (ISR), and SSR for ultimate speed.",
    iconName: "Zap",
    category: "Architecture",
    gradient: "from-cyan-500 to-blue-600",
    highlights: ["Next.js 15 App Router Architecture", "Server Actions & Edge Runtime", "SEO Schema Injection", "Sub-second Page Load Speed"],
    pricingStarting: "$1,499"
  },
  {
    id: "seo-opt",
    name: "SEO Optimization",
    description: "Data-driven Technical and On-Page SEO strategies engineered to rank #1 on Google, capture high-intent search traffic, and compound organic leads.",
    iconName: "TrendingUp",
    category: "Growth",
    gradient: "from-emerald-500 to-teal-600",
    highlights: ["Complete Technical SEO Audit", "Structured Data (JSON-LD) Schemas", "Content & Keyword Clustering", "Competitor Gap Analysis"],
    pricingStarting: "$799"
  },
  {
    id: "meta-ads",
    name: "Meta Ads Campaigns",
    description: "High-ROI Facebook & Instagram ad campaigns designed with scroll-stopping creatives, hyper-targeted custom lookalike audiences, and funnel tracking.",
    iconName: "Target",
    category: "Marketing",
    gradient: "from-pink-500 to-rose-600",
    highlights: ["High-Converting Ad Creatives & Copy", "Pixel & Conversions API (CAPI)", "Custom Audience & Retargeting Funnels", "Weekly ROI Analytics Reports"],
    pricingStarting: "$699"
  },
  {
    id: "ai-automation",
    name: "AI Automation",
    description: "Custom AI Chatbots, LLM workflows, and automated customer support bots that engage site visitors 24/7 and route leads directly to your CRM.",
    iconName: "Bot",
    category: "AI & Tech",
    gradient: "from-purple-500 to-fuchsia-600",
    highlights: ["Custom Trained AI Chat Assistant", "Lead Qualification & Booking Flows", "OpenAI / Claude API Integrations", "WhatsApp & CRM Sync"],
    pricingStarting: "$1,299"
  },
  {
    id: "crm-dev",
    name: "CRM Development",
    description: "Bespoke Lead & Customer Relationship Management systems tailored to your sales process, automated follow-ups, and revenue pipelines.",
    iconName: "Database",
    category: "Operations",
    gradient: "from-amber-500 to-orange-600",
    highlights: ["Custom Sales Pipeline Dashboards", "Automated Email & WhatsApp Notifications", "Role-Based Access Control", "Lead Score & Status Tracking"],
    pricingStarting: "$1,799"
  },
  {
    id: "uiux-design",
    name: "UI/UX Design",
    description: "Modern SaaS-style interface designs, high-fidelity interactive Figma wireframes, and design systems crafted for effortless usability.",
    iconName: "Layout",
    category: "Design",
    gradient: "from-sky-400 to-blue-500",
    highlights: ["Figma Design Systems & Tokens", "Interactive Prototypes", "Micro-Animations & Micro-Interactions", "User Journey Optimization"],
    pricingStarting: "$899"
  },
  {
    id: "perf-opt",
    name: "Performance Optimization",
    description: "Revamping slow, legacy codebases to achieve 95+ Core Web Vitals, eliminating render-blocking scripts, and optimizing image delivery pipelines.",
    iconName: "Gauge",
    category: "Engineering",
    gradient: "from-teal-400 to-emerald-600",
    highlights: ["Core Web Vitals Revamp", "Image & Asset Compression", "Code Splitting & Tree Shaking", "CDN Edge Cache Setup"],
    pricingStarting: "$599"
  }
];

export const SKILLS_DATA: SkillItem[] = [
  { name: "Next.js 15", level: 96, iconName: "Zap", category: "Frontend", experienceYears: "4+ Yrs", color: "#000000" },
  { name: "React 19", level: 98, iconName: "Code2", category: "Frontend", experienceYears: "5+ Yrs", color: "#61DAFB" },
  { name: "TypeScript", level: 92, iconName: "FileCode", category: "Frontend", experienceYears: "4+ Yrs", color: "#3178C6" },
  { name: "Tailwind CSS", level: 98, iconName: "Palette", category: "Frontend", experienceYears: "5+ Yrs", color: "#06B6D4" },
  { name: "Node.js", level: 90, iconName: "Server", category: "Backend & DB", experienceYears: "4+ Yrs", color: "#339933" },
  { name: "MongoDB", level: 88, iconName: "Database", category: "Backend & DB", experienceYears: "4+ Yrs", color: "#47A248" },
  { name: "Supabase", level: 90, iconName: "HardDrive", category: "Backend & DB", experienceYears: "3+ Yrs", color: "#3ECF8E" },
  { name: "Vercel & Edge", level: 95, iconName: "Cloud", category: "Cloud & DevOps", experienceYears: "4+ Yrs", color: "#000000" },
  { name: "SEO & Schemas", level: 96, iconName: "TrendingUp", category: "Growth & AI", experienceYears: "5+ Yrs", color: "#10B981" },
  { name: "Meta Ads & CAPI", level: 89, iconName: "Target", category: "Growth & AI", experienceYears: "3+ Yrs", color: "#0666E5" },
  { name: "AI Tools & APIs", level: 94, iconName: "Bot", category: "Growth & AI", experienceYears: "2+ Yrs", color: "#8B5CF6" }
];

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: "kamakhya-yatra",
    title: "Kamakhya Yatra Pilgrimage Portal & Booking System",
    clientName: "Kamakhya Pilgrimages",
    category: "Travel",
    description: "Comprehensive religious tourism platform featuring pilgrimage package booking, priest booking, interactive itinerary builder, and real-time payment processing.",
    heroImage: "https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80"
    ],
    businessProblem: "The client suffered from lost pilgrimage bookings due to an outdated slow website, lack of mobile responsiveness, and zero online payment tracking.",
    solutionImplemented: "Architected a Next.js App Router booking portal with instant search filters, WhatsApp direct confirmation, automated booking vouchers, and Google Schema optimization.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion", "WhatsApp API"],
    features: [
      "Dynamic Pilgrimage Package Configurator",
      "WhatsApp Instant Booking Vouchers",
      "Interactive Temple Map & Itinerary Timeline",
      "Multi-Currency Payment Gateway Readiness",
      "JSON-LD TouristAttraction & Schema Integration"
    ],
    resultsAchieved: [
      { metric: "+310%", label: "Organic Search Growth" },
      { metric: "4.2x", label: "Monthly Booking Revenue" },
      { metric: "0.8s", label: "Page Load Speed" }
    ],
    liveUrl: "https://kamakhyayatra.com",
    githubUrl: "https://github.com/suryaprataprana6-tech/Next-gen-2",
    featured: true
  },
  {
    id: "anjan-hospital",
    title: "Anjan Hospital Healthcare Portal & Patient Appointment System",
    clientName: "Anjan Super Speciality Hospital",
    category: "Healthcare",
    description: "Modern multi-department hospital portal with online doctor appointment scheduling, emergency contact quick-connect, and medical services directory.",
    heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&fit=crop&q=80"
    ],
    businessProblem: "High receptionist call volumes and patient wait times due to manual appointment booking and missing online doctor schedules.",
    solutionImplemented: "Designed an intuitive patient-centric portal with real-time doctor availability calendars, automated SMS/WhatsApp appointment reminders, and instant emergency dispatch buttons.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "Medical Schema"],
    features: [
      "1-Click Emergency Ambulance Call Trigger",
      "Doctor Department & Specialist Filter",
      "Patient Appointment Slot Booking Modal",
      "Medical Service FAQ & Patient Guides",
      "Hospital Location & Google Maps Navigation"
    ],
    resultsAchieved: [
      { metric: "-65%", label: "Phone Queue Wait Times" },
      { metric: "+180%", label: "Online Patient Bookings" },
      { metric: "99.2%", label: "Patient Satisfaction" }
    ],
    liveUrl: "https://anjanhospital.com",
    featured: true
  },
  {
    id: "goodluck-properties",
    title: "Goodluck Properties Real Estate Portal & Lead CRM",
    clientName: "Goodluck Realty Group",
    category: "Real Estate",
    description: "Luxury real estate property discovery platform with 3D virtual tour integrations, interactive price calculators, and automated lead capture funnels.",
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&q=80"
    ],
    businessProblem: "Low conversion rates from paid Meta/Google ads because potential buyers landed on static PDF flyers instead of interactive property views.",
    solutionImplemented: "Built a high-converting Next.js real estate portal featuring filtered search (bhk, location, price), high-resolution gallery sliders, and instant agent consultation booking.",
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Zod", "Framer Motion", "Meta Ads CAPI"],
    features: [
      "Property Filter by Budget, BHK, and Location",
      "EMI Mortgage & Payment Plan Calculator",
      "Instant WhatsApp Property Brochure Download",
      "High-Res Property Gallery & Video Tours",
      "Automated Buyer Qualification Questionnaire"
    ],
    resultsAchieved: [
      { metric: "3.8x", label: "Ad Campaign ROI" },
      { metric: "+240%", label: "Qualified Lead Volume" },
      { metric: "98/100", label: "Lighthouse Performance" }
    ],
    liveUrl: "https://goodluckproperties.com",
    featured: true
  },
  {
    id: "ait-research-centre",
    title: "AIT Research Centre Academic Portal & Global Collaboration Engine",
    clientName: "Academy of Information Technology",
    category: "Websites",
    description: "National academic and computer science research institute portal featuring publication archives, scholar directories, and conference registration.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&q=80"
    ],
    businessProblem: "Research papers and institutional achievements were buried in plain HTML files, resulting in poor search engine indexing and zero student engagement.",
    solutionImplemented: "Created a modern academic research hub with indexed publication search, faculty profile cards, scholarly dataset downloads, and SEO Schema for Research Projects.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "JSON-LD Schemas"],
    features: [
      "Searchable Academic Research Paper Repository",
      "Faculty & Scholar Profiles with Citation Links",
      "Conference & Symposium Event Registration",
      "Dark / Light Academic Reading Mode",
      "Full Mobile & Tablet Responsive Layout"
    ],
    resultsAchieved: [
      { metric: "12,000+", label: "Monthly Research Downloads" },
      { metric: "#1 Rank", label: "Target CS Research Keywords" },
      { metric: "100%", label: "Accessibility Score" }
    ],
    liveUrl: "https://aitresearchcentre.in",
    featured: true
  },
  {
    id: "indiaone-matrimony",
    title: "IndiaOne Matrimony Matchmaking & AI Profile Verification",
    clientName: "India One Matrimony Inc",
    category: "AI",
    description: "Trusted matchmaking platform with AI profile verification, intelligent compatibility scoring, secure messaging, and privacy-protected profile controls.",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop&q=80"
    ],
    businessProblem: "Inauthentic profiles and slow search filters led to user distrust and high churn on legacy matchmaking script.",
    solutionImplemented: "Engineered an AI-backed verification pipeline, instant filter engine, end-to-end encrypted interest requests, and automated WhatsApp onboarding.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "OpenAI API", "Socket.io"],
    features: [
      "AI Facial & Document Verification Pipeline",
      "Smart Compatibility Match Algorithm",
      "Privacy Blur & Photo Access Control",
      "Real-Time Chat & Connection Requests",
      "Multi-Language UI Support"
    ],
    resultsAchieved: [
      { metric: "+450%", label: "Verified User Registrations" },
      { metric: "4.8/5", label: "App Store User Rating" },
      { metric: "85%", label: "Match Success Rate" }
    ],
    liveUrl: "https://indiaonematrimony.com",
    featured: true
  },
  {
    id: "honeymoon-safar",
    title: "Honeymoon Safar Luxury Package Booking Engine",
    clientName: "Honeymoon Safar Travel Group",
    category: "Travel",
    description: "Premium travel & romantic getaway booking platform with interactive destination galleries, customized itinerary cost estimators, and WhatsApp sales routing.",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80"
    ],
    businessProblem: "Slow website load speeds caused high bounce rates on mobile ad campaigns targeting luxury travelers.",
    solutionImplemented: "Built an ultra-fast Next.js platform with compressed WebP media pipelines, instant itinerary downloads, and 1-tap WhatsApp consultation buttons.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel Edge", "Lucide Icons"],
    features: [
      "Curated Luxury Destination Showcase",
      "Customizable Itinerary Cost Builder",
      "Instant PDF Travel Brochure Generator",
      "Integrated Customer Reviews & Ratings",
      "Meta Ads Pixel & Conversion Tracking"
    ],
    resultsAchieved: [
      { metric: "+220%", label: "Lead Conversion Rate" },
      { metric: "0.6s", label: "Mobile First Contentful Paint" },
      { metric: "5.0 ★", label: "Traveler Satisfaction" }
    ],
    liveUrl: "https://honeymoonsafar.com",
    featured: false
  },
  {
    id: "label-raje",
    title: "Label Raje Luxury Fashion Store & E-Commerce Pipeline",
    clientName: "Label Raje Designs",
    category: "Websites",
    description: "High-end couture fashion e-commerce experience featuring dynamic apparel catalogs, size recommendation guide, and instant checkout integration.",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&fit=crop&q=80"
    ],
    businessProblem: "Generic Shopify theme failed to convey the exclusivity and premium feel of handcrafted designer garments.",
    solutionImplemented: "Designed a bespoke glassmorphic luxury web shop with smooth zoom interactions, micro-animations, quick cart drawers, and Instagram feed sync.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Stripe API"],
    features: [
      "High-Resolution Zoom Garment Inspection",
      "Slide-Over Cart Drawer & Quick Checkout",
      "Interactive Size & Measurement Guide",
      "Lookbook Collection Filter by Season",
      "Instagram Shoppable Feed Widget"
    ],
    resultsAchieved: [
      { metric: "+190%", label: "Average Order Value (AOV)" },
      { metric: "-40%", label: "Cart Abandonment Rate" },
      { metric: "99.8%", label: "Uptime Reliability" }
    ],
    liveUrl: "https://labelraje.com",
    featured: false
  },
  {
    id: "nextgen-crm",
    title: "NextGen Multi-Tenant Lead & Business CRM System",
    clientName: "NextGen Enterprise",
    category: "CRM",
    description: "All-in-one lead management, chatbot conversation tracker, and automated follow-up engine for agencies and service businesses.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop&q=80"
    ],
    businessProblem: "Client leads from landing pages, WhatsApp, and Facebook Ads were being missed due to scattered inbox channels.",
    solutionImplemented: "Engineered a centralized real-time lead command center with status Kanban boards, WhatsApp webhooks, and automated SMS notifications.",
    techStack: ["Next.js 15", "TypeScript", "Supabase", "Tailwind CSS", "Zod", "Twilio API"],
    features: [
      "Drag-and-Drop Lead Status Kanban Board",
      "Real-Time Chatbot Log Viewer & Sentiment",
      "Automated WhatsApp & Email Follow-Up Sequences",
      "Team Role Permissions & Assignment Rules",
      "Exportable CSV Analytics & Revenue Reports"
    ],
    resultsAchieved: [
      { metric: "100%", label: "Lead Capture Rate" },
      { metric: "< 2 min", label: "Average Lead Contact Time" },
      { metric: "3.5x", label: "Sales Closing Rate" }
    ],
    liveUrl: "#crm-demo",
    featured: true
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    name: "Dr. Anjan Kumar",
    role: "Founder & Director",
    company: "Anjan Super Speciality Hospital",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80",
    rating: 5,
    review: "Surya transformed our hospital's digital presence completely. Our online patient appointment system is extremely reliable and fast. Patient feedback has been overwhelming!",
    projectTag: "Healthcare Portal",
    verified: true
  },
  {
    id: "t2",
    name: "Rajesh Sharma",
    role: "Managing Partner",
    company: "Kamakhya Pilgrimages",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80",
    rating: 5,
    review: "Surya's expertise in Next.js, SEO, and WhatsApp automation resulted in a 4x increase in pilgrimage bookings. He is super responsive, transparent, and delivers beyond expectations.",
    projectTag: "Kamakhya Yatra",
    verified: true
  },
  {
    id: "t3",
    name: "Vikas Agarwal",
    role: "Managing Director",
    company: "Goodluck Properties",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop&q=80",
    rating: 5,
    review: "The real estate portal designed by Surya generated qualified property buyers within the first week of launch. His understanding of high-converting UI/UX and Meta Ads tracking is top tier.",
    projectTag: "Real Estate CRM",
    verified: true
  },
  {
    id: "t4",
    name: "Dr. P. K. Mishra",
    role: "Dean of Research",
    company: "AIT Research Centre",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop&q=80",
    rating: 5,
    review: "Surya built a world-class academic portal that showcases our institute's research globally. Page load times are instant and Google search indexing reached #1 for our primary research domains.",
    projectTag: "Academic Portal",
    verified: true
  },
  {
    id: "t5",
    name: "Sunita Roy",
    role: "CEO & Co-Founder",
    company: "IndiaOne Matrimony",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop&q=80",
    rating: 5,
    review: "Outstanding work on our matchmaking platform! The AI profile verification integration restored complete user confidence, and user retention grew by over 400%. Highly recommended!",
    projectTag: "Matrimony Platform",
    verified: true
  },
  {
    id: "t6",
    name: "Anil & Kavita Sengupta",
    role: "Founders",
    company: "Honeymoon Safar",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
    rating: 5,
    review: "Our travel package booking site is now fast, elegant, and converts like crazy. The instant WhatsApp lead routing gives us an unbeatable competitive edge.",
    projectTag: "Travel Booking",
    verified: true
  }
];

export const WORK_PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: "01",
    title: "Discovery & Alignment",
    shortDesc: "Understanding business goals, target audience, and competitive positioning.",
    detail: "We audit your existing assets, research competitors, define target user personas, and establish quantifiable KPIs (conversion goals, page speed targets, lead velocity).",
    iconName: "Search"
  },
  {
    stepNumber: "02",
    title: "Architecture & Planning",
    shortDesc: "Structuring sitemap, database schemas, tech stack, and user flows.",
    detail: "Mapping out Next.js App Router routes, database models, SEO schemas, state management, and third-party API integrations (Payment, CRM, AI, Ads Pixel).",
    iconName: "Compass"
  },
  {
    stepNumber: "03",
    title: "UI/UX & Wireframing",
    shortDesc: "Designing high-converting, SaaS-grade interactive visual prototypes.",
    detail: "Creating glassmorphic, dark/light responsive interface layouts in Figma with typography tokens, micro-animations, component states, and accessible contrast ratios.",
    iconName: "Palette"
  },
  {
    stepNumber: "04",
    title: "Agile Development",
    shortDesc: "Clean Next.js 15, TypeScript, and Tailwind CSS implementation.",
    detail: "Building modular React components, configuring Server Side Rendering, setting up Zod validated API routes, and writing clean, maintainable TypeScript code.",
    iconName: "Code2"
  },
  {
    stepNumber: "05",
    title: "QA & Performance Tuning",
    shortDesc: "Rigorous cross-device testing and 95+ Core Web Vitals optimization.",
    detail: "Executing browser testing (iOS, Android, Chrome, Safari), validating HTML accessibility, auditing Lighthouse scores, and verifying JSON-LD SEO schemas.",
    iconName: "CheckSquare"
  },
  {
    stepNumber: "06",
    title: "Deployment & Launch",
    shortDesc: "Zero-downtime deployment to Vercel CDN with SSL & DNS configuration.",
    detail: "Configuring Vercel Edge caching, custom domain SSL, environment variables, sitemap submission to Google Search Console, and Analytics tracking.",
    iconName: "Rocket"
  },
  {
    stepNumber: "07",
    title: "Growth & 24/7 Support",
    shortDesc: "Continuous iteration, conversion optimization, and maintenance.",
    detail: "Monitoring real-time user behavior, running A/B conversion tests, delivering monthly security updates, and providing direct developer priority support.",
    iconName: "ShieldCheck"
  }
];

export const BLOG_POSTS: BlogItem[] = [
  {
    id: "blog-1",
    title: "Why Next.js 15 App Router is the Ultimate Choice for High-Converting Portfolios",
    slug: "nextjs-15-app-router-portfolio-guide",
    excerpt: "Discover how React 19 Server Components, streaming SSR, and edge caching dramatically increase page load speed and boost lead conversion rates.",
    content: "Building a modern portfolio or business website requires more than just static HTML. In 2026, user patience is shorter than ever. Next.js 15 App Router combines lightning-fast server side rendering with dynamic interactivity...",
    category: "Next.js",
    readTime: "5 min read",
    date: "Jan 18, 2026",
    author: "Surya Pratap Rana",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&q=80"
  },
  {
    id: "blog-2",
    title: "Mastering Technical SEO & JSON-LD Schemas in Modern React Applications",
    slug: "technical-seo-json-ld-react-guide",
    excerpt: "Step-by-step blueprint to implement Person, Project, and LocalBusiness structured data schemas to claim Google Rich Snippets and #1 rankings.",
    content: "Search Engine Optimization has evolved beyond keyword stuffing. Search engines now parse structured JSON-LD entities to understand who you are, what services you offer, and why your site deserves rich snippet carousel placements...",
    category: "SEO",
    readTime: "7 min read",
    date: "Dec 29, 2025",
    author: "Surya Pratap Rana",
    image: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=800&fit=crop&q=80"
  },
  {
    id: "blog-3",
    title: "Integrating AI Chatbots & LLM Agents into SaaS & E-Commerce Websites",
    slug: "ai-chatbots-llm-integration-saas",
    excerpt: "Learn how to build a 24/7 AI lead capture assistant using OpenAI APIs, custom prompt engineering, and WhatsApp CRM routing.",
    content: "Static contact forms suffer from an average 80% abandonment rate. By integrating an intelligent AI chatbot that engages visitors instantaneously with natural language answers...",
    category: "AI",
    readTime: "6 min read",
    date: "Dec 12, 2025",
    author: "Surya Pratap Rana",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop&q=80"
  },
  {
    id: "blog-4",
    title: "Designing Glassmorphic Bento Grids with Framer Motion & Tailwind CSS",
    slug: "glassmorphism-bento-grid-framer-motion",
    excerpt: "A deep dive into modern luxury web aesthetics, subtle backdrop blurs, glow borders, and fluid micro-animations that mesmerize visitors.",
    content: "The aesthetic bar for web applications in 2026 has been elevated by SaaS leaders. Apple-style Bento Grids combined with frosted glassmorphism deliver a luxurious experience...",
    category: "Web Development",
    readTime: "4 min read",
    date: "Nov 25, 2025",
    author: "Surya Pratap Rana",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&fit=crop&q=80"
  }
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: "cert-1",
    title: "Next.js 15 & React 19 Senior Architect",
    issuer: "Vercel & Meta Engineering Academy",
    issueDate: "2025",
    credentialId: "VER-98421-NX15",
    badgeUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=150&fit=crop&q=80",
    verifyUrl: "https://vercel.com",
    skillsVerified: ["Next.js 15", "React 19", "Server Components", "ISR", "Edge Runtime"]
  },
  {
    id: "cert-2",
    title: "Full Stack Web Developer & Cloud Engineer",
    issuer: "AWS & MongoDB University",
    issueDate: "2024",
    credentialId: "AWS-DEV-77402",
    badgeUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&fit=crop&q=80",
    verifyUrl: "https://aws.amazon.com",
    skillsVerified: ["Node.js", "MongoDB", "Supabase", "Cloud Architecture", "REST APIs"]
  },
  {
    id: "cert-3",
    title: "Google Advanced Technical SEO & Schemas Specialist",
    issuer: "Google Digital Academy",
    issueDate: "2024",
    credentialId: "GOOG-SEO-55192",
    badgeUrl: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=150&fit=crop&q=80",
    verifyUrl: "https://skillshop.exceedlms.com",
    skillsVerified: ["Technical SEO", "JSON-LD Schemas", "Core Web Vitals", "Indexing Engine"]
  },
  {
    id: "cert-4",
    title: "Meta Certified Digital Marketing & Ads Specialist",
    issuer: "Meta Business Certification",
    issueDate: "2023",
    credentialId: "META-ADS-99104",
    badgeUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&fit=crop&q=80",
    verifyUrl: "https://www.credly.com",
    skillsVerified: ["Meta Ads Pixel", "Conversions API (CAPI)", "Audience Targeting", "Funnel Optimization"]
  }
];

export const FAQ_DATA = [
  {
    question: "What is your typical project delivery timeline?",
    answer: "Landing pages and brand websites are typically delivered within 5–7 days. Complex Next.js App Router applications, custom CRMs, or platforms with AI integrations take between 2 to 4 weeks, with weekly milestone updates."
  },
  {
    question: "How do you guarantee high conversion rates and fast load times?",
    answer: "Every site is custom built using Next.js 15 Server Components, clean Tailwind CSS, and optimized image assets to achieve 95+ Lighthouse performance scores. We design strategic call-to-actions, direct WhatsApp triggers, and frictionless lead forms."
  },
  {
    question: "Do you provide ongoing maintenance and technical support after launch?",
    answer: "Yes! All projects include 30 days of free post-launch support and monitoring. I also offer monthly support retainers covering security updates, server monitoring, content tweaks, and continuous SEO optimization."
  },
  {
    question: "Can you help migrate my existing legacy website to Next.js?",
    answer: "Absolutely. I specialize in migrating slow WordPress, PHP, or older React codebases to Next.js 15 while preserving 100% of your existing SEO rankings, backlink equity, and search engine indexation."
  }
];
