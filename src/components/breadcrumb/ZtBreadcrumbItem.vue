<script setup lang="ts">
import { computed, inject } from 'vue'
import ZtLink from '../link/ZtLink.vue'
import { breadcrumbKey } from './context'
import type { ZtBreadcrumbItemProps } from './types'
defineOptions({ name: 'ZtBreadcrumbItem' })
const props = withDefaults(defineProps<ZtBreadcrumbItemProps>(), { disabled: false })
const context = inject(breadcrumbKey)!, index = context.register()
const current = computed(() => index === context.count.value - 1)
</script>
<template><li class="zt-breadcrumb__item"><span v-if="index" class="zt-breadcrumb__separator" aria-hidden="true"><slot name="separator">{{context.separator.value}}</slot></span><span v-if="current" class="zt-breadcrumb__current" aria-current="page"><slot /></span><ZtLink v-else :href="href" :to="to" :target="target" :disabled="disabled"><slot /></ZtLink></li></template>
