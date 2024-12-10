import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const AdminDashboard = () => {
  // Dummy data for pending tutors
  const pendingTutors = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      resume: "resume-john-doe.pdf",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password456",
      resume: "resume-jane-smith.pdf",
    },
  ];

  // Handle accept and reject actions
  const handleAccept = (tutor) => {
    console.log("Accepted Tutor:", tutor);
    // Add API call to save tutor credentials to the database
  };

  const handleReject = (tutorId) => {
    console.log("Rejected Tutor ID:", tutorId);
    // Add API call to remove tutor from pending list
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Pending Tutor Registrations
              </h2>
              {pendingTutors.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b py-2">First Name</th>
                      <th className="border-b py-2">Last Name</th>
                      <th className="border-b py-2">Email</th>
                      <th className="border-b py-2">Resume</th>
                      <th className="border-b py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTutors.map((tutor) => (
                      <tr key={tutor.id}>
                        <td className="border-b py-2">{tutor.firstName}</td>
                        <td className="border-b py-2">{tutor.lastName}</td>
                        <td className="border-b py-2">{tutor.email}</td>
                        <td className="border-b py-2">
                          <a
                            href={`/resumes/${tutor.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Resume
                          </a>
                        </td>
                        <td className="border-b py-2">
                          <button
                            onClick={() => handleAccept(tutor)}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(tutor.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No pending tutor registrations.</p>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
