/**
 * app.js - Express application setup
 * Configures all middleware and mounts routes.
 */

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const routes = require("./routes/index");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────

// Set secure HTTP headers
app.use(helmet());

// Enable CORS — allow both Vercel deployment and local dev
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://taskflowpro12.vercel.app',
  'https://frontend-obwqapxkj-minhajs-projects-50f18244.vercel.app',
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
);

// Global rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use(limiter);

// ─── General Middleware ───────────────────────────────────────────────────────

// HTTP request logger (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// ─── API Health Check ─────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully",
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api", routes);

// ─── Error Handling ───────────────────────────────────────────────────────────

// Handle 404 — must come after all routes
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
