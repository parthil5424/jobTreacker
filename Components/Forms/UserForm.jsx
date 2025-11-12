"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/Store/useAuthStore";
import LandingNavbar from "../LandingNavbar";
import Navbar from "../Navbar";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
function UserForm({ onSuccess, onCancel, editData }) {
  const [coords, setCoords] = useState({
    latitude: "",
    longitude: "",
  });
  const [roles, setRoles] = useState(null);
  const [resume, setResume] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Applicant");
  const { user } = useAuthStore();
  const router = useRouter();

  //Google Maps Load
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCIcXkNG7D_chQ_T2LCse7_JPbb5083Buw",
  });

  const fectLatitude = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return position;
        },
        (err) => {
          console.log("Error", err);
          return null;
        }
      );
    }

    return navigator;
  }, [navigator]);

  useEffect(() => {
    fetchRole();
    if (editData?.resume) {
      console.log(editData?.resume);
      setResume(editData.resume);
    }
    const { position } = fectLatitude();
    if (position) {
      setCoords({
        latitude: position.coords.latitude,
        latitude: position.coords.longitude,
      });
    }
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
  const validationSchema = yup.lazy(() => {
    const isEmployer = selectedRole == "Employer";
    return yup.object({
      email: yup
        .string()
        .email("Invalid Email Address")
        .required("Please Enter Email"),
      name: yup.string().required("Please Enter User Name").min(2).max(50),
      password: yup.string().required("Please Enter Password").min(2).max(50),
      isActive: yup.boolean().required(),
      companyname: isEmployer
        ? yup.string().required()
        : yup.string().notRequired(),
      year: isEmployer ? yup.string().required() : yup.string().notRequired(),
      size: isEmployer ? yup.string().required() : yup.string().notRequired(),
      address: isEmployer
        ? yup.string().required()
        : yup.string().notRequired(),
      landmark: isEmployer
        ? yup.string().required()
        : yup.string().notRequired(),
      floor: yup.string().required(false),
      latitude: yup.string().required(false),
      longitude: yup.string().required(false),
    });
  });

  const initialValues = {
    email: editData?.email ?? "",
    name: editData?.name ?? "",
    password: editData?.password ?? "",
    role: editData?.role ?? "",
    isActive: editData?.isActive ?? true,

    // Company fields
    companyname: "",
    year: "",
    size: "",
    address: "",
    landmark: "",

    latitude: "",
    longitude: "",
    floor: "",
  };

  const handleFileChange = (e) => {
    console.log("files", e.target.files[0]);
    setResume(e.target.files[0]);
  };
  const handleCancel = () => {
    if (typeof onCancel == "function") onCancel();
    else router.push("/");
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
      let roleid = roles.find((elem) => elem.name === selectedRole)?._id;
      console.log("roleid", roleid);
      if (!roleid) {
        console.error("Role Not Selected");
        return;
      }
      let formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("password", values.password);
      formData.append("role", roleid);
      formData.append("isActive", true);
      if (values.companyname) {
        formData.append("companyname", values.companyname);
        formData.append("address", values.address);
        formData.append("year", values.year);
        formData.append("size", values.size);
        formData.append("landmark", values.landmark);
      }
      if (values.floor) {
        formData.append("floor", values.floor);
      }
      if (values.latitude && values.longitude) {
        formData.append("latitude", values.latitude);
        formData.append("longitude", values.longitude);
      }

      if (resume) {
        formData.append("resume", resume);
      }
      const res = await fetch(url, {
        method: method,
        body: formData,
      });
      if (res.status == 200) {
        if (typeof onSuccess == "function") onSuccess();
        else router.push("/Login");
      } else {
        const data = await res.json();
        console.log(data.message);
      }
    } catch (err) {
      console.error("Something Went Wrong", err);
    }
  };

  const companySize = ["0-10", "10-49", "50-249", "250+"];

  return (
    <div className="min-h-screen bg-gray-50  px-4">
      {!user && <LandingNavbar />}
      <div className="max-w-5xl mx-auto  pt-24 pb-20 px-6">
        {/* Tab System */}
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setSelectedRole("Applicant")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                selectedRole === "Applicant"
                  ? "bg-indigo-600 text-white border-b-4 border-indigo-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">👤</span>
                <span>I'm an Applicant</span>
              </div>
              <p className="text-xs mt-1 opacity-80">
                Looking for opportunities
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("Employer")}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                selectedRole === "Employer"
                  ? "bg-purple-600 text-white border-b-4 border-purple-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🏢</span>
                <span>I'm an Employer</span>
              </div>
              <p className="text-xs mt-1 opacity-80">Hiring talent</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            enableReinitialize
          >
            {({ values, errors, touched }) => (
              <Form className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Email Address
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Conditional Fields Based on Role */}
                {selectedRole === "Applicant" && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📄</span>
                      Applicant Details
                    </h3>

                    <div>
                      <label
                        htmlFor="resume"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Resume
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer">
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-all">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              id="resume"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              required
                            />
                            <div className="text-4xl mb-2">📎</div>
                            <p className="text-sm text-gray-600">
                              {resume ? (
                                <span className="text-indigo-600 font-medium">
                                  {typeof resume === "string"
                                    ? resume
                                    : resume.name}
                                </span>
                              ) : (
                                "Click to upload resume"
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC, DOCX (Max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === "Employer" && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏢</span>
                      Company Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="companyname"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Company Name
                        </label>
                        <Field
                          required
                          type="text"
                          id="companyname"
                          name="companyname"
                          placeholder="TechCorp Inc."
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                        />
                        <ErrorMessage
                          name="companyname"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="year"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Registered Year
                        </label>
                        <Field
                          required
                          type="number"
                          id="year"
                          name="year"
                          placeholder="2020"
                          min="1800"
                          max={new Date().getFullYear()}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                        />
                        <ErrorMessage
                          name="year"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="size"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Company Size
                        </label>
                        <Field
                          required
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
                        <ErrorMessage
                          name="size"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Address
                      </label>
                      <Field
                        required
                        as="textarea"
                        id="address"
                        name="address"
                        rows="3"
                        placeholder="123 Business Street, Suite 100"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="mt-6">
                      <label
                        htmlFor="landmark"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Landmark
                      </label>
                      <Field
                        required
                        type="text"
                        id="landmark"
                        name="landmark"
                        placeholder="Near City Center Mall"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                      />
                      <ErrorMessage
                        name="landmark"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Active Status */}
                {/* <div className="flex items-center gap-3 pt-4">
                  <Field
                    id="isActive"
                    type="checkbox"
                    name="isActive"
                    className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-900"
                  >
                    Activate account immediately
                  </label>
                </div> */}

                <div className="mt-6">
                  {/* <label
                    htmlFor="personalAddress"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Personal Address
                  </label>
                  <Field
                    required
                    as="textarea"
                    id="personalAddress"
                    name="personalAddress"
                    rows="3"
                    placeholder="123 Business Street, Suite 100"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                  />
                  <ErrorMessage
                    name="personalAddress"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  /> */}

                  <div className="mt-6">
                    <label
                      htmlFor="floor"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Floor / Apartment Name
                    </label>
                    <Field
                      required
                      as="textarea"
                      id="floor"
                      name="floor"
                      rows="1"
                      placeholder="123 Business Street, Suite 100"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                    />
                    <ErrorMessage
                      name="floor"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="latitude"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Latitude
                    </label>
                    <Field
                      required
                      type="text"
                      id="latitude"
                      name="latitude"
                      placeholder="latitude"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                    />
                    <ErrorMessage
                      name="latitude"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mt-6">
                    <label
                      htmlFor="latitude"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      longitude
                    </label>
                    <Field
                      required
                      type="text"
                      id="longitude"
                      name="longitude"
                      placeholder="longitude"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                    />
                    <ErrorMessage
                      name="longitude"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-x-2 pt-6">
                  <button
                    type="submit"
                    className={`text-white font-semibold rounded-lg text-sm px-6 py-3 focus:ring-4 focus:outline-none transition-all w-[250px] ${
                      selectedRole === "Applicant"
                        ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300"
                        : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-300"
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className=" text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold rounded-lg text-sm px-6 py-3 focus:ring-4 focus:outline-none focus:ring-gray-300 transition-all w-[250px]"
                  >
                    Cancel
                  </button>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/Login"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
