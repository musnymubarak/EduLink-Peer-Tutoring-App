const Course = require("../models/Course");
const User = require("../models/User");

// Utility functions
const findCourseById = async (courseId) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");
    return course;
};

const findUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
};

// Enroll a Student in a Course
exports.enrollInCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        const course = await findCourseById(courseId);
        const user = await findUserById(userId);

        // Prevent duplicates
        if (course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({ success: false, message: "Already enrolled." });
        }

        // Enroll student
        course.studentsEnrolled = [...new Set([...course.studentsEnrolled, userId])];
        await course.save();

        if (!user.courses.includes(courseId)) {
            user.courses = [...new Set([...user.courses, courseId])];
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled successfully.",
            data: {
                courseId: course._id,
                userId: user._id,
                courseName: course.courseName,
                userName: `${user.firstName} ${user.lastName}`,
            },
        });
    } catch (error) {
        console.error("Error enrolling:", error.message, error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Unenroll a Student from a Course
exports.unenrollFromCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        const course = await findCourseById(courseId);
        const user = await findUserById(userId);

        if (!course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({ success: false, message: "Not enrolled in this course." });
        }

        // Unenroll student
        course.studentsEnrolled = course.studentsEnrolled.filter(
            (studentId) => studentId.toString() !== userId.toString()
        );
        await course.save();

        user.courses = user.courses.filter(
            (courseIdInUser) => courseIdInUser.toString() !== courseId.toString()
        );
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Successfully unenrolled.",
            data: {
                courseId: course._id,
                userId: user._id,
                courseName: course.courseName,
                userName: `${user.firstName} ${user.lastName}`,
            },
        });
    } catch (error) {
        console.error("Error unenrolling:", error.message, error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};
