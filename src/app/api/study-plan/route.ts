import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

// GET /api/study-plan — get plans for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/generate-plan/${session.user.id}`, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-internal-secret": INTERNAL_SECRET,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching study plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch study plans" },
      { status: 500 }
    );
  }
}

// POST /api/study-plan — create a new plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, examDate } = await req.json();

    const res = await fetch(`${API_URL}/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        userId: session.user.id,
        subject,
        examDate,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error creating study plan:", error);
    return NextResponse.json(
      { error: "Failed to create study plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/study-plan?planId=xxx — delete a plan
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planId = req.nextUrl.searchParams.get("planId");
    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/generate-plan/${planId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-internal-secret": INTERNAL_SECRET,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error deleting study plan:", error);
    return NextResponse.json(
      { error: "Failed to delete study plan" },
      { status: 500 }
    );
  }
}
