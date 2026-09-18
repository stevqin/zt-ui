<script setup lang="ts">
import { ref } from 'vue';
import type { ZtAlertProps } from './types';
import './alert.scss';
defineOptions({ name: 'ZtAlert' });
const props = withDefaults(defineProps<ZtAlertProps>(), {
  title: '',
  description: '',
  status: 'info',
  closable: true,
  showIcon: true,
});
const emit = defineEmits<{ close: [] }>();
const visible = ref(true);
function close() {
  if (visible.value) {
    visible.value = false;
    emit('close');
  }
}
</script>
<template>
  <div
    v-if="visible"
    class="zt-alert"
    :class="[`zt-alert--${status}`]"
    :role="status === 'danger' || status === 'warning' ? 'alert' : 'status'"
  >
    <span v-if="showIcon" class="zt-alert__icon" aria-hidden="true"
      ><slot name="icon">{{
        status === 'success'
          ? '✓'
          : status === 'danger'
            ? '×'
            : status === 'warning'
              ? '!'
              : 'i'
      }}</slot></span
    >
    <div class="zt-alert__body">
      <strong v-if="title || $slots.title"
        ><slot name="title">{{ title }}</slot></strong
      >
      <div v-if="description || $slots.default">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <button v-if="closable" type="button" aria-label="关闭提示" @click="close">
      ×
    </button>
  </div>
</template>
