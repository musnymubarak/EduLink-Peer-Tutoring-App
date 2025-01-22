const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { auth, isTutor } = require("../middlewares/authMiddleware");
const {
    addSection,
    updateSectionById,
    deleteSectionById,
    getSectionsByCourseId,  
    getSectionsByTutor,
    uploadVideoToCloudinary,
    getSectionById   
} = require("../controllers/sectionController");

// Public: Get Sections by Course ID
router.get("/course/:courseId", getSectionsByCourseId); 

// Public: Get Sections by Tutor ID
router.get("/tutor", auth, getSectionsByTutor);

router.get("/:sectionId", getSectionById); 

// Add Section
router.post("/add", auth, isTutor, addSection);

//Update Section by ID
router.put("/:sectionId", auth, isTutor, updateSectionById);

// Delete Section by ID
router.delete("/:sectionId", auth, isTutor, deleteSectionById);

// Upload Video to Cloudinary
router.post("/upload-video", auth, isTutor, upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No video file uploaded",
        });
      }
  
      // Call the uploadVideoToCloudinary function from the controller
      const videoUrl = await uploadVideoToCloudinary(req.file.path, req.file.filename);
  
      res.status(200).json({
        success: true,
        message: "Video uploaded successfully.",
        videoUrl,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading video.",
        error: error.message,
      });
    }
  });
  

module.exports = router;
