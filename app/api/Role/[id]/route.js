import dbConnect from "@/lib/dbConnect";
import Role from "@/lib/Models/Role";
import { NextResponse } from "next/server";
export async function PUT(req, { params }) {
  try {
    dbConnect();
    const { id } = await params;
    if (id == "") {
      return NextResponse.json({
        status: 400,
        message: "Role Not Found",
      });
    }
    const { name, isActive } = await req.json();
    const res = await Role.findByIdAndUpdate(id, {
      name,
      isActive,
    });
    return NextResponse.json({
      status: 200,
      message: "Role Updated Successfully",
      data: res,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      message: "Failed to update Role",
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (id == "") {
      return NextResponse.json({
        status: 400,
        message: "Cannot Find Record to Delete",
      });
    }
    const res = await Role.findByIdAndDelete(id);
    return NextResponse.json({
      status: 200,
      message: "Role Deleted Successfully",
      data: res,
    });
  } catch (err) {
    console.log("error Occurred", err);
    return NextResponse.json({
      status: 500,
      message: "Failed to Delete Record",
    });
  }
}
