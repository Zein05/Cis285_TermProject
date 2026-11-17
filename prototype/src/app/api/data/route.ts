import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pairwiseDebts } from "@/lib/balances";

export const runtime = "nodejs";
export async function GET() {
  try {
    const [users, groups, expenses, payments] = await Promise.all([
      prisma.user.findMany({ orderBy: { name: "asc" } }),
      prisma.group.findMany({ include: { members: { include: { user: true } } }, orderBy: { createdAt: "asc" } }),
      prisma.expense.findMany({ include: { payer: true, shares: { include: { user: true } }, group: true }, orderBy: { spentAt: "desc" } }),
      prisma.payment.findMany({ include: { payer: true, payee: true, group: true }, orderBy: { paidAt: "desc" } }),
    ]);
    const debts = pairwiseDebts(expenses, payments);
    return NextResponse.json({ users, groups, expenses, payments, debts });
  } catch (error) {
    console.error("Unable to load SplitSmart data", error);
    return NextResponse.json({ error: "Could not load your demo workspace. Check database setup and try again." }, { status: 500 });
  }
}
