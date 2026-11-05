# SplitSmart Glossary and Business Rules

This glossary is normative for the proposed design baseline. Product rules that
still need owner approval are marked **Open** in the [decision register](./decision-register.md).

## Terms

| Term | Definition |
|---|---|
| Account holder | Person with an individual SplitSmart account. |
| Group member | Account with an active membership in a group. |
| Group manager | Member designated by the creator to add or remove members; any additional authority is open. |
| Submitter | Member who records an expense. Under the clarified requirement, the submitter is also its payer and a participant. |
| Payer | Person who initially paid the merchant; for the specified workflow this is the submitter. |
| Participant | Group member whose share is included in an expense split. |
| Expense share | Exact amount assigned to one participant under an equal or percentage split. |
| Debtor / creditor | For a pairwise obligation, respectively the participant who owes and the payer who is owed. |
| Obligation | Immutable directed financial fact that one debtor owes one creditor for one approved expense share. |
| Ledger entry | Immutable financial fact sourced from an approved expense obligation, posted payment, or approved reversal/correction. |
| Settlement / payment | Recorded transfer from a named payer/debtor to a named payee/creditor, scoped to that same pair. |
| Pairwise balance | Derived net amount for one group, currency, and unordered account pair, with a sign indicating direction. |
| Projection | Rebuildable read model computed from immutable financial facts; never the sole source of truth. |
| Approval | Authorized review decision. An expense affects balances only after the configured workflow reaches final approval. |
| Reversal | Separate compensating ledger fact that preserves the original financial event; availability and rules are open. |
| Currency scale | Number of fractional decimal places supported for a currency; the supported currency set and scales are open. |

## Business rules and invariants

1. A submitted expense belongs to one group, has positive amount, date,
   description, split method, and one or more distinct group-member participants.
   The submitter/payer is among them.
2. Equal and percentage splits use exact decimal arithmetic (`BigDecimal` in the
   Java baseline). Binary floating-point is not used for money.
3. Percentage inputs are nonnegative and total exactly 100%. Expense allocations
   reconcile exactly to the expense total at the approved currency scale.
4. The rounding mode, scale, and deterministic minor-unit tie-break are **Open**;
   no proposed algorithm is an approved product rule.
5. Pending and rejected expenses have no obligations and do not affect balances.
   Final approval and creation of all corresponding obligations are one logical,
   atomic, idempotent operation.
6. Each non-payer participant with a positive share produces a distinct
   obligation to the payer; a zero-minor-unit share remains a participant share
   but creates no zero-value ledger obligation. One expense may therefore
   produce multiple obligations. A uniqueness key on expense alone is invalid.
   The proposed key is
   `(expenseId, debtorId, creditorId, entryKind)` plus a unique `obligationId`.
7. A payment is scoped to its exact group/currency/payer/payee pair. It cannot
   redirect or discharge another pair's debt. Overpayment semantics are **Open**.
8. Every committed `POSTED` payment has exactly one corresponding immutable
   ledger posting. Pending and failed attempts are not posted financial facts.
9. Pairwise balances are derived on demand or maintained only as rebuildable
   projections from obligations and posted payment facts.
10. Financial corrections never erase history. Whether and how approved expenses
    or posted payments may be corrected/reversed is **Open**.
11. Authorization is enforced at the application/service boundary for every
    account, group, expense, receipt, balance, and report operation. UI hiding is
    not authorization.
12. Ending membership does not delete historical financial references. Former
    member access to historical expenses, receipts, and reports is **Open**.

See [data-model.md](./data-model.md) for persistence mapping and
[decision-register.md](./decision-register.md) for unresolved choices.
