import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const people = [
  { id: "u_alex", name: "Alex Morgan", email: "alex@example.demo", initials: "AM", color: "sage" },
  { id: "u_jamie", name: "Jamie Chen", email: "jamie@example.demo", initials: "JC", color: "peach" },
  { id: "u_taylor", name: "Taylor Rivera", email: "taylor@example.demo", initials: "TR", color: "lilac" },
  { id: "u_sam", name: "Sam Patel", email: "sam@example.demo", initials: "SP", color: "blue" },
];
const groups = [
  { id: "g_apartment", name: "The Apartment", emoji: "🏡", members: ["u_alex", "u_jamie", "u_taylor"] },
  { id: "g_coast", name: "Coast weekend", emoji: "🌊", members: ["u_alex", "u_jamie", "u_taylor", "u_sam"] },
];
try {
  for (const p of people) await prisma.user.upsert({ where: { id: p.id }, update: p, create: p });
  for (const g of groups) {
    await prisma.group.upsert({ where: { id: g.id }, update: { name: g.name, emoji: g.emoji }, create: { id: g.id, name: g.name, emoji: g.emoji } });
    for (const userId of g.members) await prisma.groupMember.upsert({ where: { groupId_userId: { groupId: g.id, userId } }, update: {}, create: { groupId: g.id, userId, role: userId === "u_alex" ? "manager" : "member" } });
  }
  const sample = [
    { id: "e_groceries", groupId: "g_apartment", payerId: "u_jamie", description: "Sunday groceries", amountCents: 8460, spentAt: "2026-11-14", status: "APPROVED", users: ["u_alex", "u_jamie", "u_taylor"] },
    { id: "e_internet", groupId: "g_apartment", payerId: "u_alex", description: "Monthly internet", amountCents: 6999, spentAt: "2026-11-12", status: "APPROVED", users: ["u_alex", "u_jamie", "u_taylor"] },
    { id: "e_plants", groupId: "g_apartment", payerId: "u_taylor", description: "Living room plants", amountCents: 4250, spentAt: "2026-11-16", status: "PENDING", users: ["u_alex", "u_jamie", "u_taylor"] },
    { id: "e_cabin", groupId: "g_coast", payerId: "u_alex", description: "Cabin deposit", amountCents: 24000, spentAt: "2026-11-10", status: "APPROVED", users: ["u_alex", "u_jamie", "u_taylor", "u_sam"] },
  ];
  for (const e of sample) {
    const shares = e.users.map((userId, index) => ({
      userId,
      amountCents: Math.floor(e.amountCents / e.users.length) + (index < e.amountCents % e.users.length ? 1 : 0),
    }));
    await prisma.expense.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id, groupId: e.groupId, payerId: e.payerId, description: e.description,
        amountCents: e.amountCents, spentAt: new Date(`${e.spentAt}T12:00:00.000Z`),
        splitType: "EQUAL", status: e.status, shares: { create: shares },
      },
    });
  }
  await prisma.payment.upsert({ where: { id: "p_jamie_alex" }, update: {}, create: { id: "p_jamie_alex", groupId: "g_apartment", payerId: "u_alex", payeeId: "u_jamie", amountCents: 1800, paidAt: new Date("2026-11-15T12:00:00.000Z"), note: "November settle-up" } });
} finally { await prisma.$disconnect(); }
