import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const tutorsData = [
  {
    id: 1,
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    expertise: "Mathematics, Physics",
    details: {
      phone: "123-456-7890",
      address: "123 Main Street, Cityville",
      enrollmentDate: "2023-01-15",
    },
  },
  {
    id: 2,
    name: "Ms. Jane Smith",
    email: "jane.smith@example.com",
    expertise: "Biology, Chemistry",
    details: {
      phone: "987-654-3210",
      address: "456 Maple Avenue, Townsville",
      enrollmentDate: "2023-03-20",
    },
  },
];

const ListTutor = () => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit tutor with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete tutor with ID: ${id}`);
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
              <h1 className="text-2xl font-semibold">List of Tutors</h1>
              <p className="text-sm text-gray-600">
                View all registered tutors below.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">#</th>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Email</th>
                    <th className="border-b py-2">Expertise</th>
                    <th className="border-b py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorsData.map((tutor) => (
                    <>
                      {/* Main Row */}
                      <tr key={tutor.id}>
                        <td className="border-b py-2">{tutor.id}</td>
                        <td className="border-b py-2">{tutor.name}</td>
                        <td className="border-b py-2">{tutor.email}</td>
                        <td className="border-b py-2">{tutor.expertise}</td>
                        <td className="border-b py-2">
                          <button
                            className="text-blue-600"
                            onClick={() => toggleRow(tutor.id)}
                          >
                            {expandedRows.includes(tutor.id) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows.includes(tutor.id) && (
                        <tr>
                          <td colSpan={5} className="border-b bg-gray-50 p-4">
                            <div className="space-y-2">
                              <p>
                                <strong>Phone:</strong> {tutor.details.phone}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {tutor.details.address}
                              </p>
                              <p>
                                <strong>Enrollment Date:</strong>{" "}
                                {tutor.details.enrollmentDate}
                              </p>
                              <div className="flex space-x-4 mt-2">
                                <button
                                  className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition"
                                  onClick={() => handleEdit(tutor.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
                                  onClick={() => handleDelete(tutor.id)}
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

export default ListTutor;
