"use client";
import { X, FileText, Calendar, User, Eye } from "lucide-react";

const ApplicationList = ({ open, onClose, data }) => {
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  const statusOptions = [
    "applied",
    "under review",
    "shortlisted",
    "rejected",
    "withdrawn",
  ];

  const statusColors = {
    applied: "bg-blue-100 text-blue-700",
    "under review": "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-700",
  };

  const handleStatusChange = async (id, status, userId) => {
    try {
      console.log("id", id);
      console.log("status", status);
      console.log("userId", userId);
      const res = await fetch(`/api/Application/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          userId: userId,
        }),
      });
      if (res.status == 200) {
        console.log("Status Updated SuccessFully");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Applications</h3>
                  <p className="text-blue-100 text-sm">
                    {data?.jobName || "Job Position"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {data?.applications?.length > 0 ? (
                <div className="space-y-4">
                  {data.applications.map((app, index) => {
                    const currentStatus = app.status || "applied";
                    return (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Applicant Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                  {app?.userId.name}
                                </h4>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    Applied on {formatDate(app?.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusColors[currentStatus] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {currentStatus.charAt(0).toUpperCase() +
                                  currentStatus.slice(1)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 lg:items-center">
                            {/* Resume Button */}
                            <a
                              href={app?.uploadedResume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Resume
                            </a>

                            {/* Status Dropdown */}
                            <div className="flex items-center gap-2">
                              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                Status:
                              </label>
                              <select
                                defaultValue={currentStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    app._id,
                                    e.target.value,
                                    app?.userId._id
                                  )
                                }
                                className="border border-gray-300 rounded-xl text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors cursor-pointer font-medium"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-500 text-center">
                    No applications found for this job position.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            {data?.applications?.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex-shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Total Applications:{" "}
                    <span className="font-semibold text-gray-900">
                      {data.applications.length}
                    </span>
                  </span>
                  <div className="flex gap-4">
                    <span className="text-gray-600">
                      Shortlisted:{" "}
                      <span className="font-semibold text-green-600">
                        {
                          data.applications.filter(
                            (a) => a.status === "shortlisted"
                          ).length
                        }
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Under Review:{" "}
                      <span className="font-semibold text-yellow-600">
                        {
                          data.applications.filter(
                            (a) => a.status === "under review"
                          ).length
                        }
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationList;
