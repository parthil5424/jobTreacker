import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_KEY);
export default async function middleWare(request) {
  const token = request.cookies.get("auth-token")?.value;
  const pathname = request.nextUrl.pathname;

  let verified = false;
  let userRole = null;
  try {
    if (token) {
      verified = await jwtVerify(token, secret);
      userRole = verified?.payload?.role || null;
    }
  } catch (err) {
    console.error("Error", err);
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (!token) {
      return NextResponse.next();
    }

    if (userRole.name === "Admin") {
      return NextResponse.redirect(new URL("/Admin/DashBoard", request.url));
    } else {
      return NextResponse.redirect(new URL("/Merchant/DashBoard", request.url));
    }
  }

  const publicRoutes = ["/Login", "/SignUp", "/", "/login", "/signup"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  try {
    if (!verified) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }

    if (pathname.includes("/Admin") && userRole.name !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Error", err);
    return NextResponse.redirect(new URL("/Login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
