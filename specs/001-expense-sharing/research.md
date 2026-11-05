# Architecture Research — SplitSmart

**Status**: Research for an architecture proposal; no framework, database, identity provider, or client technology is approved by this document.

## Decisions and evidence

### 1. Desktop MVP and full-product deployment

**Decision**: Treat Swing as a local desktop MVP target only. Recommend a modular service/API as the authoritative application boundary for the full web-first product and Android/iOS clients.

**Rationale**: The Constitution sets Java 21/Maven/Swing for the desktop baseline, while FR-010 requires primarily web availability plus Android and iOS, and NFR-005 requires consistent results across those clients. A desktop-only application cannot satisfy those customer requirements. A central service can enforce identity/group authorization and return authoritative shares and balances to all clients.

**Alternatives considered**:
- Swing-only modular monolith: easiest desktop demonstration, but fails FR-010 and cannot provide shared cross-device records.
- Service/API with web and native mobile clients: best fit for full requirements, with material hosting, identity, API, and client cost.
- Service/API with PWA or cross-platform UI: potentially less duplicated client UI, but whether it meets “apps” and native/store expectations is open.

**Consequences**: Use cases/domain logic must not depend on Swing. For the local MVP, invoke the Java core in-process; for a future service, invoke the same business rules server-side. Web/mobile clients should not each implement authoritative financial arithmetic. This migration still requires decisions about identity, data ownership, importing demo records, sessions, and API versioning; modularity does not make it automatic.

**Sources**: [Maven multi-module guide](https://maven.apache.org/guides/mini/guide-multiple-modules.html); [Java 21 module API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/module/package-summary.html); [OpenAPI Specification](https://spec.openapis.org/oas/latest.html); [MDN Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps); [Flutter web support](https://docs.flutter.dev/platform-integration/web).

### 2. Identity and client sessions

**Decision**: Keep identity and authorization behind an application/service boundary. Treat local-demo authentication as a demonstration only; require full-product authentication and server-side authorization before claiming FR-001/NFR-001.

**Rationale**: The spec requires email/password, reset, and private account/group data, but leaves remote-vs-local operation open. Native client session protocol and reset delivery are not chosen.

**Alternatives considered**: Local-only accounts for the demo; service-managed email/password; an external identity provider. No provider or protocol is selected.

**Consequences**: Never store/log plaintext passwords or reset secrets. For native OAuth-based clients, RFC 8252 recommends authorization through an external user-agent; RFC 9700 gives current OAuth security best practice. These references do not determine that OAuth is the chosen SplitSmart design.

**Sources**: [RFC 8252](https://www.rfc-editor.org/rfc/rfc8252.html); [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).

### 3. Storage and transaction boundary

**Decision**: Keep persistence behind repository/transaction ports. Compare local embedded relational storage for a desktop demonstration with a shared relational database behind a service for full product; do not select an engine in this plan.

**Rationale**: Expense shares, group membership, approvals, and payments have relational integrity and atomic update requirements. A local database avoids running a database server for a single-machine demo but does not provide shared multi-user access.

**Alternatives considered**:
- SQLite is an embedded candidate. SQLite documents ACID transactions and serializable isolation. Foreign-key enforcement is disabled by default and must be enabled per connection. It serializes writers; WAL can permit concurrent readers/writer on one host but does not support a network filesystem. A live file backup should use a consistent backup approach, not an unsafe blind copy.
- H2 is another embedded candidate, but its locking, compatibility, and backup behavior must be checked against its official documentation before treating it as interchangeable with SQLite.
- PostgreSQL is a shared-service candidate. Its `NUMERIC`/`DECIMAL` types are exact and specifically recommended for money. PostgreSQL's default Read Committed isolation gives each query a fresh snapshot; multi-query workflows need deliberate transaction/locking behavior. Serializable transactions can require retry handling.

**Consequences**: Test the actual selected database engine, foreign-key setup, transaction/rollback behavior, concurrency, migration, and backup/restore. Storage choice does not remove application-level validation. For SQLite, avoid floating `REAL` for money; consider integer minor units when scale/range are settled or a canonical exact decimal representation. For PostgreSQL, choose explicit precision/scale and align it with Java `BigDecimal` rules.

**Sources**: [SQLite transactions](https://www.sqlite.org/transactional.html); [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html); [SQLite isolation](https://www.sqlite.org/isolation.html); [SQLite WAL](https://www.sqlite.org/wal.html); [SQLite backup API](https://www.sqlite.org/backup.html); [SQLite datatypes](https://www.sqlite.org/datatype3.html); [PostgreSQL numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html); [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html); [Java 21 `BigDecimal`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html).

### 4. Financial rules and cross-client consistency

**Decision**: Use a canonical Java domain implementation for the Swing MVP; in a shared deployment make the service authoritative for split allocation, approval, pairwise balances, and payments. Treat any remainder allocation rule as an owner decision.

**Rationale**: `BigDecimal` represents arbitrary-precision decimal values and allows explicit scale/rounding, supporting Constitution III. A decimal type alone does not determine currency scale or the allocation of fractional-minor-unit remainders. Server-authoritative results reduce cross-client drift and directly support NFR-005.

**Alternatives considered**: Duplicate split/balance algorithms in each client, rejected as a consistency risk; client-side calculation for display only may be added later but must be reconciled to authoritative server values.

**Consequences**: Keep shared test vectors for equal/percentage splits, approval gating, pairwise signs, and payments. Tests must prove every share sum equals its expense total and every payment changes only its own pair. The proposed largest-remainder/stable-ID tie-break in [plan.md](./plan.md) remains unapproved.

**Sources**: [Java 21 `BigDecimal`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html); [JUnit User Guide](https://docs.junit.org/current/user-guide/).

## Open decisions carried forward

1. Local-only Swing demonstration or shared remote accounts/groups?
2. Is an installable PWA acceptable for Android/iOS, or are native/store apps required?
3. What web/mobile framework, hosting, API protocol, identity/session model, and reset-delivery mechanism are approved?
4. Which database engine, migration tool, local-to-shared migration, backup, and recovery objectives?
5. Supported currency set, precision/scale, rounding mode, deterministic tie-break, and overpayment behavior?
6. Review eligibility, self-approval, multiple-level configuration, notification channel, receipt limits/retention, edit/delete, report filters/exports?

No measured performance result, repository dependency, or technology deployment was discovered. NFR-004 must be tested under owner-agreed conditions against the actual selected stack.
