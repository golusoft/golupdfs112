import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { requestGoogleIndexing } from "@/services/google-search-console";

export async function POST(req: Request) {
  try {
    const authError = await verifyAuth(req);
    if (authError) return authError;

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing target URL" }, { status: 400 });
    }

    const result = await requestGoogleIndexing(url);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process indexing request" },
      { status: 500 }
    );
  }
}
