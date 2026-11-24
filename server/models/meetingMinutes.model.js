import mongoose from "mongoose";

const actionItemSchema = new mongoose.Schema({
  taskText: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedToName: String,
  deadline: Date,
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const meetingMinutesSchema = new mongoose.Schema(
  {
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
      unique: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discussionPoints: {
      type: [String],
      default: [],
    },
    clientDecisions: {
      type: [String],
      default: [],
    },
    actionItems: {
      type: [actionItemSchema],
      default: [],
    },
    nextMeetingDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
    isPublishedToClient: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MeetingMinutes", meetingMinutesSchema);
