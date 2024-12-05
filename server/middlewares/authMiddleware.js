const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Authentication Middleware
exports.auth = async (req, res, next) => {
    try {
      const token = req.cookies.access_token;  // Extract token from cookies
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token is missing",
        });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // Attach the decoded token to the request object
  
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  };


// Student Role Middleware
exports.isStudent = async (req, res, next) => {
    try {
        console.log("Account Type in isStudent Middleware:", req.user?.accountType);
        if (req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Students only",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isStudent middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

// Instructor Role Middleware
exports.isInstructor = async (req, res, next) => {
    try {
        console.log("Account Type in isInstructor Middleware:", req.user?.accountType);
        if (req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Instructors only",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isInstructor middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};

// Admin Role Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        console.log("Account Type in isAdmin Middleware:", req.user?.accountType);
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
};
