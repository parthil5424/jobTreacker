import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Application from "@/lib/Models/Application";
import Job from "@/lib/Models/Job";
import User from "@/lib/Models/User";
import Role from "@/lib/Models/Role";
export async function GET(req, { params }) {
  try {
    dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const id = searchParams.get("id");
    let data = {};
    if (role != "Admin") {
      if (role == "Applicant") {
        const appliedJobs = await Application.find({
          userId: id,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("jobId");
        const totalAppliedJobs = appliedJobs.length;
        data = {
          totalJobs: totalAppliedJobs,
          jobs: appliedJobs,
        };
      } else if (role == "Employer") {
        const jobsPosted = await Job.find({
          createdBy: id,
        }).sort({ createdAt: -1 });
        const totalJob = jobsPosted.length;
        const jobIds = jobsPosted.map((job) => job._id);

        const totalApplication = await Application.countDocuments({
          jobId: { $in: jobIds },
        });
        console.log("totalApplication", totalApplication);
        data = {
          totalJob: totalJob,
          jobs: jobsPosted,
          totalApplication: totalApplication,
        };
      }
    } else {
      const [employerRoleId, ApplicantRoleId] = await Promise.all([
        Role.findOne({
          name: "Employer",
        })
          .select("_id")
          .lean()
          .then((r) => r._id),
        Role.findOne({ name: "Applicant" })
          .select("_id")
          .lean()
          .then((r) => r._id),
      ]);

      const Users = await User.find({});
      const totalUsers = Users.length;
      const activeUsers = Users.filter((elem) => elem.isActive == true).length;

      const totalEmployer = Users.filter(
        (elem) => elem.role.toString() == employerRoleId.toString()
      ).length;

      const totalApplicant = Users.filter(
        (elem) => elem.role.toString() == ApplicantRoleId.toString()
      ).length;

      const jobs = await Job.find({});
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter((elem) => elem.isActive == true).length;

      data.totalUsers = totalUsers;
      data.activeUsers = activeUsers;
      data.totalJobs = totalJobs;
      data.activeJobs = activeJobs;
      data.totalEmployer = totalEmployer;
      data.totalApplicant = totalApplicant;
    }
    return NextResponse.json(
      {
        message: "DashBoard Data Fetched Successfully",
        status: 200,
        data: data,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Err", err);
    return NextResponse.json(
      {
        message: err.message || "Failed to fetch Dashbaord Data",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
