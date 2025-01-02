const User = require("../models/User");

// Controller to get logged-in student's profile details
const getStudentProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Find the user with accountType: "Student"
    const user = await User.findOne({
      _id: userId,
      accountType: "Student",
    }).select("firstName lastName image email additionalDetails courses").populate("additionalDetails courses");

    // Check if the user exists and has accountType "Student"
    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Respond with user details
    res.status(200).json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image: user.image,
      additionalDetails: user.additionalDetails,
      courses: user.courses,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to update logged-in student's profile details
const updateStudentProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated request
    const userId = req.user.id; // Assuming req.user is set after authentication

    // Ensure the user is a student
    const user = await User.findOne({ _id: userId, accountType: "Student" });
    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Update the user's profile with the provided data
    const { firstName, lastName, image, additionalDetails } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (image) user.image = image;
    if (additionalDetails) user.additionalDetails = additionalDetails;

    await user.save();

    // Respond with the updated profile
    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        image: user.image,
        additionalDetails: user.additionalDetails,
      },
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getStudentProfile, updateStudentProfile };
