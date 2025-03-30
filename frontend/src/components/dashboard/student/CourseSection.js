import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";

const CourseSection = () => {
  const { sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/sections/${sectionId}`);
        setSection(response.data.data);
      } catch (error) {
        console.error("Error fetching section details:", error);
      }
    };

    fetchSectionDetails();
  }, [sectionId]);

  // Handle answer selection (multiple choices)
  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      const selectedOptions = updatedAnswers[questionIndex] || [];

      // Toggle selection
      if (selectedOptions.includes(optionIndex)) {
        updatedAnswers[questionIndex] = selectedOptions.filter((opt) => opt !== optionIndex);
      } else {
        updatedAnswers[questionIndex] = [...selectedOptions, optionIndex];
      }

      return updatedAnswers;
    });
  };

  // Calculate the score
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;

    section.quiz.forEach((question, qIndex) => {
      const selectedOptions = answers[qIndex] || [];
      const correctOptions = question.options
        .map((opt, index) => (opt.isCorrect ? index : null))
        .filter((val) => val !== null);

      // Check if selected options match the correct options
      if (
        selectedOptions.length === correctOptions.length &&
        selectedOptions.every((val) => correctOptions.includes(val))
      ) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
  };

  if (!section) {
    return <div className="p-8 text-center text-xl text-gray-700">Loading section details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{section.sectionName}</h1>

        {!showQuiz ? (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Video:</h2>
              <video controls className="w-full mt-2">
                <source src={section.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Attempt Quiz
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Quiz:</h2>
              {section.quiz.length > 0 ? (
                section.quiz.map((question, qIndex) => (
                  <div key={qIndex} className="mb-4 p-4 border rounded">
                    <h3 className="font-bold">{`Question ${qIndex + 1}: ${question.questionText}`}</h3>
                    <div className="mt-2">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="block cursor-pointer">
                          <input
                            type="checkbox"
                            checked={answers[qIndex]?.includes(optIndex) || false}
                            onChange={() => handleAnswerChange(qIndex, optIndex)}
                            className="mr-2"
                          />
                          {option.optionText}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No quiz available for this section.</p>
              )}
            </div>

            {score === null ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Submit Quiz
              </button>
            ) : (
              <p className="text-lg font-bold">Your Score: {score} / {section.quiz.length}</p>
            )}

            <button
              onClick={() => {
                setShowQuiz(false);
                setScore(null);
                setAnswers({});
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
            >
              Back to Video
            </button>
          </div>
        )}

        <p className="text-gray-600 mt-4">{section.details}</p>
      </div>
    </div>
  );
};

export default CourseSection;
