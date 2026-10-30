<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ZtConfigProviderProps } from './types'
import { configProviderKey, useZtConfig } from './context'
import { useFocusRing } from './focus'
import { configStyle } from './theme'
import './config-provider.scss'
defineOptions({ name: 'ZtConfigProvider' })
const props = defineProps<ZtConfigProviderProps>()
const parent = useZtConfig()
const focusRing = computed(() => props.focusRing ?? parent.focusRing?.value ?? 'none')
const focusWidth = useFocusRing(focusRing)
const size = computed(() => props.size ?? parent.size.value)
const theme = computed(() => props.theme ?? parent.theme.value)
const borderRadius = computed(() => typeof props.borderRadius === 'number' && Number.isFinite(props.borderRadius) && props.borderRadius >= 0 ? props.borderRadius : parent.borderRadius.value)
const style = computed(() => ({ ...configStyle(theme.value, borderRadius.value), '--zt-focus-ring-width': focusWidth.value }))
provide(configProviderKey, { size, theme, borderRadius, focusRing, style })
</script>
<template><div class="zt-config-provider" :data-zt-theme="theme" :style="style"><slot /></div></template>
