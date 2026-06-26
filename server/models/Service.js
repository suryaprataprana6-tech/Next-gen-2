import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    icon: { type: String }, // name of Lucide React Icon (e.g. "Globe", "Search")
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

const MongooseService = mongoose.model("Service", serviceSchema);
export default getFallbackModel("services", MongooseService);
