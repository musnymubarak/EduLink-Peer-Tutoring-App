import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    subjects: "Math, Physics",
    details: {
      phone: "123-456-7890",
      address: "123 Main Street, Cityville",
      enrollmentDate: "2023-01-15",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subjects: "Biology, Chemistry",
    details: {
      phone: "987-654-3210",
      address: "456 Maple Avenue, Townsville",
      enrollmentDate: "2023-03-20",
    },
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    subjects: "History, Geography",
    details: {
      phone: "555-555-5555",
      address: "789 Oak Road, Villagetown",
      enrollmentDate: "2023-05-10",
    },
  },
];

const ListStudent = () => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit student with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete student with ID: ${id}`);
    // Add your delete logic here
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">List of Students</h1>
              <p className="text-sm text-gray-600">
                View all registered students below.
              </p>
            </div>

            {/* Students Table */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">#</th>
                    <th className="border-b py-2">Name</th>
                    <th className="border-b py-2">Email</th>
                    <th className="border-b py-2">Subjects</th>
                    <th className="border-b py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => (
                    <>
                      {/* Main Row */}
                      <tr key={student.id}>
                        <td className="border-b py-2">{student.id}</td>
                        <td className="border-b py-2">{student.name}</td>
                        <td className="border-b py-2">{student.email}</td>
                        <td className="border-b py-2">{student.subjects}</td>
                        <td className="border-b py-2">
                          <button
                            className="text-blue-600"
                            onClick={() => toggleRow(student.id)}
                          >
                            {expandedRows.includes(student.id) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRows.includes(student.id) && (
                        <tr>
                          <td colSpan={5} className="border-b bg-gray-50 p-4">
                            <div className="space-y-2">
                              <p>
                                <strong>Phone:</strong> {student.details.phone}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {student.details.address}
                              </p>
                              <p>
                                <strong>Enrollment Date:</strong>{" "}
                                {student.details.enrollmentDate}
                              </p>
                              <div className="flex space-x-4 mt-2">
                                <button
                                  className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition"
                                  onClick={() => handleEdit(student.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
                                  onClick={() => handleDelete(student.id)}
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

export default ListStudent;
