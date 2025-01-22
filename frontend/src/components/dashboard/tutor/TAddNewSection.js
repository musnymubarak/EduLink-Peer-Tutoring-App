import React, { useState } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const TAddNewSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();
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
    setLoading(true);
    setMessage("");

    const isValid = quiz.every((question) =>
      question.options.some((option) => option.isCorrect)
    );

    if (!isValid) {
      setMessage("Each question must have at least one correct option.");
      setLoading(false);
      return;
    }

    try {
      const formData = {
        sectionName,
        videoFile, // Use the uploaded video URL
        quiz,
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/sections/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
            >
              <IoArrowBack className="mr-2 text-2xl" />
              Back
            </button>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Section</h1>
              <p className="text-sm text-gray-600">Fill in the form below to add a new section.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div className="flex flex-col">
                <label htmlFor="sectionName" className="text-gray-600 text-sm mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  id="sectionName"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="Enter section name"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="videoFile" className="text-gray-600 text-sm mb-1">
                  Upload Video File
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                {videoFile && (
                  <p className="text-sm text-green-600">Video uploaded successfully!</p>
                )}
              </div>

              {quiz.map((question, quizIndex) => (
                <div key={quizIndex} className="flex flex-col space-y-4">
                  <div className="flex justify-between">
                    <label className="text-gray-600 text-sm">Question {quizIndex + 1}</label>
                    {quiz.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(quizIndex)}
                        className="text-red-500 text-xs"
                      >
                        Remove Question
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuizChange(quizIndex, "questionText", e.target.value)}
                    placeholder="Enter question text"
                    className="border border-gray-300 rounded-lg p-2"
                    required
                  />
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option.optionText}
                        onChange={(e) =>
                          handleOptionChange(quizIndex, optionIndex, "optionText", e.target.value)
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                        required
                      />
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() => handleCorrectOptionChange(quizIndex, optionIndex)}
                        />
                        <span className="text-gray-600 text-xs">Correct</span>
                      </label>
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(quizIndex, optionIndex)}
                          className="text-red-500 text-xs"
                        >
                          Remove Option
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(quizIndex)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  >
                    Add Option
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Add Question
              </button>

              <button
                type="submit"
                disabled={loading || !videoFile}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600"
              >
                {loading ? "Adding Section..." : "Add Section"}
              </button>
            </form>

            {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TAddNewSection;
