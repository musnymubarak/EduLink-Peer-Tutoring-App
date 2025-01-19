const express = require("express");
const router = express.Router();
const { auth, isTutor } = require("../middlewares/authMiddleware");
const {
    addSection,
    getAllSections,
    getSectionById,
    updateSectionById,
    deleteSectionById,
} = require("../controllers/sectionController");

// Public: Get All Sections
router.get("/", getAllSections);

// Public: Get Section by ID
router.get("/:sectionId", getSectionById);

// Admin-only: Add Section
router.post("/add", auth, isTutor, addSection);

// Admin-only: Update Section by ID
router.put("/:sectionId", auth, isTutor, updateSectionById);

// Admin-only: Delete Section by ID
router.delete("/:sectionId", auth, isTutor, deleteSectionById);

module.exports = router;
