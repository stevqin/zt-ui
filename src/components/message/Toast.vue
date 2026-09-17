<script setup lang="ts">
import { computed } from 'vue';
import { useZtConfig, useZtSize } from '../config-provider/context';
import { configStyle } from '../config-provider/theme';
import type { ZtMessageOptions } from './types';
import type { ZtNotificationPosition } from '../notification/types';
import './toast.scss';
const props = defineProps<
  ZtMessageOptions & {
    title?: string;
    position?: ZtNotificationPosition;
    count: number;
    offset: number;
    notification?: boolean;
    close: () => void;
    pause: (reason?: string) => void;
    resume: (reason?: string) => void;
  }
>();
const config = useZtConfig(),
  size = useZtSize(props);
const placement = computed(() => props.position ?? 'top-right');
const style = computed(() => ({
  ...configStyle(config.theme.value, config.borderRadius.value),
  ...config.style.value,
  ...props.style,
  [placement.value.startsWith('bottom') ? 'bottom' : 'top']:
    props.offset + 'px',
  fontSize:
    { mini: 11, small: 12, default: 13, medium: 14, large: 15 }[size.value] +
    'px',
}));
</script>
<template>
  <div
    :class="[
      notification ? 'zt-notification' : 'zt-message',
      `zt-toast--${type ?? 'info'}`,
      notification && `zt-toast--${placement}`,
    ]"
    class="zt-toast"
    :style="style"
    :role="type === 'error' ? 'alert' : 'status'"
    @mouseenter="pause('pointer')"
    @mouseleave="resume('pointer')"
    @focusin="pause('focus')"
    @focusout="resume('focus')"
  >
    <span aria-hidden="true" class="zt-toast__icon">{{
      type === 'success'
        ? '✓'
        : type === 'warning'
          ? '!'
          : type === 'error'
            ? '×'
            : 'i'
    }}</span>
    <div class="zt-toast__body">
      <strong v-if="title">{{ title }}</strong
      ><span v-if="typeof message === 'string'">{{ message }}</span
      ><component v-else :is="message" /><span
        v-if="count > 1"
        class="zt-toast__count"
      >
        ×{{ count }}</span
      >
    </div>
    <button v-if="showClose !== false" aria-label="关闭消息" @click="close">
      ×
    </button>
  </div>
</template>
