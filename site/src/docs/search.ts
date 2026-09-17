import { componentPlan, components, guides, scenarios } from './catalog'
import { api, slug } from './reference'
export interface SearchResult { title: string; detail: string; path: string }
const entries: SearchResult[] = [
 ...guides.map(g => ({title:g.title,detail:'指南',path:g.path})),
 ...scenarios.map(s => ({title:s.title,detail:s.description,path:'/scenarios/'+s.id})),
 ...componentPlan.map(item=>({title:`${item.name} ${item.title}`,detail:`规划组件 · ${item.description}`,path:`/roadmap#${item.phase}`})),
 ...components.flatMap(c => [
  {title:`${c.name} ${c.title}`,detail:c.description,path:c.path},
  ...api[c.path.slice(1)]!.sections.map(title=>({title,detail:`${c.name} · 示例章节`,path:`${c.path}#${slug(title)}`})),
  ...api[c.path.slice(1)]!.components.flatMap(entry=>['props','events','slots','exposes'].flatMap(kind=>entry[kind as 'props'].map(row=>({title:row.name,detail:`${entry.name} · ${kind} · ${row.description}`,path:`${c.path}#${slug(entry.name+'-'+kind+'-'+row.name)}`})))),
  ...api[c.path.slice(1)]!.types.map(type=>({title:type.name,detail:`${c.name} · 类型声明`,path:`${c.path}#types`})),
 ]),
]
export function searchDocs(query: string): SearchResult[] {
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean)
 if (!terms.length) return []
 return entries.filter(e=>terms.every(t=>(e.title+' '+e.detail).toLowerCase().includes(t))).sort((a,b)=>Number(b.title.toLowerCase()===query.toLowerCase())-Number(a.title.toLowerCase()===query.toLowerCase())).slice(0,16)
}
