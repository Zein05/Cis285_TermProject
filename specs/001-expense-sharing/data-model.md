# SplitSmart Conceptual Data Model

This is a proposed logical model derived from [spec.md](./spec.md), not a schema or selected database. Use stable identifiers and enforce referential integrity in the chosen persistence adapter. Keep historic financial records even when membership ends; exact retention and former-member access policies remain open.

## Entities and relationships

| Entity | Conceptual attributes | Relationships / ownership |
|---|---|---|
| **Account (User)** | `accountId`, normalized unique `email`, optional display name, account state, creation time; credential hash/reset state belongs to the identity boundary, never plaintext password | One account has many memberships, submitted expenses, shares, review decisions, notifications, and payment roles. Private account data is owned by that account. |
| **Group** | `groupId`, name, creator account, one currency code, creation time, group state, review-policy configuration/version | One creator; one or more memberships; zero or more expenses, payments, and notifications. Group currency follows the spec assumption; no FX is implied. |
| **GroupMembership** | `groupId`, `accountId`, role (`CREATOR`, `MANAGER`, `MEMBER`), state (`ACTIVE`, `REMOVED`), joined/ended timestamps | Many-to-many join between Group and Account; unique group/account association with lifecycle history. Only creator/managers can add/remove members. Other manager powers remain open. |
| **Expense** | `expenseId`, `groupId`, `submitterId` (also payer), amount, currency, occurred date, description, split method (`EQUAL`, `PERCENTAGE`), lifecycle state, submitted/finalized times, version | Belongs to one group; has one submitter/payer, one or more shares, zero or more review decisions, zero or one receipt, and zero or more notifications. |
| **ExpenseShare (participant)** | `expenseId`, `participantId`, assigned amount, optional input percentage, allocation order/rule version | Each share belongs to one expense and one account; unique participant per expense. Submitter/payer must be a participant. Shares sum exactly to expense amount. |
| **ReviewDecision** | `decisionId`, expense, review step, reviewer account, outcome (`APPROVE`, `REJECT`), decision time, optional reason, policy version | Append-only decision history. A group policy determines eligible reviewers and number/order of steps; reviewer eligibility and self-review are open decisions. |
| **Notification** | `notificationId`, recipient account, group/expense reference, type, created/read time, delivery state | Submission notice is addressed to every other group member, excluding submitter. Channel/retry status beyond the in-app MVP proposal is open. |
| **Payment** | `paymentId`, group, payer/debtor account, payee/creditor account, amount, currency, payment date, recorded-by account, created time, immutable status/idempotency reference | Applies to one named user pair in one group/currency. Partial/full payments reduce only that pair's obligation. Correction and excess-payment policies are open. |
| **Receipt metadata** | `receiptId`, expense, private storage key, media type, byte size, checksum, upload time | Optional one-to-one expense attachment metadata. The binary object is stored through a private adapter; do not expose a public path. Format, size, retention, and storage technology are open. |
| **Pairwise balance** | Read projection: group, currency, debtor, creditor, signed/net amount, calculation version/as-of | **Derived, not an independently editable fact.** Compute from finally approved expense shares less recorded payments for the same pair. A cache is optional only after measurement and must be rebuildable. |
| **Report query** | Requester, group/account scope, inclusive `startDate`/`endDate`, filters, sort/page options | Transient parameters by default. Persist a report definition only if saved reports are later required; no such requirement is assumed. |

## Cardinalities and integrity

- Account `1 — 0..*` GroupMembership; Group `1 — 1..*` GroupMembership while active.
- Group `1 — 0..*` Expense; Expense `1 — 1..*` ExpenseShare and `1 — 0..*` ReviewDecision.
- Expense `1 — 0..1` Receipt; Expense `1 — 0..*` Notification.
- Account `1 — 0..*` ExpenseShare/ReviewDecision/Notification; a Payment references distinct payer and payee accounts.
- Payment and its group must use that group's currency and valid group participants per the approved authorization policy. Accounts referenced by historical records cannot be hard-deleted without a separate approved retention/anonymization policy.
- Unique constraints should prevent duplicate membership and duplicate participant shares. Foreign keys should prevent dangling account/group/expense/receipt references. Database constraints complement—not replace—domain validation.

## State and invariants

### Expense lifecycle

Conceptual states: `PENDING_REVIEW`, `APPROVED`, `REJECTED`. Pending review may contain a current step and prior decisions; each approval advances the configured workflow. Final approval makes the expense balance-effective. Rejection terminates the current submission without balance effect. Resubmission/edit-after-submission behavior is not specified; model it as a new submission or audited revision only after owner approval.

State transition rules:

1. Validate amount, currency, split, participants, payer, membership, and required fields before creating a reviewable record.
2. `PENDING_REVIEW -> PENDING_REVIEW` for a non-final approval step; `PENDING_REVIEW -> APPROVED` only when all configured steps are complete; `PENDING_REVIEW -> REJECTED` on rejection.
3. No transition from `APPROVED` or `REJECTED` is assumed. Corrections, edits, deletion, and re-approval require an explicit audited policy.
4. Approval decisions are immutable; simultaneous/retried decisions must be serialized or rejected as a conflict. Only final approval affects balances.

### Financial rules

- All application monetary values/calculations use Java `BigDecimal`; never `float`/`double`. Currency scale and rounding are explicit and shared by parsing, calculation, storage, and display.
- Amounts for expenses and payments are positive. Percentage splits are non-negative and total exactly 100. A valid percentage can yield a zero minor-unit share after allocation.
- For each expense `E` paid by participant `P`, create a directed obligation from each other participant `U` to `P` for `share(E,U)`. The payer's own share is not a debt to themself.
- For a stable ordered user pair `(A,B)` within one group/currency, define `O(A,B)` as the approved expense shares owed by A to B and `P(A,B)` as payments from A to B. The signed pairwise balance is `net(A,B) = O(A,B) - P(A,B) - O(B,A) + P(B,A)`: positive means A owes B; negative means B owes A. Display at most the direction and absolute amount for this pair. This netting combines only the same two users; never redirect value through a third user or another pair. As a temporary safe boundary pending owner approval, an overpayment that would invert the pair is rejected rather than silently recorded as credit.
- Pending/rejected expenses contribute zero. Payments modify only their named payer/payee pair. A group-wide “simplified settlement” algorithm is prohibited by FR-007.
- `sum(ExpenseShare.amount) == Expense.amount` at the smallest supported currency unit. The exact deterministic remainder rule and supported currency scale are open decisions; see [plan.md](./plan.md).
- Overpayment does not silently succeed. Whether it is rejected, recorded as a pairwise credit, or handled otherwise is an owner decision.
- Submitter is always payer and participant, per the clarified specification.
- Candidate query indexes include group/date, group/expense-state, and pairwise participant/payment keys. Choose and verify indexes against the selected database and NFR-004 workload; do not treat these as benchmark results.

## Security, audit, and consistency

Authorize reads/writes against the account and current group membership at the application/service boundary; UI visibility is not authorization. Receipt access inherits expense/group authorization. Store credentials as secure hashes, issue no plaintext reset secret in logs, and require a private delivery/session mechanism when remote authentication is selected.

Review decisions and payments are append-only facts. Corrections should use audited compensating records rather than silently rewriting financial history; exact correction behavior is open. Apply approval/payment state transitions atomically with source-record updates. Prefer deriving balances from source records; if a cache is added after performance tests, retain a calculation version and rebuild/reconciliation path.

## Report semantics

Reports are read-only projections over records the requester may access. `startDate` and `endDate` are inclusive (AC-007); reversed/empty range behavior and other custom filters/export/retention rules remain open. Do not persist query state unless saved-report behavior is approved.
