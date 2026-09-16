<script setup lang="ts">
import { computed } from 'vue'
import { useZtSize } from '../config-provider/context'
import type { ZtProgressProps } from './types'
import './progress.scss'
defineOptions({ name: 'ZtProgress' })
const props = withDefaults(defineProps<ZtProgressProps>(), { percentage:0, status:'primary', showText:true, indeterminate:false, ariaLabel:'进度' })
const size = useZtSize(props)
const percent = computed(() => Number.isFinite(props.percentage) ? Math.max(0,Math.min(100,props.percentage)) : 0)
const text = computed(() => props.indeterminate ? '处理中' : props.format?.(percent.value) ?? `${percent.value}%`)
</script>
<template>
 <div class="zt-progress" :class="[`zt-progress--${size}`,`zt-progress--status-${status}`,{'is-indeterminate':indeterminate}]" role="progressbar" :aria-label="ariaLabel" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="indeterminate ? undefined : percent" :aria-valuetext="text">
  <div class="zt-progress__track"><span class="zt-progress__fill" :style="{width:indeterminate?'35%':`${percent}%`}" /></div>
  <span v-if="showText" class="zt-progress__text"><slot :percentage="percent">{{text}}</slot></span>
 </div>
</template>
