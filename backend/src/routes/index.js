/**
 * routes/index.js - Central route registry
 * Mount all feature routers here. Prefix all API routes with /api in app.js.
 */

const express = require("express");
const router = express.Router();

const authRoutes    = require("./auth.routes");
const projectRoutes = require("./project.routes");

// Mount auth routes at /api/auth
router.use("/auth", authRoutes);

// Mount project routes at /api/projects
router.use("/projects", projectRoutes);

module.exports = router;
