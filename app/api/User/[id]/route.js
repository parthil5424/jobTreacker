import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
const uploadDir = path.join(process.cwd(), "public/uploads");

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
    let image = "",
      imageurl = "";
    const data = await req.formData();
    const hashedPassword = await bcrypt.hash(data.get("password"), 10);
    let fields = {};
    for (const [key, value] of data.entries()) {
      if (key === "resume" && value instanceof File) {
        image = value;
      } else if (key === "resume" && typeof value == "string") {
        image = null;
        imageurl = value;
      } else {
        fields[key] = value;
      }
    }
    const { name, email, isActive, role } = fields;
    if (image != undefined && image != null && image != "") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      imageurl = `/uploads/${fileName}`;
    }
    const res = await User.findByIdAndUpdate(id, {
      name: name,
      email: email,
      isActive: isActive,
      role: role,
      password: hashedPassword,
      ...(imageurl !== "" && { resume: imageurl }),
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
        status: 500,
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
