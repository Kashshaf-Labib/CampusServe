import { NextResponse } from "next/server";
import {dbConnect} from "../../../db/config";

export async function GET() {
  try {
    const connection = await dbConnect();
    console.log("MongoDB Connected:", connection?.connections[0]?.readyState === 1);
    return NextResponse.json({ message: "MongoDB connection successful!" });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json({ message: "MongoDB connection failed!", error }, { status: 500 });
  }
}
