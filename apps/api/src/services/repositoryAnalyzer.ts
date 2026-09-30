import { execFileSync } from 'node:child_process'; import fs from 'node:fs'; import path from 'node:path'; import type { SourceArtifact } from '@testgen/core';
export interface RepoIntelligence { base:string; head:string; changedFiles:string[]; diff:string; dependencyGraph:Record<string,string[]>; impactedFiles:string[] }
const imports=(s:string)=>[...s.matchAll(/(?:from\s+|require\()["']([^"']+)["']/g)].map(m=>m[1]);
export function analyzeRepository(repo:string,base='HEAD~1',head='HEAD'):RepoIntelligence{
 const git=(args:string[])=>execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim(); const changedFiles=git(['diff','--name-only',base,head]).split('\n').filter(Boolean); const diff=git(['diff','--unified=2',base,head]);
 const files=git(['ls-files','*.ts','*.tsx','*.js','*.jsx']).split('\n').filter(Boolean); const graph:Record<string,string[]>={};
 for(const f of files){const abs=path.join(repo,f); if(!fs.existsSync(abs))continue; graph[f]=imports(fs.readFileSync(abs,'utf8')).map(x=>x.startsWith('.')?path.normalize(path.join(path.dirname(f),x)):x);}
 const stems=new Set(changedFiles.map(f=>f.replace(/\.(tsx?|jsx?)$/,''))); const impacted=new Set(changedFiles); for(const [f,deps] of Object.entries(graph)) if(deps.some(d=>[...stems].some(s=>d===s||d.endsWith(s)))) impacted.add(f);
 return {base,head,changedFiles,diff,dependencyGraph:graph,impactedFiles:[...impacted]};
}
export function repoArtifacts(r:RepoIntelligence):SourceArtifact[]{return [{id:'git-diff',type:'diff',name:`Git diff ${r.base}..${r.head}`,content:r.diff},{id:'impact-graph',type:'source_code',name:'Dependency impact graph',content:JSON.stringify({changed:r.changedFiles,impacted:r.impactedFiles},null,2)}]}
function git(
  repo: string,
  args: string[]
): string {
  return execFileSync("git", args, {
    cwd: repo,
    encoding: "utf8",
  }).trim();
}

function resolveGitRef(
  repo: string,
  ref: string
): string {
  const normalized = ref.replace(/\\~/g, "~");

  try {
    return git(repo, [
      "rev-parse",
      "--verify",
      `${normalized}^{commit}`,
    ]);
  } catch {
    throw new Error(
      `Invalid Git reference: ${ref}. ` +
      "Verify the repository contains the requested commit."
    );
  }
}
const baseCommit = resolveGitRef(repo, base);
const headCommit = resolveGitRef(repo, head);

const changedFiles = git(repo, [
  "diff",
  "--name-only",
  baseCommit,
  headCommit,
])
  .split("\n")
  .filter(Boolean);