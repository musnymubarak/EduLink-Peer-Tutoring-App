import React from "react";

const Table = ({ data, columns, onDelete }) => {
  return (
    <table className="w-full bg-white rounded-lg shadow">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="p-4 text-left border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="p-4">{item.name}</td>
            <td className="p-4">{item.email}</td>
            <td className="p-4">{item.status}</td>
            <td className="p-4">
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
