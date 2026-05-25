import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getLiveDashboardStats, clearAnalyticsCache } from "@/services/live-analytics-service";

export async function GET(req: Request) {
  try {
    // 1. Secure administrator session / auth gate
    const authError = await verifyAuth(req);
    if (authError) return authError;

    // 2. Read query params to check force refresh
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    if (forceRefresh) {
      clearAnalyticsCache();
    }

    // 3. Compile and pull live metrics
    const stats = await getLiveDashboardStats(forceRefresh);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Dashboard Stats API failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
