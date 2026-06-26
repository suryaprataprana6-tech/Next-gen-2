import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Company/Project Name
    industry: { type: String },
    feedback: { type: String, required: true }, // Review Text
    rating: { type: Number, default: 5 },
    url: { type: String }, // Website Link
    initials: { type: String }, // For dynamic logo badge
    gradient: { type: String }, // For dynamic logo gradient
    iconName: { type: String }, // For dynamic overlay icon
    logoUrl: { type: String }, // In case they upload a custom file
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

const MongooseTestimonial = mongoose.model("Testimonial", testimonialSchema);
export default getFallbackModel("testimonials", MongooseTestimonial);
