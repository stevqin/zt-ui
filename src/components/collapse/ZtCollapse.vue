<script setup lang="ts">
import { computed, provide } from 'vue'
import { useZtSize } from '../config-provider/context'
import { collapseKey } from './context'
import type { ZtCollapseName, ZtCollapseProps } from './types'
import './collapse.scss'
defineOptions({ name: 'ZtCollapse' })
const props = withDefaults(defineProps<ZtCollapseProps>(), { accordion: false })
const emit = defineEmits<{ 'update:modelValue': [value: ZtCollapseName | ZtCollapseName[]]; change: [value: ZtCollapseName | ZtCollapseName[]] }>()
const size = useZtSize(props)
const active = computed<ZtCollapseName[]>(() => Array.isArray(props.modelValue) ? props.modelValue : props.modelValue === undefined ? [] : [props.modelValue])
function toggle(name: ZtCollapseName) {
  const value: ZtCollapseName | ZtCollapseName[] = props.accordion ? (active.value.includes(name) ? '' : name) : (active.value.includes(name) ? active.value.filter(x => x !== name) : [...active.value, name])
  emit('update:modelValue', value); emit('change', value)
}
provide(collapseKey, { active, toggle })
</script>
<template><div class="zt-collapse" :class="`zt-collapse--${size}`"><slot /></div></template>
