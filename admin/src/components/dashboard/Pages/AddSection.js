import React, { useState } from "react";
import axios from "axios";

const AddSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [videoFile, setVideoFile] = useState(null); // State for video file input
  const [quiz, setQuiz] = useState([{ questionText: "", options: [{ optionText: "", isCorrect: false }] }]); // State for quiz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[qIndex].options[oIndex][field] = value;
    setQuiz(updatedQuiz);
  };

  const addOption = (qIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[qIndex].options.push({ optionText: "", isCorrect: false });
    setQuiz(updatedQuiz);
  };

  const addQuestion = () => {
    setQuiz([...quiz, { questionText: "", options: [{ optionText: "", isCorrect: false }] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    if (!videoFile) {
      setError("Please upload a video file.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sectionName", sectionName);
      formData.append("videoFile", videoFile);
      formData.append("quiz", JSON.stringify(quiz)); // Convert quiz to JSON string

      const response = await axios.post("http://localhost:4000/api/v1/sections/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess("Section added successfully!");
        setSectionName("");
        setVideoFile(null);
        setQuiz([{ questionText: "", options: [{ optionText: "", isCorrect: false }] }]);
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Add New Section</h1>
              <p className="text-sm text-gray-600">
                Fill in the form below to add a new section.
              </p>
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
                  Video File
                </label>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>

              {quiz.map((q, qIndex) => (
                <div key={qIndex} className="flex flex-col space-y-2">
                  <label className="text-gray-600 text-sm">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) =>
                      handleQuizChange(qIndex, "questionText", e.target.value)
                    }
                    placeholder="Enter question text"
                    className="border border-gray-300 rounded-lg p-2"
                    required
                  />
                  {q.options.map((o, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={o.optionText}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, "optionText", e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                        required
                      />
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={o.isCorrect}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, "isCorrect", e.target.checked)
                          }
                        />
                        <span className="text-gray-600 text-sm">Correct</span>
                      </label>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 text-sm"
                    onClick={() => addOption(qIndex)}
                  >
                    + Add Option
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="text-blue-600 text-sm"
                onClick={addQuestion}
              >
                + Add Question
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Section"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddSection;
