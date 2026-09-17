<script setup lang="ts">
import { computed, onBeforeUnmount, watch, Teleport } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { lockBody, unlockBody } from '../overlay/overlayManager';
import type { ZtLoadingProps } from './types';
import './loading.scss';
defineOptions({ name: 'ZtLoading' });
const props = withDefaults(defineProps<ZtLoadingProps>(), {
  loading: true,
  fullscreen: false,
  lock: false,
  text: '加载中',
});
const config = useZtConfig(),
  size = useZtSize(props),
  id = Symbol('loading');
watch(
  () => props.loading && props.fullscreen && props.lock,
  (value) => {
    if (typeof document === 'undefined') return;
    value ? lockBody(id) : unlockBody(id);
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') unlockBody(id);
});
</script>
<template>
  <div class="zt-loading" :aria-busy="loading">
    <slot /><Teleport to="body" :disabled="!fullscreen"
      ><div
        v-if="loading"
        class="zt-loading__mask"
        :class="[fullscreen && 'is-fullscreen', `zt-loading--${size}`]"
        :style="config.style.value"
        role="status"
        aria-live="polite"
      >
        <slot name="indicator"
          ><span class="zt-loading__spinner" aria-hidden="true" /></slot
        ><span>{{ text }}</span>
      </div></Teleport
    >
  </div>
</template>
