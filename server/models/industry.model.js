import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "HeartPulse" },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    keyServices: [{ type: String }],
    demoRoute: { type: String, default: "" },
    accent: { type: String, default: "from-blue-600 to-cyan-500" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Industry", industrySchema);
