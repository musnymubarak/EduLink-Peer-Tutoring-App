import React, { useEffect, useState } from "react";
import axios from "axios";

const ListReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:4000/api/v1/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async (reportId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/report/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedReport(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Failed to fetch report details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openReportDetails = (reportId) => {
    fetchReportDetails(reportId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading reports...</div>
    </div>
  );
  
  if (error) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports List</h1>
        </div>
        
        {reports.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-center text-red-500 font-medium">No reports found</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.reportedBy?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {report.courseId?.courseName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.courseCreatorId?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.reason || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            openReportDetails(report._id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={closeModal}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Reported By</p>
                <p className="font-medium">{selectedReport.reportedBy?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course Name</p>
                <p className="font-medium">{selectedReport.courseId?.courseName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tutor Email</p>
                <p className="font-medium">{selectedReport.courseCreatorId?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="text-sm">{selectedReport.reason || "N/A"}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm">{selectedReport.description}</p>
                </div>
              )}
              {selectedReport.status && (
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {selectedReport.status}
                  </span>
                </div>
              )}
              {selectedReport.createdAt && (
                <div>
                  <p className="text-sm text-gray-500">Report Date</p>
                  <p className="font-medium">{new Date(selectedReport.createdAt).toLocaleDateString()}</p>
                </div>
              )}
              <div className="pt-4">
                <button
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListReports;