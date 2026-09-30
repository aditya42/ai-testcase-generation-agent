CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS analysis_runs(id UUID PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT now(), summary TEXT, risk_score INT);
CREATE TABLE IF NOT EXISTS artifacts(id TEXT PRIMARY KEY, run_id UUID REFERENCES analysis_runs(id), source_type TEXT NOT NULL, name TEXT NOT NULL, content TEXT NOT NULL, embedding vector(1536));
CREATE TABLE IF NOT EXISTS scenarios(id TEXT PRIMARY KEY, run_id UUID REFERENCES analysis_runs(id), title TEXT NOT NULL, layer TEXT NOT NULL, priority TEXT NOT NULL, risk_score INT NOT NULL, risk_reasons JSONB NOT NULL, evidence JSONB NOT NULL, generated_code TEXT NOT NULL, review_status TEXT DEFAULT 'PENDING');
CREATE INDEX IF NOT EXISTS artifacts_embedding_idx ON artifacts USING hnsw (embedding vector_cosine_ops);
