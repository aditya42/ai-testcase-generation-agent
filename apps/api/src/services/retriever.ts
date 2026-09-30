import type { Evidence, SourceArtifact } from '@testgen/core';
const tokens=(s:string)=>new Set(s.toLowerCase().match(/[a-z0-9_/-]{3,}/g)||[]);
export function retrieve(artifacts:SourceArtifact[], query:string, limit=8):Evidence[] {
 const q=tokens(query); return artifacts.map(a=>{const t=tokens(`${a.name} ${a.content}`); let hit=0; q.forEach(x=>{if(t.has(x))hit++}); const relevance=q.size?hit/q.size:0; return {sourceId:a.id,sourceType:a.type,excerpt:a.content.replace(/\s+/g,' ').slice(0,260),relevance};}).sort((a,b)=>(b.relevance||0)-(a.relevance||0)).slice(0,limit);
}
