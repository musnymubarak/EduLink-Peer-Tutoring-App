import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function TSubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    pdfFile: null,
  });

  const subjectData = {
    1: {
      title: "C",
      banner: require("../../../images/cppBanner.png"),
      outline: "Learn the fundamentals of C programming.",
      content: "Topics include variables, loops, functions, OOP.",
      modules: ["Introduction", "Control Structures", "OOP Basics"],
      targetGroup: "Beginners in programming.",
      tutor: {
        name: "John Doe",
        rating: 4,
        experience: "5 years in teaching C++",
        bio: "Experienced C++ developer and instructor.",
        education: "MSc in Computer Science",
      },
    },
  };

  const subject = subjectData[id];

  if (!subject) {
    return (
      <div className="p-8 text-center text-xl text-gray-700">Subject not found!</div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, pdfFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted: ", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 font-bold hover:underline"
      >
        <IoArrowBack className="mr-2 text-2xl" />
        Back
      </button>

      <div className="relative">
        <img
          src={subject.banner}
          alt={`${subject.title} banner`}
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-4">
          <h1 className="text-4xl font-bold text-white">{subject.title}</h1>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Course Outline</h2>
          <p className="text-gray-600">{subject.outline}</p>
        </section>

        <div className="text-right">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Enroll as a Tutor
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Enroll as a Tutor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select a Topic
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">Select a topic</option>
                  {subject.modules.map((module, index) => (
                    <option key={index} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-4 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
