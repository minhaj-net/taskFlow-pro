/**
 * controllers/activity.controller.js
 * GET all, GET by role, GET by user, POST (log activity)
 */

const Activity = require("../models/Activity");

// ─── GET /api/activities ──────────────────────────────────────────────────────
// Returns all activities — admin & manager only
const getAllActivities = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/activities/role/:role ───────────────────────────────────────────
// Returns activities filtered by user role (admin/manager/member)
const getActivitiesByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const validRoles = ["admin", "manager", "member"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const activities = await Activity.find({ userRole: role })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      role,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/activities/user/:userId ─────────────────────────────────────────
// Returns activities for a specific user
const getActivitiesByUser = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/activities ─────────────────────────────────────────────────────
// Log a new activity — called automatically from frontend after mutations
const logActivity = async (req, res, next) => {
  try {
    const { userId, userName, userRole, action, entityType, entityName, entityId } = req.body;

    if (!userId || !userName || !userRole || !action || !entityType || !entityName || !entityId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: userId, userName, userRole, action, entityType, entityName, entityId",
      });
    }

    const activity = await Activity.create({
      userId,
      userName,
      userRole,
      action,
      entityType,
      entityName,
      entityId,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/activities/:id ───────────────────────────────────────────────
// Admin only — delete a single log
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }
    await activity.deleteOne();
    res.status(200).json({ success: true, message: "Activity deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllActivities,
  getActivitiesByRole,
  getActivitiesByUser,
  logActivity,
  deleteActivity,
};
