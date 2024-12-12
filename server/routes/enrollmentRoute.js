const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { enrollInCourse, unenrollFromCourse } = require("../controllers/enrollmentController");

// Enroll in a course
router.post("/enroll/:courseId", auth, enrollInCourse);

// Unenroll from a course
router.post("/unenroll/:courseId", auth, unenrollFromCourse);

module.exports = router;