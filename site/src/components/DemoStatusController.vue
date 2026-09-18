<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
} from 'vue';
import { injectDemoStatus } from '../docs/demo-status';
import type { DemoVisualStatus } from '../docs/catalog';
const context = injectDemoStatus();
const status = computed(() => context?.status.value ?? 'primary');
const enabled = computed(() => context?.metadata.value.controller ?? false);
const choices = computed(() => context?.metadata.value.supported ?? []);
const mobile = ref(typeof window !== 'undefined' && window.innerWidth <= 1280);
const opened = ref(false);
const root = ref<HTMLElement>();
const pill = ref<HTMLButtonElement>();
const panelId = `demo-status-${useId()}`;
async function resize() {
  const nextMobile = window.innerWidth <= 1280;
  if (nextMobile === mobile.value) return;
  const hadFocus = root.value?.contains(document.activeElement);
  mobile.value = nextMobile;
  opened.value = false;
  if (hadFocus) {
    await nextTick();
    if (nextMobile) pill.value?.focus();
    else focusChoice();
  }
}
function focusChoice() {
  root.value
    ?.querySelector<HTMLButtonElement>(`[data-status="${status.value}"]`)
    ?.focus();
}
async function open() {
  opened.value = true;
  await nextTick();
  focusChoice();
}
async function close() {
  opened.value = false;
  await nextTick();
  pill.value?.focus();
}
function choose(value: DemoVisualStatus) {
  context?.select(value);
}
async function navigate(event: KeyboardEvent, value: DemoVisualStatus) {
  const offsets: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: 3,
    ArrowUp: -3,
  };
  const index = choices.value.indexOf(value);
  let next: number;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = choices.value.length - 1;
  else if (event.key in offsets)
    next =
      (index + offsets[event.key]! + choices.value.length) %
      choices.value.length;
  else return;
  event.preventDefault();
  choose(choices.value[next]!);
  await nextTick();
  focusChoice();
}
function panelKeydown(event: KeyboardEvent) {
  if (!mobile.value || !opened.value) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    void close();
  }
  if (event.key === 'Tab') {
    const focusable = [
      ...root.value!.querySelectorAll<HTMLButtonElement>(
        '.demo-status__panel button:not([tabindex="-1"])',
      ),
    ];
    const index = focusable.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    event.preventDefault();
    focusable[
      (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length
    ]?.focus();
  }
}
// The modal owns document keyboard/focus until it closes. Capture runs before
// DocSearch's window shortcut and also guards direct programmatic focus calls.
function modalKeydown(event: KeyboardEvent) {
  if (!enabled.value || !mobile.value || !opened.value) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    event.stopImmediatePropagation();
  } else if (event.key === 'Tab' || event.key === 'Escape') {
    event.stopImmediatePropagation();
    panelKeydown(event);
  }
}
function containModalFocus(event: FocusEvent) {
  if (!enabled.value || !mobile.value || !opened.value) return;
  const panel = root.value?.querySelector('.demo-status__panel');
  if (panel && event.target instanceof Node && !panel.contains(event.target)) {
    event.stopImmediatePropagation();
    focusChoice();
  }
}
onMounted(() => {
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', modalKeydown, true);
  document.addEventListener('focus', containModalFocus, true);
  document.addEventListener('focusin', containModalFocus, true);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  window.removeEventListener('keydown', modalKeydown, true);
  document.removeEventListener('focus', containModalFocus, true);
  document.removeEventListener('focusin', containModalFocus, true);
});
</script>
<template>
  <div
    v-if="enabled"
    ref="root"
    class="demo-status"
    :class="{ 'is-mobile': mobile, 'is-open': opened }"
  >
    <button
      v-if="mobile"
      ref="pill"
      type="button"
      class="demo-status__pill"
      :aria-expanded="opened"
      :aria-controls="panelId"
      aria-haspopup="dialog"
      @click="open"
    >
      <span
        class="demo-status__dot"
        :class="`is-${status}`"
        aria-hidden="true"
      />状态 · {{ status }}
    </button>
    <div
      v-if="mobile && opened"
      class="demo-status__backdrop"
      @click.self="close"
    />
    <section
      v-if="!mobile || opened"
      :id="panelId"
      class="demo-status__panel"
      :role="mobile ? 'dialog' : 'region'"
      :aria-modal="mobile ? true : undefined"
      aria-label="示例视觉状态"
    >
      <div class="demo-status__heading">
        <strong>示例状态</strong
        ><button
          v-if="mobile"
          type="button"
          aria-label="关闭状态面板"
          @click="close"
        >
          ×
        </button>
      </div>
      <div class="demo-status__grid" role="radiogroup" aria-label="视觉状态">
        <button
          v-for="choice in choices"
          :key="choice"
          type="button"
          role="radio"
          class="demo-status__choice"
          :class="[{ 'is-selected': status === choice }, `is-${choice}`]"
          :data-status="choice"
          :aria-checked="status === choice"
          :tabindex="status === choice ? 0 : -1"
          @click="choose(choice)"
          @keydown="navigate($event, choice)"
        >
          <span class="demo-status__swatch" aria-hidden="true"
            ><span v-if="status === choice" class="demo-status__check"
              >✓</span
            ></span
          >
          <span class="demo-status__label">{{ choice }}</span>
        </button>
      </div>
      <p class="demo-status__hint">同步本页示例</p>
    </section>
  </div>
</template>
