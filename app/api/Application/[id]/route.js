import dbConnect from "@/lib/dbConnect";
import Application from "@/lib/Models/Application";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    console.log("id", id);
    const data = await req.body;
    console.log("Data", data);
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
