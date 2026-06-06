/**
 * models/Notification.js
 * Role-based notification system.
 * Each notification targets a specific user (userId).
 */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "task_assigned",      // member: a task was assigned to you
        "task_completed",     // manager/admin: a task was completed
        "task_updated",       // member: your task was updated
        "task_overdue",       // member+manager: task is past due
        "project_created",    // manager/admin: new project created
        "project_updated",    // member: project you belong to was updated
        "project_completed",  // all members: project marked complete
        "member_joined",      // manager/admin: new member joined
        "member_removed",     // affected user: removed from project
        "deadline_reminder",  // member: task due soon
        "role_changed",       // affected user: your role was changed
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "/dashboard",
    },
    // Who triggered the notification
    triggeredBy: {
      type: String, // userId
      default: null,
    },
    triggeredByName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.set("toJSON", {
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

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
