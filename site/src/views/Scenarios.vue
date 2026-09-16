<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { scenarios, components } from '../docs/catalog'
import DemoBlock from '../components/DemoBlock.vue'
const route=useRoute()
const scene=computed(()=>scenarios.find(s=>s.id===route.params.scene))
const examples={
 'form-entry':{component:defineAsyncComponent(()=>import('./scenarios/FormEntry.vue')),code:()=>import('./scenarios/FormEntry.vue?raw')},
 'query-filter':{component:defineAsyncComponent(()=>import('./scenarios/QueryFilter.vue')),code:()=>import('./scenarios/QueryFilter.vue?raw')},
 'data-list':{component:defineAsyncComponent(()=>import('./scenarios/DataList.vue')),code:()=>import('./scenarios/DataList.vue?raw')},
 'overlay-edit':{component:defineAsyncComponent(()=>import('./scenarios/OverlayEdit.vue')),code:()=>import('./scenarios/OverlayEdit.vue?raw')},
 'status-flow':{component:defineAsyncComponent(()=>import('./scenarios/StatusFlow.vue')),code:()=>import('./scenarios/StatusFlow.vue?raw')},
}
import { ref, watch } from 'vue'
const code=ref('')
const example=computed(()=>examples[scene.value?.id as keyof typeof examples])
watch(example,async value=>{code.value='';if(value){const loaded=await value.code();if(example.value===value)code.value=loaded.default}},{immediate:true})
</script>
<template><article v-if="scene && example" class="doc-section"><span class="doc-eyebrow">场景指南 / PATTERNS</span><h1>{{scene.title}}</h1><p>{{scene.description}}</p><div class="related-links"><RouterLink v-for="id in scene.components" :key="id" :to="'/'+id">{{components.find(c=>c.path==='/'+id)?.name}}</RouterLink></div><h2>交互示例</h2><DemoBlock v-if="code" :key="scene.id" :code="code" desc="数据仅用于本地演示，不会向服务端提交。复制代码后在已引入 Zt UI 样式的 Vue 项目中使用。"><component :is="example.component" /></DemoBlock><h2>实现要点</h2><ul class="doc-points"><li v-for="point in scene.points" :key="point">{{point}}</li></ul><h2>相关 API</h2><div class="component-grid"><RouterLink v-for="id in scene.components" :key="id" :to="'/api/'+id" class="component-card"><strong>{{components.find(c=>c.path==='/'+id)?.name}} <span>↗</span></strong><p>{{components.find(c=>c.path==='/'+id)?.description}}</p></RouterLink></div></article><article v-else class="doc-section"><span class="doc-eyebrow">PATTERNS</span><h1>按场景构建</h1><p>从业务任务出发，了解组件如何组合，直接尝试并复制完整示例。</p><div class="scene-grid"><RouterLink v-for="s in scenarios" :key="s.id" :to="'/scenarios/'+s.id" class="scene-card"><span class="scene-card__label">{{s.components.length}} 个关联组件</span><h3>{{s.title}} <span>↗</span></h3><p>{{s.description}}</p><small>交互示例 · 实现要点 · 相关 API</small></RouterLink></div></article></template>
