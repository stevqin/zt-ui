<script setup lang="ts">
import { computed } from 'vue';
import { useZtSize } from '../config-provider/context';
import ZtSkeleton from '../skeleton/ZtSkeleton.vue';
import type { ZtCardProps } from './types';
const props = withDefaults(defineProps<ZtCardProps>(), {
  bordered: true,
  shadow: 'never',
  loading: false,
});
const size = useZtSize(props);
const padding = computed(
  () =>
    props.padding ??
    { mini: 8, small: 12, default: 16, medium: 20, large: 24 }[size.value],
);
</script>
<template>
  <section
    :class="['zt-card', `zt-card--${shadow}`, { 'is-bordered': bordered }]"
    :aria-busy="loading"
    :style="{
      '--zt-card-padding':
        typeof padding === 'number' ? padding + 'px' : padding,
    }"
  >
    <header
      v-if="title || $slots.header || $slots.extra"
      class="zt-card__header"
    >
      <div>
        <slot name="header">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra"><slot name="extra" /></div>
    </header>
    <div class="zt-card__body">
      <ZtSkeleton v-if="loading" /><slot v-else />
    </div>
    <footer v-if="$slots.footer" class="zt-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-card {
  @include glass.tokens;
  box-sizing: border-box;
  background: var(--glass-default-soft);
  color: var(--glass-default-ink);
  border-radius: glass.radius(11px);
  font-family: var(--glass-font);
  min-width: 0;
  &.is-bordered {
    border: 1px solid var(--glass-line);
  }
  &--always,
  &--hover:hover {
    box-shadow: 0 8px 24px #00000014;
  }
  &__header,
  &__body,
  &__footer {
    padding: var(--zt-card-padding);
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid var(--glass-line);
    font-weight: 600;
  }
  &__footer {
    border-top: 1px solid var(--glass-line);
  }
}
</style>
