# SplitSmart prototype

A responsive Next.js expense-sharing demo backed by SQLite and Prisma 6. The app includes a dashboard, group details and balances, expense entry with equal or percentage splits, review/decline, payment recording, and a date-filtered report.

## Run it

From this directory:

```bash
npm install
cp .env.example .env
npm run db:setup
npm run db:seed
npm run dev
```

Open http://localhost:3000. `db:setup` applies the additive SQL migration idempotently and generates Prisma Client. It preserves the existing SQLite database and its rows. `db:seed` uses Prisma upserts, so it can be rerun without duplicating the sample users, groups, expenses, or payment. The default connection uses `prisma/dev.db`; set `DATABASE_URL` in `.env` to point at another local SQLite file.

Useful commands:

- `npm run db:setup` — apply the additive SQLite schema migration and generate Prisma Client.
- `npm run db:seed` — insert or update realistic demo data.
- `npm run lint` — run ESLint.
- `npm run build` — create a production build.

## Demo behavior

The workspace opens as Alex Morgan and does not implement sign-in, account isolation, or real group permissions. Any demo user can submit or review expenses. Payments are ledger entries stored locally; they are not connected to a bank or payment provider. Do not use this prototype for real accounts or financial records.

The application accesses Prisma only in server modules and API routes. The browser receives display data through those routes; no Prisma client or database URL is bundled into browser code. Amounts are stored as integer cents. Approved expenses and payments are netted pairwise within each group; pending and rejected expenses do not affect balances. Percentage splits require whole percentages totaling 100%, and cent remainders are assigned in participant order.
