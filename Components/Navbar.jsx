"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { logout, user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/Login");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!user) return <div>Loading</div>;
  return (
    <nav className="border-gray-200 bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Briefcase className="w-6 h-6 text-white" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            JobTracker
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto " id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:border-gray-700 items-center">
            <li>
              <Link
                href={`/${
                  user && user?.role?.name == "Admin" ? "Admin" : "Merchant"
                }/DashBoard`}
                className="block py-2 px-3 text-white  md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/Job"
                className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:bg-transparent"
              >
                Job
              </Link>
            </li>

            {user && user?.role?.name == "Admin" && (
              <>
                <li>
                  <Link
                    href="/Admin/Role"
                    className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:bg-transparent"
                  >
                    Role
                  </Link>
                </li>

                <li>
                  <Link
                    href="/Admin/User"
                    className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:bg-transparent"
                  >
                    User
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Admin/Application"
                    className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:bg-transparent"
                  >
                    Application
                  </Link>
                </li>
              </>
            )}

            <li>
              <button
                onClick={handleLogout}
                href="#"
                className="block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-white md:dark:hover:bg-transparent"
              >
                Logout
              </button>
            </li>
            <li className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
                  {/* Avatar Button */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold focus:outline-none hover:opacity-90">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Username  */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </span>
                  </div>
                </div>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                    Role:{" "}
                    <span className="font-semibold text-gray-900">
                      {user?.role?.name}
                    </span>
                  </div>
                  <Link
                    href="/Merchant/UserProfile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    View Profile
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
