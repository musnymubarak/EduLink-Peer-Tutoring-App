const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model (Student)
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",  // Reference to the Course model
        required: true,
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model (Tutor)
        required: true,
    },
    time: {
        type: Date,  // Class time
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],  // Status can be Pending, Accepted, or Rejected
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Default to current timestamp
    },
});

module.exports = mongoose.model("Class", classSchema);
