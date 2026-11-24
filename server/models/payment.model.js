import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true, // e.g. "INV-2026-0001"
    },
    title: {
      type: String,
      required: true, // e.g. "Milestone 1 - Initial Prototype & Wireframes"
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String, // Bank Transfer, UPI, Cheque, Razorpay, etc.
      default: "Bank Transfer",
    },
    transactionId: {
      type: String,
      default: "",
    },
    receiptUrl: {
      type: String,
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

export default mongoose.model("Payment", paymentSchema);
