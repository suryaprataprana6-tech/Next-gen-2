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
  name: "NextGen Digital Solutions",
  title: "Premier Digital Solutions & Revenue Growth Agency",
  tagline: "Building High-Converting Web Applications, Precision Ad Funnels & Lead Systems",
  headline: "Engineering Scalable Digital Experiences That Drive Real Revenue Growth",
  bio: "NextGen Digital Solutions is an elite digital engineering and performance growth agency. We engineer high-converting web applications, precision Meta & Google ad funnels, and automated lead generation systems that turn traffic into predictable, compounding revenue.",
  experienceYears: "5+",
  projectsDelivered: "High-Performance",
  happyClients: "Long-Term Partners",
  clientSatisfaction: "Outcome-Driven",
  leadsGenerated: "Lead Systems",
  adSpendManaged: "Multi-Platform",
  location: "Patna / Ranchi / Delhi NCR / Remote Worldwide",
  email: "suryaprataprana6@gmail.com",
  phone: "+91 83404 24989",
  whatsapp: "https://wa.me/918340424989?text=Hi%20NextGen%20Digital%20Solutions,%20I%20want%20to%20scale%20my%20business%20revenue",
  website: "https://nextgendigitalsolutions.com",
};

export const STATS_DATA = [
  { value: "High-Performance", label: "Websites & Digital Architecture", suffix: "", icon: "CheckCircle2" },
  { value: "Performance", label: "Paid Growth & Ad Strategy", suffix: "", icon: "Users" },
  { value: "Systematic", label: "Lead Generation Engines", suffix: "", icon: "TrendingUp" },
  { value: "Revenue-Focused", label: "Outcome-Driven Execution", suffix: "", icon: "Award" }
];

export const TRUSTED_CLIENTS = [
  { name: "Tourism & Travel", domain: "booking-portals", industry: "Religious & Leisure Travel", logoText: "TT", color: "from-amber-500 to-orange-600" },
  { name: "Healthcare & Clinics", domain: "patient-portals", industry: "Healthcare & Medical", logoText: "HC", color: "from-emerald-500 to-teal-600" },
  { name: "Real Estate & Housing", domain: "property-engines", industry: "Real Estate & Lead CRM", logoText: "RE", color: "from-blue-600 to-cyan-500" },
  { name: "Research & Academia", domain: "academic-hubs", industry: "Institutes & Education", logoText: "RA", color: "from-indigo-500 to-purple-600" },
  { name: "Consumer Platforms", domain: "platform-systems", industry: "Matchmaking & Social", logoText: "CP", color: "from-pink-500 to-rose-600" },
  { name: "Retail & Apparel", domain: "ecommerce-stores", industry: "Fashion & Direct-to-Consumer", logoText: "RA", color: "from-violet-500 to-fuchsia-600" }
];

export const ABOUT_STORY = {
  journey: "NextGen Digital Solutions was founded to solve a fundamental disconnect in the agency model: gorgeous websites that don't convert, and expensive ad campaigns that direct traffic to slow, broken landing pages. We engineer unified digital infrastructure that pairs engineering excellence with direct-response growth marketing.",
  mission: "To eliminate slow, bloated, low-converting software and replace it with ultra-fast, visually captivating, revenue-generating digital products.",
  coreValues: [
    { title: "Velocity & Precision", desc: "Shipping clean, maintainable code rapidly without sacrificing quality." },
    { title: "Conversion First Design", desc: "Every pixel, CTA, and micro-interaction is engineered for user engagement." },
    { title: "Architectural Integrity", desc: "Building scalable Next.js Server Components, clean API endpoints & secure DB schemas." },
    { title: "Measurable Impact", desc: "Tracking real business ROI—commercial inquiries, lead velocity, and load speeds under 1 second." }
  ]
};

export const CAREER_TIMELINE: TimelineItem[] = [
  {
    year: "2024 - Present",
    role: "Lead Full Stack & Next.js Solutions Architect",
    company: "NextGen Digital Agency",
    description: "Designing end-to-end web architectures, AI chatbot workflows, and Next.js platforms. Managing high-intent lead campaigns and technical SEO for client platforms.",
    achievements: ["Engineered modern Next.js App Router applications", "Optimized client conversion funnels and inquiry flows", "Built automated CRM pipelines for instant lead follow-up"]
  },
  {
    year: "2022 - 2024",
    role: "Senior React & Full Stack Developer",
    company: "Digital Growth Labs",
    description: "Built scalable web platforms, customized CRM systems, and e-commerce applications with React, Node.js, MongoDB, and Tailwind CSS.",
    achievements: ["Architected consumer platforms and booking systems", "Optimized Core Web Vitals and load performance"]
  },
  {
    year: "2020 - 2022",
    role: "Frontend & SEO Engineer",
    company: "WebCraft Solutions",
    description: "Developed responsive web interfaces, crafted landing pages, and implemented structured data schemas and performance optimizations.",
    achievements: ["Deployed structured JSON-LD schemas and technical SEO", "Crafted responsive web interfaces with bespoke interactions"]
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
    id: "travel-booking-portal",
    title: "Travel & Pilgrimage Booking Platform",
    clientName: "Tourism & Travel Sector",
    category: "Travel",
    description: "Comprehensive religious and leisure tourism platform featuring pilgrimage package booking, priest reservation, interactive itinerary builder, and real-time payment processing.",
    heroImage: "https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80"
    ],
    businessProblem: "Businesses in the hospitality and pilgrimage sector often lose direct bookings due to outdated slow websites, lack of mobile responsiveness, and manual enquiry tracking.",
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
      { metric: "Sub-Second", label: "Page Load Architecture" },
      { metric: "Integrated", label: "Direct WhatsApp Flow" },
      { metric: "Engineered", label: "Dynamic Itinerary Builder" }
    ],
    liveUrl: "#contact",
    githubUrl: "https://github.com/suryaprataprana6-tech/Next-gen-2",
    featured: true
  },
  {
    id: "healthcare-patient-portal",
    title: "Healthcare Portal & Doctor Appointment System",
    clientName: "Healthcare & Clinical Sector",
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
      { metric: "Automated", label: "Appointment Scheduling" },
      { metric: "Optimized", label: "Emergency Quick-Connect" },
      { metric: "Structured", label: "Medical Search Schema" }
    ],
    liveUrl: "#contact",
    featured: true
  },
  {
    id: "realestate-lead-portal",
    title: "Real Estate Discovery Portal & Lead CRM",
    clientName: "Real Estate & Commercial Sector",
    category: "Real Estate",
    description: "Luxury real estate property discovery platform with virtual tour integrations, interactive mortgage calculators, and automated lead capture funnels.",
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
      { metric: "Multi-Filter", label: "Property Search Engine" },
      { metric: "Automated", label: "Brochure Lead Funnels" },
      { metric: "Configured", label: "Meta Conversions API" }
    ],
    liveUrl: "#contact",
    featured: true
  },
  {
    id: "academic-research-portal",
    title: "Academic Research Hub & Publication Engine",
    clientName: "Education & Research Sector",
    category: "Websites",
    description: "Academic and computer science research institute portal featuring publication archives, scholar directories, and conference registration.",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&q=80"
    ],
    businessProblem: "Research papers and institutional achievements were buried in plain unindexed documents, resulting in poor search engine indexing and low visitor engagement.",
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
      { metric: "Searchable", label: "Research Archives" },
      { metric: "Indexed", label: "Google Scholar Schema" },
      { metric: "Responsive", label: "Cross-Device Layout" }
    ],
    liveUrl: "#contact",
    featured: true
  },
  {
    id: "consumer-platform",
    title: "Consumer Matchmaking & Verification System",
    clientName: "Consumer Platform Sector",
    category: "AI",
    description: "Matchmaking platform with profile verification, intelligent compatibility scoring, secure messaging, and privacy-protected profile controls.",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&fit=crop&q=80"
    ],
    businessProblem: "Inauthentic user profiles and slow search filters led to user distrust and high churn on legacy scripts.",
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
      { metric: "Verified", label: "Profile Integrity Pipeline" },
      { metric: "Real-Time", label: "Encrypted Communication" },
      { metric: "Automated", label: "Onboarding Flow" }
    ],
    liveUrl: "#contact",
    featured: true
  },
  {
    id: "luxury-travel-experience",
    title: "Luxury Travel Experience & Itinerary Planner",
    clientName: "Hospitality & Leisure Sector",
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
      { metric: "Instant", label: "Itinerary Cost Builder" },
      { metric: "Direct", label: "WhatsApp Consultation" },
      { metric: "Optimized", label: "Mobile Core Web Vitals" }
    ],
    liveUrl: "#contact",
    featured: false
  },
  {
    id: "dtc-apparel-store",
    title: "Direct-to-Consumer Fashion & Apparel Store",
    clientName: "Retail & Apparel Sector",
    category: "Websites",
    description: "High-end couture fashion e-commerce experience featuring dynamic apparel catalogs, size recommendation guide, and instant checkout integration.",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&fit=crop&q=80"
    ],
    businessProblem: "Generic off-the-shelf themes failed to convey the exclusivity and premium feel of handcrafted designer garments.",
    solutionImplemented: "Designed a bespoke luxury web shop with smooth zoom interactions, micro-animations, quick cart drawers, and Instagram feed sync.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Stripe API"],
    features: [
      "High-Resolution Zoom Garment Inspection",
      "Slide-Over Cart Drawer & Quick Checkout",
      "Interactive Size & Measurement Guide",
      "Lookbook Collection Filter by Season",
      "Instagram Shoppable Feed Widget"
    ],
    resultsAchieved: [
      { metric: "Fluid", label: "Slide Cart & Checkout UI" },
      { metric: "Mobile-First", label: "Product Grid Experience" },
      { metric: "Optimized", label: "Conversion Hierarchy" }
    ],
    liveUrl: "#contact",
    featured: false
  },
  {
    id: "nextgen-crm",
    title: "NextGen Multi-Tenant Lead CRM System",
    clientName: "Agency & B2B Operations",
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
      { metric: "Unified", label: "Multi-Channel Tracking" },
      { metric: "Automated", label: "WhatsApp & SMS Routing" },
      { metric: "Real-Time", label: "Status Kanban Boards" }
    ],
    liveUrl: "#contact",
    featured: true
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [];

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
    author: "NextGen Engineering Team",
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
    author: "NextGen Engineering Team",
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
    author: "NextGen Engineering Team",
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
    author: "NextGen Engineering Team",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&fit=crop&q=80"
  }
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [];

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
