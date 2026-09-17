<script setup lang="ts">
import type { ZtDividerProps } from './types';
withDefaults(defineProps<ZtDividerProps>(), {
  direction: 'horizontal',
  dashed: false,
  contentPosition: 'center',
});
</script>
<template>
  <div
    role="separator"
    :aria-orientation="direction"
    :class="[
      'zt-divider',
      `zt-divider--${direction}`,
      `zt-divider--${contentPosition}`,
      { 'is-dashed': dashed },
    ]"
  >
    <span
      v-if="$slots.default && direction === 'horizontal'"
      class="zt-divider__text"
      ><slot
    /></span>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-divider {
  @include glass.tokens;
  color: var(--glass-default-ink);
  &--horizontal {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 20px 0;
    &:before,
    &:after {
      content: '';
      flex: 1;
      border-top: 1px solid var(--glass-line);
    }
    &.is-dashed:before,
    &.is-dashed:after {
      border-top-style: dashed;
    }
  }
  &--vertical {
    display: inline-block;
    height: 1em;
    margin: 0 10px;
    vertical-align: middle;
    border-left: 1px solid var(--glass-line);
    &.is-dashed {
      border-left-style: dashed;
    }
  }
  &--left:before,
  &--right:after {
    flex: 0 0 8%;
  }
  &__text {
    padding: 0 16px;
    font-size: var(--glass-size-default);
  }
}
</style>
