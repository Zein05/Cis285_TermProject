import "dotenv/config";
import Database from "better-sqlite3";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
if (!url.startsWith("file:")) throw new Error("The prototype setup script expects a local SQLite file URL.");
const relativePath = url.slice("file:".length);
const databasePath = relativePath.startsWith("/") ? relativePath : resolve("prisma", relativePath);
const database = new Database(databasePath);
try {
  database.pragma("foreign_keys = ON");
  const migration = await readFile(new URL("./migrations/20261117000000_expense_sharing/migration.sql", import.meta.url), "utf8");
  database.exec(migration);
  console.log(`SQLite schema is ready at ${databasePath}. Existing rows and tables were preserved.`);
} finally {
  database.close();
}
