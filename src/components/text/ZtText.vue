<script setup lang="ts">
import { Comment, Text, computed, useSlots, type VNode } from 'vue'
import { useZtSize } from '../config-provider/context'
import type { ZtTextProps, ZtTextTag } from './types'
import './text.scss'
defineOptions({name:'ZtText',inheritAttrs:false})
const props=withDefaults(defineProps<ZtTextProps>(),{tag:'span',status:'default',weight:'normal',truncated:false})
const slots=useSlots(),size=useZtSize(props)
const tags=new Set<ZtTextTag>(['span','p','div','strong','em','label','code','del','ins','mark'])
const tag=computed(()=>tags.has(props.tag)?props.tag:'span')
const clamp=computed(()=>Number.isFinite(props.lineClamp)&&props.lineClamp!>0?Math.max(1,Math.floor(props.lineClamp!)):undefined)
function nodeText(node:VNode|string|number):string|undefined{if(typeof node==='string'||typeof node==='number')return String(node);if(node.type===Comment)return'';if(node.type===Text)return typeof node.children==='string'?node.children:'';if(Array.isArray(node.children)){const values=node.children.map(child=>nodeText(child as VNode|string|number));return values.some(value=>value===undefined)?undefined:values.join('')}return undefined}
const inferredTitle=computed(()=>{if(props.title!==undefined)return props.title;if(!props.truncated&&!clamp.value)return undefined;const nodes:VNode[]=slots.default?.({})??[];const values:(string|undefined)[]=nodes.map((node:VNode)=>nodeText(node));return values.some((value:string|undefined)=>value===undefined)?undefined:values.join('').trim()||undefined})
const classes=computed(()=>['zt-text',`zt-text--${props.status}`,`zt-text--${size.value}`,{'is-line-clamp':Boolean(clamp.value),'is-truncated':props.truncated&&!clamp.value}])
const style=computed(()=>({'--zt-text-weight':typeof props.weight==='number'?props.weight:({normal:400,medium:500,semibold:600,bold:700}[props.weight]),'--zt-line-clamp':clamp.value}))
</script>
<template><component :is="tag" v-bind="$attrs" :class="classes" :style="style" :title="inferredTitle"><slot/></component></template>
