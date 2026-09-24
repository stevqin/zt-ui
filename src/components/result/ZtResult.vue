<script setup lang="ts">
import { computed } from 'vue'
import ZtIcon from '../icon/ZtIcon.vue'
import type { ZtIconName } from '../icon/types'
import type { ZtResultProps, ZtResultStatus } from './types'
import './result.scss'
defineOptions({ name: 'ZtResult' })
const props = withDefaults(defineProps<ZtResultProps>(), { status: 'info' })
const icons: Record<ZtResultStatus, ZtIconName> = { success:'check', warning:'warning', danger:'close', info:'info', '404':'search', '403':'error', '500':'warning' }
const iconName = computed(() => props.icon ?? icons[props.status])
</script>
<template><section class="zt-result" :class="`zt-result--${status}`" :role="status==='danger'||status==='404'||status==='403'||status==='500' ? 'alert' : 'status'"><div class="zt-result__icon"><slot name="icon"><ZtIcon :name="iconName" /></slot></div><h2 v-if="title||$slots.title"><slot name="title">{{title}}</slot></h2><p v-if="subTitle||$slots['sub-title']"><slot name="sub-title">{{subTitle}}</slot></p><div v-if="$slots.extra" class="zt-result__extra"><slot name="extra" /></div></section></template>
