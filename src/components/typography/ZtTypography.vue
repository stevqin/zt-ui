<script setup lang="ts">
import { computed, ref } from 'vue';
import { useZtSize } from '../config-provider/context';
import ZtText from '../text/ZtText.vue';
import type { ZtTypographyProps, ZtTypographyEmits } from './types';
const props = withDefaults(defineProps<ZtTypographyProps>(), {
  variant: 'text',
  level: 2,
});
const resolvedSize = useZtSize(props);
const titleStyle = computed(() =>
  props.variant === 'title'
    ? {
        '--zt-typography-title-size': `calc(var(--glass-size-${resolvedSize.value}) * ${[2.4, 2, 1.7, 1.4, 1.2, 1][props.level - 1] ?? 2})`,
      }
    : undefined,
);
const emit = defineEmits<ZtTypographyEmits>();
const content = ref<HTMLElement>(),
  feedback = ref(''),
  busy = ref(false);
const tag = computed(() =>
  props.variant === 'title'
    ? `h${Math.min(6, Math.max(1, props.level))}`
    : props.variant === 'paragraph'
      ? 'p'
      : 'span',
);
async function copy() {
  if (busy.value) return;
  const text = props.copyText ?? props.text ?? content.value?.textContent ?? '';
  busy.value = true;
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    feedback.value = '已复制';
    emit('copy', text);
  } catch (error) {
    feedback.value = '复制失败';
    emit('copy-error', error);
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <component
    :is="tag"
    :style="titleStyle"
    :class="['zt-typography', `zt-typography--${variant}`]"
    ><span ref="content"
      ><ZtText
        :size="size"
        :status="status"
        :weight="strong ? 'bold' : weight"
        :truncated="truncated"
        :line-clamp="lineClamp"
        :tag="code ? 'code' : mark ? 'mark' : 'span'"
        :class="{
          'is-italic': italic,
          'is-underline': underline,
          'is-deleted': deleted,
        }"
        ><component :is="strong ? 'strong' : 'span'"
          ><component :is="italic ? 'em' : 'span'"
            ><component :is="underline ? 'u' : 'span'"
              ><component :is="deleted ? 'del' : 'span'"
                ><slot>{{ text }}</slot></component
              ></component
            ></component
          ></component
        ></ZtText
      ></span
    ><button
      v-if="copyable"
      type="button"
      :disabled="busy"
      class="zt-typography__copy"
      aria-label="复制文本"
      @click="copy"
    >
      复制</button
    ><span
      v-if="copyable"
      class="zt-typography__feedback"
      role="status"
      aria-live="polite"
      >{{ feedback }}</span
    ></component
  >
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-typography {
  @include glass.tokens;
  color: var(--glass-default-ink);
  font-family: var(--glass-font);
  margin: 0;
  &--paragraph {
    margin: 0 0 1em;
    line-height: 1.6;
  }
  &--title {
    font-size: var(--zt-typography-title-size);
    margin: 0 0 0.6em;
    font-weight: 600;
    :deep(.zt-text) {
      font-size: inherit;
      font-weight: inherit;
    }
  }
  &__copy {
    margin-left: 8px;
    border: 0;
    border-radius: glass.radius(4px);
    background: var(--glass-info-soft);
    color: var(--glass-accent);
    cursor: pointer;
    padding: 3px 6px;
    font: inherit;
    &:focus-visible {
      outline: 2px solid var(--glass-accent);
      outline-offset: 2px;
    }
  }
  &__feedback {
    font-size: 12px;
    margin-left: 6px;
  }
  .is-italic {
    font-style: italic;
  }
  .is-underline {
    text-decoration: underline;
  }
  .is-deleted {
    text-decoration: line-through;
  }
  .is-underline.is-deleted {
    text-decoration: underline line-through;
  }
}
</style>
