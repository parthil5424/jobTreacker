import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import Job from "@/lib/Models/Job";
const uploadDir = path.join(process.cwd(), "public/uploads");
await fs.mkdir(uploadDir, { recursive: true });
export async function GET(req) {
  try {
    dbConnect();
    const res = await Job.find({});
    return NextResponse.json(
      {
        data: res,
        message: "Fetched jobs Successfully",
        status: 200,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        data: [],
        message: err.message || "Failed to fetch Jobs",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    dbConnect();
    const data = await req.formData();
    console.log("data", data);
    const fields = {};
    let imageUrl = "";
    let image = "";
    for (const [key, value] of data.entries()) {
      if (key === "image" && value instanceof File) {
        image = value;
      } else {
        fields[key] = value;
      }
    }
    const { name, description, isActive, createdBy } = fields;
    if (image != "" && image != undefined && image != null) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${uniqueSuffix}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const res = await Job.create({
      name: name,
      description: description,
      isActive: isActive,
      image: imageUrl,
      createdBy: createdBy,
    });
    return NextResponse.json(
      {
        message: "Job Created Successfully",
        data: res,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("err", err);
    return NextResponse.json(
      {
        message: err.message || "internal Server Error",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
