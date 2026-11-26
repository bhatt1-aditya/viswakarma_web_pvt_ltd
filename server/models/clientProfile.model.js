import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      unique: true, // e.g. "VK-CL-2026-0001"
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    assignedTelecaller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    leadSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ClientProfile", clientProfileSchema);
