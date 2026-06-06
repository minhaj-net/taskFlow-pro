/**
 * utils/notificationHelper.js
 * Helper to create role-based notifications automatically.
 * Called from controllers whenever key events happen.
 *
 * ROLE RULES:
 *  member  → gets: task_assigned, task_updated, task_overdue,
 *                   project_updated, project_completed, member_removed,
 *                   deadline_reminder, role_changed
 *
 *  manager → gets: task_completed, project_created, member_joined,
 *                   task_overdue (for their team), + everything member gets
 *                   for projects they own
 *
 *  admin   → gets: everything — full visibility
 */

const Notification = require("../models/Notification");
const User         = require("../models/User");

/**
 * Create a single notification for one user.
 */
async function createNotification({
  userId,
  type,
  title,
  message,
  link = "/dashboard",
  triggeredBy = null,
  triggeredByName = null,
}) {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      triggeredBy,
      triggeredByName,
    });
  } catch (err) {
    console.error("Notification create error:", err.message);
  }
}

/**
 * Notify all users matching a set of roles.
 * Excludes the triggering user (don't notify yourself).
 */
async function notifyByRoles({ roles, type, title, message, link, triggeredById, triggeredByName }) {
  try {
    const users = await User.find({ role: { $in: roles } }).select("_id");
    const promises = users
      .filter((u) => u._id.toString() !== (triggeredById || ""))
      .map((u) =>
        createNotification({
          userId:          u._id.toString(),
          type,
          title,
          message,
          link,
          triggeredBy:     triggeredById || null,
          triggeredByName: triggeredByName || null,
        })
      );
    await Promise.all(promises);
  } catch (err) {
    console.error("notifyByRoles error:", err.message);
  }
}

/**
 * Notify a specific list of userIds.
 */
async function notifyUsers({ userIds, type, title, message, link, triggeredById, triggeredByName }) {
  try {
    const promises = userIds
      .filter((id) => id !== triggeredById)
      .map((userId) =>
        createNotification({
          userId,
          type,
          title,
          message,
          link,
          triggeredBy:     triggeredById,
          triggeredByName: triggeredByName,
        })
      );
    await Promise.all(promises);
  } catch (err) {
    console.error("notifyUsers error:", err.message);
  }
}

// ─── Domain-specific helpers ──────────────────────────────────────────────────

/**
 * Task assigned → notify assignee
 */
async function onTaskAssigned({ assigneeId, taskTitle, taskId, projectId, triggeredById, triggeredByName }) {
  await createNotification({
    userId:          assigneeId,
    type:            "task_assigned",
    title:           "New Task Assigned",
    message:         `You have been assigned a new task: "${taskTitle}"`,
    link:            `/dashboard/tasks/${taskId}`,
    triggeredBy:     triggeredById,
    triggeredByName,
  });

  // Also notify admin + manager
  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "task_assigned",
    title:           "Task Assigned",
    message:         `${triggeredByName} assigned "${taskTitle}" to a team member`,
    link:            `/dashboard/tasks/${taskId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Task completed → notify manager + admin
 */
async function onTaskCompleted({ taskTitle, taskId, memberIds, triggeredById, triggeredByName }) {
  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "task_completed",
    title:           "Task Completed",
    message:         `${triggeredByName} marked "${taskTitle}" as completed`,
    link:            `/dashboard/tasks/${taskId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Task updated → notify assignee
 */
async function onTaskUpdated({ assigneeId, taskTitle, taskId, triggeredById, triggeredByName }) {
  if (assigneeId && assigneeId !== triggeredById) {
    await createNotification({
      userId:          assigneeId,
      type:            "task_updated",
      title:           "Task Updated",
      message:         `Your task "${taskTitle}" has been updated`,
      link:            `/dashboard/tasks/${taskId}`,
      triggeredBy:     triggeredById,
      triggeredByName,
    });
  }
}

/**
 * Project created → notify admin + manager
 */
async function onProjectCreated({ projectName, projectId, memberIds, triggeredById, triggeredByName }) {
  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "project_created",
    title:           "New Project Created",
    message:         `${triggeredByName} created a new project: "${projectName}"`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });

  // Also notify assigned members
  await notifyUsers({
    userIds:         memberIds || [],
    type:            "project_updated",
    title:           "You've Been Added to a Project",
    message:         `You are now a member of project "${projectName}"`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Project updated → notify all project members
 */
async function onProjectUpdated({ projectName, projectId, memberIds, triggeredById, triggeredByName }) {
  await notifyUsers({
    userIds:         memberIds || [],
    type:            "project_updated",
    title:           "Project Updated",
    message:         `Project "${projectName}" has been updated`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Project completed → notify all members + admin/manager
 */
async function onProjectCompleted({ projectName, projectId, memberIds, triggeredById, triggeredByName }) {
  const allTargets = [...(memberIds || [])];

  await notifyUsers({
    userIds:         allTargets,
    type:            "project_completed",
    title:           "🎉 Project Completed!",
    message:         `Project "${projectName}" has been marked as completed`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });

  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "project_completed",
    title:           "Project Completed",
    message:         `${triggeredByName} completed project "${projectName}"`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Member added to project → notify manager + admin, and the member
 */
async function onMemberAdded({ memberName, memberId, projectName, projectId, triggeredById, triggeredByName }) {
  // Notify the added member
  if (memberId !== triggeredById) {
    await createNotification({
      userId:          memberId,
      type:            "member_joined",
      title:           "Added to Project",
      message:         `You have been added to project "${projectName}"`,
      link:            `/dashboard/projects/${projectId}`,
      triggeredBy:     triggeredById,
      triggeredByName,
    });
  }

  // Notify admin + manager
  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "member_joined",
    title:           "Member Added",
    message:         `${triggeredByName} added ${memberName} to project "${projectName}"`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Member removed from project → notify the removed member
 */
async function onMemberRemoved({ memberId, memberName, projectName, projectId, triggeredById, triggeredByName }) {
  if (memberId !== triggeredById) {
    await createNotification({
      userId:          memberId,
      type:            "member_removed",
      title:           "Removed from Project",
      message:         `You have been removed from project "${projectName}"`,
      link:            `/dashboard/projects`,
      triggeredBy:     triggeredById,
      triggeredByName,
    });
  }

  await notifyByRoles({
    roles:           ["admin", "manager"],
    type:            "member_removed",
    title:           "Member Removed",
    message:         `${triggeredByName} removed ${memberName} from "${projectName}"`,
    link:            `/dashboard/projects/${projectId}`,
    triggeredById,
    triggeredByName,
  });
}

/**
 * Role changed → notify the affected user
 */
async function onRoleChanged({ targetUserId, targetUserName, oldRole, newRole, triggeredById, triggeredByName }) {
  await createNotification({
    userId:          targetUserId,
    type:            "role_changed",
    title:           "Your Role Has Changed",
    message:         `Your role has been updated from "${oldRole}" to "${newRole}"`,
    link:            `/dashboard`,
    triggeredBy:     triggeredById,
    triggeredByName,
  });
}

/**
 * New user registered → notify admin
 */
async function onUserRegistered({ newUserName, triggeredById }) {
  await notifyByRoles({
    roles:           ["admin"],
    type:            "member_joined",
    title:           "New Member Registered",
    message:         `${newUserName} has created an account and joined the platform`,
    link:            `/dashboard/users`,
    triggeredById:   triggeredById || "",
    triggeredByName: newUserName,
  });
}

module.exports = {
  createNotification,
  notifyByRoles,
  notifyUsers,
  onTaskAssigned,
  onTaskCompleted,
  onTaskUpdated,
  onProjectCreated,
  onProjectUpdated,
  onProjectCompleted,
  onMemberAdded,
  onMemberRemoved,
  onRoleChanged,
  onUserRegistered,
};
