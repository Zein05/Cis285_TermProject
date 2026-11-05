# SplitSmart Architecture & Design Generation and Independent Review Prompts

**Project:** CIS 285 Term Project — SplitSmart  
**Repository:** https://github.com/Zein05/Cis285_TermProject  
**Prompt set version:** 1.0  
**Purpose:** Generate two independent architecture/design proposals from the approved project inputs, then have ChatGPT compare them and perform a requirements/constitution cross-check.

---

## 1. Workflow and controls

The project owner has already created the Spec Kit Constitution and the feature specification, and has run Spec Kit Clarify on the specification. The next step is architecture and design planning.

### Required sequence

1. Confirm the approved inputs listed below are current. Do not rewrite them as part of architecture generation.
2. Run **Prompt A** using Spec Kit in the repository. Save its outputs in the existing Spec Kit feature directory.
3. Preserve or copy the complete Spec Kit output set to a clearly named, read-only comparison snapshot before generating the second proposal. Do not let the second agent read that snapshot.
4. Run **Prompt B** with GitHub Copilot (or another independent coding agent) from the same approved inputs. Save its output in a separate directory.
5. Do not ask either generator to review, borrow from, or reconcile with the other generator's work.
6. Give both output sets and the approved source inputs to ChatGPT using **Prompt C**.
7. Review the comparison and cross-check findings. The project owner decides which design choices to accept. Do not merge or implement a proposal merely because an AI recommends it.

### Approved inputs — source of truth

Read these exact files before generating any architecture/design content:

- `UserRequirement.md` — original customer requirements. Treat this as the customer baseline.
- `.specify/memory/constitution.md` — governing project principles and implementation baseline.
- `specs/001-expense-sharing/spec.md` — clarified SplitSmart feature specification, including requirements, acceptance criteria, assumptions, and open questions.
- `.specify/templates/plan-template.md` — required Spec Kit plan structure.
- `.specify/templates/spec-template.md` — reference for the established specification conventions.
- Relevant existing source code, build files, tests, configuration, and repository structure, if present.

If any file is missing, stale, contradictory, or materially incomplete, report that before making assumptions. Do not invent a decision and present it as approved.

### Non-negotiable project facts and constraints

- Product name: **SplitSmart**.
- The project is a CIS 285 term project.
- Current implementation baseline in the Constitution: **Java 21, Maven, Java Swing, JUnit 5, and PlantUML**.
- The customer requirement is broader than the current desktop implementation: SplitSmart is requested to be primarily web-based and also available on Android and iOS.
- A Java Swing desktop MVP does **not** satisfy the full web/Android/iOS requirement. Preserve this gap in the architecture, scope, risks, and traceability. Do not silently change the customer requirement.
- Apply object-oriented design, cohesive responsibilities, encapsulation, and a strict boundary between Swing presentation and business/domain logic. Business rules must be testable without launching Swing.
- Use `BigDecimal` for all monetary amounts and calculations. Do not use binary floating-point types for money. Define currency scale, rounding, and deterministic split-remainder allocation.
- Use JUnit 5 for automated tests.
- Architecture diagrams must be authored as checked-in PlantUML source.
- AI-generated artifacts require human review before acceptance.
- Customer requirements and implementation decisions must remain explicitly distinguished and traceable.

### Independence and integrity rules

- Each generator must independently interpret the same approved inputs.
- Do not provide Generator A's output to Generator B before both outputs are complete and frozen.
- Do not preselect a technology stack beyond the Constitution's explicit baseline. Where the baseline does not resolve a choice, compare alternatives and document a recommendation with rationale.
- Do not treat assumptions, convenience, or a proposed design as customer-approved requirements.
- Do not change `UserRequirement.md`, the Constitution, or the clarified feature specification.
- Do not generate application implementation code in this phase.
- If an important decision is unresolved, identify it as an open decision, explain its architectural impact, and recommend the decision owner/action needed.

---

# Prompt A — Spec Kit Architecture and Design Plan

**Use with:** Spec Kit in the repository  
**Recommended command:** `/speckit-plan`  
**Feature directory:** `specs/001-expense-sharing/`

Copy and submit the following prompt to Spec Kit:

---

You are performing the architecture and design planning phase for the SplitSmart CIS 285 term project. Use the repository's installed Spec Kit workflow and templates. Your task is to produce a rigorous, traceable, implementation-aware architecture/design plan—not application source code.

## First: inspect and understand the project

Read and reconcile:

1. `UserRequirement.md`
2. `.specify/memory/constitution.md`
3. `specs/001-expense-sharing/spec.md`
4. `.specify/templates/plan-template.md`
5. Existing repository structure, source code (if any), Maven configuration, tests, and relevant project documentation.

The feature specification has already gone through Clarify. Treat its clarified requirements and decisions as approved inputs unless they conflict with the original customer requirements or Constitution. Do not repeat Clarify or silently change the specification.

Use the actual project files and existing Spec Kit conventions. Do not assume a directory, dependency, framework, database, deployment target, or implemented feature exists unless repository evidence supports it.

## Objective

Create an architecture and design proposal that explains how SplitSmart can meet the clarified functional and non-functional requirements while complying with the Constitution and making the gap between the Java Swing MVP and the full web/Android/iOS product explicit.

## Required analysis

### A. Constitution and requirement traceability

- Perform a Constitution Check before design and again after design.
- Identify every applicable principle and show how the proposed architecture satisfies it.
- Identify any violation, exception, or unresolved conflict. Never mark a gate as passed if evidence is missing.
- Preserve customer requirements FR-001 through FR-010 and relevant NFR/AC identifiers from the feature specification.
- Provide a traceability matrix connecting requirement ID → architectural component or design decision → planned verification/test.
- Explicitly classify each item as one of:
  - Customer requirement
  - Constitution constraint
  - Implementation decision
  - Assumption
  - Open decision
- Explicitly show that Swing-only implementation does not satisfy the full platform requirement FR-010.
- Do not reduce scope or reword a customer requirement to make the architecture appear compliant.

### B. Architecture options and recommendation

Evaluate reasonable architecture options appropriate to this project. At minimum, discuss:

- A Java Swing desktop MVP architecture consistent with Java 21 and Maven.
- How a web client and Android/iOS clients could be supported in the broader product.
- Whether business/domain logic should be shared independently of presentation clients.
- The application/service boundary and persistence boundary.
- Deployment and integration implications of a local desktop demonstration versus a shared multi-user product.

For each viable option, describe benefits, drawbacks, complexity, testing implications, and fit to the Constitution and customer requirements. Recommend an approach and explain why. Do not imply that a future web/mobile architecture already exists.

### C. Logical architecture and component responsibilities

Describe the system at an appropriate level, including responsibilities and dependencies for:

- Presentation/UI layer (Swing for the current MVP baseline)
- Application/use-case layer
- Domain model and business rules
- Persistence/data-access layer
- Authentication/account boundary
- Group and membership management
- Expense submission and validation
- Split calculation
- Approval workflow
- Notification handling
- Pairwise balance calculation
- Payment recording and settlement
- Reporting/querying
- Receipt image handling
- Cross-platform/API boundary, if proposed for the full product

Keep domain and business rules independent of Swing. Identify which components are in the MVP and which are future/full-product capabilities. Avoid needless microservices or abstractions without a requirement-based reason.

### D. Domain model and data design

Produce a conceptual data model and explain entities, attributes, relationships, cardinalities, lifecycle/status values, invariants, and ownership. Include at least the relevant concepts:

- Account/User
- Group
- GroupMembership and roles
- Expense
- ExpenseParticipant / ExpenseShare
- Approval / ReviewDecision
- Notification
- Pairwise Balance or a clearly explained derivation strategy
- Payment
- Receipt / attachment metadata
- Report/query parameters, where persisted

Address:

- Identity and referential integrity.
- Group membership and authorization.
- Expense state transitions (for example, pending, approved, rejected).
- Auditability of approval and payment changes.
- Whether balances are stored, derived, or cached, and how consistency is maintained.
- How a participant's share is represented.
- Currency and monetary precision.
- Whether the submitter is always the payer and a participant, per clarified specification.
- Pairwise debts must remain pairwise; do not redirect debts across different user pairs to simplify settlements.

Do not invent a database product as an approved decision. Compare suitable persistence options if the repository does not already establish one, then label the recommendation as a proposal.

### E. Financial correctness and business invariants

Treat financial calculations as high-risk domain logic. Specify:

- `BigDecimal` usage and prohibited binary floating-point money calculations.
- Currency scale and rounding policy.
- Deterministic allocation of equal-split remainders.
- Percentage splits: no negative percentages and exactly 100% total, as specified.
- Positive expense amount validation.
- Participant and payer constraints.
- Approval gating: pending/rejected expenses must not change balances; only final approval does.
- Pairwise balance derivation and sign conventions.
- Partial/full payment behavior and overpayment handling (identify unresolved policy if not decided).
- Idempotency/concurrency considerations for approval and payment actions.
- Reconciliation rules and tests that prove each expense's shares sum to its total.

Do not resolve an open business policy by inventing behavior. Recommend a policy only as a clearly labeled decision for owner approval.

### F. Security, privacy, and authorization

Explain authentication, password handling, session/token boundaries where relevant, authorization by account/group role, least privilege, receipt access, input validation, audit trail, and protection of private account/group information. Do not claim compliance with a security standard unless it is actually scoped and evidenced.

### G. Quality attributes and operational concerns

Address the specification's measurable performance, usability, privacy, correctness, and cross-platform consistency expectations. Include realistic validation approaches for each. Discuss logging/diagnostics, backup/recovery, data migration, accessibility/usability, and error handling to the extent relevant. Label unspecified service levels as proposed or open.

### H. Testing strategy

Map JUnit 5 tests to business rules and acceptance criteria. Include unit, integration, persistence, UI, authorization, workflow, financial reconciliation, and cross-platform consistency testing as appropriate. Ensure the core domain logic can be tested without launching Swing. Distinguish tests feasible for the desktop MVP from tests required for full product acceptance.

### I. Risks, dependencies, and open decisions

List risks with likelihood/impact and mitigation. Identify technical dependencies, scope boundaries, and unresolved choices. Include the platform delivery gap, authentication/deployment model, persistence choice, notification channel, receipt storage, approval policy, and any other open questions found in the specification.

## Required artifacts and output locations

Follow the installed `/speckit-plan` workflow and the existing plan template. Produce the normal Spec Kit plan outputs in `specs/001-expense-sharing/`, as applicable to the installed workflow:

- `plan.md` — architecture/implementation plan, technical context, Constitution Check, project structure, decisions and complexity tracking.
- `research.md` — alternatives investigated, comparison, evidence, rationale, and decisions still open.
- `data-model.md` — conceptual data model, relationships, invariants, and lifecycle/state definitions.
- `contracts/` — relevant interface/API or module contracts. If the current Swing-only MVP has no network API, state that and define appropriate module boundaries/contracts instead of inventing an API.
- `quickstart.md` — how to build, test, and run the proposed/current MVP based only on verified repository configuration; clearly identify future platform steps.
- PlantUML `.puml` source for relevant architecture/component and domain/data diagrams. Place diagrams in a logical location within the feature documentation, and reference them from the plan.

If the installed Spec Kit workflow creates additional standard artifacts, preserve its conventions. Do not overwrite the Constitution, UserRequirement, or clarified spec.

## Quality bar

- Be specific, internally consistent, and traceable—not generic textbook architecture.
- Use Mermaid only if the project convention requires it; the Constitution requires PlantUML source for architecture diagrams.
- Every diagram must agree with the written architecture and use meaningful component/entity names.
- Every major decision must include rationale, alternatives considered, consequences, and status (approved constraint, recommendation, assumption, or open).
- Do not fabricate repository inspection, benchmark results, dependencies, tests, or implementation status.
- Keep MVP scope distinct from full-product scope.
- End with a concise list of owner decisions required before implementation.

After generating the artifacts, run the available Spec Kit analysis/check workflow if appropriate (for example, `/speckit-analyze`) without modifying the approved source inputs. Report findings and do not automatically waive unresolved inconsistencies.

---

# Prompt B — Independent GitHub Copilot Architecture and Design Proposal

**Use with:** GitHub Copilot Chat / Agent mode in the repository  
**Important:** Run this independently from Prompt A. Do not expose Spec Kit's generated plan, research, diagrams, data model, or contracts to Copilot until Copilot has completed and frozen its own proposal.

Copy and submit the following prompt to Copilot:

---

Act as a senior software architect and design reviewer. Independently create a complete architecture and design proposal for the SplitSmart CIS 285 term project using only the approved source inputs and repository evidence. This is a parallel, independent design exercise. Do not search for, read, or reuse another AI agent's architecture proposal or generated plan.

## Source files to inspect

Read:

- `UserRequirement.md`
- `.specify/memory/constitution.md`
- `specs/001-expense-sharing/spec.md`
- `.specify/templates/plan-template.md`
- Existing source code, Maven files, tests, configuration, and repository structure, where present.

The specification has already been clarified. Do not repeat the clarification interview, rewrite requirements, or change approved source files. If a requirement is ambiguous or conflicting, record it as an open issue and explain the impact.

## Project constraints

1. Product: SplitSmart, a shared-expense management system.
2. Current implementation baseline: Java 21, Maven, Java Swing, JUnit 5, PlantUML.
3. Domain/business rules must be independent of Swing; Swing is presentation only.
4. Use object-oriented design, encapsulation, cohesive responsibilities, and testable boundaries.
5. All money must use `BigDecimal`; no `float` or `double` for monetary calculations.
6. Currency scale, rounding, and deterministic remainder allocation must be explicit.
7. Use JUnit 5.
8. Architecture diagrams must have checked-in PlantUML source.
9. Human review is required for AI-generated content.
10. The customer's full platform requirement is primarily web plus Android and iOS. A Swing-only desktop MVP does not satisfy it. Do not hide this requirement gap.
11. Preserve pairwise debts; do not net or redirect a debt between different user pairs.
12. Only approved expenses affect balances; pending and rejected expenses do not.

## Your task

Produce a complete independent architecture/design proposal. Think critically about what is appropriate for a CIS 285 term project: avoid unnecessary enterprise complexity, but do not omit architecture needed to satisfy the actual requirements.

### 1. Executive architecture recommendation

Summarize the proposed architecture, scope, major decisions, and rationale. Clearly separate:

- Current Java Swing MVP
- Architecture boundaries that make the domain reusable
- Full product capabilities needed for web, Android, and iOS

Explain what the MVP can demonstrate and what it cannot claim to satisfy.

### 2. Architecture alternatives

Compare at least two viable options for the desktop MVP and discuss a credible path for the full cross-platform product. Include tradeoffs, complexity, testability, deployment, data sharing, and requirement coverage. Do not assert that a web/API/mobile solution exists in the current repository unless verified.

### 3. Component and module architecture

Define module/package responsibilities, dependency direction, and interfaces for:

- Swing UI
- Application/use cases
- Domain model and policies
- Repositories/data access
- Account and authentication
- Group membership and permissions
- Expense submission/validation
- Split calculation
- Approval workflow
- Notifications
- Pairwise balance calculation
- Payment recording
- Reports
- Receipt metadata/storage
- Future API and mobile/web client integration

Provide a proposed package/module tree that fits the actual repository. Mark new proposed files/directories as proposed; do not claim they exist.

### 4. Domain model and persistence design

Define entities, key attributes, relationships, cardinalities, lifecycle states, and constraints. Include accounts, groups, memberships, expenses, participants/shares, approval decisions, notifications, balances, payments, and receipts.

Explain whether pairwise balances should be derived from a ledger, stored, or cached; show how consistency is maintained. Describe transaction boundaries and referential integrity. Compare persistence options if not specified by the existing repository; mark your recommendation as proposed, not approved.

### 5. Critical expense and payment rules

Specify and validate:

- Submitter is payer and participant.
- Positive expense amount.
- Equal and percentage split behavior.
- Percentage total must be exactly 100%; negative percentages are invalid.
- Currency precision and deterministic remainder allocation.
- Pending/ rejected expenses never affect balances.
- Final approval is required before balance impact.
- Pairwise debts remain between the original pairs.
- Partial/full payments update only the relevant pair.
- Overpayment and duplicate-payment policy must be marked open if not specified.
- Concurrency, duplicate submissions, duplicate approvals, and idempotency protections.

Use `BigDecimal` and show examples or pseudocode for calculations without creating application implementation code.

### 6. Security and privacy

Describe authentication, password storage approach, authorization rules, group roles, receipt access, input validation, session management where relevant, audit history, and privacy boundaries. Distinguish current MVP needs from full-product needs.

### 7. Quality attributes and testing

Map each NFR and acceptance criterion to design controls and tests. Include JUnit 5 unit tests for domain rules, integration tests, persistence tests, workflow tests, authorization tests, UI tests, performance tests, and cross-platform consistency tests where applicable. Clearly mark tests for future platforms.

### 8. Diagrams

Create valid PlantUML source files for at least:

- System context / deployment or platform boundary
- Component/module architecture
- Domain class or entity relationship model
- Expense approval and balance/payment sequence or state flow

Use diagrams consistent with the prose. If a diagram cannot be justified by verified or explicitly proposed architecture, explain why rather than fabricating details.

### 9. Requirement traceability

Create a matrix for every applicable FR, NFR, and acceptance criterion in the approved specification:

- Requirement ID and concise statement
- Proposed component(s)
- Design decision/control
- Planned test or verification
- Scope: desktop MVP, full product, or both
- Status: covered, partial, not covered, or open

Explicitly show FR-010's web/Android/iOS coverage gap if only the Swing MVP is planned.

### 10. Risks and decision register

Include risk, likelihood, impact, mitigation, owner/action, and status. Include an architecture decision record (ADR) style register for major choices, with alternatives, rationale, consequences, and approval status.

## Deliverables

Create your proposal in a separate directory so it cannot be confused with Spec Kit output:

`architecture/copilot/`

Include:

- `README.md` — scope, assumptions, and navigation
- `architecture.md` — architecture recommendation, layers, components, module/package tree, security, deployment, quality attributes
- `data-model.md` — entities, relationships, constraints, lifecycle, monetary invariants
- `traceability-matrix.md` — requirement-to-component-to-test mapping
- `decision-register.md` — ADR-style decisions and open decisions
- `risks.md` — risk register
- `diagrams/*.puml` — PlantUML source files
- `test-strategy.md` — verification strategy and requirement coverage

Do not edit `UserRequirement.md`, `.specify/memory/constitution.md`, or `specs/001-expense-sharing/spec.md`. Do not implement application code, alter the Maven build, or create tests in this architecture-only phase. Do not overwrite Spec Kit outputs.

## Final response

When finished, summarize files created, key architectural recommendations, unresolved decisions, any Constitution concerns, and any requirements that remain uncovered. Report only actions actually completed. Do not claim that a build or test passed unless you ran it and observed the result.

---

# Prompt C — ChatGPT Independent Comparison, Evaluation, and Cross-Check

**Use with:** ChatGPT after both generators finish  
**Inputs to provide:** the approved source files plus the complete frozen Spec Kit output and Copilot output. If the artifacts are in GitHub, provide the repository paths/branch or attach the files. Do not ask ChatGPT to infer missing files.

Copy and submit the following prompt to ChatGPT:

---

Act as an independent principal software architect, requirements auditor, and design assurance reviewer for the CIS 285 SplitSmart term project.

Your job is to compare two independently generated architecture/design proposals:

- **Proposal A:** Spec Kit output in `specs/001-expense-sharing/`
- **Proposal B:** GitHub Copilot output in `architecture/copilot/`

You must independently cross-check both proposals against the original customer requirements, the Constitution, and the clarified feature specification. Do not assume either proposal is correct because it was generated by a tool, is longer, or appears more polished.

## Required source material

Use and cite the actual contents of:

1. `UserRequirement.md` — original customer requirements.
2. `.specify/memory/constitution.md` — governing project principles.
3. `specs/001-expense-sharing/spec.md` — clarified specification.
4. All Spec Kit architecture/design artifacts, including plan, research, data model, contracts, quickstart, and PlantUML.
5. All Copilot architecture/design artifacts, including architecture, data model, traceability, decision register, risks, test strategy, and PlantUML.
6. Existing source/build/test files if implementation claims need verification.

If any expected artifact is missing or inaccessible, list it as missing. Do not fabricate its contents. Distinguish a proposal from implemented repository evidence.

## Review objectives

### 1. Executive verdict

State whether each proposal is:

- Acceptable
- Acceptable with required revisions
- Not acceptable

Give a concise rationale. Do not choose a winner based on document volume. Explain which proposal is stronger in which areas and whether a hybrid recommendation is justified.

### 2. Requirement completeness cross-check

Build a comprehensive matrix for every customer requirement FR-001 through FR-010, all relevant NFRs, and ACs in the clarified specification.

For each requirement, report:

- Exact requirement ID and short description
- Spec Kit coverage and evidence (file/section)
- Copilot coverage and evidence (file/section)
- Whether the coverage is complete, partial, missing, contradictory, or unsupported
- Desktop MVP versus full-product coverage
- Required correction/action

Do not let either proposal silently omit, weaken, or redefine a requirement. Give special attention to FR-010: primarily web-based plus Android and iOS. A Java Swing-only design is not full compliance.

### 3. Constitution compliance audit

Check both proposals against every applicable Constitution principle:

- Requirements traceability and separation of customer requirements from implementation decisions
- Object-oriented design and strict GUI/business-logic boundary
- Exact monetary arithmetic using BigDecimal
- JUnit 5 and independently testable domain rules
- PlantUML architecture documentation
- Human review of AI contributions
- Java 21/Maven/Swing baseline and explicit treatment of the cross-platform gap
- Governance, versioning, exceptions, and approval status where applicable

For each principle, assign Pass, Partial, Fail, or Not Demonstrated. Quote or identify specific evidence. Explain any false claim of compliance.

### 4. Architecture quality comparison

Compare both proposals on:

- Layering and dependency direction
- Separation of concerns and cohesion
- Domain model quality
- Data persistence and integrity
- Expense/approval lifecycle
- Pairwise balance correctness
- Payment semantics and auditability
- Authentication, authorization, and privacy
- Receipt storage/access
- Notification design
- Reporting and query design
- Extensibility to web/Android/iOS
- Deployment and operational complexity
- Testability, maintainability, and fit for a student project

Identify unnecessary complexity, under-designed areas, ambiguous responsibilities, circular dependencies, unsupported assumptions, and missing interfaces.

### 5. Financial correctness audit

Independently reason through the core money rules:

- BigDecimal use and scale/rounding policy
- Equal split with indivisible remainder
- Percentage split totaling exactly 100%
- Negative/zero amount rejection
- Payer/submitter/participant constraints
- Pending and rejected expense exclusion from balances
- Final approval before balance impact
- Pairwise debt semantics without redirecting between pairs
- Partial/full payment behavior
- Duplicate or concurrent approval/payment handling
- Overpayment policy and unresolved decisions
- Reconciliation of expense shares, payments, and outstanding balances

Construct at least three illustrative test cases, including one rounding/remainder case and one pairwise payment case. Show calculations explicitly. Mark any assumed policy and do not treat it as approved.

### 6. Data model and consistency audit

Compare entities, cardinalities, foreign keys, unique constraints, lifecycle state, audit history, transaction boundaries, and derived versus persisted balances. Identify data anomalies each design could permit. Verify that pending/rejected expenses cannot contaminate balances and that payment records cannot silently corrupt pairwise debt.

### 7. Diagram and artifact consistency

Check whether each PlantUML file is syntactically plausible and consistent with its proposal's text. Identify mismatched names, missing components, inconsistent relationships, or missing client/platform boundaries. Do not claim to have rendered or compiled a diagram unless you actually did.

Check consistency among architecture, data model, contracts, traceability matrix, risks, decision register, and test strategy. Identify contradictory technology or scope decisions.

### 8. Testability and acceptance coverage

For each NFR and AC, determine whether there is a measurable verification method. Identify missing unit, integration, authorization, workflow, performance, usability, persistence, and cross-platform tests. Verify that the core financial/domain logic can be tested without launching Swing.

### 9. Risk and decision quality

Compare risk registers and architecture decisions. Identify hidden risks, missing alternatives, decisions incorrectly represented as approved, and decisions requiring project-owner approval before implementation.

### 10. Consolidated recommendation

Produce a recommended architecture direction that:

- Retains sound ideas from either or both proposals.
- Does not blend incompatible designs without explaining the tradeoff.
- Meets the current Constitution.
- Preserves all customer requirements and identifies what the desktop MVP cannot satisfy.
- Is proportionate to CIS 285 scope.
- Has clear boundaries, responsibilities, and test strategy.
- Lists decisions that must be made by the project owner.

Do not rewrite source requirements or silently update the Constitution.

### 11. Actionable remediation backlog

Create a prioritized list:

- P0 — blocks architecture approval or violates a mandatory requirement/Constitution principle
- P1 — required before implementation
- P2 — important improvement or future full-product work
- P3 — optional refinement

Each item must include: finding, affected proposal/file, requirement/principle, recommended change, and acceptance condition.

### 12. Final report structure

Deliver the review in this structure:

1. Executive verdict
2. Inputs inspected and missing artifacts
3. Requirement coverage matrix
4. Constitution compliance matrix
5. Architecture comparison
6. Financial correctness audit and worked examples
7. Data model and consistency findings
8. Diagram/artifact consistency findings
9. Test and acceptance coverage
10. Risks and unresolved decisions
11. Recommended consolidated architecture
12. Prioritized remediation backlog
13. Final approval recommendation and conditions

## Review discipline

- Be objective, skeptical, and evidence-based.
- Cite repository file paths and section headings for every significant finding.
- Separate facts, interpretations, assumptions, and recommendations.
- Do not invent implementation evidence, test results, benchmark results, or diagram-render results.
- Do not assume Copilot or Spec Kit output is correct.
- Do not claim a requirement is met merely because it is mentioned; verify that the design explains how it is satisfied and how it will be tested.
- If the two proposals disagree, explain the consequence and make a reasoned recommendation.
- Preserve the original customer intent. Do not treat the current desktop MVP as the complete product.
- End with a clear decision: approve, approve with conditions, or reject pending revisions.

---

## 2. Suggested review checklist for the project owner

Before accepting either proposal, confirm:

- [ ] Both generators used the same approved source inputs.
- [ ] Neither generator read the other's output before completion.
- [ ] Spec Kit and Copilot outputs are preserved separately.
- [ ] FR-001 through FR-010 are represented and traceable.
- [ ] The web/Android/iOS requirement is not hidden by the Swing MVP.
- [ ] Constitution Check is evidence-based.
- [ ] Business logic is independent of Swing.
- [ ] All money uses BigDecimal and deterministic rounding/allocation.
- [ ] Pending/rejected expenses do not affect balances.
- [ ] Pairwise debts are preserved.
- [ ] Payments are auditable and update the correct pair only.
- [ ] JUnit 5 tests cover critical business rules.
- [ ] PlantUML source agrees with the written design.
- [ ] Open decisions and assumptions are visible.
- [ ] A human has reviewed and approved the final architecture.

## 3. Important note about repository writes

These prompts are planning/review instructions only. They do not authorize an agent to change the original customer requirements, Constitution, or clarified specification, and they do not authorize implementation work. Review generated changes before merging anything into the main branch.
