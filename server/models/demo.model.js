import mongoose from "mongoose";

const demoSchema = new mongoose.Schema(
  {
    demoNumber: { type: Number, required: true, unique: true },
    demoId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    route: { type: String, required: true },
    icon: { type: String, default: "LayoutDashboard" },
    features: [{ type: String }],
    relatedServices: [{ type: String }],
    active: { type: Boolean, default: true },
    metrics: {
      views: { type: Number, default: 0 },
      interactions: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Demo", demoSchema);
