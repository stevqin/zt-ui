<script setup lang="ts">
import type { ZtSkeletonItemProps } from './types';
withDefaults(defineProps<ZtSkeletonItemProps>(), {
  shape: 'text',
  animated: true,
});
const unit = (value: number | string | undefined) =>
  typeof value === 'number' ? value + 'px' : value;
</script>
<template>
  <span
    aria-hidden="true"
    :class="[
      'zt-skeleton-item',
      `zt-skeleton-item--${shape}`,
      { 'is-animated': animated },
    ]"
    :style="{ width: unit(width), height: unit(height) }"
    ><slot
  /></span>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-skeleton-item {
  @include glass.tokens;
  display: block;
  width: 100%;
  height: 1em;
  min-height: 1em;
  border-radius: glass.radius(4px);
  background: var(--glass-info-soft);
  &--circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  &--rect,
  &--image {
    height: 100px;
  }
  &.is-animated {
    background: linear-gradient(
      90deg,
      var(--glass-info-soft) 25%,
      var(--glass-line) 50%,
      var(--glass-info-soft) 75%
    );
    background-size: 200% 100%;
    animation: zt-shimmer 1.6s ease infinite;
  }
}
@keyframes zt-shimmer {
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .zt-skeleton-item.is-animated {
    animation: none;
  }
}
</style>
