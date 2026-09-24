<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useZtSize } from '../config-provider/context'
import { breadcrumbKey } from './context'
import type { ZtBreadcrumbProps } from './types'
import './breadcrumb.scss'
defineOptions({ name: 'ZtBreadcrumb' })
const props = withDefaults(defineProps<ZtBreadcrumbProps>(), { separator: '/', ariaLabel: '面包屑' })
const size = useZtSize(props)
const separator = computed(() => props.separator)
const items = ref(new Set<number>())
const count = computed(() => items.value.size)
let nextId = 0
provide(breadcrumbKey, {
  separator,
  count,
  register() {
    const id = nextId++
    items.value.add(id)
    return () => {
      items.value.delete(id)
    }
  },
})
</script>
<template><nav class="zt-breadcrumb" :class="`zt-breadcrumb--${size}`" :aria-label="ariaLabel"><ol><slot /></ol></nav></template>
