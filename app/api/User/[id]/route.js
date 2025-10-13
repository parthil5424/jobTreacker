import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
  try {
    dbConnect();
    const { id } = await params;
    if (id == "" || id == null || id == undefined) {
      return NextResponse.json(
        {
          message: "Failed to find User",
        },
        {
          status: 404,
        }
      );
    }
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const res = await User.findByIdAndUpdate(id, {
      name: data.name,
      email: data.email,
      isActive: data.isActive,
      role: data.role,
      password: hashedPassword,
    });
    return NextResponse.json(
      {
        data: res,
        message: "user Updated Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Failed to update user", err);
    return NextResponse.json(
      {
        data: [],
        message: "Failed to Update user",
      },
      {
        status: 200,
      }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    dbConnect();
    const { id } = await params;
    if (id == "" || id == null || id == undefined) {
      return NextResponse.json(
        {
          message: "Failed to find User",
        },
        {
          status: 404,
        }
      );
    }
    const res = await User.findByIdAndDelete(id);
    return NextResponse.json(
      {
        message: "User Deleted Successfully",
        data: res,
        status: 200,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message || "Failed to Delete",
      },
      { status: 500 }
    );
  }
}
