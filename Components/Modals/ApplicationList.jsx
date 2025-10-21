"use client";

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
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className=" fixed inset-0 z-50 flex justify-center items-center w-full overflow-y-auto"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Applications For {data?.jobName}
              </h3>{" "}
              <br />
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                data-modal-hide="default-modal"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              {data?.applications?.length > 0 ? (
                <div className="space-y-3">
                  {data.applications.map((app, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row justify-between md:items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Left: Applicant Info */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {app?.userId.name}
                          {console.log("App", app)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Applied on {formatDate(app?.createdAt)}
                        </p>
                      </div>

                      {/* Middle: Resume */}
                      <div>
                        <a
                          href={app?.uploadedResume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors duration-150"
                        >
                          View Resume
                        </a>
                      </div>

                      {/* Right: Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Status:</label>
                        <select
                          defaultValue={app.status || "applied"}
                          onChange={(e) =>
                            handleStatusChange(
                              app._id,
                              e.target.value,
                              app?.userId._id
                            )
                          }
                          className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No applications found for this job.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationList;
