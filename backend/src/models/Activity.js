/**
 * models/Activity.js - Activity log model
 * Stores every action performed by any user across the system.
 */

const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userRole: {
      type: String,
      enum: ["admin", "manager", "member"],
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "completed", "started", "assigned", "added"],
      required: true,
    },
    entityType: {
      type: String,
      enum: ["project", "task", "member"],
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
