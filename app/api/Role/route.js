import dbConnect from "@/lib/dbConnect";
import Role from "@/lib/Models/Role";
import { NextResponse } from "next/server";
export async function GET(req) {
  try {
    dbConnect();
    const data = await Role.find({});
    return NextResponse.json({
      status: 200,
      message: "Roles Fetched Successfully",
      data: data,
    });
  } catch (err) {
    console.log("error", err);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch Roles",
      data: [],
    });
  }
}
export async function POST(req) {
  try {
    dbConnect();
    const data = await req.json();
    const existingRecord = await Role.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
    });
    if (existingRecord) {
      return NextResponse.json({
        status: 409,
        message: "Role Name Already Exits",
      });
    }
    const res = await Role.create({
      name: data.name.trim(),
      isActive: data.isActive || true,
    });
    return NextResponse.json({
      status: 200,
      message: "Role Created",
      data: res,
    });
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json({
      status: 500,
      message: "Failed to add Role",
    });
  }
}
