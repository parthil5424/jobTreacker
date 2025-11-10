"use client";
import React, { useEffect, useState } from "react";
import JobForm from "@/Components/Forms/JobForm";
import ApplicationForm from "@/Components/Forms/ApplicationForm";
import ApplicationList from "@/Components/Modals/ApplicationList";
import { useAuthStore } from "@/Store/useAuthStore";
import { Briefcase, Plus } from "lucide-react";
import JobCard from "@/Components/Cards/JobCard";

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

  if (isOpen && JobForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <JobForm
          editData={editData}
          onCancel={onCancel}
          onSuccess={onSuccess}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role?.name !== "Applicant"
                ? "Manage Job Openings"
                : "Browse Opportunities"}
            </h1>
            <p className="text-gray-600">
              {user?.role?.name !== "Applicant"
                ? "Create and manage your job postings"
                : `${
                    jobs && jobs.filter((job) => job.isActive)?.length
                  } positions available`}
            </p>
          </div>

          {user?.role?.name !== "Applicant" && (
            <button
              onClick={addJob}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Post New Job
            </button>
          )}
        </header>

        {/* Filters Bar (Optional) */}
        {user?.role?.name === "Applicant" && (
          <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-100">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              All Jobs
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Full-time
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Remote
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Recently Posted
            </button>
          </div>
        )}

        {/* Job Grid */}
        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                user={user}
                userApplications={userApplication}
                onApply={handleApply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewApplications={handleViewApplication}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role?.name === "Employer"
                ? "Start by creating your first job posting"
                : "Check back later for new opportunities"}
            </p>
            {user?.role?.name === "Employer" && (
              <button
                onClick={addJob}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Post Your First Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAppForm && ApplicationForm && (
        <ApplicationForm
          userData={user}
          onCancel={closeAppForm}
          jobId={selectedJobId}
          onSuccess={appFormSuccess}
        />
      )}

      {showAppList && ApplicationList && (
        <ApplicationList
          open={showAppList}
          onClose={closeApplicationList}
          data={applicationData}
        />
      )}
    </div>
  );
}

export default Job;
