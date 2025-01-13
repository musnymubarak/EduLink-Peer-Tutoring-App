const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { auth, isStudent, isTutor } = require("../middlewares/authMiddleware");

// Route to send a class request (Student only)
router.post("/send-request/:courseId", auth, isStudent, classController.sendClassRequest);

// Route to handle tutor's decision on a class request (Tutor only)
router.post("/handle-request", auth, isTutor, classController.handleClassRequest);

module.exports = router;
