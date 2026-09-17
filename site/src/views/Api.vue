<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { componentGroups, components } from '../docs/catalog'
import { api, descriptions, eventDescription, methodDescriptions, slug } from '../docs/reference'
import ComponentTile from '../components/ComponentTile.vue'
const route=useRoute(), filter=ref(''), apiQuery=ref('')
const component=computed(()=>components.find(c=>c.path==='/'+route.params.component))
const doc=computed(()=>api[String(route.params.component)])
watch(()=>route.fullPath,()=>filter.value='')
const visible=(name:string,type:string)=>!filter.value||(name+' '+type).toLowerCase().includes(filter.value.toLowerCase())
const sections=[{key:'events',title:'事件 Events'},{key:'slots',title:'插槽 Slots'},{key:'methods',title:'实例方法与属性 Expose'}] as const
const apiGroups=computed(()=>componentGroups.map(group=>({group,items:components.filter(item=>item.group===group.id&&(item.name+item.title+item.description).toLowerCase().includes(apiQuery.value.toLowerCase()))})).filter(entry=>entry.items.length))
</script>
<template>
 <article class="doc-section api-page" v-if="component && doc">
  <span class="doc-eyebrow">接口参考 / API REFERENCE</span><h1>{{component.name}} <span>{{component.title}}</span></h1><p>{{component.description}}本页覆盖组件及组合组件的公开接口。</p>
  <div class="doc-callout">模板中可使用短横线命名，例如 <code>page-size</code> 对应 <code>pageSize</code>。带 <code>update:</code> 的事件可通过 <code>v-model</code> 绑定。下方类型名称可在“类型定义”中查阅。</div>
  <label class="api-filter">查找当前 API <input v-model="filter" type="search" placeholder="属性、事件、方法或类型…" /></label>
  <template v-for="entry in doc.components" :key="entry.name">
   <h2>{{entry.name}} 属性</h2>
   <p>默认值为“未设置”表示未声明固定默认值；上下文继承或计算行为以说明为准。</p>
   <div class="table-scroll" tabindex="0" :aria-label="entry.name+'属性表'"><table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
    <tr v-for="row in entry.props.filter(p=>visible(p.name,p.type))" :id="slug(entry.name+'-props-'+row.name)" :key="row.name"><td><a :href="'#'+slug(entry.name+'-props-'+row.name)"><code>{{row.name}}</code></a><small v-if="row.required" class="required">必填</small></td><td><code>{{row.type}}</code></td><td><code>{{row.default}}</code></td><td>{{row.description || descriptions[row.name]}}</td></tr>
    <tr v-if="!entry.props.some(p=>visible(p.name,p.type))"><td colspan="4">没有匹配的属性。</td></tr>
   </tbody></table></div>
   <template v-for="section in sections" :key="section.key">
    <h3>{{entry.name}} {{section.title}}</h3>
    <p v-if="!entry[section.key].length">此组件没有公开的{{section.title.split(' ')[0]}}。</p>
    <div v-else class="table-scroll" tabindex="0" :aria-label="entry.name+section.title"><table class="doc-table"><thead><tr><th>名称</th><th>{{section.key==='slots'?'作用域参数':'签名 / 参数'}}</th><th>说明</th></tr></thead><tbody>
     <tr v-for="row in entry[section.key].filter(p=>visible(p.name,p.type))" :key="row.name" :id="slug(entry.name+'-'+section.key+'-'+row.name)"><td><a :href="'#'+slug(entry.name+'-'+section.key+'-'+row.name)"><code>{{row.name}}</code></a></td><td><code>{{row.type}}</code></td><td>{{section.key==='events'?eventDescription(row.name):section.key==='slots'?(row.name==='default'?'组件正文内容。':'自定义 '+row.name+' 区域；可用参数见左侧。'):(methodDescriptions[row.name] || '通过组件 ref 访问。')}}</td></tr>
     <tr v-if="!entry[section.key].some(p=>visible(p.name,p.type))"><td colspan="3">没有匹配的接口。</td></tr>
    </tbody></table></div>
   </template>
  </template>
  <h2>类型定义</h2><p>从组件公开 TypeScript 定义同步，包含组合配置与引用的公共类型。标记为“公开”的类型可从 <code>@ztechjs/zt-ui</code> 导入；依赖定义仅用于解释接口结构。</p>
  <details v-for="type in doc.types" :key="type.name" class="type-definition"><summary>{{type.name}} <small>{{type.public?'公开':'依赖定义'}}</small></summary><pre><code>{{type.code}}</code></pre></details>
 </article>
 <article v-else class="doc-section api-index">
  <div class="page-kicker">REFERENCE LIBRARY / API 参考</div><div class="page-title-row"><div><h1>从公开接口开始，<br>准确接入组件。</h1><p class="page-lead">每份手册由源码同步生成，集中呈现属性、默认值、事件、插槽、实例方法与可导出的 TypeScript 类型。</p></div><div class="component-count"><strong>{{components.length}}</strong><span>COMPONENTS</span><strong>{{componentGroups.length}}</strong><span>GROUPS</span></div></div>
  <div class="component-toolbar"><label><span>查找 API</span><input v-model="apiQuery" type="search" placeholder="组件名、中文名称或用途" /></label><RouterLink class="text-link" to="/conventions">先阅读通用约定 →</RouterLink></div>
  <section v-for="entry in apiGroups" :key="entry.group.id" class="component-group-section"><div class="component-group-head" :style="{'--group-accent':entry.group.accent}"><span>{{entry.group.english}}</span><h2>{{entry.group.title}}</h2><p>{{entry.group.description}}</p></div><div class="component-landscape"><ComponentTile v-for="item in entry.items" :key="item.path" :item="item" :to="'/api'+item.path" :action="`${api[item.path.slice(1)]?.components[0]?.props.length||0} 个属性 · 查看接口`" /></div></section>
  <div v-if="!apiGroups.length" class="empty-search" role="status"><strong>没有匹配的 API</strong><p>可尝试搜索“日期”“上传”“导航”或组件英文名。</p></div>
 </article>
</template>
