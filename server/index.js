import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { aiRateLimiter } from "./services/aiService.js";
import dotenv from "dotenv";
import curateResourcesRouter from "./routes/curateResources.js";
import generatePlanRouter from "./routes/generatePlan.js";
import pdfChatRouter from "./routes/pdfChat.js";
import rateLimit from "express-rate-limit";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
// Load environment variables
dotenv.config();

// Ensure required directories exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!existsSync(uploadsDir)) {
  await mkdir(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy - required for rate limiting behind reverse proxies
app.set("trust proxy", 1);
app.use(express.json({ limit: '10mb' }));
app.use(helmet());

// Parse CORS origins from env or use defaults
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-internal-secret"],
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
  // Add trusted proxy configuration
  trustProxy: true,
});

// Apply rate limiter to all routes
app.use(limiter);

// Apply rate limiter to AI-related routes
app.use("/api/resources", aiRateLimiter);
app.use("/api/study-plan", aiRateLimiter);

// Basic health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "AcademicIQ API is running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Internal API secret middleware — only allows requests from Next.js backend
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;
function requireInternalSecret(req, res, next) {
  if (!INTERNAL_SECRET) {
    // If no secret configured, log warning and allow (dev mode)
    console.warn("WARNING: INTERNAL_API_SECRET is not set. Skipping internal auth check.");
    return next();
  }
  const provided = req.headers["x-internal-secret"];
  if (provided !== INTERNAL_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

app.use("/generate-plan", requireInternalSecret, generatePlanRouter);
app.use("/curate-resources", requireInternalSecret, curateResourcesRouter);
app.use("/pdf", requireInternalSecret, pdfChatRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
