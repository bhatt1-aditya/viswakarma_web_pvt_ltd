import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    state: { type: String, default: "All", trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

    permissions: {
      sidebar: {
        dashboard: { type: Boolean, default: true },
        telecaller: { type: Boolean, default: false },
        homeControl: { type: Boolean, default: false },
        aboutControl: { type: Boolean, default: false },
        staff: { type: Boolean, default: false },
        leads: { type: Boolean, default: false },
        projects: { type: Boolean, default: false },
      },

      buttons: {
        homeControl: {
          edit: { type: Boolean, default: false },
          deploy: { type: Boolean, default: false },
          publish: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
        aboutControl: {
          edit: { type: Boolean, default: false },
          deploy: { type: Boolean, default: false },
          publish: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
        telecaller: {
          call: { type: Boolean, default: true },
          updateStatus: { type: Boolean, default: true },
          addNote: { type: Boolean, default: true },
          delete: { type: Boolean, default: false },
        },
        staff: {
          add: { type: Boolean, default: false },
          edit: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
        leads: {
          add: { type: Boolean, default: false },
          edit: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
          assign: { type: Boolean, default: false },
        },
        projects: {
          add: { type: Boolean, default: false },
          view: { type: Boolean, default: false },
          edit: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    },
  },
  { timestamps: true }
);

// HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
