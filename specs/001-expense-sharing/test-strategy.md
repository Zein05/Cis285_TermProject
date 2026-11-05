# SplitSmart Test and Verification Strategy

This is a verification plan, not evidence of executed tests. No application
source, `pom.xml`, configured test runner, or tests were found during the
2026-11-05 repository inventory. The Constitution requires JUnit 5 once a Java
implementation exists.

## Test layers

| Layer | Scope | Required checks |
|---|---|---|
| Domain unit | Currency/Money, split allocator, state transitions, ledger rules | Exact `BigDecimal` arithmetic; no float/double; percentage validation; deterministic allocation after policy approval; pairwise signs |
| Application | Submission, review, payment, authorization, reports | Use-case result and effects; error paths; no partial writes; actor authorization |
| Persistence integration | Selected database adapter | Foreign keys/unique keys; transaction commit/rollback; isolation/version conflicts; duplicate/concurrent calls; projection rebuild |
| API contract (future) | Authenticated shared service | Request validation, idempotency, authorization, schema/version compatibility |
| UI | Swing now; web/mobile later | Presentation, accessibility, validation feedback, navigation; financial rules are not tested only through UI |
| Security/privacy | All clients and service | Cross-account, non-member, removed member, group, report, and receipt access-denial cases |
| Notification/receipt | Adapter integration | Notification idempotency, failures/retry/observable state; receipt type/size/access/retention policy |
| Non-functional | Each accepted client/deployment | Reproducible usability, performance, and cross-platform tests per NFR |

## Required financial and workflow tests

1. Pending and rejected expenses create no ledger entries and do not change balances.
2. Final approval creates all expected obligations exactly once.
3. A multi-participant expense creates a distinct obligation for each non-payer with a positive allocated share; zero-unit shares create no zero-value obligation. Unique identity permits multiple obligations from one expense and prevents duplicate reposting of each obligation.
4. Duplicate and concurrent approval requests do not double-post; stale versions fail explicitly or return the already-committed result idempotently.
5. Partial payment reduces only its named pair's outstanding amount.
6. A payment for a wrong/nonexistent pair is rejected and leaves all financial facts unchanged.
7. Overpayment follows the owner-approved policy; until then the behavior is blocked, not guessed.
8. Every committed `POSTED` payment has exactly one ledger posting; pending/failed payment attempts have none.
9. Rebuilding pairwise projections from immutable facts reproduces the same values.
10. Every valid split reconciles exactly to the expense total at approved currency scale.
11. Remainder allocation is deterministic after an owner-approved rule is selected.
12. Any approved reversal/correction adds compensating facts and preserves original history.
13. Unauthorized access to accounts, groups, expenses, reports, and receipts is denied.
14. Invalid input causes no partial financial effects; failure is explicit.

## Reproducible acceptance measurements

| NFR / AC | Method and workload | Pass threshold | Evidence |
|---|---|---|---|
| NFR-001 / AC-009 | Positive and negative actor/role/access matrix across account, group, report, receipt | All unauthorized cases denied without protected data disclosure | Versioned test report, environment, request/actor matrix |
| NFR-002 / AC-010 | At least 1,000 equal/percentage split fixtures, including remainder/tie/edge cases; reconcile ledger and projections | Exact equality at smallest approved currency unit; disclosed approved remainder policy | Test output and fixture set; policy/algorithm version |
| NFR-003 / AC-011 | First-attempt expense submission task with 10 representative participants per client | At least 9/10 unaided | Protocol, anonymized observations, numerator/denominator |
| NFR-004 / AC-012 | 100 balance/date-filtered requests against group of up to 100 members and 10,000 expense/payment records | At least 95 requests complete within 3 s | Hardware/runtime/database version, dataset seed, raw timings, summary |
| NFR-005 / AC-008 | Identical canonical scenarios through web, Android, iOS backed by shared service | Same shares and outstanding balances for every scenario | Client/build versions, API/service version, exact comparison report |

Preconditions, hardware, software versions, workload distribution, and
measurement scripts must be recorded before claiming these thresholds passed.
No measured result is currently available.

## Release gates

- Human review is required by Constitution Principle VI.
- Domain and application financial tests pass before UI integration.
- Selected-database integration tests prove transaction, uniqueness, concurrency,
  and recovery behavior before payment/approval correctness is claimed.
- Usability and performance require observed evidence, not design review.
- FR-010, AC-008, and NFR-005 remain unmet until web, Android, and iOS are
  available and pass shared-data and parity tests.

See [traceability-matrix.md](./traceability-matrix.md) for requirement mapping
and [quickstart.md](./quickstart.md) for the current verification boundary.
