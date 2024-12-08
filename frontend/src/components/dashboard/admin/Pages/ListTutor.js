import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

const tutorsData = [
  {
    id: 1,
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    expertise: "Mathematics, Physics",
  },
  {
    id: 2,
    name: "Ms. Jane Smith",
    email: "jane.smith@example.com",
    expertise: "Biology, Chemistry",
  },
];

const ListTutor = () => {
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
                  </tr>
                </thead>
                <tbody>
                  {tutorsData.map((tutor) => (
                    <tr key={tutor.id}>
                      <td className="border-b py-2">{tutor.id}</td>
                      <td className="border-b py-2">{tutor.name}</td>
                      <td className="border-b py-2">{tutor.email}</td>
                      <td className="border-b py-2">{tutor.expertise}</td>
                    </tr>
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
