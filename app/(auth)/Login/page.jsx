"use client";

import LandingNavbar from "@/Components/LandingNavbar";
import { useAuthStore } from "@/Store/useAuthStore";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Mail, Lock, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

function Login() {
  console.log("Login Called");
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
        toast.success("Login Successfully");
      } else {
        console.log("Login Failed", data.message);
        toast.error(data.message || "Failed to Login");
      }
    } catch (err) {
      console.error("Failed to Login", err);
    }
  };

  const handleSignUp = () => {
    router.push("/SignUp");
  };

  const handleGoogleClick = async () => {
    try {
      const res = await signIn("google", {
        callbackUrl: "/google/complete",
      });
    } catch (err) {
      console.error("Error", err);
    }
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
                      className="block text-sm font-medium text-gray-700 mb-2 mt-2"
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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                onClick={handleGoogleClick}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              {/* <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all  cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  GitHub
                </span>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
