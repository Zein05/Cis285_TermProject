# SplitSmart UML

These diagrams describe the current `prototype/` implementation. They use standard PlantUML syntax and can be rendered with a PlantUML extension or CLI.

- `01-architecture.puml` — browser, Next.js UI/API, Prisma, SQLite, and setup/seed boundaries.
- `02-data-model.puml` — Prisma entities and their relationships.
- `03-expense-review.puml` — expense submission, share allocation, and approval/rejection.
- `04-payment-balance.puml` — payment validation and group-scoped pairwise balance calculation.

This is a demo design: authentication and production authorization are not implemented, and payments are local ledger records.
