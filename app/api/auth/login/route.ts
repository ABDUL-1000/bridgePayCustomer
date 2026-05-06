import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { user, token } = await request.json();

  if (!user || !token) {
    return NextResponse.json({ message: "User data or token missing" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: false, // must be readable by browser JS so axios can attach it as Bearer
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", user }, { status: 200 });
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json({ message: "Failed to set authentication cookie" }, { status: 500 });
  }
}
