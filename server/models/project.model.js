import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
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
            required: true,
        },

        location: {
            address: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            pincode: { type: String },
        },

        description: {
            type: String,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Project", projectSchema);