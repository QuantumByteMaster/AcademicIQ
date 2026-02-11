import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendRecoveryEmail } from "@/lib/mail";
import { z } from "zod";

// Simple in-memory rate limiter (Note: resets on server restart/lambda cold start)
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3; // 3 requests per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

const recoverSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(req: Request) {
  try {
    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = recoverSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    await connectMongoDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account with that email exists, recovery credentials have been sent.",
        },
        { status: 200 }
      );
    }

    // Generate a random 10-character temporary password
    const tempPassword = crypto.randomBytes(5).toString("hex");

    // Hash it and save to the database
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Send recovery email
    await sendRecoveryEmail({
      to: user.email,
      username: user.name,
      tempPassword,
    });

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, recovery credentials have been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during account recovery:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
