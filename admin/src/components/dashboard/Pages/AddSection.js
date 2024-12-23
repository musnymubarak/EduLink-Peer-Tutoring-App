import React, { useState } from "react";
import axios from "axios";

const AddSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [videoFile, setVideoFile] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Prepare data to be sent to the backend
      const sectionData = {
        sectionName,
        videoFile,
        quiz,
      };

      // Send POST request to the backend to add a new section
      const response = await axios.post(
        "http://localhost:4000/api/v1/sections/add",
        sectionData,
        {
          headers: {
            "Content-Type": "application/json",
            // Include JWT token if required
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(response.data.message); // Show success message
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
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
                  Video URL (Required)
                </label>
                <input
                  type="url"
                  id="videoFile"
                  value={videoFile}
                  onChange={(e) => setVideoFile(e.target.value)}
                  placeholder="Enter video URL"
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {quiz.map((question, quizIndex) => (
                <div key={quizIndex} className="flex flex-col space-y-2">
                  <label className="text-gray-600 text-sm">Question {quizIndex + 1}</label>
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
                          onChange={(e) =>
                            handleOptionChange(quizIndex, optionIndex, "isCorrect", e.target.checked)
                          }
                        />
                        <span className="text-gray-600 text-xs">Correct</span>
                      </label>
                    </div>
                  ))}
                </div>
              ))}
              <button type="button" onClick={addQuestion} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Add Question
              </button>
              <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600">
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

export default AddSection;
