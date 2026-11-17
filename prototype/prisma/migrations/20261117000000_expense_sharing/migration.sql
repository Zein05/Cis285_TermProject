CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "initials" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT 'sage',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE TABLE IF NOT EXISTS "Group" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "emoji" TEXT NOT NULL DEFAULT '🏡',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "GroupMember" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");
CREATE TABLE IF NOT EXISTS "Expense" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "payerId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "spentAt" DATETIME NOT NULL,
  "splitType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "ExpenseShare" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expenseId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "percentage" INTEGER,
  CONSTRAINT "ExpenseShare_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ExpenseShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ExpenseShare_expenseId_userId_key" ON "ExpenseShare"("expenseId", "userId");
CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "groupId" TEXT NOT NULL,
  "payerId" TEXT NOT NULL,
  "payeeId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "paidAt" DATETIME NOT NULL,
  "note" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON UPDATE CASCADE,
  CONSTRAINT "Payment_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "User" ("id") ON UPDATE CASCADE
);
