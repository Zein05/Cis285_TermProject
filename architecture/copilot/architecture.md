# Architecture Recommendation

## Executive recommendation

Use a **layered, single-process Java 21 desktop MVP** with Swing at the edge,
application use cases coordinating operations, a Swing-independent domain core,
repository interfaces, and a small local relational database behind repository
adapters. For a CIS 285 term project, keep the initial build a single Maven project
with packages rather than splitting it into many deployable services. SQLite is a
proposed persistence choice, not a repository fact or approved decision.

The domain owns expense validation, exact split allocation, approval transitions,
pairwise accounting, and payment rules. The application layer owns use-case
orchestration and transaction boundaries. The UI collects input and renders results
but does not calculate financial outcomes. JUnit 5 tests exercise the core without
starting Swing.

Treat the desktop product and the complete customer product as distinct scopes:

1. **Current Java Swing MVP (proposed):** local demonstration of account/group
   workflows, expense submission, one review step, in-app notifications,
   pairwise balances, payments, and basic reports. It can demonstrate separation
   of concerns and deterministic financial rules. Local-only account/reset and
   persistence are not production authentication or shared data.
2. **Reusable architecture boundaries:** keep domain and application packages
   independent of Swing, database APIs, filesystem details, and delivery channels.
   Repository, notification, receipt, and identity boundaries allow adapters to
   change without moving business policy into a client.
3. **Full product capabilities (future, not present):** a shared server-side API
   and database as the source of truth, a primarily web client, and Android and iOS
   clients. All clients use the same authenticated use cases and canonical
   server-calculated shares/balances. This is the credible route to shared data
   and cross-client consistency; it is not verified in the repository.

FR-010 is uncovered by a Swing-only MVP. No MVP description, local account
simulation, or future architecture diagram should be represented as satisfying
web, Android, or iOS availability.

## Alternatives

| Option | MVP shape | Benefits | Costs and risks | Requirement fit |
|---|---|---|---|---|
| A. Layered Swing + local SQLite (recommended MVP proposal) | One Java/Maven desktop process; repositories persist locally; in-app notifications | Fits baseline; deployable as a desktop demonstration; relational constraints and transactions; easy to test domain separately; lower setup than a server | Local DB is not shared across devices; reset/email delivery and multi-user authorization are simulated or incomplete; desktop deployment only | Core expense rules can be demonstrated; FR-010, remote collaboration, external notifications and production account lifecycle are not met |
| B. Swing + in-memory repositories | Single desktop process with repository interfaces and seeded/demo data | Smallest setup; very fast test/demo; no database setup | Data lost on exit; weaker persistence/integrity demonstration; account separation is only simulated; less realistic transaction and recovery testing | Can demonstrate domain workflows, but only partial persistence and account requirements; still no FR-010 |
| C. Shared web/API/mobile product | Server-authoritative API and relational store; web, Android, iOS clients | Shared accounts/data; enforceable server authorization; one canonical calculation path; fulfills platform direction; enables remote notifications and consistent reports | Highest schedule, hosting, identity, security, deployment, and client-testing burden; multiple client stacks; risky as an unscoped term project | Only option that can meet FR-010 and NFR-005; not shown to exist in this repository |

Option A is preferable to B if the course schedule supports one persistence
dependency; otherwise B is a defensible first milestone with the same interfaces.
Option C is the product destination, not a hidden extension of a local desktop
application. Do not attempt microservices for this project: no scale, team, or
independent deployment need justifies them.

## Layers, components, and dependency direction

Dependencies point inward:

`Swing UI -> Application -> Domain`

`Persistence / notification / receipt adapters -> application/domain ports`

The domain has no dependency on Swing, JDBC, file paths, web frameworks, or a
notification provider. Application use cases depend on domain types and ports.
Adapters implement ports. Composition/wiring at the application entry point selects
adapters.

### Responsibilities and proposed interfaces

| Component | Responsibility and boundary |
|---|---|
| Swing UI | Views, input binding, validation feedback, session presentation, accessible controls. Calls use cases; never calculates shares or mutates balances directly. |
| Application/use cases | `CreateAccount`, `SignIn`, `ResetPassword`, `CreateGroup`, `ManageMembership`, `SubmitExpense`, `RecordApproval`, `RecordPayment`, `GetPairwiseBalances`, `GetReport`. Checks actor/context, coordinates ports, commits transactions, maps results to view/API DTOs. |
| Domain | `Account`, `Group`, `Membership`, `Expense`, `ExpenseShare`, `ApprovalPolicy`, `ApprovalDecision`, `Payment`, pairwise obligation rules and report predicates. Encapsulates legal transitions and invariants. |
| Split calculation | Pure domain policy such as `SplitAllocator`; accepts `BigDecimal`, currency scale, participant IDs, and equal/percentage inputs; returns exact shares or validation errors. |
| Repositories/data access | Ports such as `AccountRepository`, `GroupRepository`, `ExpenseRepository`, `PaymentRepository`, `NotificationRepository`, `ReceiptRepository`, and `LedgerRepository`. Proposed SQLite adapters enforce keys/FKs and execute transactions. |
| Account/authentication | Account lifecycle and an `AuthenticationService` port/adapter. Password hashing and credential verification are infrastructure concerns; authorization is evaluated in use cases against active membership/role. |
| Group membership/permissions | Membership lifecycle and policy. Creator/manager may add/remove members. Do not infer unspecified manager privileges; membership must be checked on every group operation. |
| Expense submission/validation | Application use case validates actor membership, positive amount, group currency, unique active participants, submitter-as-payer-and-participant, and split inputs before persistence or review. |
| Approval workflow | Domain state machine plus `ApprovalPolicy`; records stage, reviewer, decision, time, and version. Only final approval emits an accepted-ledger effect. Initial MVP supports one stage. |
| Notifications | `NotificationPublisher` port and inbox repository. MVP adapter creates in-app notices for all other group members. A failed side effect must be observable and retried/reconciled; it must not falsely imply that every remote channel delivered. |
| Pairwise balance calculation | Projection over accepted expense obligations and posted payments, keyed by the original unordered account pair plus direction. Never perform group-wide settlement optimization. |
| Payment recording | Use case verifies actor authority, payer/payee, positive amount, group/pair context and current outstanding amount under a transaction. The overpayment behavior remains open; proposed MVP rejects it. |
| Reports | Authorized query use cases filter by inclusive dates and supported parameters, and aggregate only authorized records. Repository query paths must preserve group/record authorization. |
| Receipt metadata/storage | `Receipt` metadata and a `ReceiptStore` port. MVP may store private files in an app-controlled directory with metadata in SQLite; future product should use private object storage. Only authorized group viewers receive access. |
| Future API/mobile/web | Proposed API adapter maps authenticated requests to the same application use cases. Browser and Android/iOS clients are presentation clients only; they do not become independent authorities for split or balance calculations. |

### Proposed package tree (not present in repository)

The repository currently has no observed Java source tree or Maven file. For a
single-project MVP, add the following only after project-owner approval:

```text
pom.xml                                      # proposed; Java 21, JUnit 5
src/
  main/java/.../splitsmart/
    app/                                     # proposed composition root
    application/
      account/                               # proposed account/auth use cases
      group/                                 # proposed group and membership use cases
      expense/                               # proposed submit/review use cases
      balance/                               # proposed balance/payment use cases
      report/                                # proposed report use cases
      port/                                  # proposed repository/notification/receipt ports
    domain/
      account/                               # proposed account and credential policy
      group/                                 # proposed group/membership/roles
      expense/                               # proposed expense, shares, split policies
      approval/                              # proposed review policy/state
      balance/                               # proposed pairwise obligation rules
      payment/                               # proposed payment rules
      notification/                          # proposed notification semantics
      receipt/                               # proposed receipt metadata
      report/                                # proposed report criteria/value types
      money/                                 # proposed currency and amount rules
    infrastructure/
      persistence/sqlite/                    # proposed SQLite repository adapters
      receipt/local/                         # proposed private local receipt adapter
      notification/inbox/                    # proposed in-app inbox adapter
      security/                              # proposed local credential hashing/session adapter
    presentation/swing/                      # proposed views/controllers
  test/java/.../splitsmart/
    domain/                                  # proposed JUnit 5 unit tests
    application/                             # proposed use-case/workflow tests
    infrastructure/                         # proposed persistence tests
    presentation/swing/                      # proposed Swing interaction tests
```

Keep package seams in one Maven module for the class project. A later API can
initially be an additional adapter package; only split Maven modules if actual
build/deployment ownership requires it.

## Deployment and platform boundary

For the MVP, package the Java application and local SQLite database as a desktop
install/run bundle. Keep receipt files in a private application data directory.
The installed app and its database are local to that installation; do not claim
multi-device synchronization.

For the proposed full product, deploy one application/API service and a shared
relational database, with web and mobile clients communicating over authenticated
TLS. Store receipt objects privately and issue short-lived authorized access
links or proxy access. Identity, backups, migrations, monitoring, and operational
ownership need separate approval. This path is an architecture proposal only.

## Security and privacy

### Desktop MVP

- Use distinct local accounts for workflow/access tests; do not store plaintext
  passwords. Use a standard salted, adaptive password hash (for example
  PBKDF2-HMAC-SHA-256 from the JDK with a reviewed work factor). Never store a
  reversible password or log credentials.
- Keep authenticated user identity in a session service; clear it on sign-out.
  Bind every read/write use case to that actor and check account ownership or
  active group membership, even if the UI hides controls.
- Restrict manager-only membership changes to creator/designated managers.
  Reviewer authority and self-approval remain configuration/open decisions; the
  conservative proposed MVP policy denies self-approval.
- Validate all values at the application boundary and again enforce domain
  invariants. Parameterize database queries; never assemble SQL from user text.
- Protect local database and receipt directory with OS account permissions. A
  local demo cannot provide production-grade isolation from other processes/users
  with access to the same OS account.
- Record append-only decisions and payment events with actor/time. Do not permit
  silent edits to accepted financial history; correction/retention policy is open.

### Full product

- Delegate credentials, email verification, password reset tokens, session/token
  lifecycle, throttling, and recovery to a reviewed identity service or carefully
  maintained server implementation. Use strong salted adaptive password hashing,
  short-lived access credentials, secure refresh/revocation, TLS, and rate limits.
- Enforce account/group authorization on the server for every query and mutation;
  client-side checks are usability only. Deny by default and avoid leaking whether
  another user's private record exists.
- Require active membership and role for group records, receipts, reports, and
  notifications. Use private receipt storage, size/type validation, malware
  scanning policy, and time-bounded authorized reads.
- Audit approvals, membership changes, credential-sensitive actions, and payment
  records without logging secrets, receipt contents, or unnecessary personal data.
- Define retention, account deletion, backup access, breach response, and data
  residency before launch. The specification does not settle them.

## Quality attributes and design controls

- **Correctness:** one exact `BigDecimal` policy in the domain, explicit currency
  scale, deterministic residual allocation, and balance projections from accepted
  facts only.
- **Consistency:** approval finalization and ledger effect share one database
  transaction; optimistic version/conditional transitions reject races.
- **Testability:** pure domain policies plus fake repository ports; no Swing
  startup needed for financial tests.
- **Privacy:** actor-scoped use cases and repository queries; deny/allow tests.
- **Usability:** clear correction messages and validation close to inputs; measure
  first-attempt task success against AC-011.
- **Performance:** indexes for group/date/status and pairwise ledger keys; measure
  the exact 100-member/10,000-record workload rather than promise latency from
  design alone.
- **Portability:** domain and use-case boundaries are platform-independent;
  persisted values use explicit currency and stable IDs. Cross-platform outcomes
  are not delivered until a shared API and all three clients exist and are tested.

See [test-strategy.md](./test-strategy.md) and
[traceability-matrix.md](./traceability-matrix.md) for requirement-level controls.

