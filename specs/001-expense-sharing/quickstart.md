# SplitSmart Architecture Validation Quickstart

This guide is a validation plan for the proposed design, not proof of an implemented application.

## Current repository status and prerequisites

Verified in the repository: Spec Kit docs and the approved feature spec only. No `pom.xml`, Java source, test source, database configuration, runnable application, API, or web/mobile clients were found. Therefore **there is currently no verified build, test, or run command for SplitSmart**, and no functional result can be produced from this workspace.

The Constitution requires Java 21, Maven, JUnit 5, and PlantUML for the implementation baseline; installed versions/configuration have not been verified. After a Maven project is created, verify the environment with `java -version` and `mvn -version`. `mvn test` is the expected Maven test entry point only once a valid `pom.xml` and tests exist. Application launch/package commands depend on the packaging choice and must be documented when configured.

## Validation scenarios to implement

| Scenario | Setup/action | Expected result |
|---|---|---|
| Split reconciliation | Run equal and percentage split fixtures, including remainder, zero-percent, and invalid inputs | Valid shares sum exactly to the expense total; invalid submissions do not enter review; share allocation follows the owner-approved, disclosed rule. |
| Approval gating | Submit, leave pending, reject, then finally approve fixtures | Pending/rejected expenses do not change balances; only final approval makes pairwise obligations effective. |
| Pairwise balance and payment | Approve multi-participant expenses; record partial/full payments for one pair | Each displayed pair equals approved obligations less payments for that same pair; no other pair changes; overpayment follows the owner-approved policy. |
| Membership/privacy | Exercise creator, manager, member, non-member, removed member, and second account | Only authorized actors read private/group/receipt data or mutate membership; denied requests expose no protected information. |
| Reports | Query authorized records at inclusive date boundaries and outside the range | Totals match included records; boundary dates are included; unauthorized/out-of-range records are excluded. |
| Notification | Submit an expense in a group with multiple members | Every other member receives an in-app notice; submitter does not. External delivery is not claimed until selected and tested. |
| Financial volume | Generate 1,000 expenses and a 100-member group with 10,000 expense/payment records | Reconciliation holds for every expense; after documenting test conditions, at least 95 of 100 balance/date-filtered requests complete under 3 seconds. |
| Cross-platform full product | Use one approved account/data fixture through web, Android, and iOS | Same account/expense/payment journeys and identical shares/balances on all three clients. This cannot pass with Swing alone. |
| Usability | Observe at least 10 representative participants entering an expense for review | At least 9 complete the first attempt without assistance; record failures and corrections. |

## Test organization when code exists

Use JUnit 5 for domain and application tests without launching Swing. Add persistence integration tests against the selected database engine (including foreign-key enablement, transactions, migrations, restart, and backup/restore). Add Swing UI tests or documented manual workflows for the desktop MVP. For the full product, add API authorization/contract tests and client acceptance tests for each approved platform. Use identical financial fixtures across layers/clients.

## MVP and full-product acceptance boundary

The desktop MVP can validate local domain and workflow behavior only. Mark FR-010, cross-device account sharing, and NFR-005 **not satisfied** until the primary web product and Android/iOS clients use the approved shared service and pass the scenarios above. Do not interpret a successful Swing demonstration or build as full-product acceptance.

## Design artifact check

Review the traceability table in [plan.md](./plan.md), domain constraints in [data-model.md](./data-model.md), and module contracts in [contracts/module-boundaries.md](./contracts/module-boundaries.md). Render/inspect the PlantUML sources in [diagrams/](./diagrams/) after a renderer is selected or available; this repository does not currently configure one.
