import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
import Role from "@/lib/Models/Role";
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
    const { name, email, isActive, role, floor, latitude, longitude } = fields;
    if (image != undefined && image != null && image != "") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      imageurl = `/uploads/${fileName}`;
    }

    let userObj = {
      email: email,
      name: name,
      role: role,
      isActive: isActive,
      ...(imageurl !== "" && { resume: imageurl }),
    };
    if (data.get("companyname")) {
      userObj.companyDetails = {
        name: data.get("companyname"),
        registeredYear: data.get("year"),
        size: data.get("size"),
        address: data.get("address"),
        landMark: data.get("landmark"),
      };
    }
    if (data.get("floor") && data.get("latitude")) {
      userObj.personalAddress = {
        floor: data.get("floor"),
        latitude: data.get("latitude"),
        longitude: data.get("longitude"),
      };
    }
    let res = await User.findByIdAndUpdate(
      id,
      { ...userObj }, //
      { new: true }
    );

    const roleName = await Role.findById(res.role).select("name _id");
    const updatedUserObj = {
      ...userObj,
      role: {
        id: roleName._id,
        name: roleName.name,
      },
    };
    return NextResponse.json(
      {
        data: updatedUserObj,
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
