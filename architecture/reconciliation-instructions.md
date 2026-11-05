# Reconciliation Instructions: Final Expense-Sharing Requirements and Architecture

**Repository:** `Zein05/Cis285_TermProject`  
**Working branch:** `docs/architecture-prompt-drafts`  
**Purpose:** Produce one coherent, review-ready baseline for the CIS285 Expense Sharing project by reconciling the Spec Kit and Copilot proposal artifacts.

---

## 1. Role and mission

Act as an independent principal software architect, requirements engineer, data architect, UML modeler, and design-assurance reviewer.

Reconcile the existing project artifacts into a single internally consistent set of requirements, architecture, design, data, UML, and supporting documentation.

Use:

- **Spec Kit as the primary structure and narrative** for requirements, scope, architecture rationale, research, module boundaries, and implementation planning.
- **Copilot as the preferred source of stronger material** for the financial ledger, transaction integrity, explicit data constraints, traceability, risk management, decision records, and test strategy.
- The existing user requirements and Constitution as governing source documents. Do not silently rewrite, weaken, reinterpret, or replace them.

The objective is a complete and consistent **design baseline**, not an implementation. Do not generate or modify application source code unless separately requested.

## 2. Required source inspection

Read the current branch contents before making changes. Inspect all relevant files, including at minimum:

### Governing requirements and standards
- `UserRequirement.md`
- `.specify/memory/constitution.md`
- `specs/001-expense-sharing/spec.md`

### Spec Kit proposal
- `specs/001-expense-sharing/plan.md`
- `specs/001-expense-sharing/research.md`
- `specs/001-expense-sharing/data-model.md`
- `specs/001-expense-sharing/contracts/module-boundaries.md`
- `specs/001-expense-sharing/quickstart.md`
- All existing files under `specs/001-expense-sharing/diagrams/`

### Copilot proposal
- All documents under `architecture/copilot/`, including:
  - `README.md`
  - `architecture.md`
  - `data-model.md`
  - `traceability-matrix.md`
  - `decision-register.md`
  - `risks.md`
  - `test-strategy.md`
  - All existing UML/PlantUML diagrams.

Also inspect repository structure, source code, build files, tests, and CI configuration if present. Report what exists and what is absent. Do not infer implementation status from proposal documents.

## 3. Rules for resolving conflicts

Apply these rules in order:

1. **User requirements are authoritative.** Preserve every existing functional requirement, non-functional requirement, constraint, and acceptance criterion. Do not delete, weaken, merge away, or silently change a requirement.
2. **The Constitution is authoritative for project standards.** Do not change it. If a conflict or ambiguity exists, record it as an issue requiring project-owner resolution.
3. **Spec Kit is the default documentation organization and architectural narrative.**
4. **Use Copilot material where it is demonstrably stronger**, especially immutable ledger design, transaction boundaries, payment integrity, traceability, risk register, and test strategy.
5. Do not choose between conflicting alternatives based on personal preference. If the owner has not decided, mark the item **OPEN — OWNER DECISION REQUIRED**, explain the alternatives and consequences, and record it in the decision register.
6. Do not turn a proposed decision into an approved decision. Every decision must have a status: Proposed, Approved, Rejected, Superseded, or Open.
7. Preserve existing requirement identifiers (FR, NFR, AC, and any other established IDs). If a new requirement is needed, allocate a new identifier and explain why.
8. Distinguish **required product scope**, **MVP scope**, **future scope**, and **out of scope**. A deferred requirement remains a requirement; it is not considered satisfied.
9. Distinguish design coverage from implementation, verification, and acceptance. Never label a requirement implemented, tested, or accepted without repository evidence.
10. If a source document is ambiguous, quote or summarize the ambiguity and record the question; do not invent the intended answer.

### Explicit platform rule

FR-010 requires web, Android, and iOS. A Java Swing desktop MVP does not satisfy this requirement. Retain FR-010 in the final requirements baseline. Describe the Swing application only as the MVP or an interim client, and document the future shared backend/API and client architecture needed to meet the full requirement. Do not silently redefine FR-010 as desktop-only.

## 4. P0 and P1 corrections that must be resolved in the design

The earlier independent review identified the following findings. Correct them in all affected documents and diagrams, or explicitly mark the unresolved policy decision as owner-blocking. Do not merely copy the findings into a backlog.

### P0 — Ledger uniqueness

One approved expense can create multiple obligations, commonly one for each participant other than the payer. A uniqueness constraint on `expenseId` alone is therefore incorrect.

Design a safe identity/idempotency strategy, such as a unique `obligationId` plus a suitable source/obligation key. A possible composite key is:

`(expenseId, debtorId, creditorId, entryKind)`

Validate the key against the chosen ledger-entry semantics. It must permit all legitimate obligations from one expense while preventing duplicate posting of the same obligation. Reflect the rule in:
- Data model and database constraints.
- Domain class diagram.
- Expense approval and ledger-posting sequence.
- Test strategy and traceability matrix.

### P0 — Payment posting cardinality

The prior Copilot model showed Payment-to-LedgerEntry as `0..1`. Define the payment lifecycle explicitly. A committed/posted payment must have exactly one corresponding financial posting unless a different, justified posting model is documented. If pending or failed payments exist, model their states separately from committed payments.

Reflect the corrected lifecycle and cardinality in:
- Data model and constraints.
- Class and state diagrams.
- Payment sequence diagram.
- Payment and reconciliation tests.

### P0 — Financial policies require explicit approval

The following policies must be documented. If no approved decision exists, mark it **OPEN — OWNER DECISION REQUIRED** and explain alternatives; do not fabricate approval:

- Supported currencies and currency precision/scale.
- Rounding mode and deterministic allocation of indivisible minor units.
- Remainder tie-breaking rule for equal and percentage splits.
- Whether mixed-currency expenses are supported.
- Overpayment handling.
- Duplicate payment/idempotency behavior.
- Payment reversal and correction semantics.
- Expense edit/correction behavior after approval.
- Approval eligibility, self-approval, and single-stage versus multi-stage approval.

### P0 — FR-010 remains a full-product requirement

Show the distinction between:
- Swing desktop MVP.
- Shared backend/API and authoritative business rules.
- Web client.
- Android client.
- iOS client.

Document platform sequencing as an owner decision if it is not already approved.

### P1 — Additional design corrections

- Define approval state transitions, reviewer authorization, decision history, concurrency, and exactly-once ledger effects.
- Define membership removal and access to historical expenses, receipts, and reports.
- Define notification channels, delivery guarantees, retries, idempotency, and failure handling.
- Define receipt file restrictions, size limits, storage, retention, and access control.
- Define database choice and rationale. SQLite, H2, and PostgreSQL must remain alternatives until an owner decision is recorded.
- Define transaction boundaries and consistency requirements for approval, obligation creation, payment posting, and balance projection.
- Define whether pairwise balances are derived on demand or maintained as rebuildable projections. Immutable financial facts remain the source of truth.
- Correct any traceability status such as “Covered” that overstates design, implementation, test, or acceptance evidence.

## 5. Required final documentation set

Use the existing Spec Kit directory as the primary requirements/specification home. Retain Copilot documents as source material during reconciliation, then either:
- Consolidate their accepted content into the canonical Spec Kit artifacts and mark the old Copilot documents as superseded/reference material; or
- Keep selected Copilot documents as maintained supporting artifacts with clear links and a single source of truth.

Do not leave two competing documents claiming to be the authoritative architecture or data model.

The final documentation should include the following.

### 5.1 Requirements and scope

Produce or update:

1. **Product specification** — `specs/001-expense-sharing/spec.md`
   - Product purpose, users, scope, assumptions, constraints.
   - All functional requirements with preserved IDs.
   - All non-functional requirements with preserved IDs and measurable acceptance conditions.
   - Business rules and domain terminology.
   - User scenarios and edge cases.
   - Explicit MVP, future, and out-of-scope classifications.
   - Dependencies and unresolved questions.

2. **Acceptance criteria** — include in the spec or a clearly linked dedicated document.
   - Preserve existing AC identifiers.
   - Make criteria objective, testable, and traceable.
   - Identify the evidence required to pass each criterion.
   - Identify criteria that cannot be satisfied by the Swing MVP.

3. **Requirements traceability matrix** — maintain one authoritative matrix.
   - Map each FR, NFR, and AC to use cases, components/modules, domain entities/rules, UML artifacts, and test cases.
   - Include status categories such as Specified, Designed, Implemented, Verified, Accepted, Deferred, and Open.
   - Use statuses accurately; design presence alone is not implementation or acceptance.

4. **Glossary and business rules** — add if the specification does not already provide a sufficient authoritative location.
   - Define payer, participant, debtor, creditor, obligation, pairwise balance, settlement, approval, ledger entry, reversal, and projection.
   - Define split types and all financial invariants.

### 5.2 Architecture and technical plan

Produce or update:

1. **Architecture plan** — `specs/001-expense-sharing/plan.md`
   - Architecture style and rationale.
   - Layer and module responsibilities.
   - Dependencies and allowed dependency direction.
   - Transaction and persistence boundaries.
   - Security/authorization boundaries.
   - Notification and receipt-storage ports/adapters.
   - MVP versus future-platform architecture.
   - Deployment assumptions and quality attributes.

2. **Architecture research and alternatives** — `specs/001-expense-sharing/research.md`
   - Preserve useful Spec Kit research.
   - Compare relevant database, persistence, platform, and integration alternatives.
   - Clearly distinguish facts, recommendations, and owner decisions.
   - Do not claim an alternative is selected unless approved.

3. **Module boundaries/contracts** — `specs/001-expense-sharing/contracts/module-boundaries.md`
   - Define each module's responsibility and public contract.
   - Define allowed dependencies and forbidden dependencies.
   - Identify domain/application interfaces and infrastructure adapters.
   - Explain how the Swing UI calls application use cases without owning business rules.

4. **Architecture decision register (ADR-style)** — retain or consolidate Copilot's decision register.
   - Each decision: ID, title, context, alternatives, consequences, status, owner, date, and references.
   - Include all open P0/P1 decisions.
   - Never fabricate owner, approval date, or decision status.

5. **Risk register** — retain or consolidate Copilot's risks.
   - Risk, cause, likelihood, impact, mitigation, contingency, owner, status, and related requirements/decisions.
   - Include financial correctness, privacy/security, platform delivery, persistence, concurrency, data loss, notification failure, and scope risks.

6. **Implementation plan / quickstart**
   - Keep proposed steps separate from verified commands.
   - Do not invent build or run commands if project build files do not exist.
   - State prerequisites and verification steps.
   - Include a phased implementation sequence aligned with the requirements and architecture.

### 5.3 Data architecture and detailed design

Produce or update:

1. **Authoritative data model** — `specs/001-expense-sharing/data-model.md`
   - Entity definitions, attributes, types, identifiers, relationships, cardinalities, constraints, and lifecycle.
   - Primary keys, foreign keys, unique constraints, nullability, indexes where justified.
   - Currency and amount representation.
   - Audit fields and timestamps.
   - Membership and approval history.
   - Receipt metadata and storage references.
   - Expense, split, obligation, ledger, payment, and balance projection relationships.
   - Idempotency and concurrency constraints.
   - Data retention and privacy considerations.

2. **Financial ledger design**
   - Immutable financial facts as source of truth.
   - Separate expense approval from obligation posting.
   - Pairwise debtor/creditor obligations.
   - Payment application to the intended pair/obligation.
   - Exactly-once logical posting through transactions and idempotency.
   - Rebuildable balance projections.
   - Reversal/correction records that preserve audit history.
   - Explicit handling of pending/rejected expenses and pending/failed/posted payments.

3. **Detailed domain design**
   - Responsibilities and invariants for each important class/entity/service.
   - Value objects for money, currency, split allocation, and identifiers as appropriate.
   - Explain which logic belongs in entities, domain services, application use cases, repositories, and adapters.
   - Avoid an anemic or UI-coupled domain model.

4. **Persistence mapping**
   - Explain how logical entities map to relational tables or other selected persistence structures.
   - Identify transaction boundaries and constraints.
   - Keep database-specific decisions open if the owner has not selected a database.

## 6. Required UML / PlantUML deliverables

Create source-controlled PlantUML files under:

`specs/001-expense-sharing/diagrams/`

Use consistent naming, terminology, identifiers, actors, components, class names, and relationship cardinalities across every diagram. Add a short explanatory paragraph or README describing each diagram's purpose and scope.

At minimum, provide the following diagram types.

### 6.1 Use-case diagram

Suggested file: `use-case-diagram.puml`

Show relevant actors and use cases, including as applicable:
- User/account holder.
- Group member.
- Expense payer/submitter.
- Reviewer/approver.
- Recipient/participant.
- Administrator/support role only if justified by requirements.
- Register/login/account recovery.
- Create/manage group and membership.
- Submit expense and receipt.
- Define participants and split.
- Review/approve/reject expense.
- View pairwise balances and reports.
- Record/apply payment.
- Receive notifications.
- Manage account/privacy settings.

Use `include` and `extend` only where semantically appropriate. Do not create actors or capabilities unsupported by requirements; mark proposed roles as open decisions.

### 6.2 Component architecture diagram

Suggested file: `component-architecture.puml`

Show:
- Web, Android, and iOS clients as required future product clients.
- Swing desktop MVP as a separately scoped client.
- Shared backend/API boundary for the full product.
- Presentation, application, domain, and infrastructure layers.
- Authentication/authorization boundary.
- Expense, approval, split, ledger, payment, reporting, notification, and receipt responsibilities.
- Repository interfaces and infrastructure adapters.
- Database and external services as dependencies, not domain components.

Clearly mark MVP versus future components and avoid implying that future clients are implemented.

### 6.3 Detailed class/domain diagram

Suggested file: `class-domain-model.puml`

Show the important domain classes, value objects, enums, interfaces, and relationships with multiplicities. Include as applicable:
- User/Account, Group, Membership.
- Expense, ExpenseParticipant/Split, Receipt.
- ApprovalPolicy, ApprovalDecision or equivalent.
- Obligation / PairwiseBalance.
- LedgerEntry and ledger-entry type/source reference.
- Payment and payment allocation/posting.
- Money and Currency.
- Repositories and domain/application services where useful.

The diagram must:
- Show correct one-to-many expense-to-obligation relationships.
- Avoid an expense-only uniqueness key for multiple obligations.
- Show the committed payment posting rule correctly.
- Distinguish immutable ledger facts from derived/cached projections.
- Match the authoritative data model exactly.

Do not add every database column to the class diagram; keep detailed persistence attributes in the data-model document.

### 6.4 Sequence diagrams

Provide separate diagrams for at least these flows:

- `sequence-expense-submission.puml`: submit expense, validate input, store pending expense/receipt metadata, notify reviewer as applicable.
- `sequence-expense-approval.puml`: authorize reviewer, validate state/version, record decision, approve, create obligations exactly once, commit transaction, notify parties.
- `sequence-payment-settlement.puml`: validate payer/payee/pair and amount, apply payment, post ledger fact, update/rebuild projection, commit, notify parties.

Show failure/alternate paths such as unauthorized reviewer, rejected expense, invalid split, stale version, duplicate request, transaction failure, and invalid/over-limit payment where policy applies. Do not depict a notification as guaranteed delivered merely because an event was committed.

### 6.5 State diagrams

Provide state diagrams for at least:

- `state-expense-lifecycle.puml`: draft/submitted/pending review/approved/rejected/cancelled or corrected states, but only use states supported by requirements or explicitly marked as proposed.
- `state-payment-lifecycle.puml`: initiated/pending/posted/failed/reversed or the selected lifecycle.

Show valid transitions, triggering events, guards, and terminal/reversible states. Ensure state diagrams agree with use cases, sequences, data model, and business rules. Do not allow pending/rejected expenses to create obligations.

### 6.6 Activity diagrams

Provide activity diagrams for at least:

- `activity-expense-approval.puml`: submission review, authorization, decision, atomic posting, and notification outcome.
- `activity-split-allocation-reconciliation.puml`: validate participants and split inputs, calculate exact allocations, distribute remainder deterministically, and verify sum equals expense amount.
- Add a payment/reversal activity if it materially clarifies the approved workflow.

Use decision/merge and fork/join nodes correctly. Include failure paths and explicit reconciliation checks.

### 6.7 UML quality rules

- Use PlantUML syntax compatible with the project's chosen PlantUML version.
- Prefer readable diagrams with clear package boundaries and notes over overly dense diagrams.
- Add legends for MVP/future scope and any special notation.
- Use the same class and component names across diagrams and documents.
- Ensure every important financial invariant appears in the data model and relevant sequence/state/activity diagrams.
- Do not claim diagrams compile until an actual render/compile check has been run.

## 7. Test strategy and verification plan

Retain and strengthen Copilot's test strategy. Create or update a canonical test strategy document, preferably `specs/001-expense-sharing/test-strategy.md`, or clearly link the maintained Copilot document if that is the chosen source of truth.

Include:
- Unit tests for money, currency, splits, remainder allocation, and domain invariants.
- Application/use-case tests for approval, obligation posting, payment, and authorization.
- Repository/persistence integration tests for transactions, uniqueness, and concurrency.
- API contract tests for future shared backend/client behavior.
- UI tests only for presentation behavior; do not place business-rule verification exclusively in Swing UI tests.
- Security and access-control tests.
- Notification failure/retry tests.
- Receipt validation/access tests.
- Reconciliation and ledger projection rebuild tests.
- Performance and usability test plans tied to NFR acceptance criteria.

At minimum, explicitly test:
1. Pending and rejected expenses create no ledger entries.
2. Approval posts all expected obligations exactly once.
3. A multi-participant expense creates multiple distinct obligations without uniqueness collisions.
4. Duplicate and concurrent approval requests do not double-post.
5. Partial payment reduces only the correct pairwise obligation.
6. Wrong-pair payment is rejected.
7. Overpayment follows the approved policy.
8. Posted payment has the required ledger posting.
9. Ledger projection rebuild reproduces the same balances.
10. Split allocations reconcile exactly to the expense amount.
11. Remainder distribution is deterministic.
12. Reversal/correction preserves financial audit history.
13. Unauthorized access to groups, expenses, and receipts is rejected.
14. Invalid input causes no partial financial side effects.

For every NFR, define the measurement method, environment, workload/sample, pass threshold, and evidence artifact. Do not invent test results.

## 8. Non-functional requirements: make them measurable

Preserve the original NFR identifiers and intent. For each NFR, document:
- Requirement statement.
- Rationale.
- Applicable scope/client/platform.
- Measurement method.
- Acceptance threshold.
- Preconditions and test environment.
- Verification evidence.
- Dependencies/open decisions.

Pay particular attention to:
- Privacy, authentication, authorization, and data protection.
- Exact monetary reconciliation and deterministic calculations.
- Usability threshold and user-study method.
- Performance threshold, percentile, workload, and hardware.
- Cross-platform consistency across web, Android, and iOS.

If an NFR is ambiguous, retain its original wording and propose a measurable clarification separately for owner approval. Never silently change the threshold.

## 9. Required consistency and quality audits

Before presenting the reconciled baseline, perform these audits and document their results.

### Requirements audit
- Every original FR/NFR/AC remains represented.
- No requirement is weakened or lost.
- Each requirement has a status and traceability links.
- Deferred requirements remain visible as deferred, not satisfied.

### Architecture audit
- Layer responsibilities and dependency direction are unambiguous.
- Domain rules are independent of Swing and persistence.
- MVP and future platform architecture are clearly distinguished.
- Database and external service choices are not falsely marked approved.

### Financial/data audit
- All monetary values use an exact decimal model.
- Currency/scale/rounding/remainder policies are explicit or open owner decisions.
- Expense approval and ledger posting are atomic and idempotent.
- One expense can generate multiple valid obligations.
- Posted payments have the defined ledger relationship.
- Balances are derived from auditable facts.
- Reversal/correction preserves history.
- Membership and receipt access obey authorization rules.

### UML audit
- Use-case, component, class, sequence, state, and activity diagrams agree.
- Multiplicities and lifecycles match the data model.
- No diagram shows a behavior contradicted by requirements or decisions.
- PlantUML syntax is actually compiled/rendered if tooling is available; otherwise report not verified.

### Test/acceptance audit
- Every FR/NFR/AC maps to verification evidence.
- Financial invariants have explicit automated tests.
- NFR measurement plans are reproducible.
- No unrun test is described as passing.

### Documentation audit
- There is one authoritative specification, architecture narrative, data model, and traceability matrix.
- All supporting documents link to the canonical sources.
- Open decisions and risks are visible and owned where known.
- No duplicate/conflicting diagrams or stale “final” documents remain without a superseded label.

## 10. Expected deliverable layout

Use this as the target layout, adapting only when an existing equivalent is better. Avoid needless duplication.

```text
specs/001-expense-sharing/
  spec.md
  plan.md
  research.md
  data-model.md
  test-strategy.md
  traceability-matrix.md
  decision-register.md
  risks.md
  glossary.md
  quickstart.md
  contracts/
    module-boundaries.md
  diagrams/
    README.md
    use-case-diagram.puml
    component-architecture.puml
    class-domain-model.puml
    sequence-expense-submission.puml
    sequence-expense-approval.puml
    sequence-payment-settlement.puml
    state-expense-lifecycle.puml
    state-payment-lifecycle.puml
    activity-expense-approval.puml
    activity-split-allocation-reconciliation.puml
```

The existing `architecture/copilot/` documents may be retained as historical inputs, or marked clearly as superseded/reference material after accepted content is migrated. Do not delete them merely to make the layout look clean. Preserve useful history and links.

## 11. Execution workflow

Perform the reconciliation in controlled stages:

1. **Inventory:** List every source artifact and its current status. Identify missing files and implementation evidence.
2. **Conflict analysis:** Produce a conflict/decision table showing source A, source B, governing requirement, proposed resolution, and owner decision needed.
3. **Requirements baseline:** Reconcile FR/NFR/AC and business rules without changing the authoritative original requirements.
4. **Architecture baseline:** Reconcile layers, modules, platform boundaries, integrations, persistence options, and transaction boundaries.
5. **Financial/data baseline:** Correct ledger identity, payment posting, money/currency, approval, and consistency rules.
6. **UML baseline:** Create/update all required diagram types from the same agreed domain model and use cases.
7. **Assurance baseline:** Reconcile traceability, risk, decision, and test strategy documents.
8. **Consistency review:** Run the audits in Section 9; correct contradictions.
9. **Owner review package:** Summarize approved design decisions, open decisions, risks, requirement coverage, and any blockers.
10. **Repository update:** Make changes only on the working branch. Do not merge to the default branch or alter governing source files. Keep changes reviewable and logically grouped.

Do not ask the owner to decide every detail before producing useful work. Complete the design where evidence supports it, and isolate genuinely unresolved choices in a concise decision list. Do not invent answers merely to make the documents appear complete.

## 12. Final report required from the reconciliation work

At completion, provide a concise report containing:

1. Files created, updated, retained, or marked superseded.
2. Summary of the final requirements and architecture baseline.
3. Confirmation that all original FR/NFR/AC identifiers are preserved.
4. P0/P1 corrections completed and any still blocked by owner decisions.
5. UML inventory and whether each diagram was rendered/compiled.
6. Traceability and test-strategy coverage.
7. Open decisions with recommended options and consequences.
8. Risks and unresolved inconsistencies.
9. Validation performed, with exact commands/results where actually run.
10. Git branch and commit reference.

Do not claim implementation, build, test, or diagram validation unless it was actually performed and its evidence is available.

---

## 13. Completion criteria

The reconciliation is ready for owner review when:

- The original requirements and Constitution remain intact.
- One coherent specification preserves all FR/NFR/AC identifiers and intent.
- MVP and full-product scope are clearly separated without dropping FR-010.
- One architecture narrative and one authoritative data model exist.
- P0 ledger uniqueness and payment posting defects are corrected in all affected artifacts.
- P0/P1 financial and approval decisions are approved or explicitly recorded as owner-blocking open decisions.
- Required UML diagram types exist and are mutually consistent.
- Traceability maps requirements to design and verification.
- Risk, decision, and test strategy documents are current.
- Every unverified claim is labeled honestly.
- The complete change set is on the working branch for review, with no merge to the default branch.

**Final instruction:** Prefer correctness, traceability, and explicit uncertainty over apparent completeness. The result must be a coherent design baseline that a project owner, instructor, developer, and tester can independently understand and review.
