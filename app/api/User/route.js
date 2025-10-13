import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function GET(req) {
  try {
    dbConnect();
    const users = await User.find({});
    return NextResponse.json({
      status: 200,
      message: "Connected",
      data: users,
    });
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      data: [],
    });
  }
}

export async function POST(req) {
  try {
    dbConnect();
    const data = await req.json();
    const mail = data.email;
    const existingRecord = await User.findOne({ email: mail });
    if (existingRecord) {
      return NextResponse.json(
        {
          message: "Mail Already Exists",
          status: 409,
        },
        {
          status: 409,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const res = User.create({
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.isActive,
      password: hashedPassword,
    });
    return NextResponse.json(
      {
        message: "User Created",
        status: 200,
        data: res,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      {
        message: err.message || "Failed To Create User",
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
}
