"use client";
import RoleForm from "@/Components/Forms/RoleForm";
import React, { useCallback, useEffect, useState } from "react";
import { Shield, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';


function role() {
  const [isOpen, setisOpen] = useState(false);
  const [roles, setRoles] = useState(null);
  const [editData, setEditData] = useState(null);

  const addRole = () => {
    setisOpen(true);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/Role");
      const data = await res.json();
      if (data.status == 200) {
        setRoles(data.data);
      } else {
        console.log("Failed tom fetch data");
      }
    } catch (err) {
      console.error("Failed to fetch Role", err);
    }
  };

  const handleEdit = useCallback((elem) => {
    setEditData(elem);
    setisOpen(true);
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const res = await fetch(`/api/Role/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status == 200) {
        console.log("Deleted Successfully");
      } else {
        console.log("Failed to delete role");
      }
    } catch (err) {
      console.error("Failed to Delete Role");
    }
  };

  const onSuccess = useCallback(() => {
    fetchData();
    setisOpen(false);
  }, []);

  const onCancel = useCallback(() => {
    setEditData(null)
    setisOpen(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // if (isOpen && RoleForm) {
  //   return (

  //   );
  // }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Roles Management</h1>
                <p className="text-gray-600 text-sm">Manage user roles and permissions</p>
              </div>
            </div>

            <button
              onClick={addRole}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Role
            </button>
          </div>

          {/* Search Bar */}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {roles && roles.length > 0 ? (
                  roles.map((elem, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Role Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {elem.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {elem.isActive ? (
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
                            type="button"
                            onClick={() => handleEdit(elem)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 hover:scale-105 transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(elem._id)}
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
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                          <Shield className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Roles Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Start by adding your first role
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          {roles && roles.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Total Roles: <span className="font-semibold text-gray-900">{roles.length}</span>
                </span>
                <div className="flex gap-4">
                  <span className="text-gray-600">
                    Active: <span className="font-semibold text-green-600">
                      {roles.filter(r => r.isActive).length}
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Inactive: <span className="font-semibold text-red-600">
                      {roles.filter(r => !r.isActive).length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}


          {
            isOpen &&
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
              <RoleForm
                onSuccess={onSuccess}
                onCancel={onCancel}
                editData={editData}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default role;
