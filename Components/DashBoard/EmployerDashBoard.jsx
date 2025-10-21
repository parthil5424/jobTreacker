"use client";
import { useAuthStore } from "@/Store/useAuthStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Search,
} from "lucide-react";

const EmployerDashBoard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/DashBoard?id=${user.id}&role=Employer`);
      if (res.status == 200) {
        const data = await res.json();
        setData(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleViewAll = () => {
    router.push("/Job");
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  if (loading) return <div>Loading</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Employer Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back! Here's what's happening with your job posts
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Jobs Posted */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 rounded-xl p-3">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Jobs Posted
            </h3>
            <p className="text-3xl font-bold text-gray-900">{data.totalJob}</p>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-xl p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Applications
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {data.totalApplication}
            </p>
            {/* <p className="text-xs text-gray-500 mt-2">
              {stats.pendingReviews} pending review
            </p> */}
          </div>

          {/* Avg Applications per Job */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-xl p-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
                +15%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Avg. Applications
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(stats.totalApplications / stats.totalJobs)}
            </p>
            <p className="text-xs text-gray-500 mt-2">per job posting</p>
          </div> */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold">
                      Recent Job Posts
                    </h2>
                    <p className="text-indigo-100 text-xs">
                      Your latest opportunities
                    </p>
                  </div>
                </div>
                <button className="text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {data.jobs.map((job) => (
                    <div
                      key={job._id}
                      className="group bg-gray-50 hover:bg-indigo-50 rounded-xl p-4 transition-all border border-gray-100 hover:border-indigo-200 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                            {job.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                            {/* <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              {job.salary}
                            </span> */}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(job?.createdAt) ?? ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  onClick={handleViewAll}
                >
                  View All Jobs
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashBoard;
