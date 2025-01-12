const express = require("express");
const router = express.Router();
const {
    requestClass,
    getClassRequestsForTutor,
    updateClassStatus,
    getAvailableGroupClasses
} = require("../controllers/classController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");

// Student requests a class with a tutor
router.post("/request", authenticate, authorizeRoles("Student"), requestClass);

// Tutor views class requests
router.get("/requests", authenticate, authorizeRoles("Tutor"), getClassRequestsForTutor);

// Tutor accepts or rejects a class request
router.patch("/update-status/:classId", authenticate, authorizeRoles("Tutor"), updateClassStatus);

// Student views available group classes for a course
router.get("/group-classes/:courseId", authenticate, authorizeRoles("Student"), getAvailableGroupClasses);

module.exports = router;
