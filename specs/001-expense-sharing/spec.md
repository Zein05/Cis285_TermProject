# Feature Specification: SplitSmart Expense Sharing

**Feature ID**: `001-expense-sharing`

**Active Git branch**: `docs/architecture-prompt-drafts`

**Created**: 2026-10-29

**Status**: Review draft; not owner-approved

**Input**: User description: Read `UserRequirement.md` in this workspace as the authoritative customer requirements. Write a testable SplitSmart feature specification: actors, user scenarios, functional and non-functional requirements, acceptance criteria, requirement IDs (FR-001, etc.), and open questions. Preserve all original customer features in the requirements inventory; label the Java Swing MVP subset separately. Do not write Java code. Do not edit `UserRequirement.md`.

## Clarifications

### Session 2026-10-29

- Q: When someone records an expense, should the person who paid be recorded separately from the people sharing the cost? → A: The submitter is always the payer and must be a participant.
- Q: How should a person sign in to their individual SplitSmart account? → A: Email and password, with password reset.
- Q: Who should be allowed to add or remove people from a SplitSmart group? → A: Only the creator or designated group managers can add or remove members.
- Q: What should SplitSmart do when an expense amount is zero or negative, or a percentage split is negative or does not total 100%? → A: Reject the expense submission until the amount is positive and all percentages are valid and total 100%.
- Q: Should SplitSmart keep debts between the original pairs of people, or simplify a group's balances so fewer payments are needed? → A: Keep pairwise debts; do not redirect debts between different pairs.

## Actors

- **Account holder**: A person who signs in to SplitSmart and manages their own expenses and balances.
- **Group member**: An account holder who belongs to a shared-expense group and can participate in its expenses and payments.
- **Group manager**: A group member designated by the group creator to add or remove group members; other manager permissions remain an open question.
- **Expense submitter**: A group member who paid for the expense and must be one of its participants.
- **Expense reviewer**: A group member authorized by the group to approve or reject a submitted expense.
- **Report viewer**: An account holder who reviews their own or an authorized group's expenses, balances, and payments.

An account holder may hold more than one role. Group data is available only to members with appropriate permissions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create an account and organize a group (Priority: P1)

As a person sharing expenses with others, I want my own account and a group for the people I share with, so that expense and balance information is available to the right participants.

**Why this priority**: Accounts and groups establish the identity and shared context required for all other journeys.

**Independent Test**: Create two accounts, create a group with one account, add the second, and verify that both members can see the group while a non-member cannot.

**Acceptance Scenarios**:

1. **Given** a person has no SplitSmart account, **When** they create an account with an email and password and sign in, **Then** they can access their own expense and balance information.
2. **Given** an account holder cannot remember their password, **When** they complete the password-reset process, **Then** they can set a new password and sign in.
3. **Given** a signed-in account holder, **When** they create a group and add another account, **Then** both listed members can access that group's shared information.
4. **Given** an account that is not a member of a group, **When** it requests that group's information, **Then** the information is not disclosed.

### User Story 2 - Submit and review a shared expense (Priority: P1)

As a group member, I want to record an expense, select who participated, and have it reviewed, so that only accepted expenses affect what members owe.

**Why this priority**: Expense entry and approval create the trusted source data for balances and reports.

**Independent Test**: Submit an equally split expense for selected group members, approve it as an authorized reviewer, and verify the resulting shares and balance changes; repeat with a rejected expense and verify no balance change.

**Acceptance Scenarios**:

1. **Given** a member of a group, **When** they submit an expense with an amount, date, description, split method, and participants, **Then** it is recorded as awaiting review and its proposed shares are visible to authorized group members.
2. **Given** an expense awaiting review, **When** an authorized reviewer approves it, **Then** it becomes an accepted expense and is included in group balances.
3. **Given** an expense awaiting review, **When** an authorized reviewer rejects it, **Then** it is not included in balances and its submitter can see that it was rejected.
4. **Given** an expense is submitted, **When** another group member checks their notifications, **Then** they can see that a new expense was submitted.
5. **Given** an expense has a zero or negative amount, or an invalid percentage split, **When** the submitter tries to submit it, **Then** the submission is rejected with a correction message and it does not enter review or affect balances.

### User Story 3 - Settle and understand balances (Priority: P1)

As a group member, I want to see who owes whom and record a payment, so that the group's outstanding balances reflect settlements.

**Why this priority**: Accurate pairwise balances and payment history deliver the core expense-sharing outcome.

**Independent Test**: Approve an expense that creates an amount owed between two members, record a payment between them, and verify the outstanding amount and payment history.

**Acceptance Scenarios**:

1. **Given** approved expenses involving multiple members, **When** a member opens the group's balances, **Then** the system shows the amount each member owes to each other member.
2. **Given** an outstanding amount between two members, **When** a member records a payment with payer, payee, amount, and date, **Then** the payment is recorded and the outstanding amount is reduced by the payment amount.
3. **Given** a payment exceeds the outstanding amount, **When** the member attempts to record it, **Then** the system identifies the overpayment and does not silently produce an incorrect balance.

### User Story 4 - Review expense, balance, and payment reports (Priority: P2)

As an account holder, I want summaries and reports for a selected period, so that I can understand spending and settlement activity.

**Why this priority**: Reporting makes accumulated expense and payment information useful for review and planning.

**Independent Test**: Create approved expenses and payments with dates inside and outside a selected period, request a report, and verify that the report contains only matching authorized records and totals.

**Acceptance Scenarios**:

1. **Given** an account holder has authorized expense, balance, and payment records, **When** they request a summary, **Then** the summary presents the applicable records and totals.
2. **Given** a report supports a date range, **When** the viewer selects inclusive start and end dates, **Then** only records in that range are included.
3. **Given** a viewer is not authorized to see a record, **When** they request a report, **Then** that record is excluded.

### User Story 5 - Use SplitSmart on supported platforms (Priority: P2)

As a person sharing expenses, I want to use SplitSmart on the platforms promised by the customer, so that I can participate using a web browser or a supported mobile device.

**Why this priority**: Cross-platform availability is an explicit customer requirement, though it does not prevent independent validation of core expense rules.

**Independent Test**: Complete account, group, expense, balance, and payment tasks using a supported web browser and supported Android and iOS apps, and verify consistent records and outcomes.

**Acceptance Scenarios**:

1. **Given** an account holder has access to a supported web browser, **When** they use SplitSmart, **Then** they can perform the supported account and expense-sharing tasks.
2. **Given** an account holder uses a supported Android or iOS device, **When** they use SplitSmart, **Then** they can perform the supported account and expense-sharing tasks and see consistent shared data.

### Edge Cases

- A percentage split does not total 100%, includes a negative percentage, or assigns a share to someone not in the group; invalid percentage splits are rejected before review.
- An equal or percentage split produces a smallest-currency-unit remainder.
- An expense amount is zero, negative, malformed, or uses a currency not supported by the group; zero and negative amounts are rejected before review.
- A submitter selects no participants, a non-member, or a duplicate participant.
- A group member is removed while they have expenses, pending reviews, or an outstanding balance.
- No reviewer is available, a reviewer attempts to approve their own expense, or multiple reviewers act on the same pending expense.
- An expense is rejected, edited, or submitted again after rejection.
- A payment is partial, duplicates a prior payment, exceeds the current debt, or is recorded by a person other than the payer.
- A requested report has an empty date range, reversed dates, or no matching records.
- A notification cannot be delivered when an expense is submitted.
- A user attempts to access a private account record or group record without authorization.
- The Swing desktop MVP cannot satisfy browser or Android/iOS usage; this platform gap must remain explicitly tracked and must not be reported as meeting the customer's platform requirement.

## Requirements *(mandatory)*

### Customer Requirements Inventory

These are customer needs transcribed from `UserRequirement.md`; the implementation subset below does not remove or redefine any of them.

| Customer feature | Requirement IDs | Coverage |
|---|---|---|
| Individual user accounts, login, and access to own expense and balance information | FR-001 | Full customer requirement |
| Create and manage groups of people | FR-002 | Full customer requirement |
| Create expenses with amount, date, description, equal or percentage split, and optional receipt image | FR-003 | Full customer requirement |
| Identify involved users so appropriate balances can be adjusted | FR-004 | Full customer requirement |
| Notify group members when another member creates an expense | FR-005 | Full customer requirement |
| Review and approve expenses before they are added and affect balances; support group-appropriate single or multiple review levels | FR-006 | Full customer requirement |
| Track the amount owed by each user to every other user based on entered expenses | FR-007 | Full customer requirement |
| Record payments to settle balances and reflect them accurately | FR-008 | Full customer requirement |
| Provide expense, balance, and payment reports and summaries, including custom date ranges and parameters where selected | FR-009 | Full customer requirement |
| Primarily web-based product and apps that run on Android and iOS | FR-010 | Full customer requirement; not satisfied by Swing desktop alone |

### Functional Requirements

#### Customer requirements

- **FR-001**: The system MUST allow each person to create an individual account using an email address and password, sign in, reset their password, and access their own expense and balance information.
- **FR-002**: The system MUST allow users to create groups. Only the group creator or designated group managers MUST be able to add or remove group members.
- **FR-003**: The system MUST allow a group member to submit an expense they paid for, with a positive amount, date, description, an equal or percentage-based split method, and an optional receipt image. The submitter MUST be a participant and is the expense payer. The system MUST reject a zero or negative amount before the expense enters review.
- **FR-004**: The system MUST allow the submitter to identify the group users involved in an expense, including themself, and calculate each participant's proposed share according to the selected split method. A percentage split MUST contain no negative percentages and total exactly 100%; the system MUST reject an invalid percentage split before review.
- **FR-005**: When a group member submits an expense, the system MUST notify the other members of that group that a new expense was submitted.
- **FR-006**: The system MUST keep a submitted expense out of accepted expenses and balances until an authorized reviewer approves it. Groups MUST be able to use a single review step or multiple review levels. A rejected expense MUST NOT affect balances.
- **FR-007**: The system MUST track pairwise amounts owed by each user to every other user based on accepted expenses and recorded payments; it MUST NOT redirect debt between different user pairs to simplify group-wide settlements.
- **FR-008**: The system MUST allow a user to record a payment that settles all or part of an amount owed to the named payee and MUST update only that pair's corresponding outstanding balance.
- **FR-009**: The system MUST provide expense, balance, and payment reports or summaries. Users MUST be able to request reports using a date range and other available parameters.
- **FR-010**: SplitSmart MUST be primarily available through the web and MUST also be available as apps that run on Android and iOS.

#### Non-functional requirements

- **NFR-001**: The system MUST restrict private account information to its account holder and group information to authorized group members; verification MUST include allowed and denied access cases.
- **NFR-002**: Expense shares and balances MUST reconcile to the accepted expense and recorded payments at the currency's smallest supported unit. Any rounding remainder MUST be assigned consistently and disclosed in the resulting shares.
- **NFR-003**: In a usability test with representative users, at least 90% MUST be able to submit an expense for review without assistance on their first attempt.
- **NFR-004**: For a group with up to 100 members and 10,000 expense/payment records, 95% of balance and date-filtered report requests MUST display results within 3 seconds under the agreed test conditions.
- **NFR-005**: Across supported web, Android, and iOS clients, an approved expense or recorded payment MUST produce the same participant shares and outstanding balances for the same group data.

### Acceptance Criteria

- **AC-001 (FR-001)**: A person can create an account using an email address and password, sign in, and reset their password; they can view their own expense and balance information, while a different account cannot view that private information.
- **AC-002 (FR-002)**: A user can create a group; only its creator or designated group managers can add or remove members, and unauthorized members cannot change membership.
- **AC-003 (FR-003, FR-004)**: A submitted expense records all required details and selected participants, including the submitter as payer and participant. Equal shares are equal to the smallest currency unit where possible; percentage shares match their assigned percentages and reconcile to the total. The optional receipt is present only when supplied.
- **AC-004 (FR-005)**: Submitting an expense causes each other group member to receive a notification identifying the new expense; the submitter does not receive a notification as an "other member."
- **AC-005 (FR-006)**: Pending expenses do not affect balances. An authorized approval advances the expense through its configured review levels, and only final approval affects balances. Rejection prevents balance changes.
- **AC-006 (FR-007, FR-008)**: For a known set of approved expenses and payments, each pairwise outstanding amount equals the accepted net obligations between those two users; recording a partial payment reduces only that pair's obligation by the payment amount and does not redirect or settle another pair's debt.
- **AC-007 (FR-009)**: Report totals match the included authorized records; date filters include their selected boundary dates and exclude records outside the selected period.
- **AC-008 (FR-010, NFR-005)**: The account, expense, balance, and payment journeys are usable on web, Android, and iOS clients, and each client shows matching outcomes for the same records.
- **AC-009 (NFR-001)**: Access tests verify that private account and group information is visible only to authorized actors.
- **AC-010 (NFR-002)**: Equal and percentage splits, including remainder cases, sum exactly to the expense total; subsequent payments produce correctly reconciled balances.
- **AC-011 (NFR-003)**: At least 9 of 10 representative participants complete expense submission without assistance on their first attempt.
- **AC-012 (NFR-004)**: Under documented test conditions at the specified data volume, at least 95 of 100 balance or filtered-report requests complete within 3 seconds.
- **AC-013 (FR-003, FR-004)**: A zero or negative expense amount, a negative percentage, or percentages that do not total 100% are rejected with a correction message; none of these submissions enters review or changes a balance.

### Acceptance Evidence and Status

AC-001 through AC-013 are required acceptance outcomes, not claims that they have
passed. The evidence plan for each criterion is in the
[traceability matrix](./traceability-matrix.md) and
[test strategy](./test-strategy.md). Tests, usability studies, performance runs,
and cross-platform verification have not been performed in this repository.
AC-008 cannot be satisfied by the Swing MVP.

### Java Swing MVP Subset (Implementation Decisions, Not Customer Requirements)

The following is a proposed desktop MVP subset based on the project constitution's Java 21, Maven, and Swing baseline. It is an implementation boundary, not a change to the customer requirements. The desktop MVP does not by itself satisfy FR-010.

| MVP slice | Included requirements | MVP boundary |
|---|---|---|
| Account and group basics | FR-001, FR-002 | Local desktop workflows for account access and group membership sufficient to exercise group expense sharing. Any production authentication or remote multi-user deployment remains to be decided. |
| Expense submission | FR-003, FR-004 | Amount, date, description, equal or percentage split, optional receipt image, and selected group participants. |
| Review and notification | FR-005, FR-006 | In-application notification and one reviewer approval step. Configurable multiple review levels remain outside this initial subset. |
| Balances and payments | FR-007, FR-008 | Pairwise outstanding balances and recorded partial or full payments, with exact monetary reconciliation. |
| Basic reports | FR-009 | Expense, balance, and payment summaries. Custom date ranges and parameters remain in the full customer requirement and are not assumed complete in the MVP. |
| Platform availability | FR-010 | Not included in the Java Swing desktop subset; web, Android, and iOS scope remains unresolved and required for full customer coverage. |

The MVP table is a proposed interim scope only. Full product scope remains all
FR-001–FR-010 and NFR-001–NFR-005. Future scope includes shared service/API,
primary web client, Android and iOS clients, production identity, and
cross-platform consistency. No customer requirement is out of scope or waived.

### Key Entities

- **Account**: A person’s individual identity, email address, password sign-in and reset capability, and private expense and balance information.
- **Group**: A shared context with members, management permissions, review configuration, expenses, and balances.
- **Membership**: The association between an account and a group, including whether the account is the creator, a designated manager, or another member.
- **Expense**: A submitted or reviewed record with amount, date, description, split method, submitter/payer, participants including the submitter, optional receipt, and review status.
- **Expense share**: A participant's assigned portion of an expense, calculated using an equal or percentage split and expressed in the applicable currency unit.
- **Review decision**: An approval or rejection by an authorized reviewer, including its place in a single- or multiple-level review process.
- **Notification**: A notice to other group members that an expense was submitted.
- **Balance**: The net amount one user owes another, derived from accepted expense shares and recorded payments for that same pair; balances are not redirected across different pairs to simplify settlements.
- **Payment**: A dated settlement record identifying payer, payee, amount, and associated outstanding obligation.
- **Report**: A summary or filtered view of authorized expense, balance, and payment information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 9 out of 10 representative users can create an account, join a group, and submit an expense for review without assistance.
- **SC-002**: In a test set of 1,000 expenses using equal and percentage splits, every approved expense reconciles exactly to its total at the smallest supported currency unit.
- **SC-003**: For every test group, displayed pairwise balances equal the net obligations from accepted expenses less recorded payments, with no pending or rejected expense included.
- **SC-004**: At least 95% of balance and filtered-report requests for groups with up to 100 members and 10,000 expense/payment records display results within 3 seconds under the agreed test conditions.
- **SC-005**: 100% of unauthorized access attempts in the account and group access test set are denied without exposing protected information.
- **SC-006**: Users can complete the core account, expense, balance, and payment journeys on web, Android, and iOS, with matching computed outcomes across platforms before full customer acceptance.

## Assumptions

- A person has one individual account and may belong to multiple groups.
- Each expense belongs to one group and includes at least one participant from that group; the submitter pays for the expense and is always one of its participants.
- The group selects a currency. Multi-currency expenses and exchange-rate conversion are not assumed.
- Expense shares and payments use the currency's smallest supported unit. Any indivisible remainder is allocated by a documented, deterministic rule.
- The default approval workflow for the initial desktop MVP is one authorized reviewer; groups needing multiple levels require configuration.
- Notifications in the desktop MVP are in-application notices. The full customer request does not specify a delivery channel.
- Reports include only records the requesting account is authorized to see.
- Performance targets are provisional acceptance targets and will be validated under documented, representative conditions.
- The desktop Swing MVP is a subset of the full product. No claim is made that a desktop-only implementation satisfies the requested primary web experience or Android/iOS apps.

## Open Questions

1. What group settings, beyond membership, may designated managers control?
2. For each group, who may approve expenses, may submitters approve their own expenses, and what happens if a reviewer does not act?
3. What notification channels are required beyond in-application notices, and what delivery expectation applies?
4. Which currencies are supported, and what exact allocation rule should assign fractional-cent remainders for each split method?
5. What should the system do when a recorded payment exceeds the amount owed to its named payee?
6. Should users be allowed to edit or delete submitted, approved, rejected, or paid expenses, and how should changes affect audit history and balances?
7. What custom report filters, export formats, and retention rules are required?
8. What is the approved delivery plan and scope for the primarily web-based product and Android/iOS apps alongside the Java Swing MVP?
9. Is the Java Swing MVP expected to use shared remote accounts and groups across devices, or is a local demonstration sufficient?
10. Which currencies/scales are supported, is mixed-currency activity allowed, and what rounding/remainder rule is approved?
11. How should the system handle overpayments, duplicate payment requests, and idempotent retries?
12. What audited workflow is required for payment reversals and approved-expense corrections?
13. What historical expense, report, and receipt access remains after a member is removed?
14. Which receipt file types and size limits are accepted, and what storage, retention, and cleanup policy applies?
15. Which notification channels, retry behavior, delivery guarantees, and failure visibility are required?

Architecture alternatives and the current owner-blocking status of these questions
are recorded in the [decision register](./decision-register.md).

## Canonical Design and Verification Documents

- [Architecture plan](./plan.md) and [alternatives research](./research.md)
- [Data model and financial ledger](./data-model.md) and [glossary/business rules](./glossary.md)
- [Module contracts](./contracts/module-boundaries.md)
- [Decision register](./decision-register.md) and [risk register](./risks.md)
- [Requirements traceability](./traceability-matrix.md) and [test strategy](./test-strategy.md)
- [UML inventory](./diagrams/README.md) and [validation quickstart](./quickstart.md)

All linked design choices remain proposals or open decisions unless explicitly
approved by the project owner. Their presence does not indicate implementation,
verification, or acceptance.
