/**
 * controllers/user.controller.js
 * Admin-level user management — GET all, GET by id, PUT (role/status), DELETE
 */

const User = require("../models/User");
const { onRoleChanged, onUserRegistered } = require("../utils/notificationHelper");

// ─── GET /api/users ───────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((u) => u.toPublicJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Admin can update: role, isActive, department, name
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive, department, name } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent admin from removing their own admin role
    if (
      req.params.id === req.user._id.toString() &&
      role &&
      role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own admin role",
      });
    }

    const oldRole = user.role;

    if (role       !== undefined) user.role       = role;
    if (isActive   !== undefined) user.isActive   = isActive;
    if (department !== undefined) user.department = department;
    if (name       !== undefined) user.name       = name;

    const updated = await user.save();

    // Notify if role changed
    if (role && role !== oldRole) {
      onRoleChanged({
        targetUserId:    updated._id.toString(),
        targetUserName:  updated.name,
        oldRole,
        newRole:         role,
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      }).catch(() => {});
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
