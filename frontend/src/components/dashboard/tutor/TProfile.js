import { useState, useEffect } from "react";
import axios from "axios";
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
const [loading, setLoading] = useState(false); // Loading state

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/profile/tutor", {
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
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/tutor",
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
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/profile/change-tutor-password",
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
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "profile_pictures");
    data.append("cloud_name", "dhgyagjqw");
    data.append("folder", "profile_pictures_tutor"); // Specify the folder in Cloudinary

    try {
      // Upload the image to Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/dhgyagjqw/image/upload", {
        method: "POST",
        body: data,
      });

      const uploadedImage = await res.json();
      const uploadedImageURL = uploadedImage.url;
      console.log(uploadedImageURL);

      // Send the image URL to the backend to update the profile image
      const backendResponse = await fetch("http://localhost:4000/api/v1/profile/update-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include authentication token if required
        },
        body: JSON.stringify({ image: uploadedImageURL }),
      });

      const result = await backendResponse.json();

      if (backendResponse.ok) {
        console.log("Profile image updated successfully:", result);
        window.location.reload();
      } else {
        console.error("Error updating profile image:", result.message);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
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
        {loading && <div className="text-center">Loading...</div>}
        {!loading && profileData && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Hi, {profileData.name}
            </h1>
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={profileData.image || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-richblue-800"
              />
              <br/>
              <label className="text-black bg-slate-500 p-2 border border-black rounded shadow-lg hover:shadow-2xl">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={uploadProfilePicture}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            {/* Profile Update Form */}
            <form onSubmit={updateProfile}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-richblue-600 focus:border-richblue-600"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
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
