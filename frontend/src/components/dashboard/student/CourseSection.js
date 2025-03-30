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

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;

    section.quiz.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
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
                section.quiz.map((question, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <h3 className="font-bold">{`Question ${index + 1}: ${question.questionText}`}</h3>
                    <div className="mt-2">
                      <label className="mr-4">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value="true"
                          checked={answers[index] === "true"}
                          onChange={() => handleAnswerChange(index, "true")}
                          className="mr-1"
                        />
                        True
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value="false"
                          checked={answers[index] === "false"}
                          onChange={() => handleAnswerChange(index, "false")}
                          className="mr-1"
                        />
                        False
                      </label>
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
