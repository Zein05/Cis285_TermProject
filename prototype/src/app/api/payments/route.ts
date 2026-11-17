import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pairwiseDebts } from "@/lib/balances";
export const runtime = "nodejs";
function parseCents(value: unknown): number | null {
  const text = String(value ?? "").trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}
export async function POST(request: Request) {
  try {
    const { groupId, payerId, payeeId, amount, date, note } = await request.json();
    const amountCents = parseCents(amount);
    if (!groupId || !payerId || !payeeId || payerId === payeeId || amountCents === null || amountCents <= 0 || !date) return NextResponse.json({ error: "Choose two different members, a positive amount, and a date." }, { status: 400 });
    const [members, expenses, payments] = await Promise.all([
      prisma.groupMember.findMany({ where: { groupId } }),
      prisma.expense.findMany({ where: { groupId }, include: { shares: true } }),
      prisma.payment.findMany({ where: { groupId } }),
    ]);
    if (![payerId, payeeId].every((id: string) => members.some((member) => member.userId === id))) return NextResponse.json({ error: "Both people must belong to this group." }, { status: 400 });
    const debt = pairwiseDebts(expenses, payments).find((entry) => entry.payerId === payerId && entry.payeeId === payeeId);
    if (!debt || amountCents > debt.amountCents) return NextResponse.json({ error: "That payment is larger than the current amount owed between these members." }, { status: 400 });
    const payment = await prisma.payment.create({ data: { groupId, payerId, payeeId, amountCents, paidAt: new Date(`${date}T12:00:00.000Z`), note: note?.trim() || null } });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Unable to record payment", error);
    return NextResponse.json({ error: "Payment could not be saved. Please try again." }, { status: 500 });
  }
}
