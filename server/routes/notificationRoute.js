const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming you have an authentication middleware

// Route to fetch notifications for the logged-in user
router.get("/", authMiddleware, notificationController.getNotifications);

// Route to mark a specific notification as read
router.patch("/:notificationId/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
