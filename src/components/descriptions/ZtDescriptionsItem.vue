<script setup lang="ts">
import { computed, inject } from 'vue'
import { descriptionsKey } from './context'
import type { ZtDescriptionsItemProps } from './types'
defineOptions({name:'ZtDescriptionsItem'})
const props=withDefaults(defineProps<ZtDescriptionsItemProps>(),{span:1})
const context=inject(descriptionsKey)
const width=computed(()=>props.labelWidth??context?.labelWidth.value)
const widthStyle=computed(()=>typeof width.value==='number'?`${width.value}px`:width.value)
</script>
<template><div class="zt-descriptions__item" :class="[`is-${context?.direction.value||'horizontal'}`,className]" :style="{gridColumn:`span ${span}`}"><dt :style="{width:widthStyle}"><slot name="label">{{label}}</slot></dt><dd><slot /></dd></div></template>
