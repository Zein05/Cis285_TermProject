# Risk Register

Likelihood and impact are qualitative design estimates, not measured project
statistics. Owner roles are proposed; assign named owners during human review.

| ID | Risk | Likelihood | Impact | Mitigation | Owner/action | Status |
|---|---|---:|---:|---|---|---|
| R-01 | Swing-only scope is mistaken for satisfying the required web/Android/iOS product | High | Critical | Keep FR-010/AC-008 explicitly uncovered; approve a separate platform delivery plan and acceptance gate | Product owner: decide O-01; reviewers enforce traceability | Open |
| R-02 | No source code or Maven configuration exists in inspected inventory, so baseline/project layout and dependencies are unverified | High | High | Treat package tree and SQLite as proposals; inspect and approve scaffolding before implementation; do not claim build/test status | Project lead: confirm actual repo state and baseline | Open |
| R-03 | Currency scale/remainder ambiguity causes inconsistent shares or false financial precision | Medium | High | Approve currencies and ADR-005; centralize BigDecimal allocation; test exact reconciliation and ties | Product owner + domain implementer: resolve O-03 | Open |
| R-04 | Pending/rejected or duplicate approval posts obligations incorrectly | Medium | Critical | Single atomic state/ledger transaction, conditional version transition, unique source key, idempotency and concurrent tests | Application/persistence implementer: implement and verify | Open |
| R-05 | Payment overpayment, duplicate, or wrong-direction behavior creates incorrect pair balance | Medium | High | Validate named pair transactionally; proposed overpayment rejection; idempotency key; decide semantic duplicate/reversal policy | Product owner: resolve O-07/O-08; implementer: enforce | Open |
| R-06 | Group membership changes expose historical/private data or break financial references | Medium | High | Retain historical membership; authorize every read; separate current membership from financial identity; define removed-user access | Product owner: resolve O-12; security reviewer validates | Open |
| R-07 | Local desktop password/receipt data is treated as production-secure | Medium | High | Clearly label local demo limitations; OS permissions and adaptive password hash; no production claims; require server identity and private storage for release | Project lead: communicate boundary; security owner: review | Open |
| R-08 | Notification delivery failure is reported as successful or notices are duplicated | Medium | Medium | Persist logical inbox notices transactionally; unique recipient/expense key; explicit delivery state and retry/outbox in full product | Application implementer: define failure UI and tests; owner resolve O-06 | Open |
| R-09 | Pairwise projection drifts from ledger or group-wide netting slips into UI | Medium | High | Ledger source of truth, pair-only keys, rebuild/reconciliation tests, three-person no-redirection fixture | Domain/persistence implementer: validate every query | Open |
| R-10 | Performance target is asserted without representative test data/environment | Medium | Medium | Define hardware/runtime/database conditions; benchmark 100 members and 10,000 records with 100 requests; tune measured bottlenecks | Test owner: execute AC-012 and record conditions | Open |
| R-11 | AI-generated diagrams/design are accepted without human verification | Medium | High | Review against source requirements, validate diagram syntax and implementation consistency; require owner sign-off | Human reviewer per Constitution VI | Open |
| R-12 | Custom report filters, receipt retention, edit/delete, or audit policy are assumed without approval | Medium | Medium | Keep report/retention/correction decisions open; least privilege; immutable financial events pending policy | Product owner: resolve O-09/O-10/O-14 | Open |
| R-13 | Domain logic is duplicated in future clients, leading to mismatched shares/balances | Medium | High | Shared API is source of truth; clients submit intent and render canonical outputs; cross-client golden fixtures | Full-product architect: enforce API boundary; test owner: NFR-005 | Open |

