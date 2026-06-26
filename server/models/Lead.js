import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String },
    message: { type: String },
    status: { type: String, enum: ["New", "Contacted", "Proposal Sent", "Won", "Lost"], default: "New" }
  },
  { timestamps: true }
);

const MongooseLead = mongoose.model("Lead", leadSchema);
export default getFallbackModel("leads", MongooseLead);
