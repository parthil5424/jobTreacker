import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Data", data);
    return NextResponse.json(
      {
        message: "Data Found",
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
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = await req.JSON();
    console.log("id", id);
    return NextResponse.json(
      {
        message: "Deleted Successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error", err);
    return NextResponse.json(
      {
        message: err.message || "internal server Error",
      },
      {
        status: 500,
      }
    );
  }
}
