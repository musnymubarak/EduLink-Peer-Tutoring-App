import React, { useState } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import '../../css/tutor/TAddNewSection.css';

const TAddNewSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();
  const [courseIds, setCourseIds] = useState([]);
  const [quiz, setQuiz] = useState([
    {
      questionText: "",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    duration: '',
    order: 0
  });
  const [error, setError] = useState('');

  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleOptionChange = (quizIndex, optionIndex, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options[optionIndex][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleCorrectOptionChange = (quizIndex, optionIndex) => {
    const updatedQuiz = [...quiz];
    const selectedOption = updatedQuiz[quizIndex].options[optionIndex];
    selectedOption.isCorrect = !selectedOption.isCorrect;
    setQuiz(updatedQuiz);
  };

  const addQuestion = () => {
    setQuiz([
      ...quiz,
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuiz = quiz.filter((_, i) => i !== index);
    setQuiz(updatedQuiz);
  };

  const addOption = (quizIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options.push({ optionText: "", isCorrect: false });
    setQuiz(updatedQuiz);
  };

  const removeOption = (quizIndex, optionIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options = updatedQuiz[quizIndex].options.filter((_, i) => i !== optionIndex);
    setQuiz(updatedQuiz);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "edulink_uploads");
      formData.append("cloud_name", "dhgyagjqw");
      formData.append("folder", "videos");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dhgyagjqw/video/upload",
          formData
        );
        setVideoFile(response.data.secure_url); // Set the video URL from Cloudinary
        setMessage("Video uploaded successfully!");
      } catch (error) {
        setMessage("Failed to upload video. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMessage("");
    setShowSuccessAlert(false);
  
    const isValid = quiz.every((question) =>
      question.options.some((option) => option.isCorrect)
    );

    if (!isValid) {
      setMessage("Each question must have at least one correct option.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'video' && formData[key]) {
          formDataToSend.append('video', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post('/api/sections', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/tutor/subjects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
        <Header/>
          <div className="container mx-auto max-w-7xl">
            {/* Success Alert */}
            {showSuccessAlert && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Success! </strong>
                <span className="block sm:inline">Section added successfully.</span>
                <span 
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setShowSuccessAlert(false)}
                >
                  <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </span>
              </div>
            )}
          
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center mb-6 pt-20 text-blue-600 font-bold hover:underline"
            >
              <IoArrowBack className="mr-2 text-2xl" />
              Back
            </button>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Section</h1>
              <p className="text-sm text-gray-600">Fill in the form below to add a new section.</p>
            </div>

            {error && (
              <div className="message-container message-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Enter section title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  placeholder="Enter section description"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video</label>
                <div className="video-upload" onClick={() => document.getElementById('video').click()}>
                  {formData.video ? (
                    <video
                      src={URL.createObjectURL(formData.video)}
                      controls
                      className="video-preview"
                    />
                  ) : (
                    <>
                      <FiUpload className="upload-icon" />
                      <p className="upload-text">Click to upload video</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="form-input"
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  required
                  placeholder="Enter duration in minutes"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                  required
                  placeholder="Enter section order"
                />
              </div>

              <div className="button-container">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/tutor/subjects')}
                >
                  <FiX />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  <FiSave />
                  {loading ? 'Creating...' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default TAddNewSection;