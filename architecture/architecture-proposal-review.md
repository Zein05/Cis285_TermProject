# Architecture Proposal Review: Spec Kit vs. Copilot

> **Historical review input — superseded by the reconciled design baseline.**
> This review is retained for its findings and is not an approval record or a
> competing source of truth. See the canonical
> [requirements](../specs/001-expense-sharing/spec.md), [architecture plan](../specs/001-expense-sharing/plan.md),
> [data model](../specs/001-expense-sharing/data-model.md), and
> [decision register](../specs/001-expense-sharing/decision-register.md).

**Project:** CIS285 Term Project — Expense Sharing  
**Branch reviewed:** docs/architecture-prompt-drafts  
**Review scope:** Independent architecture, requirements, and design-assurance review. This report reviews proposal artifacts only; it does not claim implementation or test verification.

## 1. Executive verdict

Both proposals are viable, with required revisions.

- **Spec Kit:** Stronger requirements discipline, architecture boundaries, platform separation, research, and rationale.
- **Copilot:** Stronger financial-ledger model, transaction integrity, data consistency, traceability, risks, and test strategy.
- **Recommendation:** Adopt a hybrid. Use Spec Kit as the primary requirements/architecture narrative and incorporate Copilot's ledger, transaction, data-model, and assurance artifacts after correcting the issues below.

Both broadly align on Java 21, Maven, a Swing desktop MVP, layered architecture (Presentation → Application → Domain → Infrastructure), Swing-independent domain logic, BigDecimal, approval-gated obligations, pairwise debt, JUnit 5, and a future shared product for web, Android, and iOS.

A Swing-only MVP does **not** satisfy the full cross-platform requirement FR-010. Both proposals acknowledge this correctly.

**Verdict:** Approve the architectural direction with conditions; do not yet approve it as implementation-ready.

## 2. Inputs inspected and evidence limitations

### Requirements and governing documents
- UserRequirement.md
- .specify/memory/constitution.md
- specs/001-expense-sharing/spec.md

### Spec Kit artifacts
- specs/001-expense-sharing/plan.md
- specs/001-expense-sharing/research.md
- specs/001-expense-sharing/data-model.md
- specs/001-expense-sharing/contracts/module-boundaries.md
- specs/001-expense-sharing/quickstart.md
- specs/001-expense-sharing/diagrams/system-architecture.puml
- specs/001-expense-sharing/diagrams/domain-model.puml

### Copilot artifacts
- architecture/copilot/README.md
- architecture/copilot/architecture.md
- architecture/copilot/data-model.md
- architecture/copilot/traceability-matrix.md
- architecture/copilot/decision-register.md
- architecture/copilot/risks.md
- architecture/copilot/test-strategy.md
- architecture/copilot/diagrams/component-architecture.puml
- architecture/copilot/diagrams/domain-model.puml
- architecture/copilot/diagrams/expense-payment-flow.puml
- architecture/copilot/diagrams/system-context.puml

### Verification limits
The inspected repository inventory did not establish Java implementation source, a pom.xml, or an executable JUnit suite. No build or tests were run. PlantUML source was inspected textually but not rendered or compiled. Therefore, all coverage ratings below are design/artifact-level only, not implementation or acceptance evidence.

## 3. Requirements coverage

### Functional requirements

| Requirement | Spec Kit | Copilot | Review |
|---|---|---|---|
| FR-001 Accounts/login/reset/privacy | Partial | Partial | Security and privacy detail needed. |
| FR-002 Groups/membership | Design-complete | Design-complete | Core membership capability represented. |
| FR-003 Expenses/receipts | Design-complete | Design-complete | Main expense and receipt concepts represented. |
| FR-004 Participants/splits | Design-complete | Design-complete | Currency and remainder policies still open. |
| FR-005 Notifications | Partial | Partial | Delivery guarantees and retries undefined. |
| FR-006 Approval | Partial | Partial | Reviewer policy and state transitions need detail. |
| FR-007 Pairwise balances | Design-complete | Design-complete | Core pairwise model represented. |
| FR-008 Payments | Partial | Partial | Overpayment, duplicate, reversal, and correction open. |
| FR-009 Reports | Partial | Partial | Scope and acceptance detail needed. |
| FR-010 Web/Android/iOS | Not met by MVP | Not met by MVP | Remains a full-product requirement. |

### Non-functional requirements

| Requirement | Spec Kit | Copilot | Review |
|---|---|---|---|
| NFR-001 Privacy/auth | Partial | Partial | Security and authorization detail needed. |
| NFR-002 Exact reconciliation | Conditional/partial | “Covered” overstates evidence | Policies and executable tests are still required. |
| NFR-003 Usability ≥90% | Planned/partial | Planned/partial | Requires a measured user study. |
| NFR-004 95% within 3 sec | Planned/partial | Planned/partial | Requires reproducible benchmarks. |
| NFR-005 Cross-platform consistency | Future/partial | Future/partial | Cannot be accepted until clients exist. |

### Acceptance criteria

| Criterion | Status in both proposals | Review |
|---|---|---|
| AC-001 Account workflow | Partial | Security and recovery detail remains. |
| AC-002 Membership authority | Design-complete | Authorization boundaries represented. |
| AC-003 Expense submission | Design-complete | Main flow represented. |
| AC-004 Notifications | Partial | Delivery/retry behavior open. |
| AC-005 Approval gating | Partial | State transitions and reviewer policy need precision. |
| AC-006 Pairwise settlement | Design-complete | Core behavior represented. |
| AC-007 Reports | Design-complete | Design only; implementation unverified. |
| AC-008 Web/Android/iOS | Not met by MVP | Requires actual clients. |
| AC-009 Access control | Planned | Requires implementation and tests. |
| AC-010 Reconciliation | Planned | Requires approved policy and tests. |
| AC-011 Usability | Planned/partial | Requires measured evidence. |
| AC-012 Performance | Planned/partial | Requires benchmark evidence. |
| AC-013 Invalid input rejection | Design-complete | Validation intent represented; implementation unverified. |

“Design-complete” does not mean implemented, tested, or accepted. Copilot's NFR-002 “Covered” status should be downgraded until the monetary policy is approved and executable reconciliation tests exist.

## 4. Constitution audit

| Principle | Spec Kit | Copilot | Finding |
|---|---|---|---|
| I — Requirements traceability | Pass, design-level | Pass, design-level | Copilot matrix is more explicit. |
| II — OO design / GUI boundary | Pass, design-level | Pass, design-level | Both isolate domain/application from Swing. |
| III — BigDecimal | Partial | Partial | Scale, rounding, and remainder policy unresolved. |
| IV — JUnit 5 | Pass, design-level | Pass, design-level | Planned; no executable suite verified. |
| V — PlantUML | Pass, artifact-level | Pass, artifact-level | Files exist; not rendered/compiled. |
| VI — Human review | Pending | Pending | Owner review remains necessary. |

Java 21/Maven/Swing/JUnit 5 baseline is recognized. FR-010's platform gap is acknowledged. The Constitution ratification date remains a governance TODO for the project owner.

## 5. Architecture comparison

Both use a layered modular monolith: Presentation → Application → Domain → Infrastructure. This is appropriate for the MVP and avoids unnecessary microservice complexity.

**Spec Kit strengths**
- Clearer requirements and scope discipline.
- Better separation of rationale from implementation.
- Stronger research and comparison of alternatives.
- Explicit module-boundary contracts.
- Better distinction between MVP and future platform scope.

**Copilot strengths**
- More explicit financial entities and ledger concepts.
- Stronger transaction-integrity treatment.
- More concrete payment and approval modeling.
- Better traceability, risk, decision, and test-strategy artifacts.
- Clearer derivation of balances from financial facts.

Copilot proposes SQLite for the local MVP; Spec Kit compares SQLite, H2, and PostgreSQL while leaving the choice open. SQLite may be reasonable, but it should not be treated as approved until the owner considers deployment, concurrency, portability, backup, and migration.

For the full product, use a shared authoritative backend/API for web, Android, and iOS. Financial calculations and authorization must be server-authoritative. Do not assume the Java desktop domain binary can be reused unchanged on iOS.

**Recommendation:** Single Maven project/modular monolith for MVP; Swing only in presentation; business rules in domain/application; persistence, receipt storage, and notification delivery behind interfaces; no microservices at this stage.

## 6. Financial correctness and examples

Use Java BigDecimal; never float or double for money. BigDecimal alone is insufficient: define currencies, scale, rounding mode, deterministic remainder allocation, mixed-currency support, overpayment, duplicate payment, reversal, and correction policies.

**Equal split:** $10.00 among three people should allocate $3.34, $3.33, and $3.33, totaling exactly $10.00. The extra cent must follow a stable, documented tie-break rule.

**Percentage split:** $100.00 at 50%/30%/20% allocates $50.00/$30.00/$20.00. Validate percentages and exact final reconciliation.

**Pairwise payment:** A pays $60.00 for A and B equally, so B owes A $30.00. B pays $12.00; the remaining B→A obligation is $18.00. An unrelated C→D balance of $5.00 must remain unchanged.

**Approval invariant:** Pending/rejected expenses create no ledger entries. Final approval must atomically validate state/version, authorize reviewer, record decision, approve expense, and create obligations exactly once. Duplicate and concurrent approval attempts must not double-post.

## 7. Data model and consistency findings

Copilot's immutable ledger is stronger than storing only mutable balance totals. Pairwise balances should be derived from immutable facts; cached projections should be added only if performance measurements justify them.

### Required corrections

- **P0 — Ledger uniqueness:** One expense may create multiple obligations (one per non-payer participant). A unique key on expenseId alone is too restrictive. Use a unique obligationId or an appropriate composite key such as (expenseId, debtorId, creditorId, entryKind), preserving idempotency.
- **P0 — Payment posting cardinality:** Copilot models Payment→LedgerEntry as 0..1. A committed payment should have exactly one posting, unless pending/non-posted payment states are explicitly modeled.
- **P1 — Currency scale:** Define scale and currency rules; not all currencies use two decimals.
- **P1 — Approval policy/versioning:** Define reviewer eligibility, self-approval, decision history, and whether multi-stage approval exists.
- **P1 — Membership history:** Define removed members' access to historical expenses, receipts, and reports.
- **P1 — Overpayment/reversal:** Define overpayment and mistaken-payment correction without erasing historical facts.

General invariants: pending/rejected expenses create no obligations; approval posts once; payments affect only the intended pair/obligation; balances rebuild from ledger facts; duplicate requests create no duplicate effects; corrections preserve audit history.

## 8. Diagrams and artifact consistency

Spec Kit diagrams: system-architecture.puml, domain-model.puml.

Copilot diagrams: component-architecture.puml, domain-model.puml, expense-payment-flow.puml, system-context.puml.

Both align broadly with the layered architecture. Future client boundaries are shown as future scope. The Copilot diagram shares the payment/ledger cardinality issue from its data model. Currency scale and approved remainder policy should appear in the consolidated model where useful. No fatal textual contradiction was identified. PlantUML rendering/compilation remains unverified and should be automated in CI.

## 9. Testability and acceptance coverage

Retain Copilot's standalone test strategy. Critical JUnit tests should cover:

1. Domain logic runs without Swing dependencies.
2. Pending and rejected expenses create no ledger entries.
3. Approved expenses create expected obligations exactly once.
4. Duplicate/concurrent approvals cannot double-post.
5. Partial payments affect only the intended pair.
6. Payments cannot target the wrong debtor-creditor pair.
7. Overpayment follows approved policy.
8. Ledger projections rebuild to identical balances.
9. Invalid input causes no financial side effects.
10. Reversal/correction preserves audit history.

Acceptance evidence still needed:
- **AC-008/FR-010:** actual web, Android, and iOS clients, or an explicitly approved scope change.
- **AC-011/NFR-003:** defined usability study and measured results.
- **AC-012/NFR-004:** reproducible benchmark with hardware, workload, dataset, and percentile definition.
- **AC-010/NFR-002:** approved monetary policies and executable reconciliation tests.

## 10. Risks and owner decisions

Use Copilot's risk register as the starting point. The project owner should decide:

1. Local-only MVP or shared remote data?
2. Future web application/PWA or separate native/store apps?
3. Web/Android/iOS delivery sequence?
4. MVP database and migration strategy?
5. Supported currencies, scale, rounding, and remainder rules?
6. Who may approve, and is self-approval prohibited?
7. Single-stage MVP approval or future multi-stage workflow?
8. Notification channels and delivery/retry guarantees?
9. Overpayment and duplicate-payment behavior?
10. Mistaken payment, expense correction, and reversal representation?
11. Receipt limits, file restrictions, retention, and access?
12. Historical access after membership removal?

Record each decision with owner, status, rationale, and date. Proposed decisions must not be represented as approved.

## 11. Consolidated architecture recommendation

- **MVP:** Java 21/Maven Swing modular monolith with Presentation, Application, Domain, and Infrastructure layers.
- **Presentation:** Swing screens and UI coordination only.
- **Application:** use-case orchestration, authorization, transaction boundaries.
- **Domain:** expense, split, approval, obligation, payment, reconciliation rules.
- **Infrastructure:** persistence, receipt storage, notifications, external adapters.
- **Financial model:** Copilot's immutable ledger, corrected uniqueness/cardinality; explicit pairwise obligations and payments; derived balances; auditable reversals/corrections.
- **Future product:** shared authoritative backend/API with web, Android, and iOS clients.
- **Governance:** Spec Kit narrative plus Copilot data model, decision/risk registers, traceability, and test strategy. Mark decisions proposed/approved/rejected/superseded. Distinguish design coverage from implementation and acceptance evidence.

## 12. Prioritized remediation backlog

### P0 — Before implementation is treated as ready
- [ ] Correct ledger source uniqueness for multiple obligations per expense.
- [ ] Correct payment-posting cardinality and distinguish pending from posted payments.
- [ ] Obtain owner approval for currency, scale, rounding, remainder, approval, and payment policies.
- [ ] Preserve FR-010 as a full-product requirement; label Swing MVP as not satisfying web/mobile delivery.

### P1 — Before financial/acceptance claims are approved
- [ ] Decide database and migration rationale.
- [ ] Specify approval transitions, reviewer permissions, self-approval, concurrency.
- [ ] Specify overpayment, duplicate payment, reversal, and correction.
- [ ] Specify notification delivery, retry, and failure behavior.
- [ ] Specify membership removal and historical access.
- [ ] Add executable financial reconciliation and transaction-integrity tests.
- [ ] Define and measure usability for AC-011/NFR-003.
- [ ] Define and benchmark performance for AC-012/NFR-004.

### P2 — Traceability and validation
- [ ] Calibrate Copilot “Covered” labels to distinguish design, implementation, and acceptance.
- [ ] Add a Spec Kit traceability matrix or maintain Copilot's as source of truth.
- [ ] Add ledger/payment details to Spec Kit's data model.
- [ ] Replace quickstart placeholders with verified build/run commands when code exists.
- [ ] Add automated PlantUML compilation/render validation to CI.

### P3 — Follow-up
- [ ] Add ledger fixtures and end-to-end financial scenarios.
- [ ] Add shared financial/approval glossary.
- [ ] Add sample approval, partial settlement, and reversal scenario.
- [ ] Add deployment/context diagram after hosting/client decisions.

## 13. Final approval recommendation

**Approve the architectural direction with conditions; do not yet approve it as implementation-ready.**

Use Spec Kit as the primary requirements/architecture narrative and incorporate Copilot's stronger ledger, transaction, traceability, risk, and test-strategy artifacts after P0/P1 corrections.

Before proceeding:
1. Resolve ledger uniqueness and payment-posting cardinality.
2. Obtain owner decisions on financial and approval policies.
3. Preserve FR-010 and distinguish it from the Swing MVP.
4. Convert financial invariants into executable JUnit 5 tests.
5. Keep design coverage, implementation status, and acceptance evidence distinct.

No requirements, Constitution, specification, or implementation files were changed during this review. No tests/builds were run; diagrams were not rendered/compiled.

## Repository references

- [User requirements](https://github.com/Zein05/Cis285_TermProject/blob/docs/architecture-prompt-drafts/UserRequirement.md)
- [Constitution](https://github.com/Zein05/Cis285_TermProject/blob/docs/architecture-prompt-drafts/.specify/memory/constitution.md)
- [Expense-sharing specification](https://github.com/Zein05/Cis285_TermProject/blob/docs/architecture-prompt-drafts/specs/001-expense-sharing/spec.md)
- [Spec Kit proposal](https://github.com/Zein05/Cis285_TermProject/tree/docs/architecture-prompt-drafts/specs/001-expense-sharing)
- [Copilot proposal](https://github.com/Zein05/Cis285_TermProject/tree/docs/architecture-prompt-drafts/architecture/copilot)
- [Reviewed branch](https://github.com/Zein05/Cis285_TermProject/tree/docs/architecture-prompt-drafts)
