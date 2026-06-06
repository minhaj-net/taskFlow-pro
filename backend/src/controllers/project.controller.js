/**
 * controllers/project.controller.js
 * Full CRUD for projects — GET all, GET by id, POST, PUT, DELETE
 */

const Project = require("../models/Project");
const {
  onProjectCreated, onProjectUpdated, onProjectCompleted,
} = require("../utils/notificationHelper");

// ─── @desc    Get all projects
// ─── @route   GET /api/projects
// ─── @access  Private
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single project by ID
// ─── @route   GET /api/projects/:id
// ─── @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Create a new project
// ─── @route   POST /api/projects
// ─── @access  Private (admin, manager)
const createProject = async (req, res, next) => {
  try {
    const { name, description, status, deadline, ownerId, memberIds } = req.body;

    if (!name || !description || !deadline || !ownerId) {
      return res.status(400).json({
        success: false,
        message: "name, description, deadline, and ownerId are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status: status || "active",
      deadline,
      ownerId,
      memberIds: memberIds || [],
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });

    // Fire notifications after response (non-blocking)
    onProjectCreated({
      projectName:     name,
      projectId:       project._id.toString(),
      memberIds:       memberIds || [],
      triggeredById:   req.user._id.toString(),
      triggeredByName: req.user.name,
    }).catch(() => {});
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update a project
// ─── @route   PUT /api/projects/:id
// ─── @access  Private (admin, manager)
const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, deadline, memberIds, taskCount, completedTaskCount } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only update fields that were actually provided
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (deadline !== undefined) project.deadline = deadline;
    if (memberIds !== undefined) project.memberIds = memberIds;
    if (taskCount !== undefined) project.taskCount = taskCount;
    if (completedTaskCount !== undefined) project.completedTaskCount = completedTaskCount;

    const updated = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });

    // Fire notifications after response
    if (status === "completed" && updated.status === "completed") {
      onProjectCompleted({
        projectName:     updated.name,
        projectId:       updated._id.toString(),
        memberIds:       updated.memberIds,
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      }).catch(() => {});
    } else {
      onProjectUpdated({
        projectName:     updated.name,
        projectId:       updated._id.toString(),
        memberIds:       updated.memberIds,
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      }).catch(() => {});
    }
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete a project
// ─── @route   DELETE /api/projects/:id
// ─── @access  Private (admin, manager)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get projects by member ID
// ─── @route   GET /api/projects/member/:userId
// ─── @access  Private
const getProjectsByMember = async (req, res, next) => {
  try {
    const projects = await Project.find({
      memberIds: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByMember,
};
