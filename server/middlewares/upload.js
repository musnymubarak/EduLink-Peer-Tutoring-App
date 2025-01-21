const multer = require("multer");
const path = require("path");

// Set up storage engine and file filtering for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // Save files to the uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename based on current timestamp
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);  // Allow video files
    } else {
        cb(new Error("Only video files are allowed"), false);  // Reject non-video files
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
