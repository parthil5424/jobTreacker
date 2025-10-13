"use client";
import React, { useEffect, useState } from "react";
import JobForm from "@/Components/Forms/JobForm";
function Job() {
  const [isOpen, setisOpen] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [editData, setEditData] = useState(null);

  const addJob = () => {
    setisOpen(true);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/Job");
      const data = await res.json();
      if (data.status == 200) {
        setJobs(data.data);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div>
          <header>
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
              onClick={addJob}
            >
              Add Job
            </button>
          </header>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Candidate Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Applied Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Uploaded Resume
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs && jobs.length > 0 ? (
                jobs.map((elem, index) => {
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      key={index}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {elem.name}
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {elem.description}
                      </th>
                      <td className="px-6 py-4">
                        {elem.isActive ? "Active" : "Not Active"}
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
      </div>
    </div>
  );
}

export default Job;
