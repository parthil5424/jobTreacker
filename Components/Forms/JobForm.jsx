"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useAuthStore } from "@/Store/useAuthStore";
import {
  X,
  Briefcase,
  FileText,
  ImageIcon,
  CheckCircle,
  Upload,
  DollarSign,
  Clock,
} from "lucide-react";
function JobForm({ onSuccess, onCancel, editData }) {
  console.log("Job Form Renderred")
  const { user } = useAuthStore();
  const [image, setImage] = useState(editData?.image || null);
  const validationSchema = yup.object({
    name: yup.string().min(2).max(20).required("Please Enter Email"),
    description: yup.string().required("Please Enter User Name").min(2).max(50),
    isActive: yup.boolean().required(),
    salaryMin: yup.number().required("Minimum Salary Is Required"),
    salaryMax: yup.number().required("Maximum Salary Is Required"),
    experience: yup.number().required("experience Is Required"),
  });
  const initialValues = {
    name: editData?.name ?? "",
    description: editData?.description ?? "",
    isActive: editData?.isActive ?? true,
    salaryMin: editData?.salaryMin ?? 0,
    salaryMax: editData?.salaryMax ?? 0,
    experience: editData?.experience ?? 0,
  };
  const handleCancel = () => {
    onCancel();
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
      formData.append("salaryMin", values.salaryMin);
      formData.append("salaryMax", values.salaryMax);
      formData.append("experience", values.experience);
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
        console.log("Failed", data.message)
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fixed  top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl z-1 max-w-2xl w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editData ? "Edit Job Posting" : "Create New Job"}
              </h2>
              <p className="text-blue-100 text-sm">
                {editData
                  ? "Update your job details"
                  : "Fill in the job information"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="p-6 h-1/6 mt-10">
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={initialValues}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div className="space-y-6">
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Job Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        id="name"
                        name="name"
                        className={`w-full pl-10 pr-4 py-3 border ${errors.name && touched.name
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
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Job Description
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        id="description"
                        name="description"
                        className={`w-full pl-10 pr-4 py-3 border ${errors.description && touched.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                          } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all resize-none`}
                      />
                      {errors.description && touched.description && (
                        <p className="text-red-500 text-sm mt-1.5 ml-1">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range (per month)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="number"
                            id="salaryMin"
                            name="salaryMin"
                            placeholder="Min (e.g., 50000)"
                            className={`w-full pl-10 pr-4 py-3 border ${errors.salaryMin && touched.salaryMin
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            type="number"
                            id="salaryMax"
                            name="salaryMax"
                            placeholder="Max (e.g., 80000)"
                            className={`w-full pl-10 pr-4 py-3 border ${errors.salaryMax && touched.salaryMax
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.salaryMin && touched.salaryMin && (
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.salaryMin}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <span className="font-medium">₹ INR</span> • Monthly
                      compensation
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Required Experience
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="number"
                        id="experience"
                        name="experience"
                        placeholder="e.g., 3"
                        min="0"
                        max="50"
                        className={`w-full pl-10 pr-20 py-3 border ${errors.experience && touched.experience
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                          } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">years</span>
                      </div>
                    </div>
                    {errors.experience && touched.experience && (
                      <p className="text-red-500 text-sm mt-1.5 ml-1">
                        {errors.experience}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Enter 0 for freshers or entry-level positions
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Image
                    </label>
                    <div className="relative">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                      >
                        <div className="text-center">
                          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold text-blue-600">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/jpg,image/jpeg,image/png"
                          className="hidden"
                        />
                      </label>
                    </div>
                    {image && (
                      <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-gray-700 flex-1">
                          {typeof image === "string" ? image : image?.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                      <Field
                        id="isActive"
                        type="checkbox"
                        name="isActive"
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <label
                      htmlFor="isActive"
                      className="ml-3 text-sm cursor-pointer"
                    >
                      <span className="font-medium text-gray-900">
                        Active Job Posting
                      </span>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Active jobs will be visible to all applicants
                      </p>
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className=" px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all w-[200px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className=" px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-[200px]"
                    >
                      {editData ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Update Job
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-5 h-5" />
                          Create Job
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default JobForm;
