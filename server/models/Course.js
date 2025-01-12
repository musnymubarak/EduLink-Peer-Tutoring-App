const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true,
    },
    courseDescription: {
        type: String,
        default: null, // Optional field with default value of null
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model for a single tutor
        required: true, // Ensure a tutor is always assigned
    },
    whatYouWillLearn: {
        type: String,
        default: null, // Optional field with default value of null
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        },
    ],
    thumbnail: {
        type: String,
        default: null, // Optional field with default value of null
    },
    tag: {
        type: [String],
        default: [], // Optional array with default value of empty array
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null, // Optional field with default value of null
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Ensure this is the correct reference to the User model
        },
    ],
    instructions: {
        type: [String],
        default: [], // Optional array with default value of empty array
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft", // Default status is "Draft"
    },
    createdAt: {
        type: Date,
        default: Date.now(), // Default to current timestamp
    },
});

module.exports = mongoose.model("Course", coursesSchema);
