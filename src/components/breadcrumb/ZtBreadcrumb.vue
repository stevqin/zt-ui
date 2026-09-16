<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useZtSize } from '../config-provider/context'
import { breadcrumbKey } from './context'
import type { ZtBreadcrumbProps } from './types'
import './breadcrumb.scss'
defineOptions({ name: 'ZtBreadcrumb' })
const props = withDefaults(defineProps<ZtBreadcrumbProps>(), { separator: '/', ariaLabel: '面包屑' })
const size = useZtSize(props), count = ref(0), separator = computed(() => props.separator)
provide(breadcrumbKey, { separator, count, register: () => count.value++ })
</script>
<template><nav class="zt-breadcrumb" :class="`zt-breadcrumb--${size}`" :aria-label="ariaLabel"><ol><slot /></ol></nav></template>
