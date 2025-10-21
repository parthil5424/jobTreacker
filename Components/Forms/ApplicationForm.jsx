"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { X, Upload, Eye, FileText, CheckCircle } from "lucide-react";
function ApplicationForm({ onSuccess, onCancel, editData, userData, jobId }) {
  console.log("UserData", userData);
  const [resume, setResume] = useState(userData?.resume || null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const statusOptions = [
    "applied",
    "under review",
    "shortlisted",
    "rejected",
    "withdrawn",
  ];
  const validationSchema = yup.object({
    job: yup.string(),
    user: yup.string(),
    status: yup.string(),
  });
  const initialValues = {
    job: editData?.job ?? "",
    user: editData?.user ?? "",
    status: editData?.status ?? "",
  };
  const handleCancel = () => {
    onCancel();
    console.log("handle Cancel");
  };
  const handleSubmit = async (values) => {
    try {
      console.log("Handle Submit Called");
      const formData = new FormData();
      let method = "POST",
        url = "/api/Application/";
      if (editData && editData._id) {
        url += editData._id;
        method = "PUT";
      }
      if (values.job == "" && values.user == "" && values.status == "") {
        values.job = jobId;
        values.user = userData.id;
        values.status = "applied";
      }
      formData.append("jobId", values.job);
      formData.append("userId", values.user);
      formData.append("status", values.status);
      if (resume) {
        formData.append("uploadedResume", resume);
      }
      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      if (res.status == 200) onSuccess();
      else {
        const data = await res.json();
        console.log(data.message);
      }
    } catch (err) {
      console.error("Something Went Wrong", err);
    }
  };

  const handleFileChange = (e) => {
    console.log("e", e);
    setResume(e.target.files[0]);
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/User");
      const data = await res.json();
      if (data.status == 200) {
        let filteredData = data.data.map((elem) => ({
          id: elem._id,
          name: elem.name,
        }));
        setUsers(filteredData);
      } else {
        console.log("Failed tom fetch User");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/Job`);
      const data = await res.json();
      if (data.status == 200) {
        let filteredData = data.data.map((elem) => ({
          id: elem._id,
          name: elem.name,
        }));
        setJobs(filteredData);
      } else {
        console.log("Failed tom fetch data");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    try {
      fetchJob();
      fetchUser();
    } catch (err) {
      console.error("err", err);
    }
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Apply for Job</h2>
                <p className="text-indigo-100 text-sm">
                  Submit your application
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={initialValues}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {userData.role.name === "Admin" && (
                  <>
                    {/* Job Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Position
                      </label>
                      <Field
                        as="select"
                        id="job"
                        name="job"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                      >
                        <option value="">Select Job Position</option>
                        {jobs.length > 0 &&
                          jobs.map((elem, index) => (
                            <option value={elem.id} key={index}>
                              {elem.name}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="job"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      />
                    </div>

                    {/* User Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Applicant
                      </label>
                      <Field
                        as="select"
                        id="user"
                        name="user"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                      >
                        <option value="">Select Applicant</option>
                        {users.length > 0 &&
                          users.map((elem, index) => (
                            <option value={elem.id} key={index}>
                              {elem.name}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="user"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Status Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Application Status
                      </label>
                      <Field
                        as="select"
                        id="status"
                        name="status"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.length > 0 &&
                          statusOptions.map((elem, index) => (
                            <option value={elem} key={index}>
                              {elem}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </>
                )}

                {/* Resume Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Resume</h3>
                      <p className="text-sm text-gray-600">
                        Upload or use existing resume
                      </p>
                    </div>
                  </div>

                  {/* Existing Resume */}
                  {resume && typeof resume === "string" && (
                    <div className="mb-4 bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Current Resume
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {resume}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open(resume, "_blank")}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resume Options */}
                  {resume && typeof resume === "string" ? (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 cursor-pointer transition-all group">
                        <input
                          type="radio"
                          name="resumeChoice"
                          value="existing"
                          defaultChecked
                          onChange={() => setFieldValue("useExisting", true)}
                          className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-all">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Use Existing Resume
                            </p>
                            <p className="text-sm text-gray-500">
                              Continue with current resume
                            </p>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 cursor-pointer transition-all group">
                        <input
                          type="radio"
                          name="resumeChoice"
                          value="new"
                          onChange={() => setFieldValue("useExisting", false)}
                          className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-all">
                            <Upload className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Upload New Resume
                            </p>
                            <p className="text-sm text-gray-500">
                              Replace with a different file
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : null}

                  {/* File Upload (shown when no resume or new resume selected) */}
                  {(!resume ||
                    (resume && typeof resume !== "string") ||
                    values.useExisting === false) && (
                    <div className="mt-4">
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-indigo-500 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-200 rounded-full flex items-center justify-center mb-3 transition-all">
                            <Upload className="w-6 h-6 text-indigo-600" />
                          </div>
                          <p className="mb-1 text-sm font-semibold text-gray-700">
                            Click to upload resume
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </div>
                        <input
                          id="resume"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>

                      {/* New file selected preview */}
                      {resume && typeof resume !== "string" && (
                        <div className="mt-3 flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {resume.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResume(null)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Submit Application
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
