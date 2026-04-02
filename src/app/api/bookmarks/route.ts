import { NextRequest, NextResponse } from "next/server";
import { getConceptsByIds } from "@/lib/concepts";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({ items: [] });
  const idList = ids.split(",").filter(Boolean);
  const items = getConceptsByIds(idList);
  return NextResponse.json({ items });
}
