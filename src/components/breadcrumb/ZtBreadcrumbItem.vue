<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import ZtLink from '../link/ZtLink.vue'
import { breadcrumbKey } from './context'
import type { ZtBreadcrumbItemProps } from './types'
defineOptions({ name: 'ZtBreadcrumbItem' })
const props = withDefaults(defineProps<ZtBreadcrumbItemProps>(), { disabled: false })
const context = inject(breadcrumbKey)!
const root = ref<HTMLElement>()
const unregister = context.register()
onBeforeUnmount(unregister)

const isCurrent = computed(() => {
  void context.count.value
  const el = root.value
  const parent = el?.parentElement
  if (!el || !parent) return false
  const siblings = [...parent.children].filter(node => node.classList.contains('zt-breadcrumb__item'))
  return siblings[siblings.length - 1] === el
})
const showSeparator = computed(() => {
  void context.count.value
  const el = root.value
  if (!el?.parentElement) return false
  const siblings = [...el.parentElement.children].filter(node => node.classList.contains('zt-breadcrumb__item'))
  return siblings[0] !== el
})
</script>
<template>
  <li ref="root" class="zt-breadcrumb__item">
    <span v-if="showSeparator" class="zt-breadcrumb__separator" aria-hidden="true"><slot name="separator">{{ context.separator.value }}</slot></span>
    <span v-if="isCurrent" class="zt-breadcrumb__current" aria-current="page"><slot /></span>
    <ZtLink v-else :href="href" :to="to" :target="target" :disabled="disabled"><slot /></ZtLink>
  </li>
</template>
