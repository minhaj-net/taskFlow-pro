/**
 * routes/user.routes.js - User management routes (admin only)
 */

const express = require("express");
const router = express.Router();

const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// All routes require login + admin role
router.use(protect);
router.use(authorize("admin"));

// GET  /api/users        — all users
// (no POST — registration is via /api/auth/register)
router.get("/", getAllUsers);

// GET    /api/users/:id  — single user
// PUT    /api/users/:id  — update role / status
// DELETE /api/users/:id  — remove user
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
