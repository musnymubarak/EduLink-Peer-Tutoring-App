const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
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
router.post("/add", auth, isAdmin, addSection);

// Admin-only: Update Section by ID
router.put("/:sectionId", auth, isAdmin, updateSectionById);

// Admin-only: Delete Section by ID
router.delete("/:sectionId", auth, isAdmin, deleteSectionById);

module.exports = router;
