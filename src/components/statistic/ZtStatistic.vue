<script setup lang="ts">
import { computed } from 'vue';
import { useZtSize } from '../config-provider/context';
import type { ZtStatisticProps } from './types';
const props = withDefaults(defineProps<ZtStatisticProps>(), {
  precision: 0,
  groupSeparator: ',',
  decimalSeparator: '.',
  fallback: '—',
});
const size = useZtSize(props);
const formatted = computed(() => {
  if (typeof props.value !== 'number' || !Number.isFinite(props.value))
    return props.fallback;
  if (props.formatter) return props.formatter(props.value);
  const precision = Number.isFinite(props.precision)
    ? Math.max(0, Math.min(20, Math.floor(props.precision)))
    : 0;
  const [integer, decimal] = props.value.toFixed(precision).split('.');
  return (
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator) +
    (decimal === undefined ? '' : props.decimalSeparator + decimal)
  );
});
</script>
<template>
  <div :class="['zt-statistic', `zt-statistic--${size}`]">
    <div v-if="title || $slots.title" class="zt-statistic__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="zt-statistic__value">
      <span v-if="prefix || $slots.prefix"
        ><slot name="prefix">{{ prefix }}</slot></span
      ><span>{{ formatted }}</span
      ><span v-if="suffix || $slots.suffix"
        ><slot name="suffix">{{ suffix }}</slot></span
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-statistic {
  @include glass.tokens;
  font-family: var(--glass-font);
  color: var(--glass-default-ink);
  font-size: var(--glass-size-default);
  &__title {
    margin-bottom: 6px;
    opacity: 0.7;
  }
  &__value {
    font-size: 1.75em;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  &--mini {
    font-size: var(--glass-size-mini);
  }
  &--small {
    font-size: var(--glass-size-small);
  }
  &--medium {
    font-size: var(--glass-size-medium);
  }
  &--large {
    font-size: var(--glass-size-large);
  }
}
</style>
