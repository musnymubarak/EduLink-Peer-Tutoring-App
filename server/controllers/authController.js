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

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for existing user
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

    // Respond without sensitive data
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
      token, // Include the token for saving in localStorage
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
