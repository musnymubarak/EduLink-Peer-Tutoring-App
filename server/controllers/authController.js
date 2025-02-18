const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const path = require('path');

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType, resumePath } = req.body;

    if (!firstName || !lastName || !email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, password, and account type are required",
      });
    }

    if (accountType === "Tutor" && !resumePath) {
      return res.status(400).json({
        success: false,
        message: "Resume is required for Tutor accounts",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ email, accountType });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account with this email already exists as a ${accountType}. Please log in or choose a different account type.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      resumePath: accountType === "Tutor" ? resumePath : null,
    });

    return res.status(201).json({
      success: true,
      message: `${accountType} account registered successfully`,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType,resumePath: user.resumePath },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during signup",
    });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { email, password, accountType } = req.body;

    // Validate required fields
    if (!email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and account type are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email, accountType });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No ${accountType} account found with this email. Please check your account type or sign up.`,
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, accountType: user.accountType }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save the token in cookies
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Helps prevent CSRF attacks
      expires: new Date(Date.now() + 3600 * 1000), // Token expires in 1 hour
    });

    // Include token in the response body for localStorage
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token, 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};
