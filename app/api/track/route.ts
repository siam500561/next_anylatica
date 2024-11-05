import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  try {
    const authHeader = req.headers.get("authorization");
    const apiKey = authHeader?.split(" ")[1];

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { visitorId, userAgent, isNewVisitor } = body;

    // Only track the visit if it's a new visitor
    if (isNewVisitor) {
      const result = await client.mutation(api.visitors.trackVisit, {
        apiKey,
        visitorId,
        userAgent: userAgent || "Unknown",
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });

      return NextResponse.json(
        { success: true, result },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // For existing visitors, just return success without tracking
    return NextResponse.json(
      { success: true, existing: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error tracking view:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const statusCode =
      errorMessage === "No websites registered yet" ? 404 : 500;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
