const express = require("express");
const router = express.Router();
const {
    requestClass,
    getClassRequestsForTutor,
    updateClassStatus,
} = require("../controllers/classController");
const { isStudent, isTutor } = require("../middlewares/authMiddleware");

// Student requests a class with a tutor
router.post("/request", isStudent, requestClass);

// Tutor views class requests
router.get("/requests", isTutor, getClassRequestsForTutor);

// Tutor accepts or rejects a class request
router.patch("/update-status/:classId", isTutor, updateClassStatus);

// Student views available group classes for a course

module.exports = router;
