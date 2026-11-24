import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: String,
      default: "",
    },
    meetingDate: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String, // e.g. "14:00"
      required: true,
    },
    endTime: {
      type: String, // e.g. "15:00"
    },
    meetingLink: {
      type: String, // Google Meet, Zoom, etc.
      trim: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        roleName: String,
        status: {
          type: String,
          enum: ["INVITED", "ACCEPTED", "DECLINED", "ATTENDED"],
          default: "INVITED",
        },
      },
    ],
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED"],
      default: "SCHEDULED",
    },
    meetingMinutes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeetingMinutes",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meeting", meetingSchema);
