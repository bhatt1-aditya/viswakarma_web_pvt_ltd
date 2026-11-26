import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedTasks: {
      type: [String],
      default: [],
    },
    workInProgress: {
      type: [String],
      default: [],
    },
    pendingWork: {
      type: [String],
      default: [],
    },
    technicalProblems: {
      type: [String],
      default: [],
    },
    blockers: {
      type: [String],
      default: [],
    },
    timeSpentHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    screenshotUrls: {
      type: [String],
      default: [],
    },
    tomorrowsPlan: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "APPROVED", "REJECTED", "CHANGES_REQUESTED"],
      default: "SUBMITTED",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      default: "",
    },
    publishedToClient: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DailyReport", dailyReportSchema);
