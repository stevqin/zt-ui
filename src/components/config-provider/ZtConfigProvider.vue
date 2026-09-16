<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ZtConfigProviderProps } from './types'
import { configProviderKey, useZtConfig } from './context'
import { configStyle } from './theme'
import './config-provider.scss'
defineOptions({ name: 'ZtConfigProvider' })
const props = defineProps<ZtConfigProviderProps>()
const parent = useZtConfig()
const size = computed(() => props.size ?? parent.size.value)
const theme = computed(() => props.theme ?? parent.theme.value)
const borderRadius = computed(() => typeof props.borderRadius === 'number' && Number.isFinite(props.borderRadius) && props.borderRadius >= 0 ? props.borderRadius : parent.borderRadius.value)
const style = computed(() => configStyle(theme.value, borderRadius.value))
provide(configProviderKey, { size, theme, borderRadius, style })
</script>
<template><div class="zt-config-provider" :data-zt-theme="theme" :style="style"><slot /></div></template>
