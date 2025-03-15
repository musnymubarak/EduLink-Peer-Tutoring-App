const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { auth, isStudent, isTutor, isAdmin } = require("../middlewares/authMiddleware");

// Route to send a class request (Student only)
router.post("/send-request/:courseId", auth, isStudent, classController.sendClassRequest);

// Route to handle tutor's decision on a class request (Tutor only)
router.post("/handle-request/:requestId", auth, isTutor, classController.handleClassRequest);

// Route to get class requests for the tutor (Tutor only)
router.get("/class-requests", auth, isTutor, classController.getClassRequestsForTutor);

// Student-only: Get Class Requests (Pending)
router.get("/student/class-requests", auth, isStudent, classController.getStudentClassRequests);

// Student-only: Get Accepted Classes (Personal & Group)
router.get("/student/accepted-classes", auth, isStudent, classController.getAcceptedClasses);

// Admin-only: Create a Group Class
router.post("/create-group-class/:courseId", auth, isTutor, classController.createGroupClass);

module.exports = router;