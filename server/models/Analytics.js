import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const visitorLogSchema = new mongoose.Schema(
  {
    ip: { type: String },
    userAgent: { type: String },
    country: { type: String, default: "India" },
    city: { type: String, default: "Unknown" },
    device: { type: String, default: "Desktop" },
    browser: { type: String, default: "Chrome" },
    path: { type: String, default: "/" },
    referrer: { type: String, default: "Direct" },
    eventType: { type: String, enum: ["pageview", "lead_submission", "whatsapp_click", "phone_click", "portfolio_view"], default: "pageview" },
    eventDetails: { type: String }
  },
  { timestamps: true }
);

const MongooseVisitorLog = mongoose.model("VisitorLog", visitorLogSchema);
export default getFallbackModel("analytics", MongooseVisitorLog);
