# Proposed Module Contracts

These are logical Java module boundaries for the Swing-only MVP. They are not existing classes, Java signatures, or HTTP endpoints. The current repository has no network API. If a service/API is approved for the full product, its versioned wire contract must be designed separately; this document does not invent routes or payload schemas.

## Dependency direction

`Swing presentation -> application use cases -> domain model`

Application use cases depend on persistence, identity, notification, and receipt **ports**. Adapters implement those ports. Domain code must not import Swing, database, HTTP, or provider-specific types. A future API adapter calls the same application use cases and maps their explicit results to a reviewed wire contract.

## Use-case contracts

| Boundary | Caller provides | Boundary guarantees / result | Explicit failure cases |
|---|---|---|---|
| **Account/authentication** | Email/password, reset request, reset proof and new password; authenticated actor context for protected use cases | Account identity is scoped to one account; credential material is never returned; a valid reset is single-use/expiring once a delivery mechanism is chosen | Invalid credentials, duplicate email, invalid/expired/reused reset proof, disabled account; do not reveal another account's private data |
| **Group management** | Actor, group identity/name, membership change | Creator/manager membership rules enforced; membership history retained; group currency and policy recorded | Non-manager mutation, non-member access, duplicate/invalid membership, removed account access |
| **Expense submission** | Actor, group, positive amount/currency, date, description, split method, unique participants and percentages if applicable, optional receipt input | Validated shares and a pending-review expense are created atomically; submitter is payer and participant; pending expense is not balance-effective | Zero/negative/malformed amount, unsupported currency, non-member/duplicate/no participant, missing payer share, negative percentages, total other than exactly 100%, storage/transaction failure |
| **Review** | Actor, expense, step/action, optional reason, action idempotency/version context | Reviewer authorization checked; immutable decision recorded; final approval is the only transition that activates balance obligations | Unauthorized reviewer, disallowed self-review if policy says so, stale/already-final state, duplicate/conflicting action |
| **Balance query** | Authenticated actor, group/pair scope | Returns pairwise projection from final approved shares minus same-pair payments; pending/rejected expenses excluded | Unauthorized group/pair, unsupported currency, calculation/data integrity failure |
| **Payment recording** | Actor, group, payer, payee, positive amount/currency, date, idempotency/version context | Records a payment against only the named pair after authorization and balance check | Same payer/payee, non-member/unauthorized payer, stale balance, duplicate request, overpayment under unresolved policy; never return success-shaped fallback |
| **Report query** | Actor, authorized scope, inclusive date range and approved filters | Returns only authorized matching records and totals | Unauthorized scope, invalid/reversed range, invalid filter, data/query failure |
| **Receipt access** | Actor, expense/receipt identifier | Authorizes via current policy and returns a private stream/reference without public storage paths | Not a member/authorized actor, missing receipt, unsupported/oversized upload, content/storage failure |
| **Notification** | Submitted expense and group recipient set | Creates an in-app notification for each other member; excludes submitter | Persistence or delivery error is surfaced/recorded; no silent claim of external delivery |

Exact errors/messages must be mapped to actionable user corrections (especially AC-013), while retaining domain-specific error categories for tests. Do not catch broad failures and return success or a zero balance.

## Transaction, concurrency, and audit contracts

- Validate before persistence; do not create an expense in review if validation fails.
- Persist an expense, shares, and local notification intents as one consistent operation where feasible. If external delivery is later selected, define retry/outbox semantics so delivery failure is visible and does not erase the expense.
- Approval must atomically record the decision and make the expense balance-effective only on final approval.
- Payment recording must check the current pair balance and append one payment atomically. Serialize competing payments or reject stale versions; retries must not duplicate records.
- Keep review decisions and payment records immutable. Any correction uses an explicit audited action defined by the owner.
- Add idempotency keys at the future network boundary only after the key scope/retention policy is decided.

## Future client/API boundary

Web, Android, and iOS clients must use an authenticated service boundary for shared data; they must not access the database directly. The service is authoritative for authorization, split allocation, review transitions, pairwise balances, and payments. Client contract tests use the same golden financial fixtures. API technology/versioning, session protocol, pagination, upload mechanism, and exact schemas remain open.
