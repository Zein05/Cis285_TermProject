import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
function parseCents(value: unknown): number | null {
  const text = String(value ?? "").trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}
function allocate(total: number, weights: number[]) {
  const whole = weights.map((weight) => Math.floor((total * weight) / weights.reduce((a, b) => a + b, 0)));
  let remainder = total - whole.reduce((a, b) => a + b, 0);
  for (let i = 0; remainder > 0; i = (i + 1) % whole.length, remainder--) whole[i]++;
  return whole;
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId, payerId, description, amount, date, participantIds, splitType, percentages } = body;
    const amountCents = parseCents(amount);
    if (!groupId || !payerId || !String(description ?? "").trim() || amountCents === null || amountCents <= 0 || !date || !Array.isArray(participantIds) || !participantIds.length || !participantIds.includes(payerId)) return NextResponse.json({ error: "Add a description, positive amount, date, and participants. The payer must be included." }, { status: 400 });
    if (new Set(participantIds).size !== participantIds.length) return NextResponse.json({ error: "Each participant can only be selected once." }, { status: 400 });
    const members = await prisma.groupMember.findMany({ where: { groupId, userId: { in: participantIds } } });
    if (members.length !== participantIds.length) return NextResponse.json({ error: "Every participant must belong to this group." }, { status: 400 });
    let weights = participantIds.map(() => 1);
    if (splitType === "PERCENTAGE") {
      const values = participantIds.map((id: string) => Number(percentages?.[id]));
      if (values.some((n: number) => !Number.isSafeInteger(n) || n < 0) || values.reduce((a: number, b: number) => a + b, 0) !== 100) return NextResponse.json({ error: "Percentages must be zero or more and total exactly 100%." }, { status: 400 });
      weights = values;
    }
    const shares = allocate(amountCents, weights);
    const expense = await prisma.expense.create({ data: { groupId, payerId, description: String(description).trim(), amountCents, spentAt: new Date(`${date}T12:00:00.000Z`), splitType: splitType === "PERCENTAGE" ? "PERCENTAGE" : "EQUAL", status: "PENDING", shares: { create: participantIds.map((userId: string, index: number) => ({ userId, amountCents: shares[index], percentage: splitType === "PERCENTAGE" ? weights[index] : null })) } } });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Unable to create expense", error);
    return NextResponse.json({ error: "Expense could not be saved. Please try again." }, { status: 500 });
  }
}
