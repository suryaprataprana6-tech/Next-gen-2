import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    featuredImage: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" }
  },
  { timestamps: true }
);

const MongooseBlog = mongoose.model("Blog", blogSchema);
export default getFallbackModel("blogs", MongooseBlog);
