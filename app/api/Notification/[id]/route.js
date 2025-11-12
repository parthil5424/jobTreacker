import dbConnect from "@/lib/dbConnect";
import Notification from "@/lib/Models/Notification";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  try {
    dbConnect();
    const { id } = await params;
    console.log("Id", id);
    const res = await Notification.find({ to: id });
    console.log("Res", res);
    return NextResponse.json(
      {
        status: 200,
        message: "Notification Fetched",
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
        message: err.message || "Internal Server Error",
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT({ params }) {
  try {
    const { id } = await params;
    console.log("ID", id);
    const res = await Notification.find({ to: id });
    console.log("Res", res);
    return NextResponse.json(
      {
        status: 200,
        message: "Found Perfectly",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      {
        message: err.message || "Internal Sever Error",
      },
      {
        status: 500,
      }
    );
  }
}
