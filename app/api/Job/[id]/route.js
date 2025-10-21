import dbConnect from "@/lib/dbConnect";
import Job from "@/lib/Models/Job";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
const uploadDir = path.join(process.cwd(), "public/uploads");
await fs.mkdir(uploadDir, { recursive: true });
export async function PUT(req, { params }) {
  try {
    dbConnect();
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Job Not Found", data: [] },
        {
          status: 400,
          message: "Job Not Found",
        }
      );
    }
    let image = "",
      imageurl = "";
    const data = await req.formData();
    let fields = {};
    for (const [key, value] of data.entries()) {
      if (key === "image" && value instanceof File) {
        image = value;
      } else if (key === "image" && typeof value == "string") {
        image = null;
        imageurl = value;
      } else {
        fields[key] = value;
      }
    }
    const { name, description, isActive, createdBy } = fields;
    if (image != undefined && image != null) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      imageurl = `/uploads/${fileName}`;
    }

    const res = await Job.findByIdAndUpdate(id, {
      name: name,
      description: description,
      isActive: isActive,
      image: imageurl,
      createdBy: createdBy,
    });
    return NextResponse.json(
      {
        message: "Updated Successfully",
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
        message: err.message || "Failed to Update",
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          message: "Could Not Find Record",
        },
        {
          status: 404,
        }
      );
    }
    console.log("id", id);
    const res = await Job.findByIdAndDelete(id);
    return NextResponse.json(
      {
        messsgae: "Deleted Successfully",
        data: res,
        status: 200,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("error", err);
    return NextResponse.json(
      {
        message: err.message || "",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
