"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
function ApplicationForm({ onSuccess, onCancel, editData }) {
  const [image, setImage] = useState(editData?.image || null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const statusOptions = ["applied", "under review", "shortlisted", "rejected"];
  const validationSchema = yup.object({
    job: yup.string().required("Please Job Name"),
    user: yup.string().required("Please Select User"),
    status: yup.string().required("Please Select Status"),
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
      const formData = new FormData();
      let method = "POST",
        url = "/api/Application/";
      if (editData && editData._id) {
        url += editData._id;
        method = "PUT";
      }
      formData.append("jobId", values.job);
      formData.append("userId", values.user);
      formData.append("status", values.status);
      if (image) {
        formData.append("uploadedResume", image);
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
    setImage(e.target.files[0]);
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
      let localdata = JSON.parse(localStorage.getItem("user"));
      let role = localdata.role.name;
      console.log("Role", role);
      fetchJob();
      fetchUser();
    } catch (err) {
      console.error("err", err);
    }
  }, []);
  return (
    <div>
      <Formik
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      >
        <Form className="max-w-sm mx-auto">
          <div className="mb-5">
            <label
              htmlFor="job"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Job Name
            </label>
            <Field
              as="select"
              id="job"
              name="job"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select Job</option>
              {jobs.length > 0 &&
                jobs.map((elem, index) => {
                  return (
                    <option value={elem.id} key={index}>
                      {elem.name}
                    </option>
                  );
                })}
            </Field>
            <ErrorMessage
              name="job"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              User
            </label>
            <Field
              as="select"
              id="user"
              name="user"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select User</option>
              {users.length > 0 &&
                users.map((elem, index) => {
                  return (
                    <option value={elem.id} key={index}>
                      {elem.name}
                    </option>
                  );
                })}
            </Field>
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </label>
            <Field
              as="select"
              id="status"
              name="status"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option>Select Status</option>
              {statusOptions.length > 0 &&
                statusOptions.map((elem, index) => {
                  return (
                    <option value={elem} key={index}>
                      {elem}
                    </option>
                  );
                })}
            </Field>
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Uploaded Resume
            </label>
            <input
              id="resume"
              type="file"
              onChange={handleFileChange}
              accept="jpg png pdf"
            />
            {image && typeof image == "string" ? (
              <p>{image}</p>
            ) : (
              <p>{image?.name}</p>
            )}
          </div>
          <div className="flex space-between">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default ApplicationForm;
