"use client";
import UserForm from "@/Components/Forms/UserForm";
import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import UserProfile from "../../Merchant/UserProfile/page";

function page() {
  const [isOpen, setisOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const [editData, setEditData] = useState(null);
  const [allRoles, setAllRoles] = useState([]);

  const addUser = () => {
    setisOpen(true);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/User");
      const data = await res.json();
      if (data.status == 200) {
        setUsers(data.data);
      } else {
        console.log("Failed tom fetch User");
      }
    } catch (err) {
      console.error("Failed to fetch Users", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/Role");
      const data = await res.json();
      setAllRoles(data.data);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getRoleName = (id) => {
    try {
      if (allRoles.length > 0) {
        const roleName = allRoles.find((role) => role._id === id)?.name;
        return roleName;
      } else {
        return "No Role Assigned";
      }
    } catch (err) {
      console.error("error ", err);
      return "";
    }
  };

  const handleEdit = (elem) => {
    let editElem = { ...elem };
    editElem.roleName = getRoleName(elem.role);
    setEditData(editElem);
    setIsEditOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const res = await fetch(`/api/User/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status == 200) {
        console.log("Deleted Successfully");
        fetchData();
      } else {
        console.log("Failed to delete role");
      }
    } catch (err) {
      console.error("Failed to Delete Role");
    }
  };

  const onSuccess = () => {
    fetchData();
    setisOpen(false);
  };

  const onCancel = () => {
    setisOpen(false);
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    employer: "bg-blue-100 text-blue-700",
    applicant: "bg-green-100 text-green-700",
    default: "bg-gray-100 text-gray-700",
  };

  const getRoleColor = (role) => {
    const roleLower = role?.toLowerCase() || "";
    return roleColors[roleLower] || roleColors.default;
  };

  if (isEditOpen) {
    return <UserProfile editData={editData} />;
  }

  if (isOpen && UserForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <UserForm
          onSuccess={onSuccess}
          onCancel={onCancel}
          editData={editData}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage all platform users
                </p>
              </div>
            </div>

            <button
              onClick={addUser}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {/* Search Bar */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div> */}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* User Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                            getRoleName(user.role)
                          )}`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {getRoleName(user.role)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 hover:scale-105 transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 hover:scale-105 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Users Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Start by adding your first user
                        </p>
                        {
                          <button
                            onClick={addUser}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            <UserPlus className="w-5 h-5" />
                            Add First User
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          {users && users.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Total Users:{" "}
                  <span className="font-semibold text-gray-900">
                    {users.length}
                  </span>
                </span>
                <div className="flex gap-4">
                  <span className="text-gray-600">
                    Active:{" "}
                    <span className="font-semibold text-green-600">
                      {users.filter((u) => u.isActive).length}
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Inactive:{" "}
                    <span className="font-semibold text-red-600">
                      {users.filter((u) => !u.isActive).length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
