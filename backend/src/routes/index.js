/**
 * routes/index.js - Central route registry
 * Mount all feature routers here. Prefix all API routes with /api in app.js.
 */

const express = require("express");
const router = express.Router();

const authRoutes         = require("./auth.routes");
const projectRoutes      = require("./project.routes");
const taskRoutes         = require("./task.routes");
const userRoutes         = require("./user.routes");
const activityRoutes     = require("./activity.routes");
const notificationRoutes = require("./notification.routes");

router.use("/auth",          authRoutes);
router.use("/projects",      projectRoutes);
router.use("/tasks",         taskRoutes);
router.use("/users",         userRoutes);
router.use("/activities",    activityRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
