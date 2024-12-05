const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { enrollInCourse } = require("../controllers/enrollmentController");

// Enroll in a course
router.post("/enroll/:courseId", auth, enrollInCourse);

module.exports = router;