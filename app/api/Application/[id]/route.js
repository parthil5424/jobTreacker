import dbConnect from "@/lib/dbConnect";
import Application from "@/lib/Models/Application";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const res = await Application.findByIdAndUpdate(id, {
      status: data.status,
    });
    return NextResponse.json(
      {
        message: "Status Updated Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      {
        message: err.message || "",
      },
      {
        status: 500,
      }
    );
  }
}
