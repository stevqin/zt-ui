<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
const props = defineProps<{ open: boolean; title: string; wide?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const panel = ref<HTMLElement>();
let previous: HTMLElement | null = null;
function key(event: KeyboardEvent) {
  if (!props.open) return;
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit("close");
  }
  if (event.key === "Tab") {
    const nodes = [
      ...(panel.value?.querySelectorAll<HTMLElement>(
        'button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',
      ) ?? []),
    ].filter((node) => node.getClientRects().length);
    if (!nodes.length) {
      event.preventDefault();
      panel.value?.focus();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    const current = nodes.indexOf(document.activeElement as HTMLElement);
    nodes[
      (current + (event.shiftKey ? -1 : 1) + nodes.length) % nodes.length
    ]?.focus();
  }
}
watch(
  () => props.open,
  async (open) => {
    if (open) {
      previous = document.activeElement as HTMLElement;
      document.addEventListener("keydown", key, true);
      await nextTick();
      (
        panel.value?.querySelector<HTMLElement>("[autofocus]") ?? panel.value
      )?.focus();
    } else {
      document.removeEventListener("keydown", key, true);
      previous?.focus();
      previous = null;
    }
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  document.removeEventListener("keydown", key, true);
  previous?.focus();
});
</script>
<template>
  <Teleport to="body"
    ><div v-if="open" class="docs-overlay" @pointerdown.self="emit('close')">
      <section
        ref="panel"
        class="docs-dialog"
        :class="{ 'docs-dialog--wide': wide }"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
      >
        <header>
          <h2>{{ title }}</h2>
          <button class="icon-button" aria-label="关闭" @click="emit('close')">
            ×
          </button>
        </header>
        <slot />
      </section></div
  ></Teleport>
</template>
