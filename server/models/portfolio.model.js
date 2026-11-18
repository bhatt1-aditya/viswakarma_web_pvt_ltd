import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    clientIndustry: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    deliverables: [{ type: String }],
    results: [{ type: String }],
    image: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
