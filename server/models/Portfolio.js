import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clientName: { type: String },
    url: { type: String },
    category: { type: String },
    description: { type: String },
    images: [{ type: String }],
    completionDate: { type: Date },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

const MongoosePortfolio = mongoose.model("Portfolio", portfolioSchema);
export default getFallbackModel("portfolios", MongoosePortfolio);
