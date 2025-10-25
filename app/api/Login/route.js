import dbConnect from "@/lib/dbConnect";
import User from "@/lib/Models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Role from "@/lib/Models/Role";

export async function POST(req, { params }) {
  try {
    dbConnect();
    console.log("Login");
    const { email, password, provider } = await req.json();

    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return NextResponse.json(
        {
          message: "No User Found With this email",
          data: [],
        },
        { status: 404 }
      );
    }
    if (provider !== "google") {
      const CompPass = await bcrypt.compare(password, isExist.password);
      if (!CompPass) {
        return NextResponse.json(
          {
            message: "Invalid UserName or Password",
            data: [],
          },
          { status: 404 }
        );
      }
    }

    const roleName = (await Role.findById(isExist.role).select("name").lean())
      ?.name;

    console.log("isExist", isExist);

    const userData = {
      id: isExist._id,
      name: isExist.name,
      email: isExist.email,
      role: { id: isExist.role, name: roleName },
      resume: isExist.resume,
      companyDetails: isExist?.companyDetails ?? null,
      resume: isExist?.resume ?? null,
    };

    const token = jwt.sign(
      {
        userId: userData._id,
        email: userData.email,
        role: userData.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login SuccessFully",
        data: userData,
        token: token,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("err", err);
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
