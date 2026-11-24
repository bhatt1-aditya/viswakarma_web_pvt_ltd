import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      default: "",
    },
    senderRole: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, default: "attachment" },
        fileType: { type: String, default: "" },
        sizeBytes: { type: Number, default: 0 },
      },
    ],
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName: { type: String },
        emoji: { type: String, required: true },
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
