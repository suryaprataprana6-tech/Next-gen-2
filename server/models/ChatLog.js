import mongoose from "mongoose";
import { getFallbackModel } from "../config/localDb.js";

const chatLogSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "ai", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    duration: { type: Number, default: 0 }, // in seconds
    redirectedToWhatsApp: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const MongooseChatLog = mongoose.model("ChatLog", chatLogSchema);
export default getFallbackModel("chatlogs", MongooseChatLog);
