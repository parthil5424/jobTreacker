"use client";
import React, { useEffect, useState } from "react";
import JobForm from "@/Components/Forms/JobForm";
import ApplicationForm from "@/Components/Forms/ApplicationForm";
import ApplicationList from "@/Components/Modals/ApplicationList";
import { useAuthStore } from "@/Store/useAuthStore";

function Job() {
  const { user, isAuthenticated } = useAuthStore();
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
      fetchData();
      fetchApplication();
    } catch (err) {
      console.error("error", err);
    }
  }, []);

  useEffect(() => {
    if (user?.role) {
      fetchApplication();
    }
  }, [user]);

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
      if (user?.role) {
        const res = await fetch(
          `/api/Application?role=${user.role.name}&user=${user.id}`
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
      if (res.status == 200) {
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
        <div className="relative overflow-hidden shadow-lg sm:rounded-2xl bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm p-4">
          <div>
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Job Openings
              </h2>
              {user?.role?.name === "Employer" && (
                <button
                  onClick={addJob}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Job
                </button>
              )}
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs && jobs.length > 0 ? (
                jobs.map((elem, index) => {
                  return (
                    <article
                      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 overflow-hidden hover:-translate-y-2"
                      key={index}
                    >
                      {/* Image Section */}
                      {elem.image && (
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                          <img
                            src={elem.image}
                            alt={elem.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-5">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {elem.name}
                        </h3>

                        {/* Description - Elegant Truncation */}
                        <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm leading-relaxed line-clamp-3">
                          {elem.description}
                        </p>

                        {/* Date - Minimal Icon */}
                        <div className="flex items-center mb-6 text-xs text-gray-500 dark:text-gray-400">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
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
                            {user && user?.role?.name == "Applicant" ? (
                              (() => {
                                const isApplied = userApplication?.find(
                                  (app) => app.jobId === elem._id
                                );
                                return (
                                  <>
                                    {isApplied && <p>{isApplied?.status}</p>}
                                    <button
                                      type="button"
                                      disabled={isApplied}
                                      className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${
                                        isApplied
                                          ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                                          : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
                                      }`}
                                      onClick={() => {
                                        handleApply(elem);
                                      }}
                                    >
                                      {isApplied ? "Applied ✓" : "Apply"}
                                    </button>
                                  </>
                                );
                              })()
                            ) : (
                              <>
                                {user && elem.createdBy == user.id && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(elem)}
                                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(elem?._id)}
                                      className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewApplication(elem)
                                      }
                                      className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 cursor-pointer"
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
                    </article>
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
              userData={user}
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
