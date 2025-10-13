"use client";
import React from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

function RoleForm({ onSuccess, onCancel, editData }) {
  const validationSchema = yup.object({
    name: yup.string().required().min(2).max(15),
    isActive: yup.boolean().required().default(true),
  });

  const initialValues = {
    name: editData?.name || "",
    isActive: editData?.isActive ?? true,
  };

  const handleSubmit = async (values) => {
    try {
      let url = "/api/Role/",
        method = "POST";
      if (editData) {
        url += editData?._id;
        method = "PUT";
      }
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.status == 200) {
        console.log(data.message);
        onSuccess();
      } else {
        console.log("Failed to create role");
      }
    } catch (err) {
      console.error("Operation Failed", err);
    }
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
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Role Name
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
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
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cancel
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default RoleForm;
