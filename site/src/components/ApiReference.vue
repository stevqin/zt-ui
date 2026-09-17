<script setup lang="ts">
import { computed } from 'vue'
import { api } from '../docs/reference'
import ApiTable from './ApiTable.vue'
const props=defineProps<{componentId:string}>()
const document=computed(()=>api[props.componentId])
const sections=[
 {key:'props' as const,title:'Attributes',label:'属性'},
 {key:'events' as const,title:'Events',label:'事件'},
 {key:'slots' as const,title:'Slots',label:'插槽'},
 {key:'exposes' as const,title:'Exposes',label:'公开方法与属性'},
]
</script>
<template>
 <section v-if="document" id="api" class="api-reference">
  <div class="api-reference__intro"><span>PUBLIC INTERFACE</span><h2>API</h2><p>名称、默认行为与类型均由组件源码和经过校验的文档元数据生成。</p></div>
  <section v-for="owner in document.components" :key="owner.name" class="api-owner">
   <h3>{{owner.name}}</h3>
   <template v-for="section in sections" :key="section.key">
    <section v-if="owner[section.key].length" class="api-section" :data-api-section="section.key">
     <div class="api-section__title"><h4>{{section.title}}</h4><span>{{section.label}}</span></div>
     <ApiTable :rows="owner[section.key]" :owner="owner.name" :section="section.key" :show-default="section.key==='props'" />
    </section>
   </template>
  </section>
  <section v-if="document.types.length" id="types" class="api-types" data-api-section="types">
   <div class="api-section__title"><h3>Types</h3><span>类型声明</span></div>
   <details v-for="type in document.types" :key="type.name" class="type-definition"><summary><code>{{type.name}}</code><small>{{type.public?'公共导出':'依赖类型'}}</small></summary><pre><code>{{type.code}}</code></pre></details>
  </section>
 </section>
</template>
