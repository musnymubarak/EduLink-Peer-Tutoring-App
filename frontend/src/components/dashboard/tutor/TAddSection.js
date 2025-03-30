import React, { useState } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import '../../css/tutor/TAddSection.css';

const TAddSection = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    duration: '',
    order: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

  return (
    <div className="tutor-add-section-container">
      <div className="tutor-add-section-content">
        <Header />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 pt-20 text-blue-600 font-bold hover:underline"
        >
          <IoArrowBack className="mr-2 text-2xl" />
          Back
        </button>
        <div className="mb-6">
          <h1 className="tutor-add-section-title">Add New Section</h1>
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
      <Footer />
    </div>
  );
};

export default TAddSection;