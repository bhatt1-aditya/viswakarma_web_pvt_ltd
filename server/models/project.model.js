import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Common / Core Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: String,
      sparse: true,
      unique: true,
      index: true, // e.g. "VK-PRJ-2026-0001"
    },
    category: {
      type: String,
      default: "Web Development",
    },
    description: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },

    // Client Relationship
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Team Assignments
    assignedTelecaller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedProjectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedDevelopers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedQATester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Dates & Priority
    startDate: {
      type: Date,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    // Financials
    contractAmount: {
      type: Number,
      default: 0,
    },
    advancePaid: {
      type: Number,
      default: 0,
    },

    // Lifecycle Statuses
    lifecycleStatus: {
      type: String,
      enum: [
        "NOT_STARTED",
        "PLANNING",
        "IN_PROGRESS",
        "ON_HOLD",
        "UNDER_REVIEW",
        "TESTING",
        "CLIENT_APPROVAL",
        "COMPLETED",
        "DELIVERED",
      ],
      default: "NOT_STARTED",
      index: true,
    },

    // Milestones
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        targetDate: { type: Date },
        amount: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "APPROVED"],
          default: "PENDING",
        },
        clientApproval: { type: Boolean, default: false },
        clientApprovedAt: { type: Date },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    // Documents & Artifacts
    documents: [
      {
        title: String,
        fileUrl: String,
        fileType: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
        visibleToClient: { type: Boolean, default: true },
      },
    ],

    // Socket.io Real-time Workspace Room
    workspaceRoom: {
      type: String,
    },

    // Backward Compatibility fields with existing Real Estate / Legacy schema
    photos: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    brochure: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
