<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
  onMounted,
  useId,
} from 'vue';
import { useZtConfig } from '../config-provider/context';
import { useOverlay } from '../overlay/useOverlay';
import { placePopover } from '../popover/position';
import { findTarget, motion } from '../anchor/scroll';
import type { ZtTourProps, ZtTourEmits } from './types';
const props = withDefaults(defineProps<ZtTourProps>(), {
  modelValue: false,
  current: 0,
  steps: () => [],
  mask: true,
  scrollIntoView: true,
  width: 320,
  zIndex: 1000,
});
const emit = defineEmits<ZtTourEmits>(),
  config = useZtConfig(),
  titleId = useId();
const model = computed({
  get: () => props.modelValue && props.steps.length > 0,
  set: (value) => emit('update:modelValue', value),
});
const overlay = useOverlay({
  modelValue: model,
  props: {
    autoFocus: true,
    focusTrap: true,
    lockScroll: false,
    escClosable: true,
    zIndex: props.zIndex,
    destroyOnClose: true,
  },
  emit: (event, ...args) => {
    if (event === 'close') emit('close', String(args[0]));
  },
});
const panel = overlay.panel,
  index = computed(() =>
    Math.min(
      props.steps.length - 1,
      Math.max(
        0,
        Number.isFinite(props.current) ? Math.floor(props.current) : 0,
      ),
    ),
  ),
  step = computed(() => props.steps[index.value]);
const target = ref<HTMLElement | null>(null),
  rect = ref<DOMRect | null>(null),
  position = ref({ top: 0, left: 0 });
let mutation: MutationObserver | undefined,
  resize: ResizeObserver | undefined,
  observed: HTMLElement | null = null;
function update() {
  if (!model.value) return;
  let element: HTMLElement | null | undefined;
  try {
    const value = step.value?.target;
    element =
      typeof value === 'function'
        ? value()
        : typeof value === 'string'
          ? findTarget(value)
          : value;
  } catch {
    element = null;
  }
  target.value = element?.isConnected ? element : null;
  if (observed !== target.value) {
    resize?.disconnect();
    observed = target.value;
    if (observed) resize?.observe(observed);
  }
  rect.value = target.value?.getBoundingClientRect() ?? null;
  if (rect.value && panel.value) {
    const popup = panel.value.getBoundingClientRect();
    position.value = placePopover(
      rect.value,
      { width: popup.width || props.width, height: popup.height || 180 },
      { width: window.innerWidth, height: window.innerHeight, padding: 12 },
      step.value?.placement ?? 'bottom',
      12,
    );
  }
}
async function locate() {
  await nextTick();
  update();
  if (props.scrollIntoView)
    target.value?.scrollIntoView?.({
      block: 'center',
      inline: 'nearest',
      behavior: motion(),
    });
  await nextTick();
  update();
}
watch(
  () => [model.value, props.current, props.steps],
  () => {
    if (model.value) void locate();
    else void nextTick(overlay.afterLeave);
  },
  { deep: true, immediate: true },
);
onMounted(() => {
  if (typeof MutationObserver !== 'undefined') {
    let scheduled = false
    mutation = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        update()
      })
    })
    mutation.observe(document.body, { childList: true, subtree: true })
  }
  if (typeof ResizeObserver !== 'undefined') {
    resize = new ResizeObserver(update);
    if (target.value) {
      resize.observe(target.value);
      observed = target.value;
    }
  }
  window.addEventListener('scroll', update, true);
  window.addEventListener('resize', update);
});
onBeforeUnmount(() => {
  mutation?.disconnect();
  resize?.disconnect();
  window.removeEventListener('scroll', update, true);
  window.removeEventListener('resize', update);
});
function previous() {
  if (index.value > 0) {
    emit('update:current', index.value - 1);
    emit('change', index.value - 1);
  }
}
async function next() {
  if (index.value < props.steps.length - 1) {
    emit('update:current', index.value + 1);
    emit('change', index.value + 1);
  } else if (await overlay.requestClose('confirm')) emit('finish');
}
const maskClip = computed(() => {
  if (!rect.value || typeof window === 'undefined') return undefined
  const w = window.innerWidth
  const h = window.innerHeight
  const pad = 4
  const x = Math.max(0, rect.value.left - pad)
  const y = Math.max(0, rect.value.top - pad)
  const rw = rect.value.width + pad * 2
  const rh = rect.value.height + pad * 2
  // evenodd hole lets pointer events reach the highlighted target.
  return `path(evenodd, "M0 0H${w}V${h}H0Z M${x} ${y}H${x + rw}V${y + rh}H${x}Z")`
})
const panelStyle = computed(() => ({
  ...config.style.value,
  width: `min(${props.width}px, calc(100vw - 24px))`,
  ...(rect.value
    ? { top: position.value.top + 'px', left: position.value.left + 'px' }
    : { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }),
}));
</script>
<template>
  <Teleport to="body"
    ><div
      v-if="model && step"
      class="zt-tour"
      :style="{ zIndex: overlay.layer.value }"
    >
      <div
        v-if="mask"
        class="zt-tour__mask"
        :class="{ 'is-full': !rect }"
        :style="maskClip ? { clipPath: maskClip } : undefined"
        aria-hidden="true"
      >
        <div
          v-if="rect"
          class="zt-tour__spotlight"
          :style="{
            top: rect.top - 4 + 'px',
            left: rect.left - 4 + 'px',
            width: rect.width + 8 + 'px',
            height: rect.height + 8 + 'px',
          }"
        />
      </div>
      <section
        ref="panel"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        :class="['zt-tour__panel', { 'is-centered': !rect }]"
        :style="panelStyle"
      >
        <button
          type="button"
          class="zt-tour__close"
          aria-label="关闭引导"
          @click="overlay.requestClose('close')"
        >
          ×
        </button>
        <h2 :id="titleId">{{ step.title }}</h2>
        <div class="zt-tour__content">
          <slot :step="step" :index="index">{{ step.description }}</slot>
        </div>
        <footer>
          <span>{{ index + 1 }} / {{ steps.length }}</span
          ><button v-if="index > 0" type="button" @click="previous">
            上一步</button
          ><button type="button" data-tour-next @click="next">
            {{ index === steps.length - 1 ? '完成' : '下一步' }}
          </button>
        </footer>
      </section>
    </div></Teleport
  >
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-tour {
  position: fixed;
  inset: 0;
  pointer-events: none;
  &__mask {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: auto;
    &.is-full {
      background: #0007;
    }
  }
  &__spotlight {
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 0 0 9999px #0007;
    border: 2px solid #fff;
    box-sizing: border-box;
    pointer-events: none;
  }
  &__panel {
    @include glass.tokens;
    position: fixed;
    box-sizing: border-box;
    max-height: calc(100vh - 24px);
    overflow: auto;
    pointer-events: auto;
    background: var(--glass-default-soft);
    border: 1px solid var(--glass-line);
    border-radius: glass.radius(11px);
    box-shadow: var(--glass-shadow);
    padding: 20px;
    color: var(--glass-default-ink);
    font: var(--glass-size-default) var(--glass-font);
    h2 {
      font-size: 1.25em;
      margin: 0 24px 12px 0;
    }
    footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
      span {
        margin-right: auto;
      }
    }
    button {
      border: 1px solid var(--glass-line);
      background: var(--glass-info-soft);
      color: inherit;
      border-radius: glass.radius(6px);
      padding: 5px 10px;
      cursor: pointer;
      &:focus-visible {
        outline: 2px solid var(--glass-accent);
      }
    }
  }
  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  &__content {
    line-height: 1.6;
  }
}
</style>
