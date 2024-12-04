import React from "react";
import { useParams } from "react-router-dom";

export default function SubjectDetails() {
  const { id } = useParams(); // Get the subject ID from the route
  const subjectData = {
    1: {
      title: "C++",
      banner: "image.png",
      outline: "Learn the fundamentals of C++ programming.",
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
    // Add similar data for other subjects...
  };

  const subject = subjectData[id];

  if (!subject) {
    return <div>Subject not found!</div>;
  }

  return (
    <div className="p-8">
      <img
        src={subject.banner}
        alt={`${subject.title} banner`}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {subject.title}
      </h1>
      <p className="text-gray-600 mb-4">{subject.outline}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Course Content
      </h2>
      <ul className="list-disc list-inside mb-4">
        {subject.modules.map((module, i) => (
          <li key={i}>{module}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Target Group</h2>
      <p className="text-gray-600 mb-4">{subject.targetGroup}</p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tutor Details</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg font-semibold">{subject.tutor.name}</p>
        <p className="text-yellow-500 mb-2">
          Rating: {"⭐".repeat(subject.tutor.rating)}
        </p>
        <p className="text-gray-600">{subject.tutor.experience}</p>
        <p className="text-gray-600">{subject.tutor.bio}</p>
        <p className="text-gray-600">
          <strong>Education:</strong> {subject.tutor.education}
        </p>
      </div>
    </div>
  );
}
