import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.API_URL || "http://localhost:5000";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

// GET /api/curate-resources — get resources for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${API_URL}/curate-resources/${session.user.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
          "x-internal-secret": INTERNAL_SECRET,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching curated resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/curate-resources — create new resources
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject } = await req.json();

    const res = await fetch(`${API_URL}/curate-resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": session.user.id,
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        userId: session.user.id,
        subject,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error creating curated resources:", error);
    return NextResponse.json(
      { error: "Failed to create resources" },
      { status: 500 }
    );
  }
}

// DELETE /api/curate-resources?resourceId=xxx — delete a resource
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resourceId = req.nextUrl.searchParams.get("resourceId");
    if (!resourceId) {
      return NextResponse.json(
        { error: "resourceId is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/curate-resources/${resourceId}`, {
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
    console.error("Error deleting curated resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
