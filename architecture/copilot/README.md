# SplitSmart Architecture Proposal

## Scope and status

This is an independent, AI-generated architecture and design proposal based only on
`UserRequirement.md`, `.specify/memory/constitution.md`,
`specs/001-expense-sharing/spec.md`, `.specify/templates/plan-template.md`, and the
repository inventory available during review. It does not amend those sources and is
not Spec Kit output.

The proposal is not an implementation, an approved product scope, or evidence that
any requirement has been delivered. All architecture choices below are proposed and
require human review under Constitution Principle VI. No Java source, Maven build
file, tests, or runtime configuration was present in the inspected repository
inventory; the package tree is therefore illustrative and marked proposed.

The Java Swing MVP is a local, demonstrable subset. It does **not** satisfy the
customer's primary web plus Android and iOS requirement (FR-010), shared-device
availability, or full production account/reset expectations. The proposed full
product path is a server-authoritative API and shared database with web, Android,
and iOS clients.

## Assumptions and open issues

- One currency per group; supported currencies and currency exponents still need
  approval.
- The submitter is the payer and is always an expense participant.
- Only final approval affects balances; pending and rejected expenses never do.
- Pairwise obligations are preserved; no three-party debt redirection is allowed.
- The MVP uses local persistence and in-application notifications as a classroom
  demonstration. This does not imply secure remote collaboration.
- Overpayment, semantic duplicate payments, edits/deletes, reviewer policy, and
  full-product deployment are open as recorded in the decision register.

## Navigation

- [Architecture and component design](./architecture.md)
- [Domain and persistence model](./data-model.md)
- [Requirement traceability](./traceability-matrix.md)
- [Decision register](./decision-register.md)
- [Risks](./risks.md)
- [Test strategy](./test-strategy.md)
- [System/platform boundary](./diagrams/system-context.puml)
- [Component architecture](./diagrams/component-architecture.puml)
- [Domain model](./diagrams/domain-model.puml)
- [Expense and settlement flow](./diagrams/expense-payment-flow.puml)

