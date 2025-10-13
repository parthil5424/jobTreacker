"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
function UserForm({ onSuccess, onCancel, editData }) {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const res = await fetch("/api/Role");
      const data = await res.json();
      if (data.status == 200) {
        const filteredRoles = data.data.map((role) => ({
          _id: role._id,
          name: role.name,
        }));
        setRoles(filteredRoles);
      } else {
        console.log("no Role Found");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid Email Address")
      .required("Please Enter Email"),
    name: yup.string().required("Please Enter User Name").min(2).max(50),
    password: yup.string().required("Please Enter Password").min(2).max(50),
    role: yup.string().required("Please Select Role"),
    isActive: yup.boolean().required(),
  });
  const initialValues = {
    email: editData?.email ?? "",
    name: editData?.name ?? "",
    password: editData?.password ?? "",
    role: editData?.role ?? "",
    isActive: editData?.isActive ?? true,
  };
  const handleCancel = () => {
    onCancel();
    console.log("hanle Cancel");
  };
  const handleSubmit = async (values) => {
    try {
      console.log("values", values);
      console.log("Handle Submit");
      let method = "POST",
        url = "/api/User/";
      if (editData && editData._id) {
        url += editData._id;
        method = "PUT";
      }
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(values),
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
              User email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              User Name
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
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PassWord
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="max-w-sm mx-auto">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select your Role
            </label>
            <Field
              id="role"
              as="select"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="role"
            >
              <option value="">Select Role</option>
              {roles.length > 0 &&
                roles.map((elem, index) => {
                  return (
                    <option value={elem._id} key={index}>
                      {elem.name}
                    </option>
                  );
                })}
            </Field>
            <ErrorMessage
              name="role"
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

export default UserForm;
