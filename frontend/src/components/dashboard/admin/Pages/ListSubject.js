import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const subjectsData = [
  {
    id: 1,
    name: "Mathematics",
    details: {
      description: "The study of numbers, shapes, and patterns.",
      prerequisites: "Basic algebra and geometry",
    },
  },
  {
    id: 2,
    name: "Physics",
    details: {
      description: "The study of matter, energy, and the interactions between them.",
      prerequisites: "Calculus and basic mechanics",
    },
  },
];

const ListSubject = () => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit subject with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete subject with ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">List of Subjects</h1>
              <p className="text-sm text-gray-600">
                View all registered subjects below.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">#</th>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsData.map((subject) => (
                    <>
                      {/* Main Row */}
                      <tr key={subject.id}>
                        <td className="border-b py-2">{subject.id}</td>
                        <td className="border-b py-2">{subject.name}</td>
                        <td className="border-b py-2">
                          <button
                            className="text-blue-600"
                            onClick={() => toggleRow(subject.id)}
                          >
                            {expandedRows.includes(subject.id) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows.includes(subject.id) && (
                        <tr>
                          <td colSpan={3} className="border-b bg-gray-50 p-4">
                            <div className="space-y-2">
                              <p>
                                <strong>Description:</strong>{" "}
                                {subject.details.description}
                              </p>
                              <p>
                                <strong>Prerequisites:</strong>{" "}
                                {subject.details.prerequisites}
                              </p>
                              <div className="flex space-x-4 mt-2">
                                <button
                                  className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition"
                                  onClick={() => handleEdit(subject.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
                                  onClick={() => handleDelete(subject.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ListSubject;
