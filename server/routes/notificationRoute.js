// notificationRoute.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middlewares/authMiddleware").auth; 

router.get("/", auth, notificationController.getNotifications);  
router.patch("/:notificationId/read", auth, notificationController.markAsRead);

module.exports = router;
