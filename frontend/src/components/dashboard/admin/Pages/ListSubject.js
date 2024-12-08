import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import Footer from "../Footer";

const subjectsData = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
  { id: 3, name: "Chemistry" },
];

const ListSubject = () => {
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
                  </tr>
                </thead>
                <tbody>
                  {subjectsData.map((subject) => (
                    <tr key={subject.id}>
                      <td className="border-b py-2">{subject.id}</td>
                      <td className="border-b py-2">{subject.name}</td>
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

export default ListSubject;
