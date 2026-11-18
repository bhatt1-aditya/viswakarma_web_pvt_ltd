import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    idNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categorySlug: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    overview: { type: String, required: true },
    businessProblemsSolved: [{ type: String }],
    features: [{ type: String }],
    developmentApproach: [{ type: String }],
    techStack: [{ type: String }],
    deliverables: [{ type: String }],
    demoSlug: { type: String, default: "" },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
