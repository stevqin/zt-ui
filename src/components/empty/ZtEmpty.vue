<script setup lang="ts">
import { useZtSize } from '../config-provider/context';
import type { ZtEmptyProps } from './types';
const props = withDefaults(defineProps<ZtEmptyProps>(), {
  description: '暂无数据',
  imageSize: 80,
  imageAlt: '',
});
const size = useZtSize(props);
</script>
<template>
  <div role="status" :class="['zt-empty', `zt-empty--${size}`]">
    <div
      class="zt-empty__image"
      :style="{ width: imageSize + 'px', height: imageSize + 'px' }"
    >
      <slot name="image"
        ><img v-if="image" :src="image" :alt="imageAlt" /><svg
          v-else
          viewBox="0 0 80 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 25 24 10h32l12 15v29H12V25Z"
            fill="currentColor"
            opacity=".12"
          />
          <path
            d="M12 25h18l4 8h12l4-8h18M24 10h32l12 15v29H12V25L24 10Z"
            stroke="currentColor"
            stroke-width="2"
          /></svg
      ></slot>
    </div>
    <p class="zt-empty__description">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.default" class="zt-empty__actions"><slot /></div>
  </div>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-empty {
  @include glass.tokens;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--glass-default-ink);
  font-family: var(--glass-font);
  font-size: var(--glass-size-default);
  &__image {
    color: var(--glass-info-ink);
    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__description {
    margin: 12px 0;
  }
  &--mini {
    font-size: var(--glass-size-mini);
    padding: 8px;
  }
  &--small {
    font-size: var(--glass-size-small);
    padding: 16px;
  }
  &--medium {
    font-size: var(--glass-size-medium);
    padding: 28px;
  }
  &--large {
    font-size: var(--glass-size-large);
    padding: 32px;
  }
}
</style>
