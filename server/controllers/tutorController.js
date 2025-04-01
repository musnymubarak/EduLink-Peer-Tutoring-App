const Course = require('../models/Course');
const User = require('../models/User'); // Import the User model

exports.assignTutorToCourse = async (req, res) => {
    const { courseId } = req.params; // Extract courseId from the URL
    const tutorId = req.user._id; // Get the tutor ID from the authenticated user (from the middleware)

    if (!courseId || !tutorId) {
        return res.status(400).json({ success: false, message: "Missing courseId or tutorId." });
    }

    try {
        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // Check if the tutor is already assigned (optional check)
        if (course.availableTutors.includes(tutorId)) {
            return res.status(400).json({ success: false, message: "Tutor is already assigned to this course." });
        }

        // Add tutor to the course's availableTutors array
        course.availableTutors.push(tutorId);
        await course.save();

        // Find the tutor (User) and update their courses array
        const tutor = await User.findById(tutorId);
        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor not found." });
        }

        // Check if the course is already in the tutor's courses array
        if (!tutor.courses.includes(courseId)) {
            tutor.courses.push(courseId);
            await tutor.save();
        }

        return res.status(200).json({
            success: true,
            message: "Tutor assigned to course successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while assigning tutor.",
            error: error.message,
        });
    }
};

exports.getTutorById = async (req, res) => {
    const { tutorId } = req.params; // Extract tutorId from the URL

    if (!tutorId) {
        return res.status(400).json({ success: false, message: "Tutor ID is required." });
    }

    try {
        // Find the tutor by their ID
        const tutor = await User.findById(tutorId);

        if (!tutor) {
            return res.status(404).json({ success: false, message: "Tutor not found." });
        }

        // Return the tutor details
        return res.status(200).json({
            success: true,
            data: {
                _id: tutor._id,
                firstName: tutor.firstName,
                lastName: tutor.lastName,
                email: tutor.email,
                createdAt: tutor.createdAt,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching tutor details.",
            error: error.message,
        });
    }
};

exports.getTotalEnrolledStudents = async (req, res) => {
    const { tutorId } = req.params; // Extract tutorId from URL

    if (!tutorId) {
        return res.status(400).json({ success: false, message: "Tutor ID is required." });
    }

    try {
        // Find all courses where the tutor is assigned
        const courses = await Course.find({ tutor: tutorId }).populate('studentsEnrolled');

        if (!courses || courses.length === 0) {
            return res.status(404).json({ success: false, message: "No courses found for this tutor." });
        }

        // Calculate the total number of enrolled students across all courses
        const totalStudents = courses.reduce((acc, course) => acc + course.studentsEnrolled.length, 0);

        return res.status(200).json({
            success: true,
            tutorId,
            totalStudentsEnrolled: totalStudents,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching enrolled students count.",
            error: error.message,
        });
    }
};

exports.getAllTutors = async (req, res) => {
    try {
        // Filter by accountType, since the field in your document is 'accountType'
        const tutors = await User.find({ accountType: 'Tutor' });

        if (!tutors || tutors.length === 0) {
            return res.status(404).json({ success: false, message: "No tutors found." });
        }

        return res.status(200).json({
            success: true,
            data: tutors,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching tutor details.",
            error: error.message,
        });
    }
};

