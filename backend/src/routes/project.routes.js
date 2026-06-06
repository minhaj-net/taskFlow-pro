/**
 * routes/project.routes.js - Project CRUD + member management + file attachments
 */

const express = require("express");
const router = express.Router();

const {
  getAllProjects, getProjectById, createProject,
  updateProject, deleteProject, getProjectsByMember,
} = require("../controllers/project.controller");

const {
  getFiles, getFileById, uploadFile, deleteFile,
  addMember, removeMember,
} = require("../controllers/projectFile.controller");

const { protect } = require("../middleware/auth.middleware");

router.use(protect);

// ── Core CRUD ──────────────────────────────────────────────────
router.route("/").get(getAllProjects).post(createProject);
router.get("/member/:userId", getProjectsByMember);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

// ── Member management ──────────────────────────────────────────
router.post("/:projectId/members",           addMember);
router.delete("/:projectId/members/:userId", removeMember);

// ── File attachments ───────────────────────────────────────────
router.route("/:projectId/files").get(getFiles).post(uploadFile);
router.route("/:projectId/files/:fileId").get(getFileById).delete(deleteFile);

module.exports = router;
