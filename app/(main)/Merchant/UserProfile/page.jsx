"use client";

import { useAuthStore } from "@/Store/useAuthStore";
import { Form, Formik, Field } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { X, Upload, Eye, FileText, CheckCircle } from "lucide-react";

export default function UserProfile({ editData = null, onSuccess }) {
  console.log("Edit Data", editData);
  const [resume, setResume] = useState(null);
  const { user, updateUser } = useAuthStore();

  const validationSchema = yup.lazy(() => {
    const isEmployer = user?.companyDetails;
    return yup.object({
      name: yup.string().required("Name Is required").min(2).max(50),
      email: yup.string().email().required("Name Is required").min(2).max(50),
      companyName: isEmployer
        ? yup.string().required("Company name is Required")
        : "",
      address: isEmployer
        ? yup.string().required("Company address is Required")
        : "",
      registeredYear: isEmployer
        ? yup.string().required("Registered year is Required")
        : "",
      size: isEmployer ? yup.string().required("Company size is Required") : "",
      landMark: isEmployer ? yup.string().required("landmark is Required") : "",
    });
  });

  useEffect(() => {
    if (user) {
      if (user.role.name === "Admin" && editData) {
        setResume(editData?.resume);
      } else {
        if (user?.resume) setResume(user.resume);
      }
    }
  }, [user]);

  const initialValues = {
    name: editData?.name || user?.name,
    email: editData?.email || user?.email,
    companyName:
      editData?.companyDetails?.name || (user?.companyDetails?.name ?? ""),
    address:
      editData?.companyDetails?.address ||
      (user?.companyDetails?.address ?? ""),
    registeredYear:
      editData?.companyDetails?.year ||
      (user?.companyDetails?.registeredYear ?? ""),
    size: editData?.companyDetails?.size || (user?.companyDetails?.size ?? ""),
    landMark:
      editData?.companyDetails?.landMark ||
      (user?.companyDetails?.landMark ?? ""),
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Handle Submit");
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      //   formData.append("password", values.password);
      if (values.companyName) {
        formData.append("companyname", values.companyName);
        formData.append("address", values.address);
        formData.append("year", values.registeredYear);
        formData.append("size", values.size);
        formData.append("landmark", values.landMark);
      }
      if (resume) {
        formData.append("resume", resume);
      }
      let id = user.id;
      if (editData && user.role.name == "Admin") {
        id = editData._id;
      }
      const res = await fetch(`/api/User/${id}`, {
        body: formData,
        method: "PUT",
      });
      if (res.status == 200) {
        console.log("Data Updated SuccessFully");
        if (!editData && user.role.name !== "Admin") {
          const data = await res.json();
          updateUser(data.data);
        }
      } else {
        const data = await res.json();
        console.log("Failed", data.message);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  const handleFileChange = (e) => {
    console.log("e", e.target.files[0]);
    setResume(e.target.files[0]);
  };
  const companySize = ["0-10", "10-49", "50-249", "250+"];

  const showCompanyDetails = editData
    ? editData?.roleName === "Employer"
    : user?.companyDetails;

  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 h-1/6 mt-10">
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, setFieldValue }) => (
              <Form>
                <div className="space-y-6">
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      User Name
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.name && touched.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                      />
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Id
                    </label>
                    <div className="relative">
                      <Field
                        type="text"
                        id="email"
                        name="email"
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {user.role.name !== "Admin" && !showCompanyDetails ? (
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

                      {resume && typeof resume === "string" && (
                        <div className="mt-4 mb-4 bg-white rounded-xl p-4 border border-gray-200">
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
                    </div>
                  ) : null}

                  {/* {(editData &&
                    user.role.name === "Admin" &&
                    editData?.roleName !== "Employer") ||
                    (!user.companyDetails && (
                      
                    ))} */}

                  {user.role.name !== "Admin" && showCompanyDetails ? (
                    <>
                      <div className="mb-5">
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Company Name
                        </label>
                        <div className="relative">
                          <Field
                            type="text"
                            id="companyName"
                            name="companyName"
                            className={`w-full pl-10 pr-4 py-3 border ${
                              errors.companyName && touched.companyName
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.companyName && touched.companyName && (
                          <p className="text-red-500 text-sm mt-1.5 ml-1">
                            {errors.companyName}
                          </p>
                        )}
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Registered Year
                        </label>
                        <div className="relative">
                          <Field
                            type="text"
                            id="registeredYear"
                            name="registeredYear"
                            min="1800"
                            max={new Date().getFullYear()}
                            className={`w-full pl-10 pr-4 py-3 border ${
                              errors.registeredYear && touched.registeredYear
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                        {errors.registeredYear && touched.registeredYear && (
                          <p className="text-red-500 text-sm mt-1.5 ml-1">
                            {errors.registeredYear}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="size"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Company Size
                        </label>
                        <Field
                          as="select"
                          id="size"
                          name="size"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                        >
                          <option value="">Select Company Size</option>
                          {companySize.map((elem, index) => (
                            <option value={elem} key={index}>
                              {elem} employees
                            </option>
                          ))}
                        </Field>
                        {errors.size && touched.size && (
                          <p className="text-red-500 text-sm mt-1.5 ml-1">
                            {errors.size}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Address
                        </label>
                        <Field
                          as="textarea"
                          id="address"
                          name="address"
                          rows="3"
                          placeholder="123 Business Street, Suite 100"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                        />
                        {errors.address && touched.address && (
                          <p className="text-red-500 text-sm mt-1.5 ml-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <label
                          htmlFor="landMark"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Landmark
                        </label>
                        <Field
                          type="text"
                          id="landMark"
                          name="landMark"
                          placeholder="Near City Center Mall"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                        />
                        {errors.landMark && touched.landMark && (
                          <p className="text-red-500 text-sm mt-1.5 ml-1">
                            {errors.landMark}
                          </p>
                        )}
                      </div>
                    </>
                  ) : null}

                  {/* {(editData &&
                    editData?.roleName !== "Applicant" &&
                    user.role.name === "Admin") ||
                    (user.companyDetails && (
                      
                    ))} */}
                </div>
                <div className="flex items-center justify-center gap-x-2 pt-6">
                  <button
                    type="submit"
                    className={`text-white font-semibold rounded-lg text-sm px-6 py-3 focus:ring-4 focus:outline-none transition-all w-[250px] ${"bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300"}`}
                  >
                    Update Details
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
