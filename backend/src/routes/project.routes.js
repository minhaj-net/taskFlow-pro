/**
 * routes/project.routes.js - Project CRUD routes
 */

const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByMember,
} = require("../controllers/project.controller");

const { protect } = require("../middleware/auth.middleware");

// All project routes require a valid JWT
router.use(protect);

// GET  /api/projects                  — list all projects
// POST /api/projects                  — create new project
router.route("/").get(getAllProjects).post(createProject);

// GET  /api/projects/member/:userId   — projects for a specific member
// NOTE: must be defined BEFORE /:id to avoid "member" being treated as an id
router.get("/member/:userId", getProjectsByMember);

// GET    /api/projects/:id            — single project
// PUT    /api/projects/:id            — update project
// DELETE /api/projects/:id            — delete project
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

module.exports = router;
