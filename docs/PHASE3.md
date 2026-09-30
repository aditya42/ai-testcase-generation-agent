# Phase 3 — Autonomous AI Quality Engineering Agent

Phase 3 turns generation into a controlled autonomous engineering loop.

## Pipeline

1. **Repository intelligence** — reads a real Git range, captures changed files/diff and builds a lightweight import dependency graph.
2. **Impact expansion** — identifies source/tests importing changed modules and feeds this evidence into the existing risk engine.
3. **Semantic/evidence retrieval** — correlates requirements, OpenAPI, defects, existing tests, source and change evidence.
4. **LLM planning with deterministic fallback** — structured scenarios are schema/quality gated before code is accepted.
5. **Sandbox validation + bounded repair** — generated files are isolated in a temporary directory; validation has a strict timeout and one bounded cleanup/repair attempt.
6. **Autonomous judge** — scores evidence traceability, assertions, risk rationale, duplicate status and validation result. It emits approve/review/reject *for the proposal quality*, not a merge decision.
7. **GitHub outputs** — generated specs, full JSON evidence, Markdown check summary, and a Checks API-compatible payload are emitted as CI artifacts.
8. **Human merge gate** — the workflow never commits or merges generated tests automatically.

## Local run

```bash
npm install
npm run agent:autonomous -w apps/api -- \
  --input ../../sample-app/artifacts.json \
  --repo ../.. \
  --base HEAD~1 \
  --head HEAD \
  --out ../../generated-tests-phase3
```

## Outputs

- `AI-*.spec.ts` — proposed Playwright/API tests
- `AUTONOMOUS_REPORT.json` — evidence, impact, execution and judge details
- `GITHUB_CHECK.md` — reviewer-friendly PR summary
- `check-run-payload.json` — payload suitable for a GitHub Check integration

## Production hardening roadmap

Replace lexical retrieval with pgvector embeddings; replace lightweight import parsing with ts-morph/TypeScript compiler API; execute Playwright inside an ephemeral Docker runner; add Stryker mutation testing; post Checks API annotations through a GitHub App; create a branch/PR only after explicit reviewer approval.
