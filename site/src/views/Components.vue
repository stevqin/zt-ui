<script setup lang="ts">
import { ref, computed } from 'vue'
import { components, groups } from '../docs/catalog'
const query=ref('')
const filtered=computed(()=>components.filter(c=>(c.name+c.title+c.description).toLowerCase().includes(query.value.toLowerCase())))
</script>
<template><article class="doc-section"><span class="doc-eyebrow">COMPONENT LIBRARY</span><h1>组件索引</h1><p>从 {{components.length}} 个组件页面中找到所需能力，每页都提供交互示例和完整 API。</p><label class="api-filter">筛选组件 <input v-model="query" type="search" placeholder="输入组件名称或用途…" /></label><template v-for="group in groups" :key="group"><section v-if="filtered.some(c=>c.group===group)"><h2>{{group}}</h2><div class="component-grid"><RouterLink v-for="c in filtered.filter(c=>c.group===group)" :key="c.path" :to="c.path" class="component-card"><strong>{{c.name}}<span>↗</span></strong><span>{{c.title}}</span><p>{{c.description}}</p></RouterLink></div></section></template><p v-if="!filtered.length" role="status">没有匹配的组件，试试“日期”“表单”或“Input”。</p></article></template>
