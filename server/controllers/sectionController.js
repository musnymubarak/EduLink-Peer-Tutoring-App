const Section = require("../models/Section");

// Add a New Section
exports.addSection = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can add sections.",
            });
        }

        // Extract section details from the request body
        const { sectionName, videoFile, quiz } = req.body;

        // Validate mandatory fields
        if (!sectionName || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "Section name and video file are required.",
            });
        }

        // Create a new section
        const newSection = await Section.create({
            sectionName,
            videoFile,
            quiz: quiz || [],
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

// Get All Sections
exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.find();

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

        const section = await Section.findById(sectionId);

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

// Update a Section by ID (Only Admin)
exports.updateSectionById = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can update sections.",
            });
        }

        const { sectionId } = req.params;
        const updatedData = req.body;

        // Find and update the section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            updatedData,
            { new: true }
        );

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found.",
            });
        }

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

// Delete a Section by ID (Only Admin)
exports.deleteSectionById = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can delete sections.",
            });
        }

        const { sectionId } = req.params;

        // Find and delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found.",
            });
        }

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
