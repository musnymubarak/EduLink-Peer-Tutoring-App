const express = require("express");
const router = express.Router();
const { auth, isTutor } = require("../middlewares/authMiddleware");
const {
    addSection,
    updateSectionById,
    deleteSectionById,
    getSectionsByCourseId,  
    getSectionsByTutorId,   
} = require("../controllers/sectionController");


// Public: Get Sections by Course ID
router.get("/course/:courseId", getSectionsByCourseId); 

// Public: Get Sections by Tutor ID
router.get("/tutor/:tutorId", getSectionsByTutorId); 

// Admin-only: Add Section
router.post("/add", auth, isTutor, addSection);

// Admin-only: Update Section by ID
router.put("/:sectionId", auth, isTutor, updateSectionById);

// Admin-only: Delete Section by ID
router.delete("/:sectionId", auth, isTutor, deleteSectionById);

module.exports = router;
