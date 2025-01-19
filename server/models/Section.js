const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      optionText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  videoFile: {
    type: String,
    required: true, // Path or URL to the video file
  },
  quiz: [
    {
      type: questionSchema, // Embedding the question schema for the quiz
    },
  ],
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (assumed to represent tutors)
    required: true,
  },
  courseIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course model
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
