import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dns from "node:dns";
import routes from "./routes/all.routes.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/socketHandler.js";
import { seedDefaultRoles } from "./utils/seedRoles.js";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("DNS configuration note:", e.message);
}

const app = express();
const httpServer = http.createServer(app);

// CONNECT DB & SEED ROLES
connectDB().then(() => {
  seedDefaultRoles();
}).catch(() => {});

// MIDDLEWARES
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
];

// INITIALIZE SOCKET.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  },
});

initSocket(io);
app.set("io", io);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Attach io to all incoming requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    company: "Vishwakarma Web Private Limited",
    status: "Operational",
    apiVersion: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API ROUTES
app.use("/api", routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// SERVER START
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Vishwakarma Web API & Realtime Socket running on http://localhost:${PORT}`);
});

export default app;
