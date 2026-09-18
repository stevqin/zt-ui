<script setup lang="ts">
import { computed, toRaw, useSlots, watchEffect } from 'vue'
import { iconComponents, warnUnknownIcon } from './icons'
import type { ZtIconProps } from './types'
import './icon.scss'

defineOptions({name:'ZtIcon',inheritAttrs:false})
const props=withDefaults(defineProps<ZtIconProps>(),{status:'default',spin:false,strokeWidth:2,label:''})
const slots=useSlots()
const cssSize=computed(()=>{
 if(typeof props.size==='number')return Number.isFinite(props.size)&&props.size>0?`${props.size}px`:'1em'
 return typeof props.size==='string'&&props.size.trim()?props.size.trim():'1em'
})
const rotation=computed(()=>Number.isFinite(props.rotate)?`${props.rotate}deg`:'0deg')
const resolved=computed(()=>props.component?toRaw(props.component):(props.name?iconComponents[props.name]:undefined))
watchEffect(()=>{if(import.meta.env.DEV&&props.name&&!iconComponents[props.name]&&!slots.default&&!props.component)warnUnknownIcon(props.name)})
const classes=computed(()=>['zt-icon-glyph',`zt-icon-glyph--status-${props.status}`,{'is-spin':props.spin}])
const style=computed(()=>({'--zt-icon-size':cssSize.value,'--zt-icon-color':props.color,'--zt-icon-rotate':rotation.value}))
</script>
<template><i v-bind="$attrs" :class="classes" :style="style" :role="label?'img':undefined" :aria-label="label||undefined" :aria-hidden="label?undefined:'true'"><slot><component :is="resolved" v-if="resolved" :stroke-width="strokeWidth"/></slot></i></template>
