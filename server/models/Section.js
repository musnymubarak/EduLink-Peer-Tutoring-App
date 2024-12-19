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
});

module.exports = mongoose.model("Section", sectionSchema);
