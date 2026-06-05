/**
 * middleware/error.middleware.js - Global error handler
 * Catches all errors passed via next(error) and returns a structured response.
 * Must be registered LAST in the middleware chain.
 */

const errorHandler = (err, req, res, next) => {
  // Log the full error in development for debugging
  if (process.env.NODE_ENV !== "production") {
    console.error("💥 Error:", err);
  }

  let statusCode = err.statusCode || res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: Bad ObjectId ─────────────────────────────────────────────────
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Resource not found — invalid ID: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (e.g. unique email) ────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists`;
  }

  // ── Mongoose: Validation error ─────────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // ── JWT: Invalid token ─────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // ── JWT: Expired token ─────────────────────────────────────────────────────
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired — please log in again";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
