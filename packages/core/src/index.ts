export type SourceType = 'requirement'|'openapi'|'diff'|'existing_test'|'defect'|'source_code';
export interface SourceArtifact { id:string; type:SourceType; name:string; content:string; path?:string }
export interface Evidence { sourceId:string; sourceType:SourceType; excerpt:string; relevance?:number }
export interface ChangeImpact { files:string[]; symbols:string[]; endpoints:string[]; components:string[]; riskSignals:string[] }
export interface ValidationFinding { gate:'schema'|'duplicate'|'security'|'syntax'|'quality'; severity:'info'|'warning'|'error'; message:string }
export interface Scenario { id:string; title:string; layer:'ui'|'api'; priority:'P0'|'P1'|'P2'; riskScore:number; riskReasons:string[]; evidence:Evidence[]; given:string[]; when:string[]; then:string[]; generatedCode:string; confidence?:number; duplicateOf?:string; validation?:ValidationFinding[] }
export interface AnalysisResult { runId:string; summary:string; riskScore:number; changedComponents:string[]; coverageGaps:string[]; scenarios:Scenario[]; changeImpact?:ChangeImpact; retrieval?:{query:string; evidence:Evidence[]}; quality?:{passed:boolean; findings:ValidationFinding[]}; provider?:string }
