import React, { useState } from "react";
import Table from "../Utilities/Table";

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", code: "MATH101", status: "Active" },
    { id: 2, name: "Physics", code: "PHYS201", status: "Inactive" },
  ]);

  const handleDelete = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const handleAdd = () => {
    const newSubject = {
      id: subjects.length + 1,
      name: `New Subject ${subjects.length + 1}`,
      code: `SUBJ${subjects.length + 101}`,
      status: "Pending",
    };
    setSubjects([...subjects, newSubject]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Subjects</h2>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Subject
      </button>
      <Table
        data={subjects}
        columns={["Name", "Code", "Status", "Actions"]}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageSubjects;
