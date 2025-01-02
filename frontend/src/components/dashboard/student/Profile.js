import { useState } from "react";
import Sidebar from "../Sidebar";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imageData, setImageData] = useState(null); // State for new image file

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfileData(response.data);
      setFormData({
        firstName: response.data.name.split(" ")[0],
        lastName: response.data.name.split(" ")[1],
        email: response.data.email,
        bio: response.data.additionalDetails?.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Update profile data
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/student",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Profile updated successfully!");
      setProfileData(response.data.profile); // Update profile state with new data
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async () => {
    if (!imageData) {
      alert("Please select an image to upload.");
      return;
    }
    try {
      const formDataObj = new FormData();
      formDataObj.append("image", imageData);

      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/pic",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Profile picture updated successfully!");
      setProfileData({ ...profileData, image: response.data.image }); // Update profile image
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture. Please try again.");
    }
  };

  // Update password
  const updatePassword = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Profile Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-richblue-800"
              />
            </div>
            {/* Add Profile Picture Button */}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => document.getElementById("profilePicture").click()}
            >
              Add Profile Picture
            </button>
            <input
              type="file"
              id="profilePicture"
              className="hidden"
            />
          </div>

          {/* Form */}
          <form>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                placeholder="Enter your email"
              />
            </div>

            {/* Change Password Button */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowModal(true)}
              >
                Change Password
              </button>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                placeholder="Write a short bio about yourself"
                rows="4"
              ></textarea>
            </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            </form>

            {/* Password Update Form */}
            <form className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Change Password
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={updatePassword}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
