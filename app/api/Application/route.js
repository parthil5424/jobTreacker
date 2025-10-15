import dbConnect from "@/lib/dbConnect";
import Application from "@/lib/Models/Application";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import Job from "@/lib/Models/Job";
const uploadDir = path.join(process.cwd(), "public/uploads");
await fs.mkdir(uploadDir, { recursive: true });

export async function GET(req, { params }) {
  try {
    dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const user = searchParams.get("user");
    console.log("Role", role);
    console.log("user", user);
    let res = [];
    if (role == "Admin") {
      res = await Application.find({}).populate("userId", "name email");
    } else if (role == "Employer") {
      const jobIds = await Job.find({ createdBy: user }).distinct("_id");
      console.log("jobIds", jobIds);
      res = await Application.find({
        jobId: { $in: jobIds },
      }).populate("userId", "name email");
    } else {
      res = await Application.find({
        userId: user,
      }).populate("userId", "name email");
    }
    return NextResponse.json({
      status: 200,
      data: res,
      message: "Fetched Application Successfully",
    });
  } catch (err) {
    console.log("error", err);
    return NextResponse.json(
      {
        status: 500,
        data: [],
        message: err.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const jobId = data.get("jobId");
    const userId = data.get("userId");
    const status = data.get("status");
    const uploadedResume = data.get("uploadedResume");
    console.log("data", data);
    const isAppliedBefore = await Application.findOne({
      jobId: jobId,
      userId: userId,
    });
    if (isAppliedBefore) {
      return NextResponse.json(
        {
          message: "Already Applied to this Job",
          status: 409,
        },
        {
          status: 409,
        }
      );
    }
    let fileUrl = "";
    if (uploadedResume instanceof File) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${uploadedResume.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await uploadedResume.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      fileUrl = `/uploads/${fileName}`;
    } else {
      fileUrl = uploadedResume;
    }
    const res = await Application.create({
      jobId: jobId,
      userId: userId,
      status: status,
      uploadedResume: fileUrl,
    });
    return NextResponse.json(
      {
        status: 200,
        message: "Applied Successfully",
        data: res,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json(
      {
        status: 500,
        message: err.message || "Something Went Wrong",
      },
      { status: 500 }
    );
  }
}
