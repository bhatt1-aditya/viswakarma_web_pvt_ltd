import mongoose from "mongoose";

const bugReportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    bugId: {
      type: String,
      unique: true,
      required: true, // e.g. "BUG-2026-0001"
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    stepsToReproduce: {
      type: String,
      default: "",
    },
    expectedBehavior: {
      type: String,
      default: "",
    },
    actualBehavior: {
      type: String,
      default: "",
    },
    screenshots: [
      {
        type: String,
      },
    ],
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "FIXED", "RETESTING", "CLOSED", "REOPENED"],
      default: "OPEN",
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDeveloper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
    retestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    retestedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BugReport", bugReportSchema);
