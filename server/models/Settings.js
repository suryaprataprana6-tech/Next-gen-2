import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const settingsSchema = new mongoose.Schema(
  {
    websiteName: { type: String, default: "NextGen Digital" },
    logo: { type: String },
    favicon: { type: String },
    primaryColor: { type: String, default: "#2563EB" },
    secondaryColor: { type: String, default: "#7C3AED" },
    footerText: { type: String, default: "© 2026 NextGen Digital. All rights reserved." },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" }
    },
    contactDetails: {
      phone: { type: String, default: "+91 6209424989" },
      whatsapp: { type: String, default: "https://wa.me/916209424989" },
      email: { type: String, default: "contact@nextgendigital.com" },
      address: { type: String, default: "Mumbai, India" }
    }
  },
  { timestamps: true }
);

const MongooseSettings = mongoose.model("Settings", settingsSchema);
export default getFallbackModel("settings", MongooseSettings);
