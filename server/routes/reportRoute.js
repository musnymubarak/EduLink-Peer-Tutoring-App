const express = require("express");
const { createReport, getReportsByCourse, getReportsByUser } = require("../controllers/reportController");
const { auth, isStudent } = require("../middlewares/authMiddleware");
const { isEnrolledInCourse } = require("../middlewares/courseMiddleware");

const router = express.Router();

router.post(
  "/:courseId",
  auth,
  isStudent,
  createReport
);

router.get("/:courseId", getReportsByCourse);

router.get("/user/:userId", getReportsByUser);

module.exports = router;
