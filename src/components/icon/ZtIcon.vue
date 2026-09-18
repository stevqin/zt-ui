<script setup lang="ts">
import { computed, toRaw, useSlots, watchEffect } from 'vue'
import { useZtConfig } from '../config-provider/context'
import { iconComponents, warnUnknownIcon } from './icons'
import type { ZtIconProps } from './types'
import './icon.scss'

defineOptions({name:'ZtIcon',inheritAttrs:false})
const props=withDefaults(defineProps<ZtIconProps>(),{status:'default',spin:false,strokeWidth:2,label:''})
const slots=useSlots()
const config=useZtConfig()
const presetSize=computed(()=>typeof props.size==='string'&&['mini','small','default','medium','large'].includes(props.size)?props.size:typeof props.size==='undefined'?config.size.value:undefined)
const cssSize=computed(()=>typeof props.size==='number'&&Number.isFinite(props.size)&&props.size>0?`${props.size}px`:typeof props.size==='string'&&!presetSize.value&&props.size.trim()?props.size:undefined)
const rotation=computed(()=>Number.isFinite(props.rotate)?`${props.rotate}deg`:'0deg')
const resolved=computed(()=>props.component?toRaw(props.component):(props.name?iconComponents[props.name]:undefined))
watchEffect(()=>{if(import.meta.env.DEV&&props.name&&!iconComponents[props.name]&&!slots.default&&!props.component)warnUnknownIcon(props.name)})
const classes=computed(()=>['zt-icon-glyph',`zt-icon-glyph--status-${props.status}`,presetSize.value&&`zt-icon-glyph--${presetSize.value}`,{'is-spin':props.spin}])
const style=computed(()=>({'--zt-icon-size':cssSize.value,'--zt-icon-color':props.color,'--zt-icon-rotate':rotation.value}))
</script>
<template><i v-bind="$attrs" :class="classes" :style="style" :role="label?'img':undefined" :aria-label="label||undefined" :aria-hidden="label?undefined:'true'"><slot><component :is="resolved" v-if="resolved" :stroke-width="strokeWidth"/></slot></i></template>
