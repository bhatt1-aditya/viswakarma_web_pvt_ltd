import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      default: "All",
      trim: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
    },
    requirement: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "Website",
    },
    status: {
      type: String,
      enum: [
        // Legacy support
        "Pending",
        "Interested",
        "Not Interested",
        "Follow-up",
        "Closed",
        // Enterprise Lifecycle statuses
        "NEW",
        "ASSIGNED",
        "CONTACTED",
        "INTERESTED",
        "FOLLOW_UP",
        "NEGOTIATION",
        "DEAL_CONFIRMED",
        "REJECTED",
      ],
      default: "NEW",
      index: true,
    },

    notes: [
      {
        text: String,
        callOutcome: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    followUpDate: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Deal Confirmation Workflow
    dealDetails: {
      dealValue: { type: Number, default: 0 },
      advanceAmount: { type: Number, default: 0 },
      projectScope: { type: String, default: "" },
      category: { type: String, default: "Web Development" },
      estimatedDays: { type: Number, default: 30 },
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      submittedAt: { type: Date },
      status: {
        type: String,
        enum: ["NONE", "PENDING_APPROVAL", "APPROVED", "REJECTED"],
        default: "NONE",
      },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approvedAt: { type: Date },
      rejectionReason: { type: String, default: "" },
      createdClientId: { type: String },
      createdClientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lead", leadSchema);
