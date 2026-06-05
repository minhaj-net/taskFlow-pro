/**
 * routes/auth.routes.js - Authentication routes
 * Maps HTTP methods + paths to controller functions.
 */

const express = require("express");
const router = express.Router();

const { register, login, getProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/auth/register — create a new account
router.post("/register", register);

// POST /api/auth/login — authenticate and receive JWT
router.post("/login", login);

// GET /api/auth/profile — get own profile (protected)
router.get("/profile", protect, getProfile);

module.exports = router;
