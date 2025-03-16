const mongoose = require("mongoose");

const classRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Student making the request
        required: true,
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Tutor being requested
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",  // Related course
        required: true,
    },
    type: {
        type: String,
        enum: ["Personal", "Group"],  // Class type
        required: true,
    },
    time: {
        type: Date,  // Proposed class time
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],  // Request status
        default: "Pending",
    },
    duration: {
        type: Number,  // Duration of the class in minutes
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Request creation time
    }
});

module.exports = mongoose.model("ClassRequest", classRequestSchema);
