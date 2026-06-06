/**
 * routes/task.routes.js - Task CRUD routes
 */

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  getTasksByProject,
  getTasksByAssignee,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const { protect } = require("../middleware/auth.middleware");

// All task routes require a valid JWT
router.use(protect);

// NOTE: specific sub-routes must come BEFORE /:id to avoid param conflicts

// GET  /api/tasks/project/:projectId  — tasks for a project
router.get("/project/:projectId", getTasksByProject);

// GET  /api/tasks/assignee/:userId    — tasks for a user
router.get("/assignee/:userId", getTasksByAssignee);

// GET  /api/tasks                     — all tasks
// POST /api/tasks                     — create task
router.route("/").get(getAllTasks).post(createTask);

// GET    /api/tasks/:id               — single task
// PUT    /api/tasks/:id               — update task
// DELETE /api/tasks/:id               — delete task
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
