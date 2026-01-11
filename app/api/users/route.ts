import { NextResponse } from "next/server";
import { connectDB } from "@/config/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { firebaseUid, email, name, provider } = body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        name,
        provider,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}
