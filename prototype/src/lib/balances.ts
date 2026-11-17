import type { Expense, ExpenseShare, Payment } from "@prisma/client";

type WithShares = Expense & { shares: ExpenseShare[] };
type Debt = { groupId: string; payerId: string; payeeId: string; amountCents: number };

export function pairwiseDebts(expenses: WithShares[], payments: Payment[]): Debt[] {
  const net = new Map<string, number>();
  const change = (groupId: string, from: string, to: string, cents: number) => {
    if (from === to || cents <= 0) return;
    const [a, b] = [from, to].sort();
    const key = `${groupId}|${a}|${b}`;
    const signed = from < to ? cents : -cents;
    net.set(key, (net.get(key) ?? 0) + signed);
  };
  for (const expense of expenses.filter((item) => item.status === "APPROVED")) {
    for (const share of expense.shares) change(expense.groupId, share.userId, expense.payerId, share.amountCents);
  }
  for (const payment of payments) change(payment.groupId, payment.payerId, payment.payeeId, -payment.amountCents);
  return [...net.entries()].flatMap(([key, cents]) => {
    if (!cents) return [];
    const [groupId, a, b] = key.split("|");
    return cents > 0 ? [{ groupId, payerId: a, payeeId: b, amountCents: cents }] : [{ groupId, payerId: b, payeeId: a, amountCents: -cents }];
  });
}
