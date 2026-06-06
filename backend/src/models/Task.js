/**
 * models/Task.js - Mongoose Task model
 * Matches the Task interface from the frontend types exactly.
 */

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true },
    content:   { type: String, required: true, trim: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: true }
);

commentSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    projectId: {
      type: String,
      required: [true, "Project ID is required"],
    },
    assigneeId: {
      type: String,
      required: [true, "Assignee ID is required"],
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    dueDate: {
      type: String, // ISO date string — keeps parity with frontend type
      required: [true, "Due date is required"],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// ── toJSON: expose _id as "id", clean up __v ──────────────────────────────────
taskSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
    if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
    return ret;
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
