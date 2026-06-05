/**
 * models/Project.js - Mongoose Project model
 * Matches the Project interface from the frontend types exactly.
 */

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    deadline: {
      type: String, // ISO date string — keeps parity with frontend type
      required: [true, "Deadline is required"],
    },
    ownerId: {
      type: String,
      required: [true, "Owner ID is required"],
    },
    memberIds: {
      type: [String],
      default: [],
    },
    taskCount: {
      type: Number,
      default: 0,
    },
    completedTaskCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ── Virtual: expose Mongoose _id as "id" for frontend compatibility ───────────
projectSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Ensure timestamps are ISO strings
    if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
    if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
    return ret;
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
