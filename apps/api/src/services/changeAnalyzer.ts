import type { ChangeImpact, SourceArtifact } from '@testgen/core';
const uniq=(xs:string[])=>[...new Set(xs)];
export function analyzeChanges(artifacts:SourceArtifact[]):ChangeImpact {
 const diffs=artifacts.filter(a=>a.type==='diff'||a.type==='source_code'); const text=diffs.map(d=>d.content).join('\n');
 const files=uniq(diffs.flatMap(d=>[d.path,d.name].filter(Boolean) as string[]));
 const symbols=uniq([...text.matchAll(/(?:function|class|interface|const|let|var)\s+([A-Za-z_$][\w$]*)/g)].map(m=>m[1]).slice(0,30));
 const endpoints=uniq([...text.matchAll(/(?:GET|POST|PUT|PATCH|DELETE)\s+([^\s'"`]+)/gi)].map(m=>`${m[1].toUpperCase()} ${m[2]}`).concat([...text.matchAll(/['"`](\/api\/[A-Za-z0-9_\-\/{\}.]+)['"`]/g)].map(m=>m[1])));
 const map:[RegExp,string][]=[[/payment|card|authorize/i,'payment'],[/checkout|order/i,'checkout'],[/auth|login|token|session/i,'authentication'],[/inventory|stock/i,'inventory'],[/shipping|delivery/i,'shipping'],[/customer|account/i,'customer']];
 const all=artifacts.map(a=>`${a.name}\n${a.content}`).join('\n'); const components=map.filter(([r])=>r.test(all)).map(([,c])=>c);
 const riskSignals:string[]=[]; if(/delete|remove|drop|breaking/i.test(text)) riskSignals.push('breaking-or-removal-change'); if(/auth|token|secret/i.test(text)) riskSignals.push('security-sensitive-change'); if(/payment|order|checkout/i.test(text)) riskSignals.push('revenue-critical-change'); if(/catch|retry|timeout|error/i.test(text)) riskSignals.push('failure-path-change');
 return {files,symbols,endpoints,components:uniq(components),riskSignals:uniq(riskSignals)};
}
