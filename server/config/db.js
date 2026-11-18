import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js SRV DNS resolution on Windows for MongoDB Atlas
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("DNS server setup warning:", err.message);
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB Connection Successful to Vishwakarma DB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Don't crash process immediately in dev so server can still serve health or fallback
  }
};
