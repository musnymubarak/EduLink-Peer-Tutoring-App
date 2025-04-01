const express = require("express");
const { createReport, getReportsByCourse, getReportsByUser, getAllReports } = require("../controllers/reportController");
const { auth, isStudent, isAdmin } = require("../middlewares/authMiddleware");
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

router.get('/', getAllReports, isAdmin);

module.exports = router;
