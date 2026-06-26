import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import path from "path";
import fs from "fs";

// Models
import User from "./models/User.js";
import Settings from "./models/Settings.js";
import Service from "./models/Service.js";
import Portfolio from "./models/Portfolio.js";
import Testimonial from "./models/Testimonial.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

dotenv.config();

const app = express();

// Rate Limiter for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Middlewares
const allowedOrigins = [
  "https://next-gen-2.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in early production; tighten later
  },
  credentials: true
}));
app.use(express.json());
app.use(limiter);

// Serve uploads locally
app.use("/uploads", express.static("uploads"));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandle Error:", err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nextgen_digital";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB database successfully");
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error("MongoDB Connection Error:", err.message);
    console.warn("Express server starting with offline database fallback...");
    try {
      await seedDatabase();
      console.log("Seeded offline database successfully");
    } catch (seedErr) {
      console.error("Offline database seeding failed:", seedErr.message);
    }
    
    // Start server anyway so frontend requests don't hang completely, but error logs are warning
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (Database Offline)`);
    });
  });

// Seeding function
async function seedDatabase() {
  try {
    // 1. Seed Admin User
    const adminCount = await User.countDocuments({});
    if (adminCount === 0) {
      await User.create({
        name: "Super Admin",
        email: "admin@nextgendigital.com",
        password: "Admin@123", // Will hash on pre-save
        role: "Admin",
        permissions: ["all"]
      });
      console.log("Seeded default admin account (admin@nextgendigital.com / Admin@123)");
    }

    // 2. Seed Default Settings
    const settingsCount = await Settings.countDocuments({});
    if (settingsCount === 0) {
      await Settings.create({
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
      });
      console.log("Seeded default website settings");
    }

    // 3. Seed Default Services
    const servicesCount = await Service.countDocuments({});
    if (servicesCount === 0) {
      const defaultServices = [
        {
          name: "Search Engine Optimization (SEO)",
          description: "Dominate search results, drive organic traffic, and capture high-intent customers with data-backed content optimization and ranking strategies.",
          icon: "Search",
          featured: true,
          status: "Active"
        },
        {
          name: "Google Ads",
          description: "Target buyers instantly. We set up, manage, and optimize performance-driven Google PPC campaigns designed to yield high conversions.",
          icon: "Megaphone",
          featured: true,
          status: "Active"
        },
        {
          name: "Meta Ads",
          description: "Scale brand growth on Facebook and Instagram with visually compelling ad creatives and hyper-targeted custom audience segmentation.",
          icon: "Target",
          featured: true,
          status: "Active"
        },
        {
          name: "Social Media Marketing",
          description: "Build an active online community, enhance customer loyalty, and drive product virality across LinkedIn, TikTok, and Instagram.",
          icon: "MessageCircle",
          featured: false,
          status: "Active"
        },
        {
          name: "Website Development",
          description: "Develop fast, responsive, and visually spectacular websites optimized for maximum user experience, speed, and sales conversion.",
          icon: "Code",
          featured: true,
          status: "Active"
        },
        {
          name: "Branding",
          description: "Craft a premium, memorable brand identity. We design logos, choose typography systems, and create brand strategy playbooks.",
          icon: "Palette",
          featured: false,
          status: "Active"
        },
        {
          name: "Email Marketing",
          description: "Nurture leads and drive repeat revenue with custom, high-converting lifecycle emails, sequence automations, and weekly newsletters.",
          icon: "Mail",
          featured: false,
          status: "Active"
        },
        {
          name: "Content Marketing",
          description: "Establish ultimate industry authority. We research, write, and distribute SEO-optimized blog posts, case studies, and digital guides.",
          icon: "FileText",
          featured: false,
          status: "Active"
        },
        {
          name: "Analytics & Reporting",
          description: "Gain complete visibility on performance. We build customized BI analytics dashboards tracking marketing spend and conversion funnels.",
          icon: "BarChart3",
          featured: false,
          status: "Active"
        },
        {
          name: "AI Automation",
          description: "Reduce operational friction. We develop bespoke AI chatbots and streamline backend CRM systems to scale support and outbound sales.",
          icon: "Cpu",
          featured: true,
          status: "Active"
        }
      ];
      await Service.insertMany(defaultServices);
      console.log("Seeded default services database");
    }

    // 4. Seed Default Testimonials
    const testimonialsCount = await Testimonial.countDocuments({});
    if (testimonialsCount === 0) {
      const defaultTestimonials = [
        {
          name: "India One Matrimony",
          url: "https://indiaonematrimony.com",
          industry: "Matrimonial & Matchmaking",
          initials: "IOM",
          gradient: "from-pink-500 to-rose-500",
          iconName: "Heart",
          feedback: "NextGen Digital delivered a modern, secure and user-friendly matrimonial platform. Their professionalism, communication and development quality exceeded our expectations.",
          featured: true,
          status: "Active"
        },
        {
          name: "Honeymoon Safar",
          url: "https://honeymoonsafar.com",
          industry: "Travel Booking",
          initials: "HS",
          gradient: "from-sky-400 to-blue-500",
          iconName: "Compass",
          feedback: "Our travel booking website is now faster, mobile-friendly and optimized for lead generation. The team provided an excellent experience from start to finish.",
          featured: true,
          status: "Active"
        },
        {
          name: "Kamakhya Yatra",
          url: "https://kamakhyayatra.com",
          industry: "Religious Tourism",
          initials: "KY",
          gradient: "from-amber-500 to-orange-600",
          iconName: "MapPin",
          feedback: "The website perfectly represents our religious tourism services. The booking flow and user experience have significantly improved.",
          featured: true,
          status: "Active"
        },
        {
          name: "Label Raje",
          url: "https://labelraje.com",
          industry: "Premium Fashion E-Commerce",
          initials: "LR",
          gradient: "from-purple-500 to-indigo-600",
          iconName: "ShoppingBag",
          feedback: "NextGen Digital created a premium fashion website with an elegant design and smooth shopping experience. Highly recommended.",
          featured: true,
          status: "Active"
        },
        {
          name: "AIT Research Centre",
          url: "https://aitresearchcentre.in",
          industry: "Education & Research",
          initials: "AIT",
          gradient: "from-emerald-500 to-teal-600",
          iconName: "BookOpen",
          feedback: "They developed a professional educational and research platform that reflects our organization's vision perfectly.",
          featured: true,
          status: "Active"
        },
        {
          name: "AIT Research Centre Global",
          url: "https://aitresearchcentre.com",
          industry: "International Research",
          initials: "AITG",
          gradient: "from-blue-600 to-indigo-700",
          iconName: "Globe",
          feedback: "Our international research portal now has a modern design, better performance and improved user engagement.",
          featured: true,
          status: "Active"
        },
        {
          name: "World's Winner Education",
          url: "https://worldswinnereducation.com",
          industry: "Educational Services",
          initials: "WWE",
          gradient: "from-cyan-500 to-teal-500",
          iconName: "GraduationCap",
          feedback: "The website is clean, responsive and easy for students to use. We are extremely satisfied with the final outcome.",
          featured: false,
          status: "Active"
        },
        {
          name: "Miss Bharat Award",
          url: "https://missbharataward.com",
          industry: "Event & Pageant Platform",
          initials: "MBA",
          gradient: "from-yellow-400 to-amber-500",
          iconName: "Award",
          feedback: "NextGen Digital delivered a premium event website with excellent branding, responsive design and smooth user experience.",
          featured: false,
          status: "Active"
        }
      ];
      await Testimonial.insertMany(defaultTestimonials);
      console.log("Seeded default testimonials database");
    }

    // 5. Seed Default Portfolio
    const portfolioCount = await Portfolio.countDocuments({});
    if (portfolioCount === 0) {
      const defaultPortfolio = [
        {
          name: "India One Matrimony",
          url: "https://indiaonematrimony.com",
          clientName: "India One Matrimony Inc",
          category: "Matrimony",
          description: "India's trusted matrimonial platform with verified profiles and AI-powered matchmaking solutions.",
          images: ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop&q=80"],
          completionDate: new Date("2025-08-15"),
          featured: true,
          status: "Active"
        },
        {
          name: "Honeymoon Safar",
          url: "https://honeymoonsafar.com",
          clientName: "Honeymoon Safar Travel Group",
          category: "Travel & Tourism",
          description: "Travel and honeymoon package booking platform designed for seamless trip planning and booking.",
          images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop&q=80"],
          completionDate: new Date("2025-10-22"),
          featured: true,
          status: "Active"
        },
        {
          name: "Kamakhya Yatra",
          url: "https://kamakhyayatra.com",
          clientName: "Kamakhya Pilgrimages",
          category: "Religious Tourism",
          description: "Religious tourism platform focused on pilgrimage, packages, and spiritual travel experiences.",
          images: ["https://images.unsplash.com/photo-1602631985686-2bb0604508ec?w=600&fit=crop&q=80"],
          completionDate: new Date("2025-12-05"),
          featured: true,
          status: "Active"
        },
        {
          name: "Label Raje",
          url: "https://labelraje.com",
          clientName: "Label Raje Designs",
          category: "Fashion & Retail",
          description: "Modern fashion, clothing line, and luxury apparel brand e-commerce website.",
          images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&fit=crop&q=80"],
          completionDate: new Date("2026-01-20"),
          featured: true,
          status: "Active"
        },
        {
          name: "AIT Research Centre",
          url: "https://aitresearchcentre.in",
          clientName: "Academy of Information Technology",
          category: "Research & Education",
          description: "National academic and science research institute portal focused on educational studies.",
          images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&fit=crop&q=80"],
          completionDate: new Date("2026-02-14"),
          featured: true,
          status: "Active"
        },
        {
          name: "AIT Research Centre Global",
          url: "https://aitresearchcentre.com",
          clientName: "AIT Global Foundations",
          category: "Research & Academic",
          description: "International academic exchange and research collaboration platform.",
          images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&fit=crop&q=80"],
          completionDate: new Date("2026-03-30"),
          featured: true,
          status: "Active"
        },
        {
          name: "World's Winner Education",
          url: "https://worldswinnereducation.com",
          clientName: "Worlds Winner Academy",
          category: "Education & Career",
          description: "Educational platform for student resources, courses, and digital career growth.",
          images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&fit=crop&q=80"],
          completionDate: new Date("2026-04-10"),
          featured: false,
          status: "Active"
        },
        {
          name: "Miss Bharat Award",
          url: "https://missbharataward.com",
          clientName: "Miss Bharat Pageants",
          category: "Events & Pageants",
          description: "National beauty pageant platform focused on talent, leadership, and social impact.",
          images: ["https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&fit=crop&q=80"],
          completionDate: new Date("2026-05-18"),
          featured: false,
          status: "Active"
        }
      ];
      await Portfolio.insertMany(defaultPortfolio);
      console.log("Seeded default portfolio database");
    }

  } catch (error) {
    console.error("Database Seeding Error:", error);
  }
}
