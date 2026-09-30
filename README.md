# AI Test-Case Generation Agent

A portfolio-grade Quality Engineering agent that converts **requirements + OpenAPI specifications + code diffs + existing tests + production defects** into traceable, risk-ranked test scenarios and Playwright UI/API tests.

## Why this is different

Most AI test generators start with a prompt and return code. This project treats test generation as a quality-engineering decision system:

`Evidence → Change Analysis → Risk → Coverage Gap → Scenario IR → Test Code → Validation → Human Review`

Every scenario contains its risk score, reasons, source evidence and generated test code.

## Demo architecture

- **Frontend:** React + TypeScript + Vite
- **Agent/API:** Fastify + TypeScript
- **Test target:** Playwright UI and API tests
- **Persistence design:** PostgreSQL + pgvector
- **Local mode:** deterministic risk engine; no API key required
- **LLM-ready:** provider boundary is intentionally separated from the scenario IR

See `docs/ARCHITECTURE.md`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and select **Run Demo Analysis**. API health: `http://localhost:8080/health`.

Or run only the agent demo:

```bash
npm run demo
```

## Docker

```bash
docker compose up --build
```

UI: `http://localhost:3000`  
API: `http://localhost:8080`

## API

`POST /api/analyze`

```json
{
  "artifacts": [
    {"id":"REQ-142","type":"requirement","name":"Payment requirement","content":"..."},
    {"id":"DIFF-1","type":"diff","name":"PaymentService.ts","content":"..."},
    {"id":"DEF-391","type":"defect","name":"Duplicate order","content":"..."}
  ]
}
```

Supported source types: `requirement`, `openapi`, `diff`, `existing_test`, `defect`.

## Risk model

The production version should score at least:

- business/revenue criticality
- changed-code surface and dependency blast radius
- historical production defects
- security/auth/data sensitivity
- existing test coverage
- negative/boundary coverage gaps
- API contract changes
- test flakiness/history

The current local demo deliberately uses transparent rules so reviewers can run it without credentials. Replace/augment the analyzer with an LLM provider while retaining the structured `Scenario` contract.

## Portfolio demo story

1. Show the supplied checkout requirement.
2. Show a payment-service code change.
3. Supply historical defect `PROD-391`.
4. Show that the existing suite covers only successful checkout.
5. Run analysis.
6. Explain why the agent assigns P0/high risk to payment-decline coverage.
7. Expand traceability to show which evidence produced the scenario.
8. Show generated Playwright API and UI tests.
9. Explain that validation and human approval are gates before PR creation.

## Roadmap

- GitHub App / webhook ingestion for PR diffs
- OpenAPI semantic diffing
- AST-based code/change dependency graph
- embeddings and hybrid retrieval with pgvector
- OpenAI/other LLM adapters with structured outputs
- test deduplication and semantic coverage matching
- generated-code compile/lint/Playwright validation sandbox
- mutation testing feedback
- production telemetry/defect ingestion
- reviewer approval workflow and GitHub PR creation
- agent evaluation dataset: validity, traceability, duplication, risk recall, executable-test rate

## Resume-ready description

**AI Test-Case Generation Agent** — Built an AI-assisted quality engineering platform that correlates requirements, API contracts, code changes, regression coverage, and production defects to identify risk-based coverage gaps and generate traceable Playwright UI/API tests with human-review gates.

## Phase 2 — Agentic intelligence pipeline

The agent now treats generated tests as a governed software artifact rather than raw LLM text:

```text
Requirements / OpenAPI / Diff / Tests / Defects
                    │
                    ▼
             Change Analyzer
        files • symbols • APIs • risk
                    │
                    ▼
          Evidence Retriever (RAG seam)
                    │
                    ▼
       Risk Reasoner / LLM Provider
        deterministic fallback included
                    │
                    ▼
         Structured Scenario Schema
                    │
                    ▼
       Playwright Code Generation
                    │
                    ▼
       Quality + Security Gates
       duplicate • evidence • assertions
                    │
                    ▼
         PR Report + Test Artifacts
```

### Run the agent from CLI

```bash
npm install
npm run agent -w apps/api -- --input ../../sample-app/artifacts.json --out ../../generated-tests
```

This produces `report.json`, `PR_REPORT.md`, and generated `*.spec.ts` files. With no `OPENAI_API_KEY`, the repository remains fully demoable using its deterministic risk engine. Add an API key to activate the structured LLM reasoner; malformed/provider output automatically falls back rather than silently creating untrusted tests.

### Phase-2 engineering controls

- **Change intelligence:** extracts changed files, symbols, API surfaces, components, and high-risk signals from diffs/source.
- **Evidence retrieval:** ranks supplied requirements, contracts, tests and defects against the impacted surface. The interface is intentionally ready to be replaced by pgvector embeddings.
- **Structured LLM output:** Zod validates scenarios before code generation.
- **Hallucination control:** the prompt forbids invented endpoints and scenarios retain source evidence.
- **Duplicate detection:** lexical similarity checks proposed scenarios against the existing regression suite.
- **Security gate:** blocks unsafe generated-code patterns such as `eval`, `child_process`, and environment mutation.
- **Test quality gate:** checks evidence and explicit Playwright assertions.
- **Human-in-the-loop:** PR output is explicitly proposed test code; approval remains a reviewer action.
- **Provider resilience:** deterministic generation remains available when the LLM is absent or fails.

## Phase 3: Autonomous GitHub quality loop

Phase 3 adds real Git diff ingestion, lightweight dependency-impact analysis, bounded sandbox validation/repair, an autonomous proposal-quality judge, and GitHub Actions/Checks artifacts. Generated tests remain proposals and require human review before merge.

See `docs/PHASE3.md` and `.github/workflows/autonomous-test-agent.yml`.
