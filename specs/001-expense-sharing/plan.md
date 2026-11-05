# Implementation Plan: SplitSmart Expense Sharing Architecture

**Branch**: `001-expense-sharing` (Spec Kit feature identifier) | **Active Git branch**: `docs/architecture-prompt-drafts` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Customer baseline [UserRequirement.md](../../UserRequirement.md), approved project constraints [constitution.md](../../.specify/memory/constitution.md), and clarified feature specification [spec.md](./spec.md).

## Summary

This is an architecture proposal, not application implementation. The repository currently contains no `pom.xml`, Java source, test source, or configured client/API project. The Constitution establishes Java 21, Maven, Swing, JUnit 5, and PlantUML as implementation constraints, but those configurations are not yet evidenced in the repository.

For the desktop MVP, use a Java/Swing presentation layer that calls application use cases and a framework-independent domain core. Place persistence, receipt handling, identity, and notifications behind explicit boundaries. A local relational store is a candidate for a single-machine demonstration, not a shared product. For the full customer product, the recommended direction is a modular Java service/API with shared server-side financial rules, web as the primary client, and Android/iOS clients using the same service. This is a recommendation, not an approved stack or proof that these platforms exist. A Swing-only MVP does **not** meet customer requirement FR-010.

Approval configuration, reviewer eligibility, currency and remainder rules, overpayment handling, storage and deployment choices, and the delivery plan for FR-010 remain owner decisions. No unresolved policy is silently filled in.

## Technical Context

- **Language/Version**: Java 21 is the Constitution baseline; no Java project or compiler target is present to verify. Web/mobile languages are undecided.
- **Primary Dependencies**: Maven, Java Swing, JUnit 5, and PlantUML are Constitution constraints, not verified configured dependencies. No framework, API library, ORM, or UI toolkit for future clients is selected.
- **Storage**: No store is present. Embedded relational storage is a candidate for a local desktop demo; a shared relational database behind a service is recommended for the full product. Engine and schema are open decisions.
- **Testing**: JUnit 5 is required by the Constitution. No tests or test runner are present. Domain rules must be testable without launching Swing.
- **Target Platform**: Desktop Swing is the proposed MVP target. The customer target is primarily web plus Android and iOS; this remains an unmet requirement until those clients are delivered and validated.
- **Project Type**: Proposed modular Java desktop MVP with a migration path to a service-backed multi-client product; no application project is currently implemented.
- **Performance Goals**: NFR-004: for a group up to 100 members and 10,000 expense/payment records, at least 95 of 100 balance/date-filtered report requests display in under 3 seconds under documented, agreed test conditions. No performance results exist.
- **Constraints**: Preserve FR-001–FR-010; Swing alone cannot satisfy FR-010. Use `BigDecimal` for monetary calculations, define scale/rounding/remainder policy before implementation, preserve pairwise debts, and keep pending/rejected expenses out of balances. Password reset and multi-user deployment need an actual delivery/authentication boundary.
- **Scale/Scope**: NFR-004 workload is the only quantified scale target. The specification assumes one currency per group and does not assume multi-currency conversion. Hosting, availability, retention, backup objectives, and offline behavior are unspecified.

### Classification and status

- **Customer requirement**: FR/NFR items preserved from the approved specification and customer requirement.
- **Constitution constraint**: the principles and implementation baseline in the Constitution.
- **Implementation decision**: an architectural proposal or MVP boundary; it is not customer approval.
- **Assumption**: a specification assumption used to frame the design.
- **Open decision**: an unresolved choice requiring an owner decision; no compliance claim depends on treating it as settled.

## Constitution Check

The status below is about the plan, not implemented software. The repository has no source/build/tests, so implementation conformance cannot be certified.

### Before design (gate)

| Principle / constraint | Classification | Gate status and evidence |
|---|---|---|
| I. Requirements are traceable and classified | Constitution constraint | **Open pending plan artifacts.** Inputs identify FR-001–FR-010, NFR-001–NFR-005, and AC-001–AC-013. The design must trace all IDs and keep FR-010 visible. |
| II. Object-oriented design and strict GUI boundary | Constitution constraint | **Design condition.** Propose cohesive UI/application/domain/persistence boundaries. No code exists to verify separation or testability. |
| III. Exact monetary arithmetic | Constitution constraint | **Design condition with unresolved policy.** `BigDecimal` is mandatory; supported currency scale and deterministic remainder allocation are not approved. |
| IV. Automated tests with JUnit 5 | Constitution constraint | **Design condition.** JUnit 5 is required, but no Maven configuration or tests exist. |
| V. PlantUML architecture documentation | Constitution constraint | **Plan deliverable.** PlantUML source will be added; it still requires human review and a renderer/check in implementation. |
| VI. Human review of AI contributions | Constitution constraint | **Not yet satisfied.** Owner/human review is required before accepting this proposal. |
| Full customer platform requirement FR-010 | Customer requirement | **Not met by Swing-only scope.** Full-product delivery remains required; no scope waiver or exception is approved. |

No gate is treated as passed on missing implementation evidence. Planning can proceed because the platform shortfall is explicit and the proposal does not claim that the MVP satisfies it.

### After design (gate)

| Principle / constraint | Design assessment |
|---|---|
| I. Traceability/classification | **Plan-level pass:** the matrix below traces all FR, NFR, and AC IDs to components and planned verification; customer requirements remain distinct from choices. |
| II. GUI boundary | **Design-level pass; implementation unverified:** Swing calls use cases; domain logic has no Swing dependency and is tested independently. |
| III. Monetary correctness | **Design-level pass; implementation blocked on owner policy:** `BigDecimal`, exact reconciliation, and deterministic allocation tests are specified. Currency scale and final tie-breaking rule remain open. |
| IV. JUnit 5 | **Plan-level pass; implementation unverified:** unit, integration, and acceptance verification are mapped; no suite exists yet. |
| V. PlantUML | **Artifacts supplied; review/render pending:** diagram source is included in this feature directory. |
| VI. Human review | **Open:** this AI-generated design must be reviewed before acceptance. |
| FR-010 / NFR-005 | **Not satisfied by the Swing MVP.** A web-first, shared-service product with Android/iOS clients is required for full acceptance. The owner must approve a delivery/scope plan; this plan does not waive the requirement. |

## Architecture Options and Recommendation

All options below are **implementation decisions under consideration**, not customer requirements or existing repository capabilities.

| Option | Benefits | Complexity | Testing implications | Fit / drawbacks |
|---|---|---|---|---|
| A. Swing desktop modular monolith | Smallest implementation/deployment; conforms to the current desktop baseline; pure Java domain tests are straightforward. A local database can support a single-machine demonstration. | Low for a demo; local storage/account/notification adapters still need implementation. | Domain/application tests without Swing; desktop workflow and local persistence tests. Cannot prove remote identity or multi-client consistency. | Does not provide a browser product, Android/iOS apps, shared accounts, or cross-device state. **Not full customer coverage**; fails FR-010 and NFR-005. |
| B. Modular Java service/API plus web and native mobile clients | One server-side authority for authorization, expense approvals, shares, pairwise balances, payments, and report access; clients use the same records and rules. | High: service hosting, authentication/session lifecycle, API security, shared persistence, migrations, monitoring, backups, plus three client surfaces. | Domain, API contract, database, authorization, workflow, load, and per-client end-to-end tests; same golden financial fixtures across clients. | Strongest fit for FR-010 and NFR-005; largest delivery and operations cost. |
| C. Service/API plus web/PWA or cross-platform UI | Potentially less duplicated client UI and broad reach from one client codebase; still permits one authoritative service. | Medium-to-high: service remains necessary; additional client framework/build and store or installation pipeline may be needed. | Service/domain tests plus browser/device tests on each required platform; verify offline/native behavior and store distribution if required. | A PWA or shared UI may not meet the customer's meaning of “apps” or native/store expectations. Does not replace the Swing MVP requirement or settle platform acceptance. |

**Recommendation (proposal)**: Keep the initial Swing MVP a local demonstration only if the owner approves that boundary. Put use cases and domain rules behind ports so that the Java core can run in the desktop process for the MVP and in a future service process. For full delivery, prefer a modular monolith service/API with web-first and Android/iOS clients; clients request authoritative shares and balances rather than independently calculating them. Avoid microservices until a measured requirement justifies their operational cost. Do not assume a Java domain binary can run on iOS; cross-platform consistency should come from the server contract and shared test vectors.

### Decision register

| ID | Classification | Decision / status | Rationale and alternatives considered | Consequence / approval needed |
|---|---|---|---|---|
| D-01 | Implementation decision | Separate Swing, application, domain, and adapter boundaries — **recommended** | Meets Constitution II and isolates financial rules. Alternative: put logic in Swing screens, rejected because it couples rules to UI and impedes independent tests. | Use cases/domain can be called locally now and by an API adapter later; implement and review dependency direction. |
| D-02 | Implementation decision | Modular monolith before microservices — **recommended** | Requirements describe one cohesive expense-sharing product and modest quantified data volume; no independent scaling/ownership requirement supports service decomposition. | A future service still needs deployment/operations; re-evaluate only with evidence. |
| D-03 | Implementation decision | Relational persistence with a repository/transaction boundary — **proposal; engine open** | Relationships and approval/payment state changes need referential integrity and atomic updates. Local SQLite and shared PostgreSQL are candidates, not selections; see [research.md](./research.md). | Choose engine, monetary storage representation, migration tooling, and backup approach before implementation. |
| D-04 | Implementation decision | Authoritative pairwise balance derived from approved shares and payments — **recommended** | Avoids drift between a mutable balance and source records; preserves original user pairs. | Add a cache only after profiling, with versioning/rebuild verification. |
| D-05 | Implementation decision | Central service/API for full product — **recommended; delivery open** | Supports web/Android/iOS access to the same groups and outcomes and central authorization. Alternative local-only desktop cannot meet FR-010/NFR-005. | Requires owner-approved platform sequence, hosting, identity/session, API, and migration decisions. |
| D-06 | Implementation decision | Swing-only desktop scope for first demonstration — **specification implementation subset, not a waiver** | Smallest path to exercise core domain rules under the baseline. | Explicitly fails FR-010 and portions of FR-001/005/006/009; must not be reported as full acceptance. |
| A-01 | Assumption (from spec) | One currency per group; no FX | Preserves the clarified specification assumption and avoids unrequested conversion behavior. | Supported currencies, scale, and rounding/remainder allocation still need owner approval. |
| A-02 | Assumption (from spec) | A person has one account and may belong to multiple groups; each expense belongs to one group | Preserves the feature specification's assumptions. | Revisit only through an approved specification change. |
| O-01 | Open decision | Local demonstration or shared remote accounts/data | Feature spec leaves this unresolved. | Owner must select before deciding whether local identity/storage is sufficient. |
| O-02 | Open decision | Web/mobile delivery and native/store versus PWA meaning | FR-010 is mandatory, but client scope and acceptance details are not defined. | Owner must approve client strategy and delivery order; no waiver is implied. |
| O-03 | Open decision | Storage engine, migration, backup, recovery, and hosting | No configuration exists; options are proposals only. | Select actual engine and operational owner before schema/build work. |
| O-04 | Open decision | Reviewer roles, self-approval, multiple levels, inactivity | Core policy is underspecified. | Approve workflow before implementing approval eligibility/transitions. |
| O-05 | Open decision | Currency set, scale, rounding/remainder rule, and overpayment | These choices affect member obligations. | Approve before implementing monetary calculations or payment acceptance. |
| O-06 | Open decision | Notification channel/delivery; receipt storage, limits, and retention | Current MVP assumes in-app notice only; external delivery/attachment policy is open. | Select before claiming complete notification or receipt behavior. |
| O-07 | Open decision | Expense edits/deletion, payment corrections, report filters/exports, and retention | Lifecycle and reporting details remain open in the spec. | Approve audited correction and reporting policies before full implementation. |
| O-08 | Open decision | Password-reset delivery and session/token model | FR-001 requires reset but no delivery/session mechanism is selected. | Approve identity boundary before production account claims. |

## Logical Architecture and Component Responsibilities

1. **Presentation** — Swing screens collect input, show validation/errors, and render balances/reports. They call application use cases; they contain no financial or authorization rules. A web client and Android/iOS clients are future surfaces, not present code.
2. **Application/use-case layer** — Coordinates account/group operations, expense submission, review, payment, balance/report queries, receipt access, and notification creation. Applies actor/group context, transaction boundaries, and explicit error mapping.
3. **Domain** — Encapsulates accounts, group membership/roles, expense/share values, approval transitions, pairwise obligations, and payment invariants. Pure Java and independent of Swing, databases, HTTP, and notification providers.
4. **Persistence boundary** — Repository and unit-of-work/transaction ports; adapter choice remains open. Persist source records and audit history. Referential constraints and atomic approval/payment updates are required.
5. **Account/authentication boundary** — Owns email identity, password verification/reset, and sessions. Local demo credentials must not be stored as plaintext. For a shared product, enforce identity and authorization server-side; web/mobile local state is never an authorization source. Provider and session protocol remain open.
6. **Group/membership** — Creator/managers may add/remove members as specified. Other manager powers and reviewer eligibility are open. Preserve historical expense references when membership ends; access/retention policy for former members is open.
7. **Expense submission/splits** — Validate group membership, payer=submitter, payer is a participant, positive amount, unique participants, and valid percentage total before creating a reviewable expense. Shares are proposed until final approval.
8. **Approval** — Evaluate each configured review step, record immutable decisions, reject unauthorized/self-review according to the policy selected by the owner, and apply the expense to balances only on final approval. Single-step is the MVP subset; multiple levels remain required for the full product.
9. **Notifications** — MVP proposal is in-application notices to every other group member (not the submitter). External channel and delivery/retry expectations are open. Future external delivery should not make expense persistence appear successful while notification failure is hidden.
10. **Pairwise balance and payment** — Derive obligations only from finally approved expenses; record payments for the named debtor/creditor pair only. No group-wide debt redirection. Overpayment treatment is unresolved; explicitly detect it and do not silently corrupt balances.
11. **Reporting** — Query only authorized records; date range boundaries are inclusive per AC-007. Filters and report results can remain transient unless saved reports are approved.
12. **Receipt handling** — Store metadata and a private storage reference, not a public path. Read access is checked through the associated expense/group authorization. File type/size, storage, retention, and upload limits are open.
13. **Future API boundary** — The current Swing-only design has no network API. A future service/API is recommended for the full product; its protocol/schema is not invented here and must be designed with the approved clients and auth model.

See [system-architecture.puml](./diagrams/system-architecture.puml), [domain-model.puml](./diagrams/domain-model.puml), [module-boundaries.md](./contracts/module-boundaries.md), and [data-model.md](./data-model.md).

## Requirements Traceability

Classification values use the categories defined above. “Planned test” is not a test result; no implementation or test suite exists yet.

| ID | Classification | Component / design path | Planned verification and scope status |
|---|---|---|---|
| FR-001 | Customer requirement | Account/auth boundary, own-account query authorization, password-reset adapter | JUnit account/reset and cross-account denial tests; AC-001. Local demo is not proof of production reset or shared identity. |
| FR-002 | Customer requirement | Group and membership use cases; creator/manager role checks | JUnit role matrix and non-member denial; AC-002. |
| FR-003 | Customer requirement | Expense submission, `BigDecimal` amount, date/description, split method, receipt metadata | Domain and persistence tests; AC-003, AC-013. |
| FR-004 | Customer requirement | Participant/share model and deterministic split calculator | Equal/percentage/remainder, duplicate/non-member/payer cases; AC-003, AC-010, AC-013. |
| FR-005 | Customer requirement | Notification application port; exclude submitter | Recipient-set test (all other members, no submitter); AC-004. In-app MVP only; full channel open. |
| FR-006 | Customer requirement | Configurable review steps, immutable decisions, final-approval balance gate | Pending/rejected/final approval workflow tests; AC-005. MVP subset has one step; full multi-level behavior still required. |
| FR-007 | Customer requirement | Pairwise obligation derivation from approved shares | Golden-ledger tests proving no cross-pair debt redirection; AC-006. |
| FR-008 | Customer requirement | Payment use case and pair-scoped ledger entry | Partial/full payment and pair-isolation tests; overpayment policy test blocked on owner choice; AC-006. |
| FR-009 | Customer requirement | Authorized query/report service with inclusive date filter | Record-level access and boundary-date/totals tests; AC-007. MVP basic reports do not establish all custom filters. |
| FR-010 | Customer requirement | Future web-first client, service/API, Android client, iOS client | End-to-end journey on each client and shared-result test; AC-008. **Not satisfied by Swing MVP.** |
| NFR-001 | Customer requirement | Authenticated account and group authorization at application/service boundary | Allowed/denied access tests for account, member, non-member, manager, receipt, and report; AC-009. |
| NFR-002 | Customer requirement | Exact decimal arithmetic, explicit unit scale and remainder allocation | 1,000-case reconciliation/property tests; every share sum equals expense at smallest supported unit; AC-010. |
| NFR-003 | Customer requirement | Expense-entry UX and correction messages | Representative usability test: at least 9/10 first-attempt unassisted; AC-011. |
| NFR-004 | Customer requirement | Indexed query/report boundary; measure before adding cache | Documented 100-member/10,000-record workload, 100 requests, at least 95 under 3 seconds; AC-012. |
| NFR-005 | Customer requirement | Server-authoritative financial result and stable client contract | Same fixture through web/Android/iOS; exact participant shares and pairwise balances match; AC-008. |
| SC-001 | Customer requirement (success criterion) | Account, group, expense-entry workflow and usability | At least 9/10 representative users create/join/submit without assistance; measure with the AC-011 usability protocol. |
| SC-002 | Customer requirement (success criterion) | Split calculator and exact decimal policy | Reconcile all 1,000 equal/percentage fixtures to the smallest supported currency unit; AC-010. |
| SC-003 | Customer requirement (success criterion) | Approval-gated pairwise ledger | For every test group, compute net obligations from approved expenses less payments; exclude pending/rejected records; AC-005/006. |
| SC-004 | Customer requirement (success criterion) | Balance/report query and persistence | At least 95% of requests meet 3 seconds for the specified group/record volume under documented conditions; AC-012. |
| SC-005 | Customer requirement (success criterion) | Account/group authorization boundary | Deny all unauthorized requests in the defined test set without disclosure; AC-009. |
| SC-006 | Customer requirement (success criterion) | Full-product clients and shared service | Complete core journeys on web, Android, and iOS with matching outcomes; blocked for Swing-only scope; AC-008. |
| AC-001 | Customer requirement (acceptance criterion) | FR-001 identity/reset/private-account boundary | Account creation, sign-in, reset, owner read, other-account denial. |
| AC-002 | Customer requirement (acceptance criterion) | FR-002 membership roles | Creator/manager can change membership; unauthorized actor cannot. |
| AC-003 | Customer requirement (acceptance criterion) | FR-003/004 submission and shares | Required fields, payer/participant, exact share total, optional receipt. |
| AC-004 | Customer requirement (acceptance criterion) | FR-005 notification fan-out | Every other member receives an expense notice; submitter excluded. |
| AC-005 | Customer requirement (acceptance criterion) | FR-006 review state machine | Pending/rejected do not change balances; only final configured approval does. |
| AC-006 | Customer requirement (acceptance criterion) | FR-007/008 pairwise ledger | Known fixtures, partial payment, no other-pair change or redirection. |
| AC-007 | Customer requirement (acceptance criterion) | FR-009 query/report | Authorized totals and inclusive date endpoints. |
| AC-008 | Customer requirement (acceptance criterion) | FR-010/NFR-005 clients/API | Required web/Android/iOS journeys and identical outcomes; blocked until clients exist. |
| AC-009 | Customer requirement (acceptance criterion) | NFR-001 authorization | Allowed and denied data-access test matrix. |
| AC-010 | Customer requirement (acceptance criterion) | NFR-002 arithmetic and ledger | Equal/percentage remainder and payment reconciliation. |
| AC-011 | Customer requirement (acceptance criterion) | NFR-003 usability | At least 9 of 10 participants complete first submission unassisted. |
| AC-012 | Customer requirement (acceptance criterion) | NFR-004 performance | At least 95/100 specified requests under 3 seconds under documented conditions. |
| AC-013 | Customer requirement (acceptance criterion) | FR-003/004 input validation | Invalid amount/percentage rejected before review with correction message and no balance effect. |

### MVP versus full-product coverage

The proposed desktop subset can exercise core account/group, expense, one-step review, in-app notice, pairwise balance/payment, and basic-report workflows locally. It does not by itself prove shared remote identity/password reset, production notifications, configurable multi-step review, the full report/filter scope, or FR-010. Every customer requirement remains in the traceability matrix regardless of MVP coverage.

## Quality, Security, Testing, and Operations

### Financial correctness

- Accept monetary inputs as decimal strings and use `BigDecimal` only; reject NaN/infinity at input boundaries and never convert money through `double`/`float`.
- Store one group currency code per the current assumption. Normalize amounts to that currency's approved minor-unit scale; supported currencies and scale metadata are open.
- Require positive expense/payment amounts. Percentage inputs must be non-negative and sum exactly to 100 before submission.
- Proposed deterministic allocation: compute exact decimal shares, quantize to minor units, distribute residual units by largest fractional remainder with a stable participant-ID tie-break; for equal splits, distribute residual units by stable participant-ID order. This is a **proposal requiring owner approval**, not an approved rule. Disclose assigned shares.
- For each expense, assert `sum(shares) == total` exactly. For each pair, derive accepted obligations less that pair's payments; pending/rejected expenses contribute zero. A payment must never change another pair.
- Serialize competing review/payment updates in one transaction or use optimistic version checks and retry/conflict handling. Use request/action idempotency in a future API so retries do not duplicate approvals/payments; key format/retention are open.
- Overpayment policy is explicitly open. Until selected, surface the conflict and do not record an amount as a successful settlement that yields a misleading balance.

### Security and privacy

The account boundary stores/verifies password hashes only, supports one-time/expiring reset credentials through a delivery mechanism, and never logs passwords/reset tokens. The mechanism/provider and session/token protocol are undecided. A local demo must be clearly labeled and cannot claim production-grade shared authentication. In the full product, authorize every service request against the authenticated account and current group role; do not rely on UI hiding or client-supplied group IDs. Gate receipt reads through expense/group authorization; keep storage private. Validate input both in UI and domain/service. Preserve approval and payment history as immutable records; corrections need an owner-approved compensating-action policy. No security-standard compliance is claimed.

### Testing and operational plan

- **Unit (JUnit 5)**: split arithmetic, percentages/remainders, positive amount, participant/payer constraints, state transitions, reviewer policy, pairwise sign convention, and exact payment behavior. No Swing launch.
- **Application/integration**: submit → notify → review → final approval → balances; rejected/pending exclusions; duplicate/concurrent action outcomes; error-to-user mapping.
- **Persistence**: real chosen engine, foreign-key setup, transactions/rollback, uniqueness, migrations, restart, backup/restore. Do not use a substitute DB as evidence for production behavior.
- **Authorization/security**: allowed/denied account, group, manager, reviewer, removed-member, report, and receipt requests; reset/session lifecycle. Cross-client requests must be denied server-side.
- **UI/usability**: Swing workflow and clear validation; measure AC-011 with representative users. Full-product tests repeat journeys on web, Android, and iOS.
- **Financial reconciliation**: golden fixtures plus generated test cases over 1,000 expenses; verify share sums, pair isolation, and payment reconciliation.
- **Performance**: document data generation, hardware/runtime, cache state, request mix, and timing method for AC-012. Do not claim the 3-second target without measurement.
- **Cross-platform**: once clients/API exist, run the same fixtures through every client and compare returned shares and pair balances.

Logging should carry correlation/action identifiers and domain failure context without credentials, reset secrets, receipt content, or unnecessary private data. Define local backup/restore, shared-service recovery objectives, migration ownership, retention, and notification retry/delivery policy before production; these are not specified. Usability/accessibility validation should cover keyboard navigation, focus order, descriptive controls, and assistive-technology semantics appropriate to each approved client.

## Risks and Open Decisions

| Risk / open decision | Likelihood / impact | Mitigation or owner action |
|---|---|---|
| Swing-only scope mistaken for completion of FR-010 | High / Critical | Keep explicit “not satisfied” status in docs and release claims; owner approves web/Android/iOS delivery plan. |
| Local demo mistaken for shared identity or production password reset | High / High | Label demo boundary; decide central identity, reset delivery, session model, and remote-vs-local scope before claiming AC-001. |
| Unapproved rounding/remainder rule changes member obligations | Medium / High | Owner approves supported currencies, scale, rounding, and deterministic allocation; lock golden tests before implementation. |
| Concurrent/duplicate approvals or payments create duplicate obligations | Medium / High | Atomic transaction/version checks, idempotent API actions, conflict tests, immutable audit records. |
| Reviewer policy/levels are not specified | Medium / High | Decide reviewer eligibility, self-review, multiple-level configuration, rejection/edit/resubmission flow. |
| Overpayment/incorrect-payment correction is unresolved | Medium / High | Owner selects reject/credit/other policy and audit correction path before payment acceptance. |
| Receipt or account data exposed across groups | Medium / High | Server-side authorization, private object storage, denial tests, logging/privacy review. |
| Unselected storage behaves differently for decimal/integrity/concurrency | Medium / High | Select and test the actual engine; explicit foreign-key/transaction/money representation tests. |
| NFR-004 missed or claimed without valid conditions | Medium / Medium | Agree test environment/workload and benchmark actual indexed query path; avoid speculative caching. |
| Notification delivery failures hidden after successful expense submission | Medium / Medium | Decide channel and delivery guarantee; define retry/outbox behavior and visible failure state. |
| No source/build/test project exists yet | High / Medium | Create implementation tasks only after owner choices; do not present this plan as a passing build. |

**Owner decisions required before implementation planning is complete (all classified as Open decisions)**: O-01 local-only demo or shared remote accounts/data; O-02 delivery order and acceptance meaning for web, Android, iOS (native/store versus PWA); O-03 storage engine, hosting, migrations, backup and recovery; O-04 reviewer roles, self-approval, multi-level policy and inactivity; O-05 supported currencies, scale, remainder/tie-break and overpayment policy; O-06 notification channels/retry expectations and receipt format/size/storage/retention; O-07 expense edit/delete, payment corrections, report filters/exports and retention; O-08 password-reset delivery and session model. These map to the spec's Open Questions and additional architecture choices; none is silently resolved here.

## Project Structure

### Verified repository structure

```text
UserRequirement.md                 # present; has a pre-existing worktree modification
.specify/
  memory/constitution.md
  templates/plan-template.md
  scripts/powershell/
specs/001-expense-sharing/
  spec.md
  checklists/requirements.md
docs/prompts/architecture-design-review-prompts.md
```

No `pom.xml`, `src/`, Java source, tests, client project, API, or database configuration was found. The feature specification's old branch metadata says the workspace was not a Git repository; the current workspace is a Git repository on `docs/architecture-prompt-drafts`. The Spec Kit setup identifier is `001-expense-sharing`; no branch switch is performed here.

### Proposed implementation layout (not present)

```text
pom.xml
src/main/java/<project-package>/
  presentation/swing/
  application/
  domain/
  ports/
  adapters/persistence/
  adapters/identity/
  adapters/notification/
  adapters/receipt/
src/test/java/<project-package>/
  domain/
  application/
  integration/
specs/001-expense-sharing/
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/module-boundaries.md
  diagrams/
```

Only add server/API, web, Android, and iOS projects after the owner approves FR-010 delivery and client choices. This layout is a proposal, not a claim about existing source directories.

**Structure Decision**: A single Java modular monolith with clear package boundaries is the least-complex starting point for the Swing MVP and leaves a path to a service process. Persistence and external I/O are ports/adapters; avoid a multi-service deployment until scale or ownership evidence requires it.

## Complexity Tracking

No Constitution violation is being waived. The service/API and additional clients are justified only by the still-required FR-010 full product and are future work, not MVP claims. Repository/transaction boundaries are justified by storage uncertainty, financial atomicity, and the local-to-shared deployment distinction; they must remain small and requirement-focused. No microservices or unapproved framework/database are proposed.
