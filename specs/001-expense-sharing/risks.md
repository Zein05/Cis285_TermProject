# SplitSmart Risk Register

Likelihood and impact are qualitative design estimates, not measured project
statistics. Owners are unassigned; assign them during project review.

| ID | Risk / cause | Likelihood | Impact | Mitigation | Contingency | Owner | Status / links |
|---|---|---:|---:|---|---|---|---|
| R-01 | Swing-only scope is mistaken for satisfying FR-010 | High | Critical | Keep full-product platform acceptance separate; matrix labels it deferred | Plan an explicit web/Android/iOS delivery gate | Unassigned | Open; FR-010, ADR-011 |
| R-02 | Currency/rounding choices are made implicitly | Medium | Critical | Block monetary implementation on approved scales and allocation policy; exact reconciliation tests | Stop financial acceptance; preserve source data and recalculate only through audited migration | Unassigned | Open; NFR-002, ADR-005/006 |
| R-03 | Duplicate/concurrent approval posts obligations twice | Medium | Critical | Atomic state transition, expected version, per-obligation unique key, idempotency, concurrency tests | Rebuild projection from immutable facts and add compensating correction only under approved policy | Unassigned | Open; FR-006/007, ADR-004 |
| R-04 | Payment and ledger posting diverge | Medium | Critical | One transaction; posted payment requires exactly one ledger posting; uniqueness and reconciliation constraints | Quarantine inconsistent records; reconcile from audited event sources | Unassigned | Open; FR-008, ADR-004/008 |
| R-05 | Overpayment or duplicate payment corrupts pairwise balance | Medium | High | Exact pair check, request idempotency, explicit owner policy, wrong-pair tests | Block further settlement for pair and reconcile against immutable facts | Unassigned | Open; FR-008, ADR-008/009 |
| R-06 | Membership removal exposes historical/private data | Medium | High | Retain membership history; authorize every read; separate current membership from financial identity | Restrict access pending owner policy and audit affected reads | Unassigned | Open; NFR-001, ADR-015 |
| R-07 | Demo credentials or receipts are treated as production-secure | Medium | Critical | Label local demo limitations; private storage, access controls, no plaintext credentials | Do not deploy or store real sensitive data until reviewed production controls exist | Unassigned | Open; FR-001, NFR-001, ADR-012/014 |
| R-08 | Notification delivery is dropped, falsely reported, or duplicated | Medium | Medium | Persist notification intent, unique recipient/event key, explicit states, retry/outbox design | Show undelivered state and allow safe retry | Unassigned | Open; FR-005, ADR-013 |
| R-09 | Chosen database cannot meet transaction/concurrency/backup needs | Medium | High | Compare SQLite/H2/PostgreSQL; test selected engine, migration, backup/restore | Re-select before production; restore from verified backup | Unassigned | Open; ADR-003 |
| R-10 | Balance projection drifts from ledger | Medium | High | Projection is rebuildable; reconciliation and rebuild tests; same-pair semantics | Rebuild projection and record discrepancy | Unassigned | Open; FR-007, ADR-016 |
| R-11 | Performance target claimed without reproducible evidence | Medium | Medium | Record hardware, runtime, dataset, request distribution and raw timings | Keep NFR-004 open and tune only after measured profile | Unassigned | Open; NFR-004, AC-012 |
| R-12 | Future clients implement financial calculations differently | Medium | High | Shared service is authoritative; shared golden fixtures; no client-ledger writes | Disable divergent client calculation and use service result | Unassigned | Open; NFR-005, ADR-011 |
| R-13 | Receipt validation/retention/access is undefined | Medium | High | Approve file types, limits, malware handling, storage, retention, access rules | Disable uploads until policy and controls are implemented | Unassigned | Open; FR-003, NFR-001, ADR-014 |
| R-14 | AI-produced design is accepted without independent review | Medium | High | Human review required by Constitution VI; verify source traceability and diagrams | Keep artifacts marked proposed and block acceptance | Unassigned | Open; Constitution VI |
