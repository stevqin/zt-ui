<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentMeta, PlannedComponent } from '../docs/catalog'
import { groupOf } from '../docs/catalog'
const props=defineProps<{item:ComponentMeta|PlannedComponent;planned?:boolean;to?:string;action?:string}>()
const group=computed(()=>groupOf(props.item.group))
</script>
<template>
 <component :is="planned?'div':'RouterLink'" :to="planned?undefined:(to||(item as ComponentMeta).path)" class="component-tile" :class="{'is-planned':planned}" :style="{'--group-accent':group.accent}">
  <div class="component-tile__meta"><span>{{group.english}}</span><span class="component-status">{{planned?'规划中':'稳定'}}</span></div>
  <strong>{{item.name}} <small>{{item.title}}</small></strong>
  <p>{{item.description}}</p>
  <div class="component-tile__foot"><span>{{planned?(item as PlannedComponent).phase.toUpperCase():(action||'查看示例与 API')}}</span><b aria-hidden="true">{{planned?'·':'→'}}</b></div>
 </component>
</template>
