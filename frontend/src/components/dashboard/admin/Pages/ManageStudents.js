import React, { useState } from "react";
import Table from "../Utilities/Table";

const ManageStudents = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", status: "Active" },
    { id: 2, name: "Bob Brown", email: "bob.brown@example.com", status: "Pending" },
  ]);

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const handleAdd = () => {
    const newStudent = {
      id: students.length + 1,
      name: `New Student ${students.length + 1}`,
      email: `student${students.length + 1}@example.com`,
      status: "Pending",
    };
    setStudents([...students, newStudent]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Student
      </button>
      <Table
        data={students}
        columns={["Name", "Email", "Status", "Actions"]}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageStudents;
