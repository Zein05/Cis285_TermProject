# Requirements Traceability Matrix

This is the single canonical matrix. The listed requirement/design coverage is
proposal-level only. Repository inventory on 2026-11-05 contains no application
source, Maven build, runtime, or test suite; accordingly nothing is marked
Implemented, Verified, or Accepted.

## Status vocabulary

- **Specified**: present in the requirements baseline.
- **Designed**: proposed design control exists in the linked artifacts.
- **Implemented / Verified / Accepted**: only after repository and review evidence
  exists; none currently qualify.
- **Deferred**: required capability intentionally outside the proposed Swing MVP.
- **Open**: owner decision or evidence is still required.

## Functional requirements and acceptance criteria

| Requirement | Acceptance | Use case | Component/module | Domain entities/rules | UML | Planned evidence | Status |
|---|---|---|---|---|---|---|---|
| FR-001 accounts, sign-in, reset, own data | AC-001 | UC-01 Account lifecycle | Identity adapter; Account use cases | Account; actor-scoped access | use-case, component | T-01 account lifecycle and cross-account denial | Specified; Designed; Open on production identity/reset |
| FR-002 groups and membership control | AC-002 | UC-02 Manage group | Group/authorization use cases | Group, Membership; creator/manager may add/remove | use-case, class | T-02 role matrix and removal history | Specified; Designed |
| FR-003 expense fields, receipt, positive amount | AC-003, AC-013 | UC-03 Submit expense | Expense application; Receipt port | Expense, Receipt; positive amount; submitter=payer | use-case, class, submission sequence | T-03 required fields, receipt validation, invalid-input no-side-effect | Specified; Designed |
| FR-004 participants and split | AC-003, AC-010, AC-013 | UC-03 Submit expense | Split policy | ExpenseShare; participant membership; exact 100% | class, split activity | T-04 equal/percent/remainder reconciliation | Specified; Designed; Open on monetary policy |
| FR-005 notify other members | AC-004 | UC-03 Submit expense | Notification port/adapter | Notification; recipient set excludes submitter | use-case, component, submission sequence | T-05 recipient/idempotency/retry and delivery-failure tests | Specified; Designed; Open on channels/guarantees |
| FR-006 review before balance effect | AC-005 | UC-04 Review expense | Approval and ledger use cases | ApprovalPolicy, Decision, Expense, LedgerEntry; atomic final posting | use-case, class, approval sequence, expense state, approval activity | T-06 pending/rejected exclusion; authorized, duplicate, concurrent final approval | Specified; Designed; Open on reviewer/self-approval policy |
| FR-007 pairwise balances, no redirection | AC-006 | UC-05 View balance | Ledger/projection | Obligation, PairwiseBalance; same-pair netting only | class, component | T-07 three-member no-redirection and projection rebuild | Specified; Designed |
| FR-008 record payment to named payee | AC-006 | UC-06 Record payment | Payment/ledger use cases | Payment, LedgerEntry; posted payment has exactly one posting | class, payment sequence/state | T-08 partial/full, wrong pair, duplicate, posting cardinality, overpayment | Specified; Designed; Open on duplicate/overpayment/reversal policy |
| FR-009 reports and summaries | AC-007 | UC-07 View reports | Reporting/query module | ReportQuery; authorization and inclusive date bounds | use-case, component | T-09 totals, date boundaries, unauthorized exclusion | Specified; Designed; MVP scope partial |
| FR-010 primarily web plus Android and iOS | AC-008 | UC-08 Use supported clients | Web, Android, iOS and shared API (future) | One authoritative service and shared records | component | T-10 per-client acceptance and cross-client parity | Specified; Designed (target only); Deferred; not implemented |

## Non-functional requirements and success criteria

| Requirement | Criterion | Design control | UML | Planned evidence | Status |
|---|---|---|---|---|---|
| NFR-001 privacy and authorized group access | AC-009; SC-005 | Deny-by-default server/application authorization; receipt/report checks | component, class | T-11 allowed/denied access matrix; security review | Specified; Designed; Open on production controls |
| NFR-002 exact reconciliation and disclosed remainder | AC-010; SC-002, SC-003 | Exact decimal model, fixed approved currency policy, immutable facts | class, approval, split activity | T-04/T-07 across 1,000 fixtures; exact totals | Specified; Designed; Open on currency/rounding |
| NFR-003 >=90% first-attempt unaided expense submission | AC-011; SC-001 | Actionable validation is a design goal; detailed interaction design is not present | N/A (interaction design not yet detailed) | T-12 observed study, 10 representative participants, >=9 first-attempt success | Specified; Open; not verified |
| NFR-004 p95 within 3 seconds for stated workload | AC-012; SC-004 | Indexed queries and rebuildable projection; no performance claim by design | component | T-13 100 requests, 100 members, 10,000 records, documented environment; >=95 within 3 seconds | Specified; Designed; not verified |
| NFR-005 identical outcomes across supported clients | AC-008; SC-006 | Shared authoritative service; clients do not own financial calculations | component | T-10 canonical fixture parity on web, Android, iOS | Specified; Designed (target only); Deferred |

## Test evidence index

Test IDs are plans, not existing tests: T-01 authentication/privacy; T-02
membership; T-03 submission/receipt; T-04 split allocation; T-05 notification;
T-06 approval/atomic posting; T-07 pairwise ledger/projection; T-08 payment;
T-09 reports; T-10 cross-platform; T-11 authorization; T-12 usability; T-13
performance. See [test-strategy.md](./test-strategy.md).

## Acceptance evidence

The original AC-001–AC-013 identifiers and statements remain in
[spec.md](./spec.md). Their objective pass conditions and evidence artifacts are
specified above and in the test strategy. No criterion has been run or accepted.
