import React, { useState, useEffect } from "react";
import axios from "axios";

const EditCourse = ({ courseId, onClose, onUpdate }) => {
    const [courseData, setCourseData] = useState({
        courseName: "",
        courseDescription: "",
        categoryObj: null,
        categoryName: "",
        whatYouWillLearn: "",
        thumbnail: "",
        tags: "",
        instructions: "",
        status: "",
        availableInstructors: [],
        price: null,
        courseContent: [],
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:4000/api/v1/courses/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { includeFeedback: true },
                });
                console.log(response.data);

                if (response.data.success) {
                    setCourseData({
                        courseName: response.data.data.courseName,
                        courseDescription: response.data.data.courseDescription,
                        categoryObj: response.data.data.category, // Store the entire category object
                        categoryName: response.data.data.category?.name || "", // Store just the name for display
                        whatYouWillLearn: response.data.data.whatYouWillLearn || "",
                        thumbnail: response.data.data.thumbnail || "",
                        tags: response.data.data.tag ? response.data.data.tag.join(", ") : "", 
                        instructions: response.data.data.instructions ? response.data.data.instructions.join(", ") : "", 
                        status: response.data.data.status || "",
                        availableInstructors: response.data.data.availableInstructors || [],
                        price: response.data.data.price || null,
                        courseContent: response.data.data.courseContent || [],
                    });
                } else {
                    alert("Failed to load course data");
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
                alert("An error occurred while fetching the course data.");
            }
        };

        fetchCourseData();
    }, [courseId]);
    
    console.log(courseData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "categoryName") {
            setCourseData((prevData) => ({
                ...prevData,
                categoryName: value,
            }));
        } else {
            setCourseData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleThumbnailUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "edulink_uploads");
        data.append("cloud_name", "dhgyagjqw");
        data.append("folder", "course_thumbnails");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dhgyagjqw/image/upload", {
                method: "POST",
                body: data,
            });

            const uploadedImage = await res.json();
            setCourseData((prevData) => ({
                ...prevData,
                thumbnail: uploadedImage.url,
            }));
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
            alert("Failed to upload thumbnail.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(`http://localhost:4000/api/v1/courses/${courseId}`, {
                category: courseData.categoryName,
                courseName: courseData.courseName,
                whatYouWillLearn: courseData.whatYouWillLearn,
                courseDescription: courseData.courseDescription,
                thumbnail: courseData.thumbnail,
                tag: courseData.tags.split(",").map(tag => tag.trim()),
                instructions: courseData.instructions.split(",").map(instruction => instruction.trim()),
                status: courseData.status,
                price: courseData.price,
                availableInstructors: courseData.availableInstructors,
                courseContent: courseData.courseContent
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                alert("Course updated successfully!");
                onUpdate();
                onClose();
            } else {
                alert("Failed to update course");
            }
        } catch (error) {
            console.error("Error updating course:", error);
            alert("An error occurred while updating the course.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Course</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Course Name:</label>
                        <input type="text" name="courseName" value={courseData.courseName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Category:</label>
                        <input type="text" name="categoryName" value={courseData.categoryName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>What You Will Learn:</label>
                        <textarea name="whatYouWillLearn" value={courseData.whatYouWillLearn} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Course Description:</label>
                        <textarea name="courseDescription" value={courseData.courseDescription} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Thumbnail:</label>
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
                        {courseData.thumbnail && <img src={courseData.thumbnail} alt="Thumbnail Preview" className="w-32 h-32 object-cover rounded-lg mt-4" />}
                    </div>
                    <div>
                        <label>Tags:</label>
                        <input type="text" name="tags" value={courseData.tags} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Instructions:</label>
                        <textarea name="instructions" value={courseData.instructions} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Status:</label>
                        <select name="status" value={courseData.status} onChange={handleChange} required>
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                    <button type="submit" className='bg-blue-600 text-white p-2 rounded'>Update Course</button>
                    <button type="button" className='bg-gray-600 text-white p-2 rounded ml-2' onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;