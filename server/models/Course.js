const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true, // courseName is mandatory
    },
    courseDescription: {
        type: String,
        default: null, // Optional field with default value of null
    },
    availableInstructors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
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
    price: {
        type: Number,
        default: null, // Optional field with default value of null
    },
    thumbnail: {
        type: String,
        default: null, // Optional field with default value of null
    },
    tag: {
        type: [String],
        default: [], // Optional array with default value of empty array
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
