# Domain and Persistence Model

> **Historical reference only — superseded.** Use the canonical data model at
> [specs/001-expense-sharing/data-model.md](../../specs/001-expense-sharing/data-model.md).

## Design and persistence status

All entities and constraints here are proposed from the approved specification.
The inspected repository contains no Java/Maven implementation or persistence
configuration. Persistence is therefore undecided. The recommended classroom MVP
option is SQLite behind repository interfaces; it provides durable local records,
foreign keys, unique constraints, and transactions without a server. It is not
shared multi-device storage.

For the full product, use one shared relational database behind the authoritative
API. Do not let clients write the ledger directly. A relational store supports
referential integrity and atomic approval/payment workflows. Database vendor,
hosting, migration and backup strategy remain unapproved.

## Entities and cardinalities

| Entity | Important attributes | Relationships and constraints |
|---|---|---|
| `Account` | `accountId`, normalized unique `email`, `passwordHash`, `createdAt`, `status` | One account has 0..* memberships, submitted expenses, decisions, payments, notifications. Email uniqueness is case-insensitive per chosen policy; canonicalization needs approval. Password material is never exposed in domain DTOs. |
| `Group` | `groupId`, `name`, `creatorAccountId`, `currencyCode`, `currencyScale`, `createdAt`, `status`, `approvalPolicyId` | 1 creator; 1..* memberships over time; 0..* expenses, payments, notifications. Currency is fixed for the group in this proposal. |
| `Membership` | `groupId`, `accountId`, `role` (`CREATOR`, `MANAGER`, `MEMBER`), `joinedAt`, `endedAt`, `status` | Many-to-many association between accounts and groups; unique active `(groupId, accountId)`. Creator or designated manager alone can add/remove members. Historical references remain after removal. Additional manager powers are open. |
| `Expense` | `expenseId`, `groupId`, `submitterId`, `payerId`, `amount`, `currencyCode`, `expenseDate`, `description`, `splitMethod`, `status`, `version`, `submittedAt`, `finalizedAt` | Belongs to one group; submitter equals payer; 1..* shares, 0..* approval decisions, 0..1 receipt, 0..* notification targets. Amount positive. Submitter must be an active participant at submission. |
| `ExpenseShare` | `expenseId`, `participantId`, `shareAmount`, optional `percentage` | Composite unique `(expenseId, participantId)`; participant must be active group member when submitted and submitter must be included. Shares are nonnegative and sum exactly to expense amount at currency scale. Immutable after final approval absent an approved correction policy. |
| `ApprovalPolicy` | `policyId`, `groupId`, ordered stages and reviewer eligibility rules | One active policy per group; MVP has exactly one stage. Full multiple-level semantics, self-approval, timeouts, quorum, and reviewer eligibility require decisions. |
| `ApprovalDecision` | `decisionId`, `expenseId`, `stage`, `reviewerId`, `decision` (`APPROVE`, `REJECT`), `decidedAt`, `comment`, `idempotencyKey` | Expense has 0..* ordered decisions; at most one accepted decision per expense/stage. Reviewer must be authorized. Unique idempotency key per operation. Decision history append-only. |
| `Notification` | `notificationId`, `recipientId`, `groupId`, `expenseId`, `createdAt`, `readAt`, `deliveryState` | On submission, one logical notice per other active group member; submitter excluded. Unique `(recipientId, expenseId, notificationKind)`. MVP inbox only. Delivery channel/retries are open for full product. |
| `LedgerEntry` | `entryId`, `groupId`, `expenseId` or `paymentId`, `fromAccountId`, `toAccountId`, `amount`, `currencyCode`, `occurredAt`, `entryKind` | Immutable accepted-expense obligation or payment fact; endpoints are distinct accounts in same group. Unique source reference prevents duplicate posting. No entry for pending/rejected expenses. |
| `PairwiseBalance` | Projection key `(groupId, accountLowId, accountHighId)`, signed `netLowOwesHigh`, `currencyCode`, `asOfVersion` | Derived from ledger facts; direction encoded by sign. Only combines obligations between those exact two accounts. Optional cache is rebuildable and versioned. |
| `Payment` | `paymentId`, `groupId`, `payerId`, `payeeId`, `amount`, `currencyCode`, `paymentDate`, `recordedBy`, `idempotencyKey`, `createdAt` | Names the actual debtor/payer and creditor/payee and relates to their exact pair. Positive, endpoints distinct and group members (policy for historical members open). Overpayment and semantic duplicate policy are open. |
| `Receipt` | `receiptId`, `expenseId`, `storageKey`, `mediaType`, `byteSize`, `contentHash`, `uploadedAt`, `uploadedBy` | 0..1 per expense in this proposal; metadata separated from content. Access follows group/expense authorization. Whether multiple images are allowed is open. |
| `Report` / criteria | `viewerId`, optional `groupId`, inclusive dates, parameters | A query/result value, not necessarily a persisted entity. Must be authorized and aggregate only eligible records. |

`Account`, `Group`, and other durable entities use stable opaque IDs. Do not use
mutable email/name as a financial foreign key. Amounts in a single group share
its currency code and scale.

## Lifecycle states

```text
Expense: DRAFT (transient) -> PENDING_REVIEW -> [PENDING_REVIEW at next stage]
                                      |               |
                                      +-> REJECTED    +-> APPROVED (final)
```

Only the submit use case persists a valid expense in `PENDING_REVIEW`. Invalid
input never creates a reviewable expense. In a one-stage MVP, an authorized
approval goes directly from pending to final `APPROVED`; rejection goes to
`REJECTED`. Pending and rejected states create no obligation entries. Re-submission
after rejection is a new expense linked to the prior record only if an approved
product policy calls for that relation. No editing/deletion lifecycle is assumed.

`Membership`: `ACTIVE -> REMOVED` (historical row retained).

`Payment`: proposed states are `RECORDED` and, if a later reversal feature is
approved, `REVERSED`; do not physically delete financial records. Reversal policy
is not specified and remains open.

`Notification`: `UNREAD -> READ`; channel delivery states are adapter concerns and
are not proof of receipt by a person.

## Monetary invariants and calculations

All amounts, percentages, intermediate products, shares, obligations and payment
values use `BigDecimal`. Never use `float` or `double`. Each group stores an
approved currency and scale (`2` is an example, not a global assumption). Validate
currency scale at application boundaries; do not silently round incoming money.
Reject excess fractional digits unless an explicitly approved input rule says
otherwise.

1. Expense total is strictly positive.
2. Every participant is an active group member at submission; participant IDs are
   distinct; the submitter is both payer and participant.
3. Equal split gives each selected participant a share in minor units; percentage
   split has nonnegative percentages whose exact `BigDecimal` sum is 100%.
4. Every share is nonnegative, rounded/allocated to the currency unit under one
   deterministic rule, and shares sum exactly to the expense total.
5. Only final approval posts an obligation effect. Rejection and pending review
   post none.
6. Payments are positive and apply only to the named payer/payee pair. They do
   not change any other pair.
7. Balance projection is reproducible from immutable accepted expense/payment
   facts; a cached projection may not be the sole source of truth.

### Proposed deterministic allocation

The specification requires deterministic reconciliation but leaves the precise
currency/remainder algorithm open. Proposed policy for approval: compute ideal
unrounded shares in `BigDecimal`, floor each to the group's minor unit, then assign
remaining minor units by descending fractional remainder; break ties by stable
participant ID ascending. For equal splits, ideal shares are total divided by
participant count. For percentages, ideal share is total multiplied by percentage
and divided by 100. This largest-remainder method is deterministic and sums to the
original amount. It can result in a one-minor-unit difference from an individual
ideal percentage, which must be disclosed. The product owner must approve this
tradeoff and currency policy.

Pseudocode (illustrative, not application implementation):

```text
unit = 10 ^ (-currencyScale) represented as BigDecimal
for each participant:
    ideal = amount / count                         # equal
    # or ideal = amount * percentage / 100        # percentage
    base = floor(ideal to currencyScale)
    remainder = ideal - base
residualUnits = (amount - sum(base)) / unit
order participants by remainder descending, then accountId ascending
add one unit to first residualUnits shares
assert sum(shares) == amount
```

The implementation must use `BigDecimal` operations with explicit scale/rounding
for division and must not exponentiate into a floating-point intermediate. All
ordering, scale, and rounding details need unit tests.

## Pairwise ledger and consistency

Store immutable source facts, not an independently editable balance. For an
approved expense paid by `P`, create one obligation for each other participant
`U` in the amount of `U`'s allocated share, with `U` owing `P`. The payer's own
share is not a debt. A payment from `U` to `P` posts a payment fact against that
same pair. Repeated obligations in both directions may be netted **only within
that pair** to show the pair's net direction; no group-wide graph/netting or
redirecting one person's debt to a third person is permitted.

Maintain `PairwiseBalance` as a derived read projection or rebuildable cache:

- Key by group and the sorted pair of account IDs; retain a signed amount to
  indicate direction.
- Rebuild by summing accepted expense obligations and subtracting corresponding
  payments for the same pair only.
- A payment request must name the direction it settles; validate its available
  outstanding obligation transactionally. Proposed MVP rejects an overpayment;
  final policy remains open.
- Include ledger source IDs and unique posting constraints so retrying final
  approval cannot post twice.
- Compare/reconcile cache against ledger in tests and optionally on diagnostics.

## Transactions and referential integrity

Use a DB transaction for:

- **Submission:** verify group/members, insert expense and exact shares, record
  submission audit state, and create per-recipient notification records. External
  delivery occurs after commit via an outbox/retry mechanism in the full product;
  MVP inbox rows are local DB writes. A failed notification adapter must be
  visible and retryable; it must not roll back an already accepted expense.
- **Approval:** compare current pending state/version, authorize reviewer, insert
  unique decision, transition state, and (only at final approval) insert all
  obligation entries/projection updates atomically. Duplicate or racing approvals
  return a conflict/current state and cannot double-post.
- **Payment:** validate the named pair's outstanding amount, insert idempotent
  payment and ledger fact, and update/rebuild the projection atomically.
- **Membership change:** authorize manager, retain historical membership and
  preserve referential links to expenses, shares, decisions, and payments.

Foreign keys should prevent dangling account/group/expense/payment references.
Financial history should be append-only; corrections require an explicit,
auditable compensating event policy. For local receipt files, write to a temporary
file then atomically move and persist metadata; reconcile orphan files after
failure. A future object store requires the same authorization and cleanup policy.
