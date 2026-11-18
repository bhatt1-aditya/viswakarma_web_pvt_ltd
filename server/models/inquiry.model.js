import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    state: { type: String, default: "All", trim: true },
    companyName: { type: String, default: "" },
    serviceRequired: { type: String, default: "General Consultation" },
    projectBudget: { type: String, default: "" },
    projectTimeline: { type: String, default: "" },
    projectDescription: { type: String, required: true },
    source: { type: String, default: "Website Contact Form" },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Qualified", "Closed"],
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

export default mongoose.model("Inquiry", inquirySchema);
