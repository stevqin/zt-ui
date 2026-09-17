<script setup lang="ts">
import type { ApiRow } from '../docs/reference'
defineProps<{ rows:ApiRow[]; owner:string; section:string; showDefault?:boolean }>()
const anchor=(owner:string,section:string,name:string)=>`${owner}-${section}-${name}`.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')
</script>
<template>
 <div class="api-table-wrap">
  <table class="api-table">
   <thead><tr><th>名称</th><th>说明</th><th>类型</th><th v-if="showDefault">默认值</th></tr></thead>
   <tbody><tr v-for="row in rows" :id="anchor(owner,section,row.name)" :key="row.name" :data-api-row="row.name">
    <td data-label="名称"><div class="api-name"><a class="api-anchor" :href="'#'+anchor(owner,section,row.name)" :aria-label="'链接到 '+row.name">#</a><code>{{row.templateName||row.name}}</code><small v-if="row.templateName&&row.templateName!==row.name">{{row.name}}</small><span v-if="row.required" class="required">必填</span></div></td>
    <td data-label="说明">{{row.description}}</td>
    <td data-label="类型"><code class="api-type">{{row.type}}</code></td>
    <td v-if="showDefault" data-label="默认值"><code class="api-default">{{row.default}}</code></td>
   </tr></tbody>
  </table>
 </div>
</template>
