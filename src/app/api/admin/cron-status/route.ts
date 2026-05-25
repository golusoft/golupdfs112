import { NextResponse } from "next/server";
import { getDbLogs } from "@/lib/admin/mock-blog-data";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    const logs = await getDbLogs();
    
    // Get last 20 cron execution logs
    const cronLogs = logs
      .filter(l => l.action === 'cron' || l.action === 'publish')
      .slice(0, 20)
      .map(l => ({
        id: l.id,
        ts: l.ts,
        action: l.action,
        status: l.status,
        details: l.details,
        keyword: l.keyword,
      }));

    // Compute stats
    const publishedToday = logs.filter(l => {
      const logDate = new Date(l.ts);
      const today = new Date();
      return logDate.toDateString() === today.toDateString() &&
             l.action === 'publish' && l.status === 'success';
    }).length;

    const failedToday = logs.filter(l => {
      const logDate = new Date(l.ts);
      const today = new Date();
      return logDate.toDateString() === today.toDateString() && l.status === 'failed';
    }).length;

    return NextResponse.json({
      cronLogs,
      stats: {
        publishedToday,
        failedToday,
        totalLogs: logs.length,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
