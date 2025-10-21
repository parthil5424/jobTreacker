"use client";

import { useAuthStore } from "@/Store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  Calendar,
} from "lucide-react";

const ApplicantDashBoard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/DashBoard?id=${user.id}&role=Applicant`);
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
    console.log("Handle View All");
    router.push("/Job");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-200";
      case "under review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "applied":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "withdrawn":
        return "bg-cream-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">Applied Jobs</h2>
                <p className="text-indigo-100 text-sm">
                  Track your applications
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <p className="text-white text-2xl font-bold">
                {data && data.totalJobs}
              </p>
              <p className="text-indigo-100 text-xs">Total</p>
            </div>
          </div>
        </div>

        {/* Recent Jobs List */}
        <div className="px-6 py-4">
          <h3 className="text-gray-700 font-semibold text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Recent Applications
          </h3>

          <div className="space-y-3">
            {data &&
              data.jobs.map((job, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 hover:bg-indigo-50 rounded-xl p-4 transition-all duration-200 border border-gray-100 hover:border-indigo-200 hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Logo */}
                    <div className="bg-white rounded-lg p-2 text-2xl flex-shrink-0 shadow-sm border border-gray-100 overflow-ellipsis"></div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                        {job.jobId.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-2">
                        {/* <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span> */}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(job?.createdAt) ?? ""}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleViewAll}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group cursor-pointer"
          >
            View All Applications
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashBoard;
