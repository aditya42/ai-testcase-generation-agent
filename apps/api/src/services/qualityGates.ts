import type { Scenario, SourceArtifact, ValidationFinding } from '@testgen/core';
function words(s:string){return new Set(s.toLowerCase().match(/[a-z0-9]{3,}/g)||[])}
function similarity(a:string,b:string){const A=words(a),B=words(b); const i=[...A].filter(x=>B.has(x)).length; const u=new Set([...A,...B]).size; return u?i/u:0}
export function validateScenario(s:Scenario, artifacts:SourceArtifact[]):ValidationFinding[]{
 const f:ValidationFinding[]=[]; if(!s.evidence.length)f.push({gate:'quality',severity:'error',message:'Scenario has no source evidence'}); if(s.riskScore<0||s.riskScore>100)f.push({gate:'schema',severity:'error',message:'Risk score must be 0..100'}); if(!/expect\s*\(/.test(s.generatedCode))f.push({gate:'quality',severity:'warning',message:'Generated test contains no explicit Playwright assertion'}); if(/process\.env\.[A-Z_]+\s*=|eval\(|child_process/.test(s.generatedCode))f.push({gate:'security',severity:'error',message:'Unsafe generated-code pattern detected'});
 const tests=artifacts.filter(a=>a.type==='existing_test'); for(const t of tests){if(similarity(`${s.title} ${s.given} ${s.when} ${s.then}`,`${t.name} ${t.content}`)>.48){f.push({gate:'duplicate',severity:'warning',message:`Potential duplicate of ${t.name}`});break;}}
 return f;
}
export function validateAll(scenarios:Scenario[], artifacts:SourceArtifact[]){const findings=scenarios.flatMap(s=>validateScenario(s,artifacts)); return {passed:!findings.some(f=>f.severity==='error'),findings};}
