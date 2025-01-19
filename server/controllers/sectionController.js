const Section = require("../models/Section");

// Add a New Section (Only Tutor)
exports.addSection = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can add sections.",
            });
        }

        // Extract section details from the request body
        const { sectionName, videoFile, quiz, courseIds } = req.body;

        // Validate mandatory fields
        if (!sectionName || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "Section name and video file are required.",
            });
        }

        // Check if the section name is unique for the tutor
        const existingSection = await Section.findOne({ sectionName, tutorId: req.user._id });
        if (existingSection) {
            return res.status(400).json({
                success: false,
                message: "A section with this name already exists for this tutor.",
            });
        }

        // Create a new section
        const newSection = await Section.create({
            sectionName,
            videoFile,
            quiz: quiz || [],
            tutorId: req.user._id, // Assign the current tutor as the section owner
            courseIds: courseIds || [], // Associate the section with courses if provided
        });

        return res.status(201).json({
            success: true,
            message: "Section created successfully.",
            data: newSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while creating the section.",
            error: error.message,
        });
    }
};

// Get All Sections (Accessible to Tutors and Admins)
exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.find().populate("tutorId", "name email").populate("courseIds", "courseName");

        return res.status(200).json({
            success: true,
            message: "Sections fetched successfully.",
            data: sections,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching sections.",
            error: error.message,
        });
    }
};

// Get a Section by ID
exports.getSectionById = async (req, res) => {
    try {
        const { sectionId } = req.params;

        const section = await Section.findById(sectionId).populate("tutorId", "name email").populate("courseIds", "courseName");

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section fetched successfully.",
            data: section,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the section.",
            error: error.message,
        });
    }
};

// Update a Section by ID (Only Tutor who owns the section)
exports.updateSectionById = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can update sections.",
            });
        }

        const { sectionId } = req.params;
        const updatedData = req.body;

        // Find the section and ensure the tutor owns it
        const section = await Section.findOne({ _id: sectionId, tutorId: req.user._id });

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found or you do not have permission to update it.",
            });
        }

        // Update the section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, updatedData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Section updated successfully.",
            data: updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the section.",
            error: error.message,
        });
    }
};

// Delete a Section by ID (Only Tutor who owns the section)
exports.deleteSectionById = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can delete sections.",
            });
        }

        const { sectionId } = req.params;

        // Find the section and ensure the tutor owns it
        const section = await Section.findOne({ _id: sectionId, tutorId: req.user._id });

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found or you do not have permission to delete it.",
            });
        }

        // Delete the section
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting the section.",
            error: error.message,
        });
    }
};