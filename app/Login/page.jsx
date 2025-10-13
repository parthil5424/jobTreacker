"use client";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

function Login() {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        if (data.data.role.name == "Admin") {
          router.push("/DashBoard");
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
  return (
    <div>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          email: "",
          password: "",
        }}
      >
        <Form>
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
          <div className="flex space-between">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
