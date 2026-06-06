/**
 * controllers/projectFile.controller.js
 * File attachment CRUD for projects.
 * Uses base64 encoding — suitable for an MVP (no disk/S3 setup needed).
 */

const ProjectFile = require("../models/ProjectFile");
const { onMemberAdded, onMemberRemoved } = require("../utils/notificationHelper");

// ── GET /api/projects/:projectId/files ────────────────────────
const getFiles = async (req, res, next) => {
  try {
    const files = await ProjectFile.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 })
      .select("-data"); // exclude base64 in list

    res.status(200).json({ success: true, count: files.length, data: files });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/projects/:projectId/files/:fileId ────────────────
// Returns full base64 data for download
const getFileById = async (req, res, next) => {
  try {
    const file = await ProjectFile.findOne({
      _id: req.params.fileId,
      projectId: req.params.projectId,
    });

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/projects/:projectId/files ───────────────────────
// Accepts: { name, mimeType, size, data (base64) }
const uploadFile = async (req, res, next) => {
  try {
    const { name, mimeType, size, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({
        success: false,
        message: "name and data (base64) are required",
      });
    }

    // 10 MB limit (base64 is ~33% larger than binary)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (size && size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 10 MB",
      });
    }

    const file = await ProjectFile.create({
      projectId:     req.params.projectId,
      name,
      originalName:  name,
      size:          size || 0,
      mimeType:      mimeType || "application/octet-stream",
      uploadedBy:    req.user._id.toString(),
      uploadedByName: req.user.name,
      data,
    });

    // Return without base64 data in response
    const { data: _d, ...fileJson } = file.toJSON();

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: { ...fileJson, id: file._id.toString() },
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/projects/:projectId/files/:fileId ─────────────
const deleteFile = async (req, res, next) => {
  try {
    const file = await ProjectFile.findOne({
      _id: req.params.fileId,
      projectId: req.params.projectId,
    });

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Only uploader or admin can delete
    if (
      file.uploadedBy !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this file",
      });
    }

    await file.deleteOne();
    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/projects/:projectId/members ─────────────────────
// Add a member to the project
const addMember = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.memberIds.includes(userId)) {
      return res.status(409).json({ success: false, message: "User is already a member" });
    }

    project.memberIds.push(userId);
    await project.save();

    res.status(200).json({ success: true, message: "Member added", data: project });

    // Auto-notify
    const User = require("../models/User");
    const addedUser = await User.findById(userId).select("name");
    onMemberAdded({
      memberId:        userId,
      memberName:      addedUser?.name ?? "Unknown",
      projectName:     project.name,
      projectId:       project._id.toString(),
      triggeredById:   req.user._id.toString(),
      triggeredByName: req.user.name,
    }).catch(() => {});
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/projects/:projectId/members/:userId ───────────
// Remove a member from the project
const removeMember = async (req, res, next) => {
  try {
    const Project = require("../models/Project");
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.memberIds = project.memberIds.filter(
      (id) => id !== req.params.userId
    );
    await project.save();

    res.status(200).json({ success: true, message: "Member removed", data: project });

    const User = require("../models/User");
    const removedUser = await User.findById(req.params.userId).select("name");
    onMemberRemoved({
      memberId:        req.params.userId,
      memberName:      removedUser?.name ?? "Unknown",
      projectName:     project.name,
      projectId:       project._id.toString(),
      triggeredById:   req.user._id.toString(),
      triggeredByName: req.user.name,
    }).catch(() => {});
  } catch (error) {
    next(error);
  }
};

module.exports = { getFiles, getFileById, uploadFile, deleteFile, addMember, removeMember };
