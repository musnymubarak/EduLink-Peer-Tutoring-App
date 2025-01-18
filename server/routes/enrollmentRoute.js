const express = require("express");
const router = express.Router();
const { auth, isStudent} = require("../middlewares/authMiddleware");
const { enrollInCourse, unenrollFromCourse, getEnrolledCourses } = require("../controllers/enrollmentController");

// Enroll in a course
router.post("/enroll/:courseId", auth, enrollInCourse);

// Unenroll from a course
router.post("/unenroll/:courseId", auth, unenrollFromCourse);

// Get enrolled courses
router.get("/enrolled-courses", auth, isStudent, getEnrolledCourses);

module.exports = router;
