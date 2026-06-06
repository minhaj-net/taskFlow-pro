/**
 * routes/activity.routes.js
 */

const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  getActivitiesByRole,
  getActivitiesByUser,
  logActivity,
  deleteActivity,
} = require("../controllers/activity.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect);

// GET  /api/activities               — all logs (admin + manager)
// POST /api/activities               — log new activity (any authenticated user)
router.get("/",  authorize("admin", "manager"), getAllActivities);
router.post("/", logActivity);

// GET /api/activities/role/:role     — by role (admin + manager)
router.get("/role/:role", authorize("admin", "manager"), getActivitiesByRole);

// GET /api/activities/user/:userId   — by user (own logs or admin/manager)
router.get("/user/:userId", getActivitiesByUser);

// DELETE /api/activities/:id         — admin only
router.delete("/:id", authorize("admin"), deleteActivity);

module.exports = router;
