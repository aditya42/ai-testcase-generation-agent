# Phase 2: Agent Intelligence

## Agent stages
1. **Change Analyzer** derives files, symbols, API paths, affected business components and risk signals.
2. **Evidence Retriever** ranks requirements, OpenAPI contracts, historical defects and existing tests against the change surface.
3. **Risk Reasoner** uses a structured LLM provider when configured; deterministic analysis is always available.
4. **Scenario Contract** validates AI reasoning before code generation.
5. **Playwright Generator** converts approved structured intent into API/UI test proposals.
6. **Quality Gates** check evidence, duplication, unsafe code patterns and assertion presence.
7. **PR Reporter** produces a reviewer-oriented Markdown report and machine-readable JSON.

## Production evolution
Replace lexical retrieval with PostgreSQL/pgvector embeddings; add TypeScript Compiler API/tree-sitter for deeper AST and call-graph analysis; execute generated tests inside an isolated container; feed compile/runtime errors to a bounded repair loop; publish a GitHub Check with reviewer approval before opening a PR.
