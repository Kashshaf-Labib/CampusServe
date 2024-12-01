import { NextResponse } from "next/server";
import { dbConnect } from "@/db/config";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { userid, email, token, orders } = body;

    // Validate required fields
    if (!userid || !email) {
      return NextResponse.json(
        { error: "userid and email are required" },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = await User.create({
      userid,
      email,
      token,
      orders: orders || [],
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}


