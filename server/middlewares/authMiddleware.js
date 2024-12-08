const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Authentication Middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.access_token;

        // If token is missing, respond with an error
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database based on the decoded token ID
        const user = await User.findById(decoded.id); // Assuming the JWT contains the user ID
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Attach the user data to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

// Student Role Middleware
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "This route is only for students.",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isStudent middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error verifying user role.",
        });
    }
};

// Instructor Role Middleware
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This route is only for instructors.",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isInstructor middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error verifying user role.",
        });
    }
};

// Admin Role Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "This route is only for admins.",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error verifying user role.",
        });
    }
};
