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
| **ApprovalPolicy** | `policyId`, `groupId`, version, ordered stages and eligibility rules | Versioned group policy referenced by each decision; single/multi-stage configuration and reviewer eligibility remain open. |
| **ReviewDecision** | `decisionId`, expense, review step, reviewer account, outcome (`APPROVE`, `REJECT`), decision time, optional reason, policy version | Append-only decision history. A group policy determines eligible reviewers and number/order of steps; reviewer eligibility and self-review are open decisions. |
| **Notification** | `notificationId`, recipient account, group/expense reference, type, created/read time, delivery state | Submission notice is addressed to every other group member, excluding submitter. Channel/retry status beyond the in-app MVP proposal is open. |
| **Obligation** | `obligationId`, `expenseId`, debtor, creditor, amount, currency, `entryKind`, creation time | Immutable directed fact for each positive non-payer participant share after final approval. Zero-unit shares remain recorded but create no zero-value ledger fact. Multiple obligations may reference the same expense. |
| **LedgerEntry** | `entryId`, `entryKind` (`OBLIGATION`, `PAYMENT`, approved compensating type), `sourceId`, unique `sourceKey`, directed accounts, amount, currency, creation time | Immutable financial fact. Expense obligations and posted payments have distinct source keys. |
| **PaymentAttempt** | `requestId`, group, payer, payee, amount, currency, date, state (`RECEIVED`, `PENDING`, `FAILED`, `POSTED`), recorded-by, failure reason | Request lifecycle; `POSTED` has exactly one associated committed Payment. Failed/pending attempts are not financial facts and have no ledger entry. Retry/retention policy is open. |
| **PostedPayment** | `paymentId`, `requestId`, group, payer/debtor, payee/creditor, amount, currency, payment date, recorded-by, posted time | Exists only as a committed financial fact. Each PostedPayment has exactly one LedgerEntry, enforced through a unique source key and a transaction. |
| **Receipt metadata** | `receiptId`, expense, private storage key, media type, byte size, checksum, upload time | Optional one-to-one expense attachment metadata. The binary object is stored through a private adapter; do not expose a public path. Format, size, retention, and storage technology are open. |
| **Pairwise balance** | Read projection: group, currency, debtor, creditor, signed/net amount, calculation version/as-of | **Derived, not an independently editable fact.** Compute from finally approved expense shares less recorded payments for the same pair. A cache is optional only after measurement and must be rebuildable. |
| **Report query** | Requester, group/account scope, inclusive `startDate`/`endDate`, filters, sort/page options | Transient parameters by default. Persist a report definition only if saved reports are later required; no such requirement is assumed. |

## Attribute type conventions

These are logical types; physical SQL types depend on the database owner decision.

| Attribute family | Logical type and rule |
|---|---|
| Entity identifiers | Stable opaque identifier (`AccountId`, `GroupId`, `ExpenseId`, etc.); do not use mutable email/name as a foreign key |
| Money | `Money(amount: BigDecimal, currencyCode)`; amount is exact decimal and positive where required; binary floating point is prohibited |
| Currency | ISO-style currency code plus owner-approved scale/precision; supported codes and scale table remain open |
| Percentage | `BigDecimal` percentage in the inclusive range 0–100; all percentage inputs for one expense total exactly 100 |
| Expense/payment dates | Calendar date (`LocalDate`) for occurred/payment date; no timezone conversion of a date-only value |
| Audit timestamps | UTC instant (`Instant`) for created/submitted/decided/posted/read/ended events |
| Version and stage | Nonnegative integer/long for optimistic concurrency version; positive integer for approval stage |
| State and role | Closed enums (`ExpenseState`, `MembershipState`, `MembershipRole`, `DecisionOutcome`, `PaymentAttemptState`, `LedgerEntryKind`) |
| Receipt metadata | Media type string, nonnegative byte-size integer, content hash string, opaque private storage key |
| Optional values | Nullable only when expressly optional, such as percentage for equal splits, receipt reference, decision reason, or read/end timestamp |

Primary keys, required foreign keys, financial amounts, state, and creation/audit
fields are `NOT NULL`. Optional receipt content is never stored in a public
database URL. The physical amount precision/scale, email normalization, and
specific datetime serialization are open until the persistence engine is selected.

## Cardinalities and integrity

- Account `1 — 0..*` GroupMembership; Group `1 — 1..*` GroupMembership while active.
- Group `1 — 0..*` Expense; Expense `1 — 1..*` ExpenseShare and `1 — 0..*` ReviewDecision.
- Expense `1 — 0..1` Receipt; Expense `1 — 0..*` Notification.
- Group `1 — 1..*` ApprovalPolicy versions; each ReviewDecision refers to exactly one policy version and stage.
- Expense `1 — 0..*` Obligation; each Obligation references exactly one Expense and one LedgerEntry.
- PostedPayment `1 — 1` LedgerEntry. A pending/failed PaymentAttempt has no committed PostedPayment and no LedgerEntry.
- PaymentAttempt `1 — 0..1` PostedPayment; `POSTED` attempts have exactly one PostedPayment; failed/pending attempts have none.
- Account `1 — 0..*` ExpenseShare/ReviewDecision/Notification; a Payment references distinct payer and payee accounts.
- Payment and its group must use that group's currency and valid group participants per the approved authorization policy. Accounts referenced by historical records cannot be hard-deleted without a separate approved retention/anonymization policy.
- Unique constraints should prevent duplicate membership and duplicate participant shares. Foreign keys should prevent dangling account/group/expense/receipt references. Database constraints complement—not replace—domain validation.

### Relational mapping and keys

This is a logical relational mapping, not a selected database schema. Proposed
primary keys are stable opaque IDs. Use foreign keys for all references, `NOT
NULL` for required identity/state/amount/currency fields, and exact decimal or
integer-minor-unit storage only after the currency policy is approved. Binary
floating-point storage is prohibited.

| Logical table | Key and constraint requirements |
|---|---|
| `Account` | PK `accountId`; unique normalized email under the owner-approved normalization rule |
| `Group` | PK `groupId`; FK creator; currency code and approved scale |
| `Membership` | PK `membershipId`; FKs account/group; unique active `(groupId, accountId)`; preserve ended rows |
| `Expense` | PK `expenseId`; FKs group/submitter; positive amount; `version`; state check; submitter equals payer |
| `ExpenseShare` | PK `(expenseId, participantId)` or stable `shareId` plus unique pair; FKs expense/account; nonnegative amount |
| `ApprovalPolicy` | PK `policyId`; FK group; unique `(groupId, version)`; immutable once referenced by a decision |
| `ApprovalDecision` | PK `decisionId`; FKs expense/reviewer; stage and decision key constraints according to approved policy; append-only |
| `Obligation` | PK `obligationId`; FK expense/debtor/creditor; CHECK debtor != creditor and amount > 0; UNIQUE `(expenseId, debtorId, creditorId, entryKind)` |
| `LedgerEntry` | PK `entryId`; unique immutable `sourceKey`; source kind/ID and currency; one-to-one obligation and payment source constraints |
| `PaymentAttempt` | PK `requestId` (or unique request key scoped to actor); state check; failure details contain no secrets |
| `PostedPayment` | PK `paymentId`; unique `requestId`; FKs group/payer/payee; CHECK payer != payee and amount > 0; exactly one ledger row with unique payment source key |
| `ReceiptMetadata` | PK `receiptId`; unique expense FK if one-receipt policy remains; private storage key; size/type/hash; no public URL |
| `PairwiseBalance` | Optional derived table keyed by group, currency, and canonical account pair; rebuild/version metadata; never independently editable |

For expense obligations, enforce both `UNIQUE(obligationId)` and
`UNIQUE(expenseId, debtorId, creditorId, entryKind)`. This permits one approved
expense to create obligations for multiple debtors while making retries of any
one obligation idempotent. An expense-only unique ledger key is prohibited.
The source-key constraint and final expense-state transition must be checked
inside the same transaction.

Cross-row invariants—share totals, percentage totals, exactly one posting for a
committed payment, and all obligations matching the approved expense
participants—must be enforced by the domain/application transaction and
verified against the selected database. Simple row-level `CHECK` constraints
alone are not sufficient.

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
- For each expense `E` paid by participant `P`, create a directed obligation from each other participant `U` with a positive allocated share to `P` for `share(E,U)`. Keep a zero-unit share as a participant allocation but do not create a zero-value obligation. The payer's own share is not a debt to themself.
- For a stable ordered user pair `(A,B)` within one group/currency, define `O(A,B)` as the approved expense shares owed by A to B and `P(A,B)` as posted payments from A to B. The signed pairwise balance is `net(A,B) = O(A,B) - P(A,B) - O(B,A) + P(B,A)`: positive means A owes B; negative means B owes A. Display at most the direction and absolute amount for this pair. This netting combines only the same two users; never redirect value through a third user or another pair. Acceptable overpayment/credit behavior is an owner decision; until resolved, the system must not silently accept an overpayment as a successful settlement.
- Pending/rejected expenses contribute zero. Payments modify only their named payer/payee pair. A group-wide “simplified settlement” algorithm is prohibited by FR-007.
- `sum(ExpenseShare.amount) == Expense.amount` at the smallest supported currency unit. The exact deterministic remainder rule and supported currency scale are open decisions; see [plan.md](./plan.md).
- A committed `PostedPayment` has exactly one `LedgerEntry` with the same group, currency, payer, payee, and amount. Payment state, payment fact, ledger posting, and projection update/dirty marker commit atomically. Duplicate request IDs return the prior result or an explicit conflict; they do not create another payment/posting. Request scope and semantic duplicate policy require owner approval.
- Corrections/reversals are compensating append-only facts; their authorization, direction, relationship, and effect on projections require owner approval. Do not delete or mutate a posted payment or approved obligation.
- Submitter is always payer and participant, per the clarified specification.
- Candidate query indexes include `(groupId, occurredOn)`, `(groupId, state)`,
  `(groupId, debtorId, creditorId)`, payment pair/date, and report date filters.
  Add only indexes supported by query shape; verify against the selected database
  and NFR-004 workload. These are candidates, not benchmark results.

## Security, audit, and consistency

Authorize reads/writes against the account and current group membership at the application/service boundary; UI visibility is not authorization. Receipt access inherits expense/group authorization. Store credentials as secure hashes, issue no plaintext reset secret in logs, and require a private delivery/session mechanism when remote authentication is selected.

Review decisions and payments are append-only facts. Corrections should use audited compensating records rather than silently rewriting financial history; exact correction behavior is open. Apply approval/payment state transitions atomically with source-record updates. Prefer deriving balances from source records; if a cache is added after performance tests, retain a calculation version and rebuild/reconciliation path.

## Report semantics

Reports are read-only projections over records the requester may access. `startDate` and `endDate` are inclusive (AC-007); reversed/empty range behavior and other custom filters/export/retention rules remain open. Do not persist query state unless saved-report behavior is approved.

## Transaction boundaries and audit

1. **Submission:** validate all fields, membership, allocation, and receipt before
   creating a pending expense. Persist the pending expense, its shares, receipt
   metadata reference, and logical notification intents consistently. If receipt
   content is staged outside the database, discard it on transaction failure;
   failed cleanup must be surfaced or queued for explicit cleanup. Failed
   validation or transaction must not create partial records.
2. **Approval:** compare the expected expense version, append the decision, and
   conditionally transition state. On final approval only, insert every
   per-participant obligation and its ledger source. State, decisions, obligation
   facts, and projection update/dirty marker commit atomically.
3. **Payment:** within one transaction, validate the named pair/current state,
   enforce request idempotency, create the committed PostedPayment and exactly one
   LedgerEntry, then update or mark the pair projection dirty. Failed attempts
   cannot leave either financial fact committed.
4. **Projection:** calculate on demand or update a rebuildable projection from
   the ledger. A projection failure is observable and recoverable by rebuilding;
   never rewrite immutable facts to repair a projection.

Database-specific locking/isolation, retry limits, backup and recovery
procedures depend on the selected engine and remain open. Corrections and
reversals append compensating facts only under an owner-approved policy.
