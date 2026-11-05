# Test and Verification Strategy

> **Historical reference only — superseded.** Use the canonical strategy at
> [specs/001-expense-sharing/test-strategy.md](../../specs/001-expense-sharing/test-strategy.md).

## Scope and conventions

No application code, Maven build, or tests were present in the inspected
repository inventory. The following is a planned verification strategy, not test
results. Automated tests use JUnit 5 in the proposed Java project. Swing is not
started for domain tests. Human review of this proposal and its diagrams is
required by Constitution Principle VI.

Map of controls to requirements is in
[traceability-matrix.md](./traceability-matrix.md). Validate the named acceptance
criterion itself rather than inferring success from a passing build.

## Test layers

| Test type | Focus and examples | Framework/approach | Scope |
|---|---|---|---|
| Domain unit tests | Account/group invariants; creator/manager authorization policy; participant membership; submitter=payer=participant; positive amounts; exact percentage totals; negative percentages; equal/percentage remainder allocation; approval state transitions; pairwise obligations; payment direction and overpayment candidate policy | JUnit 5; deterministic fixtures and generated/property-style loops | Desktop MVP and reusable core |
| Application/use-case tests | Account and group workflows, submission writes, notification recipient set, review authorization, final-approval-only posting, report filters, payment update of one pair | JUnit 5 with fake ports; assert state/effects, not only return value | Desktop MVP |
| Persistence integration tests | SQLite schema/migrations, FK/unique constraints, transaction rollback, source idempotency, ledger projection rebuild, inclusive date query, actor/group query boundaries | JUnit 5 against temporary isolated DB; no shared developer data | Proposed MVP |
| Workflow tests | Pending -> approval/rejection; multiple stage future; racing/duplicate approvals; notification failure and retry; removed membership with history | JUnit 5, integration adapter where concurrency/transaction semantics matter | One stage MVP; multi-stage future |
| Authorization tests | Account owner vs other account; member vs nonmember; creator/manager/member; receipt/report access; reviewer permission; attempted ID substitution | JUnit 5 application/integration; explicit allowed and denied cases | Both; server/API enforcement future |
| Payment/ledger tests | Partial/full payment; repeat request with same key; pair direction; opposing obligation within same pair; no transfer to a third account; overpayment; ledger vs projection | JUnit 5 integration and invariant tests | Desktop MVP |
| UI tests | Form validation feedback; participant selection; no accidental submission on invalid input; keyboard/accessibility behavior; result rendering | Swing component/controller tests; use headless-safe tests where possible, small display-backed smoke test if available | Desktop MVP |
| Usability study | First-attempt expense submission task with representative users; record numerator, denominator, assistance and observed failure points | Moderated test; acceptance is >=9/10 per AC-011 | MVP UI then each production client |
| Performance tests | Pairwise balance and date-filtered reports at 100 members/10,000 expense-payment records; warm/cold behavior and data distribution documented | Repeat 100 requests; verify >=95 <=3 seconds under agreed conditions | SQLite candidate; repeat on full service |
| Cross-platform consistency | Same canonical account/group/expense/payment fixtures produce identical shares and balances on web, Android, iOS | Contract tests plus end-to-end tests against shared API; compare exact currency values | Future full product only |
| Diagram/document review | PlantUML parses; nodes, dependencies, states and labels agree with design and requirements | Human review; use PlantUML validator if available | Architecture deliverable |

## Monetary and state test requirements

1. For every allocation fixture, verify input and output use `BigDecimal`, each
   share has the approved currency scale, shares are nonnegative, and the sum
   equals the expense amount exactly.
2. Cover totals smaller than participant counts, exact division, residual ties,
   uneven percentages, zero percentage shares, high-precision percentages summing
   exactly to 100%, and invalid sums/negative percentages.
3. Assert pending and rejected expense submissions do not create ledger entries or
   change any balance. Assert only the final configured approval posts once.
4. Apply payments and assert only the named pair changes; other pairs in a
   three-account fixture remain byte-for-byte unchanged.
5. Rebuild pairwise projections from ledger and compare with the persisted/read
   projection after each workflow.
6. Race two approvals or payment requests against the same version/outstanding
   debt. Exactly one state transition/posting must occur, or retries must resolve
   idempotently; no double balance effect.
7. Invalid submission tests assert no review record, notification, receipt link, or
   ledger side effect is committed.

## Requirement test index

| Requirement | Planned test/verification |
|---|---|
| FR-001 / AC-001 | Account create/sign-in/reset workflow and cross-account privacy tests; reset channel is full-product/open |
| FR-002 / AC-002 | Membership role matrix and nonmember access denial |
| FR-003 / FR-004 / AC-003 / AC-013 | Expense validation, required fields, split rules, receipt optionality, no persistence on invalid input |
| FR-005 / AC-004 | Notification recipient fan-out excludes submitter; retry/duplicate handling |
| FR-006 / AC-005 | Pending/rejected no balance effect; final approval only; reviewer authorization and concurrency |
| FR-007 / FR-008 / AC-006 | Ledger reconstruction, pairwise direction, partial/full payment and no-redirection fixtures |
| FR-009 / AC-007 | Report totals, authorization filter, inclusive date boundaries and invalid ranges |
| FR-010 / AC-008 | Browser/Android/iOS core journey end-to-end tests; not applicable to Swing-only MVP |
| NFR-001 / AC-009 / SC-005 | Allowed/denied access tests; future API security verification |
| NFR-002 / AC-010 / SC-002 / SC-003 | 1,000 allocation fixtures; exact balance reconciliation; pending/rejected exclusion |
| NFR-003 / AC-011 / SC-001 | Representative-user first-attempt study; at least 9/10 |
| NFR-004 / AC-012 / SC-004 | 100-request benchmark at specified data volume and documented conditions |
| NFR-005 / AC-008 / SC-006 | Cross-platform shared-data and exact outcome parity; future only |

## Release/acceptance gates

- Human reviewer confirms each design claim against approved requirements and
  constitution before accepting this AI-generated proposal.
- Domain tests establish financial invariants before wiring Swing.
- Integration tests prove transaction and idempotency behavior before an MVP
  claims approval/payment correctness.
- Usability and performance criteria require observed, documented test results;
  neither is passed by design review alone.
- Full-product acceptance requires web, Android, and iOS implementations plus
  shared-data and parity tests. Until then FR-010, AC-008, NFR-005, and SC-006
  remain uncovered.
