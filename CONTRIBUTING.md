# Contributing

Thank you for improving Riverbend Gastroenterology Scheduling. Contributions are welcome when they strengthen inspectability, accessibility, deterministic policy behavior, evaluation evidence, or the FDE lifecycle while preserving the project’s synthetic-data and non-clinical boundaries.

## Before You Open a Pull Request

Open an issue first for material changes to policy semantics, identity flow, safety routing, data contracts, platform boundaries, or presentation claims. Describe the user or FDE problem, the smallest useful change, the evidence you expect, and the conditions under which the proposal should be narrowed or stopped.

Never add real patient information, protected health information, credentials, production endpoints, customer reviews, medical advice, or invented outcome claims. Synthetic fixtures must be obviously fictional and documented in the scenario or assumption ledger.

## Development Workflow

```bash
pnpm install
pnpm dev
pnpm test
pnpm check
pnpm build
```

| Change type | Required evidence |
| --- | --- |
| Conversation or policy | Positive scenario, negative guarantee, reason code, required/forbidden tool assertions |
| Data contract | Type changes, fixture update, migration or compatibility note |
| Accessibility | Keyboard and focus validation, text alternative, reduced-motion review where relevant |
| Visual system | Representative screenshots and consistency with `ideas.md` |
| Platform strategy | Phase 1 evidence, falsifiable hypothesis, metric contract, stop/scale rule |

## Pull Request Standard

Keep changes focused. Update tests, documentation, traceability, and the iteration log when behavior changes. State what was tested and what remains unverified. A passing final sentence is not sufficient evidence for a workflow change; the pull request should show the underlying policy and tool path.

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and license your contribution under the [MIT License](LICENSE).

