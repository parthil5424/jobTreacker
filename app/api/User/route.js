import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
const uploadDir = path.join(process.cwd(), "public/uploads");
export async function GET(req) {
  try {
    await dbConnect();
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
    const data = await req.formData();

    const mail = data.get("email");
    const fields = {};
    let imageUrl = "";
    let image = "";
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
    const hashedPassword = await bcrypt.hash(data.get("password"), 10);
    for (const [key, value] of data.entries()) {
      if (key === "resume" && value instanceof File) {
        image = value;
      } else {
        fields[key] = value;
      }
    }
    const { email, name, role, isActive } = fields;
    if (image != "" && image != undefined && image != null) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      imageUrl = `/uploads/${fileName}`;
    }

    let userObj = {
      email: email,
      name: name,
      role: role,
      isActive: isActive,
      password: hashedPassword,
      ...(imageUrl !== "" && { resume: imageUrl }),
    };
    if (data.get("companyname")) {
      userObj.companyDetails = {
        name: data.get("companyname"),
        registeredYear: data.get("year"),
        size: data.get("size"),
        address: data.get("address"),
        landmark: data.get("landmark"),
      };
    }
    const res = await User.create(userObj);
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
