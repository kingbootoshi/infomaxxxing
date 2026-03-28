import { searchConcepts } from "@/lib/concepts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ items: [] });

  const items = searchConcepts(q);
  return NextResponse.json({ items });
}
