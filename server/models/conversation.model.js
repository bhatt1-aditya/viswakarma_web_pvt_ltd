import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    isGroup: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "group",
    },
    name: {
      type: String,
      default: "Project Workspace Channel",
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        roleName: {
          type: String,
          default: "member",
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
