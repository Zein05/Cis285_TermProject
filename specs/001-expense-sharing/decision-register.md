# SplitSmart Architecture Decision Register

Statuses describe the evidence available in this repository. No owner approvals
or approval dates were found; **Open — owner decision required** is not approval.
Owner: unassigned unless stated otherwise. Decision date: not recorded.

| ID | Topic | Status | Alternatives / consequences | Proposed direction (not approved) | Owner |
|---|---|---|---|---|---|
| ADR-001 | Domain and UI boundary | Proposed | Put rules in Swing (coupled) or keep a testable domain/application core | Swing invokes application use cases; domain has no UI/persistence dependency | Unassigned |
| ADR-002 | MVP architecture | Proposed | Single-process Java/Swing packages vs multi-module/service-first | One modular Java 21/Maven desktop process for MVP; no microservices | Unassigned |
| ADR-003 | Persistence engine | Open — owner decision required | SQLite local; H2 local; PostgreSQL shared service. Portability, operations, concurrency, and deployment differ | Keep repository/transaction ports; evaluate all three against scope before selection | Unassigned |
| ADR-004 | Immutable ledger and projections | Proposed | Mutable balance only; recompute everything; or immutable facts plus rebuildable projection | Immutable obligations/payment postings are source of truth; pairwise projection is rebuildable | Unassigned |
| ADR-005 | Currencies, scale, rounding, remainders | Open — owner decision required | Supported currency set and exponents; rounding mode; floor/largest remainder or another deterministic allocation; tie by participant ID or another rule | Use `BigDecimal` in Java, reject unsupported precision, and adopt one documented deterministic policy only after approval | Unassigned |
| ADR-006 | Mixed-currency expenses | Open — owner decision required | Disallow across group; allow with recorded conversion/rates; constrain to group currency | Current proposal assumes one currency per group and no FX; owner must confirm | Unassigned |
| ADR-007 | Expense approval policy | Open — owner decision required | Single/multi-stage; eligible roles; self-approval; quorum/timeouts; editing while pending | Persist policy version and immutable decisions; final approval only posts | Unassigned |
| ADR-008 | Payment overpayment and duplicates | Open — owner decision required | Reject overpayment or record credit; define request-idempotency and semantic-duplicate rules | Enforce exact pair and request idempotency; do not silently accept excess | Unassigned |
| ADR-009 | Payment reversal/correction | Open — owner decision required | Prohibit; append compensating posting; workflow-based correction | Preserve immutable original facts; no hard deletion | Unassigned |
| ADR-010 | Expense editing/correction | Open — owner decision required | Lock after submission/approval; audited revision; reversal and resubmission | No edit/delete after approval until a correction policy is approved | Unassigned |
| ADR-011 | Platform sequencing and deployment | Open — owner decision required | Swing-only interim; web-first service; parallel native clients; PWA/cross-platform app | Full product requires web, Android, iOS, shared API and authoritative rules; sequence is not set | Unassigned |
| ADR-012 | Identity, sessions, and password reset | Open — owner decision required | Local demo identity; service-managed credentials; external identity provider | Keep identity behind adapter; never represent a local demo as production account/reset support | Unassigned |
| ADR-013 | Notification channels and delivery | Open — owner decision required | In-app inbox; email; push; combinations, with varying retries/guarantees | Persist logical event/outbox; make failures observable and delivery idempotent | Unassigned |
| ADR-014 | Receipt validation, storage, retention | Open — owner decision required | Local private directory; private object storage; permitted types, size, retention | Store metadata separately, authorize each retrieval, never expose public storage paths | Unassigned |
| ADR-015 | Former-member historical access | Open — owner decision required | Deny all after removal; read-only history; per-record policy | Retain financial history and membership history; decide access separately | Unassigned |
| ADR-016 | Balance projection strategy | Proposed | Compute on demand; maintained rebuildable projection | Choose from measured workload; immutable facts remain authoritative in either case | Unassigned |

## Decision record context and references

The status, alternatives, consequences, owner, and date fields for each record
are in the table above or the status convention at the top. Context and trace
references are listed here; no approval dates are inferred.

| ID | Context | References | Decision date |
|---|---|---|---|
| ADR-001 | GUI framework must not own business rules | Constitution II; FR-003–FR-009 | Not recorded |
| ADR-002 | Course baseline and term-project scope require a small initial architecture | Constitution implementation baseline; FR-010 | Not recorded |
| ADR-003 | Durable storage and full shared-data deployment are both in scope but engine is unspecified | FR-001, FR-007–FR-009; NFR-004 | Not recorded |
| ADR-004 | Pending/rejected expenses must not affect balances; balances must remain pairwise/auditable | FR-006–FR-008; NFR-002; AC-005, AC-006, AC-010 | Not recorded |
| ADR-005 | Currency scale and indivisible minor-unit allocation affect member obligations | FR-003, FR-004, FR-007; NFR-002; AC-003, AC-010, AC-013 | Not recorded |
| ADR-006 | Customer requirements mention shared expenses but do not define exchange-rate behavior | FR-003, FR-007; spec assumptions | Not recorded |
| ADR-007 | Approval is required, but policy/eligibility/self-review details are unspecified | FR-006; AC-005 | Not recorded |
| ADR-008 | Payments must settle named balances; overpayment and retry semantics are unspecified | FR-008; AC-006 | Not recorded |
| ADR-009 | Financial corrections must preserve audit history; reversal semantics are unspecified | FR-008; AC-006 | Not recorded |
| ADR-010 | Post-approval expense editing/deletion behavior is unspecified | FR-006–FR-009; spec open questions | Not recorded |
| ADR-011 | Web, Android, and iOS are required, but sequence and app meaning are unspecified | FR-010; NFR-005; AC-008 | Not recorded |
| ADR-012 | Accounts require password reset and private data, but delivery/session mechanism is unspecified | FR-001; NFR-001; AC-001, AC-009 | Not recorded |
| ADR-013 | Member notification is required but channel, retry, and delivery guarantee are unspecified | FR-005; AC-004 | Not recorded |
| ADR-014 | Optional receipt is required but file validation, storage, and retention are unspecified | FR-003; NFR-001; AC-003 | Not recorded |
| ADR-015 | Membership removal is required but historic access/retention is unspecified | FR-002, FR-007–FR-009; NFR-001; AC-002 | Not recorded |
| ADR-016 | Balance query workload is stated, but caching strategy is not | FR-007; NFR-002, NFR-004; AC-006, AC-012 | Not recorded |

## Source conflict and reconciliation table

| Source A | Source B / conflict | Governing requirement | Baseline resolution | Owner decision |
|---|---|---|---|---|
| Customer `UserRequirement.md` requests web, Android, and iOS | Swing-only MVP cannot provide those platforms | FR-010, NFR-005 | Retain FR-010 as full product; Swing is interim only; shared API and clients are future target | Delivery order and native/PWA meaning remain open (ADR-011) |
| Spec Kit supplies primary requirements/architecture organization | Copilot materials supply stronger ledger and test detail but contain stale statuses/relationships | Constitution I and FR-006–FR-008 | Canonical artifacts live under `specs/001-expense-sharing`; copied assurance content is corrected and old proposal docs are superseded | Human review required |
| Earlier proposed uniqueness by expense | One expense can create many participant obligations | FR-007; NFR-002 | Unique obligation ID plus `(expenseId, debtorId, creditorId, entryKind)`; expense-only key prohibited | Key semantics fixed in design; implementation proof pending |
| Earlier Payment-to-LedgerEntry `0..1` representation | A committed payment must not lack a posting | FR-008 | Separate non-posted PaymentAttempt from committed Payment; each committed Payment has exactly one LedgerEntry | Async transfer lifecycle, duplicate semantics and reversals remain open |
| Proposed largest-remainder allocation | Currency/rounding/tie-break policy has no owner approval | NFR-002; AC-010 | Keep candidate algorithms labeled proposed; use no algorithm as an approved rule | Owner approval required (ADR-005/006) |
| SQLite, H2, and PostgreSQL are each mentioned as candidates | No database is selected in repository or governing input | NFR-004 and financial transaction needs | Retain all as alternatives; define ports and test criteria without engine-specific commitment | Owner selection required (ADR-003) |
| Prior matrix used “Covered” for design-only entries | No implementation or test evidence exists | Constitution I/VI | Canonical statuses separate Specified/Designed from Implemented/Verified/Accepted; current implementation evidence is absent | Human acceptance remains open |

## Conflict resolution

The customer requirements and Constitution govern. The specification remains the
primary requirements record; this register does not approve any proposed policy.
The Copilot proposal documents are historical input, not a second authority; see
[the architecture index](../../architecture/copilot/README.md).

## Review record

No human review/approval is recorded as of 2026-11-05. Update status, owner,
decision date, rationale, and affected requirement/design links when an owner
resolves an item.
