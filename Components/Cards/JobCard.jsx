"use client";
import {
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
export default function JobCard({
  job,
  user,
  userApplications,
  onApply,
  onEdit,
  onDelete,
  onViewApplications,
}) {
  const isApplied = userApplications?.find((app) => app.jobId === job._id);
  const isOwner = user && job.createdBy === user.id;
  const isApplicant = user?.role?.name === "Applicant";
  const isEmployer = user?.role?.name === "Employer";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Image Section with Overlay */}
      {job.image && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          <img
            src={job.image}
            alt={job.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Job Type Badge */}
          {job?.type && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-semibold shadow-lg">
                {job.type}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {job.name}
        </h3>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 mb-4">
          {job?.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{job.location}</span>
            </div>
          )}
          {job?.salaryMax && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span>
                {job.salaryMin} - {job.salaryMax}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {job.description}
        </p>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <Calendar className="w-3.5 h-3.5" />
          Posted {formatDate(job.createdAt)}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Applicant View */}
          {isApplicant && (
            <>
              {isApplied && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Status: {isApplied.status}
                </div>
              )}
              {
                job.isActive ? <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => onApply(job)}
                  className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isApplied
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      Apply Now
                    </>
                  )}
                </button> : "Not Accepting Applications"
              }

            </>
          )}

          {/* Employer View - Owner Actions */}
          {isEmployer && isOwner && (
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onEdit(job)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(job._id)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => onViewApplications(job)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Users className="w-4 h-4" />
                Apps
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
