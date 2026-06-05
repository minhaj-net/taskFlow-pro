/**
 * middleware/notFound.middleware.js - 404 handler
 * Catches requests that don't match any defined route.
 * Must be registered AFTER all routes but BEFORE the error handler.
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Forward to the global error handler
};

module.exports = notFound;
