const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate password strength (for example, at least 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if a user with the same email and account type already exists
    const existingUser = await User.findOne({ email, accountType });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account with this email already exists as a ${accountType}. Please log in or choose a different account type.`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
    });

    // Send response without sensitive data
    return res.status(201).json({
      success: true,
      message: `${accountType} account registered successfully`,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.accountType },
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

    // Check if the user exists for the given email and account type
    const user = await User.findOne({ email, accountType });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No ${accountType} account found with this email. Please check your account type or sign up.`,
      });
    }

    // Compare the entered password with the hashed password
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

    // Set the token in a cookie
    res.cookie("access_token", token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure the cookie is secure in production
      maxAge: 3600000, // 1 hour expiration time
    });

    // Send response with user data and accountType included
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType, // Ensure accountType is sent in response
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
