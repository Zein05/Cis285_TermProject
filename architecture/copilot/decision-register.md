# Decision Register

## Status convention

Every entry is **Proposed — pending human/project-owner approval**. This document
does not approve a scope change. “Decision” describes the recommendation if the
project proceeds with the proposed architecture. The constitution requires the
FR-010 gap to remain visible and any exception to be approved explicitly.

## Architecture decision records

### ADR-001: Keep business policy outside Swing

- **Status:** Proposed — pending approval.
- **Context:** The baseline is Java Swing, but core calculations and workflows need
  independent tests and a future platform path.
- **Decision:** Swing calls application use cases; domain logic has no Swing
  dependency. Infrastructure implements application/domain ports.
- **Alternatives:** Put rules in Swing controllers (simpler first form but couples
  policy to UI and blocks independent testability); use a distributed service
  immediately (higher term-project scope).
- **Rationale:** Satisfies Constitution Principle II at low incremental complexity.
- **Consequences:** Requires modest package boundaries and wiring, but enables
  JUnit tests without GUI and reuse of application/domain rules.

### ADR-002: One Maven project with layered packages for the MVP

- **Status:** Proposed — pending approval.
- **Context:** No Java source or Maven configuration was observed; the course
  baseline calls for Java 21/Maven.
- **Decision:** Start with one Maven project and clear packages, not multiple
  deployable services or Maven modules. Split modules only for a demonstrated need.
- **Alternatives:** In-memory-only demonstration; multi-module Maven build; service
  decomposition.
- **Rationale:** Keeps term-project setup manageable while preserving testable
  boundaries.
- **Consequences:** No current build can be claimed; project scaffolding requires
  separate approval and work.

### ADR-003: SQLite for durable local MVP storage

- **Status:** Proposed — pending approval; persistence choice not specified by
  source requirements.
- **Context:** A local desktop MVP should persist and test transactions without
  requiring hosted infrastructure.
- **Decision:** Use SQLite through repository interfaces, with foreign keys,
  unique constraints, migrations, and transaction-scoped use cases.
- **Alternatives:** In-memory repositories (lowest effort, no durable state);
  embedded H2 (Java integration, local-only); remote relational DB (multi-user
  capable but requires server/operations).
- **Rationale:** SQLite is a small footprint and supports relational integrity and
  transactions for a local exercise.
- **Consequences:** Local data is not synchronized or multi-device safe; operating
  system file protection is not equivalent to server authorization. Revisit for
  full product.

### ADR-004: Ledger is source of truth; pairwise balances are derived

- **Status:** Proposed — pending approval.
- **Context:** Balances must include only final-approved expenses/payments and must
  never redirect debt between different user pairs.
- **Decision:** Persist immutable obligation/payment facts; derive or cache a
  rebuildable signed balance projection for each group/account pair.
- **Alternatives:** Store mutable balance only (fast reads but drift and poor audit);
  recompute all history for each read (simple but may miss performance target).
- **Rationale:** Rebuildable ledger balances auditability with practical indexed
  reads without group-level debt netting.
- **Consequences:** Approval/payment transaction and idempotent posting are
  essential; database migration/rebuild needs tests.

### ADR-005: Deterministic largest-remainder allocation

- **Status:** Proposed — pending explicit approval of currency and rounding policy.
- **Context:** The spec mandates exact reconciliation and deterministic disclosed
  remainders but leaves currency scales and exact rule open.
- **Decision:** Compute exact `BigDecimal` ideals, floor to currency scale, then
  distribute residual minor units by descending fractional remainder with
  ascending stable participant ID as tie-breaker.
- **Alternatives:** Round each share independently (can fail to reconcile);
  assign all residual to payer (predictable but biased); random residual (not
  reproducible).
- **Rationale:** Deterministic, reproducible, and total-preserving for equal and
  percentage splits.
- **Consequences:** Assigned amount can differ by one minor unit from an ideal
  fractional share. Document/disclose it. Product owner must approve supported
  currencies and algorithm before implementation.

### ADR-006: MVP supports one authorized approval stage

- **Status:** Proposed — pending reviewer-policy approval.
- **Context:** The MVP subset specifies one reviewer; the customer allows
  group-appropriate single or multiple review levels.
- **Decision:** Demonstrate one stage; model a policy/stage boundary so future
  multiple stages can be represented. Only final approval posts obligations.
- **Alternatives:** Multi-level configurable engine in MVP (larger scope); no
  approval in MVP (breaks core workflow).
- **Rationale:** One stage exercises the required gate without an enterprise
  workflow engine.
- **Consequences:** Full FR-006 remains partial until multiple review levels and
  reviewer eligibility are decided and delivered. Proposed conservative rule:
  no self-approval.

### ADR-007: Full product requires a shared authoritative API

- **Status:** Proposed path only — delivery and platform scope unapproved.
- **Context:** Customer requires primary web and Android/iOS with matching
  outcomes; desktop-only local persistence cannot meet this.
- **Decision:** For full product, use a server-authoritative API and shared
  relational store; web and mobile clients call the same use cases and display
  server-calculated shares/balances.
- **Alternatives:** Independent local clients/databases (no shared data);
  client-specific financial calculations (divergent outcomes); a desktop-only
  release (explicitly misses FR-010).
- **Rationale:** Centralized authorization and calculation best support shared
  records and NFR-005.
- **Consequences:** Substantial additional identity, deployment, hosting, security,
  and client scope. No API or mobile/web app was verified in this repository.

### ADR-008: MVP notification is an in-app inbox

- **Status:** Proposed — pending channel/delivery decision.
- **Context:** Requirement asks for notifications but does not choose channel or
  delivery guarantee; spec's MVP subset uses in-app notices.
- **Decision:** Persist a notice for each other group member on submission. Keep
  publisher port and delivery state for future adapters.
- **Alternatives:** Email/push immediately (needs provider credentials, privacy and
  delivery operations); no notification (misses MVP feature).
- **Rationale:** Demonstrates recipient semantics without external services.
- **Consequences:** Does not notify users who are not running the desktop app.
  Full-product channels, retries and delivery expectations remain open.

## Open decisions requiring owner/product answers

| ID | Open decision | Impact if unresolved | Recommended action |
|---|---|---|---|
| O-01 | Approved delivery plan/scope for web, Android, iOS, and Swing (spec open question 8) | FR-010 remains uncovered; schedule and technology cannot be finalized | Product owner sets deliverables, sequencing, and acceptance; keep gap explicit until then |
| O-02 | Shared remote accounts/groups required for Swing MVP or local demonstration acceptable (question 9) | Determines database/deployment/auth and whether local SQLite is appropriate | Approve local demo as a bounded MVP or choose a shared API scope |
| O-03 | Supported currency codes/scales and exact remainder method (question 4) | Impacts storage, input validation, shares, and cross-client parity | Approve ADR-005 and per-currency metadata before implementation |
| O-04 | Who may approve, self-approval, inactivity/timeout, multiple-stage rules (question 2) | Authorization and workflow transition behavior are incomplete | Specify roles, stage/quorum rules, and escalation before implementation |
| O-05 | Manager powers beyond membership (question 1) | Avoid accidental over-privilege | Keep managers limited to explicit add/remove until approved |
| O-06 | Notification channels/delivery guarantees (question 3) | In-app notice alone may not satisfy customer expectation | Specify channels, retry/expiry, and delivery meaning |
| O-07 | Overpayment policy (question 5) | Cannot finalize payment acceptance behavior | Proposed MVP rejects excess; owner explicitly accepts or defines credit/refund behavior |
| O-08 | Semantic duplicate-payment rules and external payment references | Idempotency key only handles retries, not repeated real-world records | Define duplicate matching, reversals, reconciliation and correction audit |
| O-09 | Edit/delete of submitted/approved/rejected/paid expenses (question 6) | Could invalidate shares, approvals, reports and balances | Default to immutable finalized facts; design correction events if required |
| O-10 | Report parameters, export formats, retention (question 7) | Custom reporting and privacy obligations not fully scoped | Define allowed filters, export and retention before full-product release |
| O-11 | Email normalization, account verification/reset channel and recovery | Local demo cannot prove secure production reset | Choose identity provider/protocol and recovery controls for full product |
| O-12 | Removed member with pending review/outstanding debt | Historical participation and future access semantics need clarity | Preserve ledger/history; decide pending-review and report access policy |
| O-13 | Whether submitter may approve, and no-reviewer behavior | Affects liveness and conflict of interest | Proposed deny self-approval; define reassignment/escalation |
| O-14 | Receipt count, size/type limits, malware/privacy/retention | Receipt storage, upload and deployment requirements not specified | Define limits and content lifecycle before remote upload implementation |

