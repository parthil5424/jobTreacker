"use client";
import React, { useEffect, useState } from "react";

import ApplicationForm from "@/Components/Forms/ApplicationForm";
import { useRouter } from "next/navigation";
function Application() {
  const router = useRouter();
  const [isOpen, setisOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState(null);
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);

  const statusOptions = ["applied", "under review", "shortlisted", "rejected"];

  const addAplication = () => {
    setisOpen(true);
  };

  const fetchData = async () => {
    try {
      let localdata = JSON.parse(localStorage.getItem("user"));
      if (localdata == null || localdata == undefined) {
        router.push("/Login");
        return;
      } else if (localdata.role.name != "Admin") {
        router.push("/Login");
        return;
      }
      let role = localdata.role.name;

      const res = await fetch(`/api/Application?role=${role}`);
      const data = await res.json();
      if (data.status == 200) {
        setApplications(data.data);
      } else {
        console.log("Failed tom fetch data");
      }
    } catch (err) {
      console.error("Failed to fetch Job", err);
    }
  };

  const handleEdit = (elem) => {
    setEditData(elem);
    setisOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const res = await fetch(`/api/Job/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status == 200) {
        console.log("Deleted Successfully");
      } else {
        console.log("Failed to delete role");
      }
    } catch (err) {
      console.error("Failed to Delete Role");
    }
  };

  const onSuccess = () => {
    fetchData();
    setisOpen(false);
  };

  const onCancel = () => {
    setisOpen(false);
    setEditData(null);
  };

  const fetchAllJobs = async () => {
    try {
      const res = await fetch("/api/Job");
      const data = await res.json();
      console.log(data.data);
      if (data.data.length > 0) {
        console.log("Conition");
        setJobs(data.data);
      }
    } catch (err) {
      console.error("Error Occurred", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/User");
      const data = await res.json();
      if (data.data.length > 0) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Error Occurred", err);
    }
  };

  const getUserName = (id) => {
    try {
      if (users.length > 0) {
        const name = users.find((user) => user._id === id)?.name;
        return name;
      }
      return "";
    } catch (err) {
      console.error("error", err);
      return "";
    }
  };

  const getJobName = (id) => {
    try {
      if (jobs.length > 0) {
        const name = jobs.find((job) => job._id === id)?.name;
        return name;
      }
      return "";
    } catch (err) {
      console.error("error", err);
      return "";
    }
  };

  const handleStatusChange = (e) => {
    console.log("value", e.target.value);
  };

  useEffect(() => {
    fetchAllJobs();
    fetchAllUsers();
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {isOpen ? (
          <ApplicationForm
            onSuccess={onSuccess}
            onCancel={onCancel}
            editData={editData}
          />
        ) : (
          <div>
            <header>
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
                onClick={addAplication}
              >
                Add Application
              </button>
            </header>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Job Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Applicant Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications && applications.length > 0 ? (
                  applications.map((elem, index) => {
                    return (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {getJobName(elem.jobId)}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {getUserName(elem.userId)}
                        </th>
                        <td className="px-6 py-4">{elem.uploadedResume}</td>
                        <td className="px-6 py-4">
                          <select onChange={handleStatusChange}>
                            {statusOptions.length > 0 &&
                              statusOptions.map((op, index) => {
                                return (
                                  <option
                                    value={op}
                                    defaultValue={
                                      op == elem.status ? true : false
                                    }
                                    key={index}
                                  >
                                    {op}
                                  </option>
                                );
                              })}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-evenly">
                            <button
                              type="button"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                              onClick={() => {
                                handleEdit(elem);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                              onClick={() => {
                                handleDelete(elem?._id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3}>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default Application;
