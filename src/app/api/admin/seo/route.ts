import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getLiveSeoStats } from "@/services/live-analytics-service";

export async function GET(req: Request) {
  try {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    const seoStats = await getLiveSeoStats();

    return NextResponse.json(seoStats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch SEO analytics" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
