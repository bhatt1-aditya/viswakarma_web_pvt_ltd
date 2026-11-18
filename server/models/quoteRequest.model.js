import mongoose from "mongoose";

const quoteRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    state: { type: String, default: "All", trim: true },
    companyName: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    serviceName: { type: String, default: "" },
    projectBudget: { type: String, default: "" },
    timeline: { type: String, default: "" },
    projectDescription: { type: String, required: true },
    estimatedPriceRange: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "In Review", "Contacted", "Proposal Sent", "Closed"],
      default: "New",
    },
    notes: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("QuoteRequest", quoteRequestSchema);
