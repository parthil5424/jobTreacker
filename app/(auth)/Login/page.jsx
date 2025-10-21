"use client";

import LandingNavbar from "@/Components/LandingNavbar";
import { useAuthStore } from "@/Store/useAuthStore";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      console.log("Values", values);
      const res = await fetch("/api/Login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status == 200) {
        login(data.data, data.token);
        if (data.data.role.name == "Admin") {
          router.push("/Admin/DashBoard");
        } else {
          router.push("/Merchant/DashBoard");
        }
      } else {
        console.log("Login Failed", data.message);
      }
    } catch (err) {
      console.error("Failed to Login", err);
    }
  };

  const handleSignUp = () => {
    router.push("/SignUp");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <LandingNavbar />
      <div className="flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>
            <Formik
              onSubmit={handleSubmit}
              initialValues={{
                email: "",
                password: "",
              }}
              className="space-y-5"
            >
              {({ values, errors, touched }) => (
                <Form>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      User email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1.5 ml-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white mb-1"
                    >
                      PassWord
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={showPassword ? `text` : "password"}
                        id="password"
                        name="password"
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.password && touched.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center  cursor-pointer focus-visible:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                      {errors.password && touched.password && (
                        <div className="text-red-500 text-sm mt-1.5 ml-1">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-5 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
