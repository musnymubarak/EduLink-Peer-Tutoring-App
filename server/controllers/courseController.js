const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");

// Add Course (Only Tutor)
exports.addCourse = async (req, res) => {
    try {
        // Verify that the user is a Tutor
        if (req.user.accountType !== "Tutor") {
            return res.status(401).json({
                success: false,
                message: "Only Tutors can add courses.",
            });
        }

        // Extract course details from the request body
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

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required.",
            });
        }

        // Validate the tag
        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Tag is required.",
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

        // Check if the courseName already exists in the database
        const existingCourse = await Course.findOne({ courseName: courseName });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "This course name is already in use.",
            });
        }

        // Check if category exists, if not, create a new category
        let categoryObj = await Category.findOne({ name: category });
        if (!categoryObj) {
            categoryObj = await Category.create({ name: category });
        }

        // Create a new course
        const newCourse = await Course.create({
            courseName,
            courseDescription: courseDescription || null,
            availableInstructors: availableInstructors || [],
            whatYouWillLearn: whatYouWillLearn || null,
            courseContent: courseContent || [],
            price: price || null,
            thumbnail: thumbnail || null,
            tag, // Tag is now required
            category: categoryObj._id,
            instructions: instructions || null,
            status: status || "Draft", // Default status if not provided
        });

        // If a category is provided, add the course to the category's courses array
        categoryObj.courses.push(newCourse._id);
        await categoryObj.save();

        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while creating the course.",
            error: error.message,
        });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("availableInstructors", "firstName lastName email")
            .populate("category", "name")
            .populate("studentsEnrolled", "_id")
            .populate("ratingAndReviews")
            .populate("courseContent"); // Make sure all relations are populated

        const formattedCourses = courses.map((course) => ({
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription || null, // Default to null if not present
            availableInstructors: course.availableInstructors || [], // Default to empty array if not present
            category: course.category || null, // Default to null if not present
            studentsEnrolled: course.studentsEnrolled || [], // Default to empty array if not present
            ratingAndReviews: course.ratingAndReviews || [], // Default to empty array if not present
            courseContent: course.courseContent || [], // Default to empty array if not present
            thumbnail: course.thumbnail || null, // Default to null if not present
            tag: course.tag || [], // Default to empty array if not present
            instructions: course.instructions || [], // Default to empty array if not present
            status: course.status || "Draft", // Default to "Draft" if not present
            createdAt: course.createdAt || Date.now(), // Default to current timestamp if not present
        }));

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            data: formattedCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching courses.",
            error: error.message,
        });
    }
};

// Get a Single Course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Attempt to fetch the course by ID
        const course = await Course.findById(courseId)
            .populate("availableInstructors", "firstName lastName email")
            .populate("category", "name")
            .populate("courseContent")
            .populate("ratingAndReviews")
            .populate("studentsEnrolled");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully.",
            data: {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription || null,
                availableInstructors: course.availableInstructors || [],
                category: course.category || null,
                studentsEnrolled: course.studentsEnrolled || [],
                ratingAndReviews: course.ratingAndReviews || [],
                courseContent: course.courseContent || [],
                thumbnail: course.thumbnail || null,
                tag: course.tag || [],
                instructions: course.instructions || [],
                status: course.status || "Draft",
                createdAt: course.createdAt || Date.now(),
            }
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the course.",
            error: error.message,
        });
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
