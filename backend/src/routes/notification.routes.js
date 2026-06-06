const express = require("express");
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

// ── IMPORTANT: specific routes must come BEFORE /:id ──────────
router.get("/",             getMyNotifications);
router.put("/read-all",     markAllAsRead);
router.delete("/clear-all", clearAll);
// ── Parameterized routes last ──────────────────────────────────
router.put("/:id/read",     markAsRead);
router.delete("/:id",       deleteNotification);

module.exports = router;
