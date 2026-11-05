# SplitSmart UML baseline

These PlantUML files describe the proposed design in
[plan.md](../plan.md), [data-model.md](../data-model.md), and
[glossary.md](../glossary.md). They are design artifacts, not implementation
evidence. The repository has no configured PlantUML renderer; syntax/rendering
has not been verified.

All diagrams use the following scope labels:

- **MVP proposal**: local Java Swing demonstration, not yet implemented.
- **Full product target**: required web, Android, and iOS clients with shared
  server-authoritative use cases; future/unimplemented.
- **Open**: behavior requiring an owner decision; no alternative is implied to be
  approved.

| Diagram | Purpose |
|---|---|
| [use-case-diagram.puml](./use-case-diagram.puml) | Actors and user-facing account, group, expense, review, balance, payment, notification, and report capabilities. |
| [component-architecture.puml](./component-architecture.puml) | MVP/full-product boundary, layers, ports, adapters, and authoritative service. |
| [class-domain-model.puml](./class-domain-model.puml) | Domain entities, value objects, ledger identity, and payment-posting cardinality. |
| [sequence-expense-submission.puml](./sequence-expense-submission.puml) | Validate, persist a pending expense, and record notification intent. |
| [sequence-expense-approval.puml](./sequence-expense-approval.puml) | Authorize review, record decision, and atomically post obligations on final approval. |
| [sequence-payment-settlement.puml](./sequence-payment-settlement.puml) | Validate named pair and atomically commit a payment with one ledger posting. |
| [state-expense-lifecycle.puml](./state-expense-lifecycle.puml) | Supported expense review states and balance-effect gate. |
| [state-payment-lifecycle.puml](./state-payment-lifecycle.puml) | Payment request versus committed posted-payment lifecycle. |
| [activity-expense-approval.puml](./activity-expense-approval.puml) | Approval decision, atomic posting, and notification failure boundaries. |
| [activity-split-allocation-reconciliation.puml](./activity-split-allocation-reconciliation.puml) | Split validation, exact allocation, and reconciliation check. |

`system-architecture.puml` and `domain-model.puml` are retained legacy inputs.
Use the correspondingly named component and class diagrams above as canonical.
