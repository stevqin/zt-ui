<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { components } from '../docs/catalog'
import { api, descriptions, eventDescription, methodDescriptions, slug } from '../docs/reference'
const route=useRoute(), filter=ref('')
const component=computed(()=>components.find(c=>c.path==='/'+route.params.component))
const doc=computed(()=>api[String(route.params.component)])
watch(()=>route.fullPath,()=>filter.value='')
const visible=(name:string,type:string)=>!filter.value||(name+' '+type).toLowerCase().includes(filter.value.toLowerCase())
const sections=[{key:'events',title:'事件 Events'},{key:'slots',title:'插槽 Slots'},{key:'methods',title:'实例方法与属性 Expose'}] as const
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
 <article v-else class="doc-section"><span class="doc-eyebrow">REFERENCE LIBRARY</span><h1>API 手册</h1><p>按组件查阅属性、默认值、事件、插槽与实例方法。每份文档都附有相关类型定义。</p><div class="component-grid"><RouterLink v-for="c in components" :key="c.path" :to="'/api'+c.path" class="component-card"><strong>{{c.name}} <span>↗</span></strong><span>{{c.title}}</span><p>{{c.description}}</p><small>{{api[c.path.slice(1)]?.components[0]?.props.length}} 个属性 · 查看完整接口</small></RouterLink></div></article>
</template>
