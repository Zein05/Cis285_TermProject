# Requirement Traceability Matrix

> **Historical reference only — superseded.** Use the canonical matrix at
> [specs/001-expense-sharing/traceability-matrix.md](../../specs/001-expense-sharing/traceability-matrix.md).

## Reading the status

This is design-level coverage proposed for future work, not delivery status. The
repository inventory showed no application source, Maven build, or tests. “Covered”
means the proposed desktop design has a concrete control and planned verification
for the stated desktop slice; it does not mean implemented or approved. “Partial”
means an explicitly omitted capability or unresolved policy remains. “Not
covered” means the desktop MVP does not meet the stated customer requirement.
The full-product columns describe the proposed destination only.

## Functional requirements

| ID and concise statement | Proposed components | Design control | Planned verification | Scope | Status |
|---|---|---|---|---|---|
| FR-001 Individual email/password accounts, sign-in, reset, own data | Account/auth use cases; session; account repository | Local distinct accounts and actor-scoped queries; reset delivery is not available in a local-only MVP | Account lifecycle, wrong-password, reset flow, owner/other-account authorization tests | Desktop MVP / full product | Partial |
| FR-002 Groups; only creator/managers change membership | Group/membership domain and use cases | Active membership, creator/manager check on every mutation; historical membership retained | Allowed/denied role matrix, removal/history integration tests | Both | Covered |
| FR-003 Positive expense with date/description/equal-or-percent split/optional receipt; submitter payer and participant | Expense use case/domain, split policy, receipt adapter | Validate positive amount, group member, payer=submitter, participant inclusion, receipt optional | Domain boundary cases and persistence/receipt workflow tests | Both | Covered |
| FR-004 Participants and proposed shares; percentage nonnegative and totals exactly 100% | Split allocator and expense validator | Decimal total equality; reject negative/invalid participants; exact minor-unit allocation | Equal/percentage/remainder/property tests | Both | Covered |
| FR-005 Notify other group members of submission | Notification use case/port and inbox adapter | One inbox row per other active member; submitter excluded; delivery state observable | Recipient fan-out, exclusion, duplicate/retry tests | Desktop MVP (in-app) / full product | Partial |
| FR-006 Authorized single or multi-level review; rejected/pending excluded | Approval policy/state machine, expense repository, ledger | MVP one stage; final state transition and ledger posting atomic; no posting before final approval | State transition, authorization, duplicate/race, rejection and multi-stage future tests | Both; multi-level full product | Partial |
| FR-007 Pairwise obligations; no redirection across users | Ledger and pairwise projection | Ledger keyed by original pair; net only within that pair; no group-wide simplification | Rebuild/reconciliation and three-user no-redirection scenario | Both | Covered |
| FR-008 Record full/partial payments to named payee; update only that pair | Payment use case, ledger, pairwise projection | Transactional named-pair check; idempotency key; proposed overpayment rejection | Partial/full payment, wrong-pair isolation and retry tests | Both | Covered |
| FR-009 Expense/balance/payment reports with dates and parameters | Report use cases/repository queries | Actor-scoped filters; inclusive dates; MVP basic summaries; custom parameters limited | Report fixture totals, boundary-date and authorization tests | Both | Partial |
| FR-010 Primarily web plus Android and iOS apps | Future API, shared DB, web/mobile presentation clients | Central authoritative API and shared data proposed; no such implementation observed | Cross-platform journey/consistency suite when clients exist | Full product | Not covered |

## Non-functional requirements

| ID and concise statement | Proposed components | Design control | Planned verification | Scope | Status |
|---|---|---|---|---|---|
| NFR-001 Private account and authorized group access only | Authentication/session, application authorization, repositories | Deny-by-default actor-scoped use cases and receipt/report checks | Positive/negative authorization matrix; future API penetration/security testing | Both; production controls full product | Partial |
| NFR-002 Exact reconciliation at smallest unit; consistent disclosed remainder | Money value rules, split allocator, ledger | Explicit group scale and deterministic largest-remainder proposal; exact sum invariant | BigDecimal scale/boundary/property tests; ledger-to-projection reconciliation | Both | Covered |
| NFR-003 At least 90% first-attempt unassisted expense submission | Swing forms; future client UX | Guided split/participant inputs, immediate correction messages; usability target measured, not assumed | Representative moderated usability task; at least 9/10 first-attempt successes | Both, each full client measured | Partial |
| NFR-004 p95 <=3 seconds for balance/date-filtered report at 100 members/10,000 records | Query/repository/projection | Indexed group/date/pair keys; cache is rebuildable; workload target not guaranteed by design | Repeatable load test with documented hardware/data; 95/100 <=3 s | Both | Partial |
| NFR-005 Matching approved shares/balances across web/Android/iOS | Shared domain service/API and clients | One server-authoritative calculation and stored ledger; clients render canonical results | Identical contract fixtures and end-to-end cross-client tests | Full product | Not covered |

## Acceptance criteria

| ID and concise statement | Proposed components | Design control | Planned test/verification | Scope | Status |
|---|---|---|---|---|---|
| AC-001 Account create/sign-in/reset and private data isolation | Account/auth/session | Local account boundary; production reset channel remains open | Account workflow and unauthorized account read tests | Desktop MVP / full product | Partial |
| AC-002 Creator/manager membership authority | Group/membership | Role check in use case, not only UI | Creator/manager/ordinary/nonmember permission matrix | Both | Covered |
| AC-003 Required expense details, payer/participant, exact shares, optional receipt | Expense/split/receipt | Submission invariants and optional metadata | Submission integration and split reconciliation tests | Both | Covered |
| AC-004 Notice every other member, not submitter | Notification inbox | Recipient set excludes submitter | Fan-out and no-self-notice test | Desktop MVP / full product | Partial |
| AC-005 Pending/rejected excluded; authorized configured review; only final approval affects balance | Approval/ledger | Atomic final transition and posting | Pending/reject/final approval and duplicate/concurrent decision tests | Both; configured multi-stage in full product | Partial |
| AC-006 Pairwise net obligation; partial payment affects only that pair | Ledger/payment/projection | Pair-keyed facts; no cross-pair transfer | Three-account graph with partial/full settlement and pair isolation | Both | Covered |
| AC-007 Authorized report totals and inclusive date bounds | Report/query authorization | Inclusive date predicate and actor-scoped selection | Start/end boundary, unauthorized row exclusion, totals test | Both | Covered |
| AC-008 Core journeys usable on web, Android, iOS; matching outcomes | Future API and clients | Shared records and canonical calculation | Platform-specific end-to-end parity suite | Full product | Not covered |
| AC-009 Allow/deny access verification | Authz and repository boundary | Deny by default; tests cover both outcomes | Account/group/receipt/report authorization matrix | Both | Covered |
| AC-010 Equal/percentage remainder sums; payments reconcile | Split allocator/ledger/payment | Explicit scale and deterministic allocation | Property-based or generated JUnit 5 fixtures, payment reconciliation | Both | Covered |
| AC-011 At least 9/10 succeed unassisted first attempt | UI | Usability feedback and measurable acceptance target | Representative-user study; report numerator/denominator | Both | Partial |
| AC-012 At least 95/100 requests within 3 seconds | Repositories/report/balance queries | Candidate indexes and reproducible dataset | Timed load benchmark at exact record/member counts | Both | Partial |
| AC-013 Invalid amount/negative or non-100% percentages rejected before review | Submission/split validation | Validation before persistence; actionable error | Invalid-input tests assert no expense, notification, approval or ledger entry | Both | Covered |

## Success criteria from the specification

| ID | Design control and planned verification | Scope | Status |
|---|---|---|---|
| SC-001 9/10 account, join, submit without assistance | Usability study across intended workflows; include reset/join readiness | Desktop MVP / full product | Partial |
| SC-002 1,000 split fixtures reconcile | JUnit 5 generated/batch split invariant test over equal/percentage cases | Both | Covered |
| SC-003 Balances equal accepted obligations less payments; exclude pending/rejected | Ledger reconstruction and state-filter integration tests | Both | Covered |
| SC-004 p95 balance/report request <=3 sec at target volume | Reproducible performance suite | Both | Partial |
| SC-005 100% unauthorized attempts denied without disclosure | Authorization test corpus; future API security testing | Both | Partial |
| SC-006 Core journeys on web, Android, iOS with parity | Shared-service integration and client end-to-end suite | Full product | Not covered |

## Explicit FR-010 coverage gap

The proposed desktop slice has **no browser, Android, iOS, shared API, or shared
remote store**, so it cannot satisfy FR-010 or AC-008. The future API/client
architecture is a proposed route, not a committed or present repository capability.
Do not mark FR-010, NFR-005, or SC-006 covered until all required clients are
available and cross-platform tests pass. A delivery/scope decision is required.
