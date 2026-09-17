<script setup lang="ts">
import { useZtSize } from '../config-provider/context';
import type { ZtPageHeaderProps, ZtPageHeaderEmits } from './types';
const props = withDefaults(defineProps<ZtPageHeaderProps>(), {
  showBack: true,
  backLabel: '返回',
});
const emit = defineEmits<ZtPageHeaderEmits>(),
  size = useZtSize(props);
</script>
<template>
  <header :class="['zt-page-header', `zt-page-header--${size}`]">
    <nav
      v-if="$slots.breadcrumb"
      class="zt-page-header__breadcrumb"
      aria-label="面包屑"
    >
      <slot name="breadcrumb" />
    </nav>
    <div class="zt-page-header__row">
      <button
        v-if="showBack"
        type="button"
        class="zt-page-header__back"
        :aria-label="backLabel"
        @click="emit('back', $event)"
      >
        <slot name="back-icon">←</slot>
      </button>
      <div class="zt-page-header__content">
        <h1>
          <slot name="title">{{ title }}</slot>
        </h1>
        <p v-if="description || $slots.description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div v-if="$slots.extra" class="zt-page-header__extra">
        <slot name="extra" />
      </div>
    </div>
    <slot />
  </header>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-page-header {
  @include glass.tokens;
  color: var(--glass-default-ink);
  font: var(--glass-size-default) var(--glass-font);
  &__breadcrumb {
    margin-bottom: 12px;
  }
  &__row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  &__content {
    flex: 1;
    min-width: 120px;
    h1 {
      font-size: 1.5em;
      margin: 0;
      font-weight: 600;
    }
    p {
      margin: 6px 0 0;
      color: var(--glass-muted);
    }
  }
  &__back {
    border: 1px solid var(--glass-line);
    border-radius: glass.radius(8px);
    background: var(--glass-default-soft);
    color: inherit;
    padding: 6px 10px;
    font: inherit;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid var(--glass-accent);
    }
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
@media (max-width: 480px) {
  .zt-page-header__extra {
    flex-basis: 100%;
  }
}
</style>
