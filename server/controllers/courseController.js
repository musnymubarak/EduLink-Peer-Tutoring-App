const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");

// Add Course (Only Tutor)
exports.addCourse = async (req, res) => {
    try {
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({ success: false, message: "Only Tutors can add courses." });
        }

        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag,
            category,
            instructions,
            status,
        } = req.body;

        if (!courseName || !category || !tag) {
            return res.status(400).json({ success: false, message: "Course name, category, and tag are required." });
        }

        const existingCourse = await Course.findOne({ courseName });
        if (existingCourse) {
            return res.status(400).json({ success: false, message: "This course name is already in use." });
        }

        let categoryObj = await Category.findOne({ name: category });
        if (!categoryObj) {
            categoryObj = await Category.create({ name: category });
        }

        const newCourse = await Course.create({
            courseName,
            courseDescription: courseDescription || null,
            tutor: req.user._id,
            whatYouWillLearn: whatYouWillLearn || null,
            courseContent: courseContent || [],
            price: price || null,
            thumbnail: thumbnail || null,
            tag,
            category: categoryObj._id,
            instructions: instructions || [],
            status: status || "Draft",
        });

        categoryObj.courses.push(newCourse._id);
        await categoryObj.save();

        return res.status(201).json({ success: true, message: "Course created successfully.", data: newCourse });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error occurred while creating the course.", error: error.message });
    }
};

// Get All Published Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: "Published" })
            .populate("tutor", "firstName lastName email")
            .populate("category", "name")
            .populate("studentsEnrolled", "_id")
            .populate("ratingAndReviews")
            .populate("courseContent");

        return res.status(200).json({ success: true, message: "Published courses fetched successfully.", data: courses });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error occurred while fetching courses.", error: error.message });
    }
};

// Get a Single Published Course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({ _id: courseId, status: "Published" })
            .populate("tutor", "firstName lastName email")
            .populate("category", "name")
            .populate("courseContent")
            .populate("ratingAndReviews")
            .populate("studentsEnrolled");

        if (!course) {
            return res.status(404).json({ success: false, message: "Published course not found." });
        }

        return res.status(200).json({ success: true, message: "Course fetched successfully.", data: course });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error occurred while fetching the course.", error: error.message });
    }
};

// Update Course by ID (Only Tutor)
exports.updateCourseById = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can update courses.",
            });
        }

        const { courseId } = req.params; // Get courseId from request parameters
        const {
            courseName,
            courseDescription,
            availableInstructors,
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag, // Tag is now compulsory
            category,
            instructions,
            status,
        } = req.body;

        // Validate mandatory fields
        if (!courseName) {
            return res.status(400).json({
                success: false,
                message: "Course name is required.",
            });
        }

        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Tag is required.",
            });
        }

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required.",
            });
        }

        // Validate if availableInstructors is an array if provided
        if (availableInstructors && !Array.isArray(availableInstructors)) {
            return res.status(400).json({
                success: false,
                message: "availableInstructors must be an array.",
            });
        }

        // Check if all instructors exist if provided
        if (availableInstructors && availableInstructors.length > 0) {
            const invalidInstructors = await User.find({ '_id': { $in: availableInstructors } });
            if (invalidInstructors.length !== availableInstructors.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more instructors do not exist.",
                });
            }
        }

        // Check if the course exists
        let existingCourse = await Course.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Check if category exists, if not, create a new category
        let categoryObj = await Category.findOne({ name: category });
        if (!categoryObj) {
            categoryObj = await Category.create({ name: category });
        }

        // Update the course with new values or retain existing ones if not provided
        existingCourse.courseName = courseName;
        existingCourse.courseDescription = courseDescription || existingCourse.courseDescription;
        existingCourse.availableInstructors = availableInstructors || existingCourse.availableInstructors;
        existingCourse.whatYouWillLearn = whatYouWillLearn || existingCourse.whatYouWillLearn;
        existingCourse.courseContent = courseContent || existingCourse.courseContent;
        existingCourse.price = price || existingCourse.price;
        existingCourse.thumbnail = thumbnail || existingCourse.thumbnail;
        existingCourse.tag = tag;
        existingCourse.category = categoryObj._id;
        existingCourse.instructions = instructions || existingCourse.instructions;
        existingCourse.status = status || existingCourse.status;

        // Save the updated course
        await existingCourse.save();

        // If a category is provided, add the course to the category's courses array
        categoryObj.courses.push(existingCourse._id);
        await categoryObj.save();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            data: existingCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the course.",
            error: error.message,
        });
    }
};

// Delete Course by ID (Only Tutor)
exports.deleteCourseById = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can delete courses.",
            });
        }

        const { courseId } = req.params;

        // Find and delete the course
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Remove the course from the category's courses array
        const categoryObj = await Category.findById(deletedCourse.category);
        categoryObj.courses.pull(courseId);
        await categoryObj.save();

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting the course.",
            error: error.message,
        });
    }
};
