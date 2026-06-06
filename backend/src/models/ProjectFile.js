/**
 * models/ProjectFile.js
 * Stores file metadata per project. Actual file content stored as base64
 * or just metadata for a realistic file management system.
 */

const mongoose = require("mongoose");

const projectFileSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: [true, "Project ID is required"],
    },
    name: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // bytes
      required: true,
    },
    mimeType: {
      type: String,
      default: "application/octet-stream",
    },
    uploadedBy: {
      type: String, // userId
      required: true,
    },
    uploadedByName: {
      type: String,
      required: true,
    },
    // Base64 data — for small files in a demo/MVP context
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

projectFileSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Don't return base64 data in list queries — only in single file fetch
    if (ret.data && ret.data.length > 100) {
      delete ret.data;
    }
    if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
    if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
    return ret;
  },
});

const ProjectFile = mongoose.model("ProjectFile", projectFileSchema);

module.exports = ProjectFile;
