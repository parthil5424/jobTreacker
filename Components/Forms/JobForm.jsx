"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useAuthStore } from "@/Store/useAuthStore";
function JobForm({ onSuccess, onCancel, editData }) {
  const { user } = useAuthStore();
  const [image, setImage] = useState(editData?.image || null);
  const validationSchema = yup.object({
    name: yup.string().min(2).max(20).required("Please Enter Email"),
    description: yup.string().required("Please Enter User Name").min(2).max(50),
    isActive: yup.boolean().required(),
  });
  const initialValues = {
    name: editData?.name ?? "",
    description: editData?.description ?? "",
    isActive: editData?.isActive ?? true,
  };
  const handleCancel = () => {
    onCancel();
    console.log("hanle Cancel");
  };
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      let method = "POST",
        url = "/api/Job/";
      if (editData && editData._id) {
        url += editData._id;
        method = "PUT";
      }
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("isActive", values.isActive);
      if (image) {
        formData.append("image", image);
      }
      formData.append("createdBy", user.id);
      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      if (res.status == 200) onSuccess();
      else {
        const data = await res.json();
      }
    } catch (err) {
      console.error("Something Went Wrong", err);
    }
  };

  const handleFileChange = (e) => {
    console.log("e", e);
    setImage(e.target.files[0]);
  };

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
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Job Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Job Description
            </label>
            <Field
              type="text"
              id="description"
              name="description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <Field
                id="isActive"
                type="checkbox"
                name="isActive"
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label
              htmlFor="isActive"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              isActive
            </label>
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Job Image
            </label>
            <input type="file" onChange={handleFileChange} accept="jpg png" />
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

export default JobForm;
