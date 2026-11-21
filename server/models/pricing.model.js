import mongoose from "mongoose";

const pricingTierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    badge: { type: String, default: "For Startups & SMBs" },
    highlight: { type: Boolean, default: false },
    price: { type: String, default: "Custom Scope" },
    tagline: { type: String, default: "" },
    features: [{ type: String }],
    cta: { type: String, default: "Request Consultation" },
    ctaLink: { type: String, default: "/quote" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const pricingFaqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true, trim: true },
    a: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PricingTier = mongoose.model("PricingTier", pricingTierSchema);
export const PricingFaq = mongoose.model("PricingFaq", pricingFaqSchema);
