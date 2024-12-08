import React, { useState } from "react";
import Table from "../Utilities/Table";

const ManageTutors = () => {
  const [tutors, setTutors] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", status: "Pending" },
  ]);

  const handleDelete = (id) => {
    setTutors(tutors.filter((tutor) => tutor.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Tutors</h2>
      <Table
        data={tutors}
        columns={["Name", "Email", "Status", "Actions"]}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageTutors;
