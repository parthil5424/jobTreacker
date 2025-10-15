"use client";
import React, { useEffect, useState } from "react";
import JobForm from "@/Components/Forms/JobForm";
import ApplicationForm from "@/Components/Forms/ApplicationForm";
import ApplicationList from "@/Components/Modals/ApplicationList";
function Job() {
  const [userData, setUserData] = useState({});

  const [jobs, setJobs] = useState(null);
  const [editData, setEditData] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [userApplication, setUserApplication] = useState([]);
  const [applicationData, setApplicationData] = useState(null);

  const [isOpen, setisOpen] = useState(false);
  const [showAppForm, setShowAppForm] = useState(false);
  const [showAppList, setShowAppList] = useState(false);

  useEffect(() => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      console.log("User", user);
      setUserData(user);
      fetchData();
      fetchApplication();
    } catch (err) {
      console.error("error", err);
    }
  }, []);

  useEffect(() => {
    if (userData?.role) {
      fetchApplication();
    }
  }, [userData]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/Job");
      const data = await res.json();
      if (data.status == 200) {
        setJobs(data.data);
      } else {
        console.error("Failed tom fetch data");
      }
    } catch (err) {
      console.error("Failed to fetch Job", err);
    }
  };

  const fetchApplication = async () => {
    try {
      if (userData?.role) {
        const res = await fetch(
          `/api/Application?role=${userData.role.name}&user=${userData.id}`
        );
        if (res.status == 200) {
          const data = await res.json();
          setUserApplication(data.data);
        } else {
          const { message } = await res.json();
          console.log("Failed to Fetch Application", message);
        }
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const addJob = () => {
    setisOpen(true);
  };

  const handleEdit = (elem) => {
    setEditData(elem);
    setisOpen(true);
  };

  const onSuccess = () => {
    setEditData(null);
    fetchData();
    setisOpen(false);
  };

  const onCancel = () => {
    setisOpen(false);
    setEditData(null);
  };

  const closeApplicationList = () => {
    setShowAppList(false);
    setApplicationData(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/Job/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status == 200) {
        fetchData();
      } else {
        console.log("Failed to delete role");
      }
    } catch (err) {
      console.error("Failed to Delete Role");
    }
  };

  const handleApply = async (elem) => {
    try {
      setSelectedJobId(elem._id);
      setShowAppForm(true);
    } catch (err) {
      console.err("err", err);
    }
  };

  const handleViewApplication = async (elem) => {
    try {
      if (userApplication.length > 0) {
        console.log(elem);
        let applicationData = userApplication.filter(
          (app) => app.jobId == elem._id
        );
        if (applicationData.length <= 0) {
          console.log("No Application Found");
          return;
        }
        setApplicationData({
          jobName: elem.name,
          createdDate: elem.createdAt,
          applications: applicationData,
        });

        setShowAppList(true);
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const closeAppForm = () => {
    setSelectedJobId(null);
    setShowAppForm(false);
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const appFormSuccess = () => {
    try {
      setSelectedJobId(null);
      setShowAppForm(false);
      fetchData();
      fetchApplication();
    } catch (err) {
      console.error("Error Occurred");
    }
  };

  return (
    <div>
      {isOpen ? (
        <JobForm
          editData={editData}
          onCancel={onCancel}
          onSuccess={onSuccess}
        />
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div>
            <header>
              {/* {userData && userData.role.name != "Applicant" && (
                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
                  onClick={addJob}
                >
                  Add Job
                </button>
              )} */}
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
                onClick={addJob}
              >
                Add Job
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs && jobs.length > 0 ? (
                jobs.map((elem, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Image Section */}
                      {elem.image && (
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                          <img
                            src={elem.image}
                            alt={elem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-5">
                        {/* Title */}
                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {elem.name}
                        </h5>

                        {/* Description */}
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                          {elem.description}
                        </p>

                        {/* Created Date */}
                        <div className="flex items-center mb-4 text-xs text-gray-500 dark:text-gray-400">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDate(elem.createdAt)}
                        </div>

                        {/* Action Buttons */}
                        {
                          <div className="flex gap-3">
                            {userData.role.name == "Applicant" ? (
                              (() => {
                                const isApplied = userApplication?.find(
                                  (app) => app.jobId === elem._id
                                );
                                return (
                                  <button
                                    type="button"
                                    disabled={isApplied}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg focus:ring-4 focus:outline-none transition-colors ${
                                      isApplied
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-60"
                                        : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 cursor-pointer"
                                    }`}
                                    onClick={() => {
                                      handleApply(elem);
                                    }}
                                  >
                                    {isApplied ? "Applied ✓" : "Apply"}
                                  </button>
                                );
                              })()
                            ) : (
                              <>
                                {elem.createdBy == userData.id && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(elem)}
                                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(elem?._id)}
                                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewApplication(elem)
                                      }
                                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 cursor-pointer"
                                    >
                                      View Applications
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        }
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No Data Found
                  </p>
                </div>
              )}
            </div>{" "}
          </div>
          {showAppForm && (
            <ApplicationForm
              userData={userData}
              onCancel={closeAppForm}
              jobId={selectedJobId}
              onSuccess={appFormSuccess}
            />
          )}
          {
            <ApplicationList
              open={showAppList}
              onClose={closeApplicationList}
              data={applicationData}
            />
          }
        </div>
      )}
    </div>
  );
}

export default Job;
