const Class = require("../models/Class");
const Course = require("../models/Course");
const User = require("../models/User");

// Student requests a class with a tutor
exports.requestClass = async (req, res) => {
    try {
        const { courseId, tutorId, time, type } = req.body;
        const studentId = req.user._id;

        // Validate inputs
        if (!courseId || !tutorId || !time || !type) {
            return res.status(400).json({
                success: false,
                message: "All fields (courseId, tutorId, time, type) are required."
            });
        }

        // Check if student is enrolled in the course
        const course = await Course.findById(courseId);
        if (!course || !course.studentsEnrolled.includes(studentId)) {
            return res.status(403).json({
                success: false,
                message: "You must be enrolled in this course to request a class."
            });
        }

        // Check if tutor exists
        const tutor = await User.findById(tutorId);
        if (!tutor || tutor.accountType !== "Tutor") {
            return res.status(404).json({
                success: false,
                message: "Tutor not found."
            });
        }

        // Create a new class request
        const newClass = await Class.create({
            student: studentId,
            tutor: tutorId,
            course: courseId,
            time,
            type,
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Class request sent to the tutor.",
            data: newClass
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while requesting class.",
            error: error.message
        });
    }
};

// Tutor responds to class request
exports.respondToClassRequest = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status } = req.body;
        const tutorId = req.user._id;

        // Validate status
        if (!["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'Accepted' or 'Rejected'."
            });
        }

        // Find class and verify tutor ownership
        const classRequest = await Class.findById(classId);
        if (!classRequest || classRequest.tutor.toString() !== tutorId.toString()) {
            return res.status(404).json({
                success: false,
                message: "Class request not found or unauthorized."
            });
        }

        // Update class status
        classRequest.status = status;
        await classRequest.save();

        return res.status(200).json({
            success: true,
            message: `Class request ${status.toLowerCase()} successfully.`,
            data: classRequest
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while responding to class request.",
            error: error.message
        });
    }
};



// Tutor updates class status (Accept or Reject)
exports.updateClassStatus = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status } = req.body;
        const tutorId = req.user._id;

        // Allowed status updates
        const validStatuses = ["Accepted", "Rejected"];

        // Validate the provided status
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be either 'Accepted' or 'Rejected'.`
            });
        }

        // Find the class and verify tutor ownership
        const classRequest = await Class.findById(classId);
        if (!classRequest || classRequest.tutor.toString() !== tutorId.toString()) {
            return res.status(404).json({
                success: false,
                message: "Class request not found or unauthorized access."
            });
        }

        // Prevent status change if already Accepted or Rejected
        if (["Accepted", "Rejected"].includes(classRequest.status)) {
            return res.status(400).json({
                success: false,
                message: `Class is already marked as '${classRequest.status}'.`
            });
        }

        // Update the class status
        classRequest.status = status;
        await classRequest.save();

        return res.status(200).json({
            success: true,
            message: `Class status updated to '${status}'.`,
            data: classRequest
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while updating class status.",
            error: error.message
        });
    }
};

