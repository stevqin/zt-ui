<script setup lang="ts">
import { useZtSize } from '../config-provider/context';
import type { ZtBlockquoteProps, ZtBlockquoteSlots } from './types';
import './blockquote.scss';

defineOptions({ name: 'ZtBlockquote' });
const props = withDefaults(defineProps<ZtBlockquoteProps>(), { status: 'primary' });
defineSlots<ZtBlockquoteSlots>();
const size = useZtSize(props);
</script>

<template>
  <blockquote :cite="cite" :class="['zt-blockquote', `zt-blockquote--status-${status}`, `zt-blockquote--${size}`]">
    <div v-if="title || $slots.title" class="zt-blockquote__title"><slot name="title">{{ title }}</slot></div>
    <div class="zt-blockquote__body"><slot /></div>
    <footer v-if="$slots.footer" class="zt-blockquote__footer"><slot name="footer" /></footer>
  </blockquote>
</template>
