/**
 * controllers/task.controller.js
 * Full CRUD for tasks — GET all, GET by id, GET by project,
 * GET by assignee, POST, PUT, DELETE
 */

const Task = require("../models/Task");
const {
  onTaskAssigned, onTaskCompleted, onTaskUpdated,
} = require("../utils/notificationHelper");

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/project/:projectId ───────────────────────────────────────
const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/assignee/:userId ─────────────────────────────────────────
const getTasksByAssignee = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assigneeId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assigneeId, priority, status, dueDate } = req.body;

    if (!title || !description || !projectId || !assigneeId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "title, description, projectId, assigneeId, and dueDate are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assigneeId,
      priority: priority || "medium",
      status: status || "todo",
      dueDate,
      comments: [],
    });

    // Auto-notify assignee + managers/admins
    await onTaskAssigned({
      assigneeId,
      taskTitle:       title,
      taskId:          task._id.toString(),
      projectId,
      triggeredById:   req.user._id.toString(),
      triggeredByName: req.user.name,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, assigneeId, priority, status, dueDate, comments } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Capture OLD values before mutation
    const oldStatus    = task.status;
    const oldAssigneeId = task.assigneeId;

    // Only update provided fields
    if (title       !== undefined) task.title       = title;
    if (description !== undefined) task.description = description;
    if (assigneeId  !== undefined) task.assigneeId  = assigneeId;
    if (priority    !== undefined) task.priority    = priority;
    if (status      !== undefined) task.status      = status;
    if (dueDate     !== undefined) task.dueDate     = dueDate;
    if (comments    !== undefined) task.comments    = comments;

    const updated = await task.save();

    // Auto-notify using OLD values for comparison
    const newAssigneeId = updated.assigneeId;
    if (status === "completed" && oldStatus !== "completed") {
      // Task just completed
      await onTaskCompleted({
        taskTitle:       updated.title,
        taskId:          updated._id.toString(),
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      });
    } else if (assigneeId && assigneeId !== oldAssigneeId) {
      // Reassigned
      await onTaskAssigned({
        assigneeId:      newAssigneeId,
        taskTitle:       updated.title,
        taskId:          updated._id.toString(),
        projectId:       updated.projectId,
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      });
    } else {
      // General update — notify current assignee
      await onTaskUpdated({
        assigneeId:      updated.assigneeId,
        taskTitle:       updated.title,
        taskId:          updated._id.toString(),
        triggeredById:   req.user._id.toString(),
        triggeredByName: req.user.name,
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByProject,
  getTasksByAssignee,
  createTask,
  updateTask,
  deleteTask,
};
