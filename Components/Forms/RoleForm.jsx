"use client";
import React from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { X, FileText } from "lucide-react";

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
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onCancel}
      ></div>
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-full w-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add Role</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <Formik
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                >
                  <Form className="max-w-sm mx-auto">
                    <div className="mb-5">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-600 whitespace-nowrap"
                      >
                        Role Name
                      </label>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className="bg-white border text-black border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 d dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        className="text-sm font-medium text-gray-600 whitespace-nowrap"
                      >
                        isActive
                      </label>
                    </div>
                    <div className="flex justify-between">

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
                    </div>

                  </Form>
                </Formik>
              </div>
            </div >
          </div>
        </div>
      </div>
    </>

  );
}

export default RoleForm;
