import { getConceptById } from "@/lib/concepts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  if (!id.trim()) return NextResponse.json({ item: null }, { status: 400 });

  const item = getConceptById(id);
  if (!item) return NextResponse.json({ item: null }, { status: 404 });

  return NextResponse.json({ item });
}
