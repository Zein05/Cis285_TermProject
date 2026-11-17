import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { decision } = await request.json();
    if (!["APPROVED", "REJECTED"].includes(decision)) return NextResponse.json({ error: "Choose approve or reject." }, { status: 400 });
    const result = await prisma.expense.updateMany({ where: { id, status: "PENDING" }, data: { status: decision } });
    if (!result.count) return NextResponse.json({ error: "This expense is no longer awaiting review." }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to review expense", error);
    return NextResponse.json({ error: "Your review could not be saved." }, { status: 500 });
  }
}
