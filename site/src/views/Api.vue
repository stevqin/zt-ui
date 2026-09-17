<script setup lang="ts">
import { computed, ref } from 'vue'
import { componentGroups, components } from '../docs/catalog'
import { api } from '../docs/reference'
import ComponentTile from '../components/ComponentTile.vue'
const apiQuery=ref('')
const apiGroups=computed(()=>componentGroups.map(group=>({group,items:components.filter(item=>item.group===group.id&&(item.name+item.title+item.description).toLowerCase().includes(apiQuery.value.toLowerCase()))})).filter(entry=>entry.items.length))
</script>
<template>
 <article class="doc-section api-index">
  <div class="page-kicker">REFERENCE LIBRARY / API 参考</div><div class="page-title-row"><div><h1>从公开接口开始，<br>准确接入组件。</h1><p class="page-lead">每个组件的示例、属性、事件、插槽、公开方法和类型声明现在位于同一页面。这里用于快速定位组件。</p></div><div class="component-count"><strong>{{components.length}}</strong><span>COMPONENTS</span><strong>{{componentGroups.length}}</strong><span>GROUPS</span></div></div>
  <div class="component-toolbar"><label><span>查找 API</span><input v-model="apiQuery" type="search" placeholder="组件名、中文名称或用途" /></label><RouterLink class="text-link" to="/conventions">先阅读通用约定 →</RouterLink></div>
  <section v-for="entry in apiGroups" :key="entry.group.id" class="component-group-section"><div class="component-group-head" :style="{'--group-accent':entry.group.accent}"><span>{{entry.group.english}}</span><h2>{{entry.group.title}}</h2><p>{{entry.group.description}}</p></div><div class="component-landscape"><ComponentTile v-for="item in entry.items" :key="item.path" :item="item" :to="item.path+'#api'" :action="`${api[item.path.slice(1)]?.components[0]?.props.length||0} 个属性 · 查看组件 API`" /></div></section>
  <div v-if="!apiGroups.length" class="empty-search" role="status"><strong>没有匹配的 API</strong><p>可尝试搜索“日期”“上传”“导航”或组件英文名。</p></div>
 </article>
</template>
