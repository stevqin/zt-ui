<script setup lang="ts">
import {
  computed,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { RouterLink, useRoute } from "vue-router";
import { ZtIcon, type ZtIconName } from "@ztechjs/zt-ui";
import { findPage, groups, pages } from "../content/components";
import type { DocGroup } from "../app/types";
const props = withDefaults(defineProps<{ mobile?: boolean }>(), {
  mobile: false,
});
const emit = defineEmits<{ navigate: [] }>();
const route = useRoute();
const root = ref<HTMLElement>();
const pinned = ref<DocGroup>();
let host: HTMLElement | null = null;
let observer: ResizeObserver | undefined;
let frame = 0;
let mounted = false;
function measurePinned() {
  frame = 0;
  if (!host || !root.value || host.clientWidth === 0) {
    pinned.value = undefined;
    return;
  }
  const top =
    host.getBoundingClientRect().top +
    Number.parseFloat(getComputedStyle(host).paddingTop);
  let current: DocGroup | undefined;
  for (const section of root.value.querySelectorAll<HTMLElement>(
    ".sidebar-group",
  )) {
    const heading = section.querySelector<HTMLElement>(".nav-group")!;
    const rect = heading.getBoundingClientRect();
    if (
      section.getBoundingClientRect().top < top - 1 &&
      rect.top <= top + 1 &&
      rect.bottom > top
    )
      current = section.dataset.group as DocGroup;
  }
  pinned.value = current;
}
function scheduleMeasure() {
  if (mounted && !frame) frame = requestAnimationFrame(measurePinned);
}
onMounted(() => {
  mounted = true;
  host = root.value?.closest<HTMLElement>(".sidebar") ?? null;
  if (!host) return;
  host.addEventListener("scroll", scheduleMeasure, { passive: true });
  window.addEventListener("resize", scheduleMeasure);
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(scheduleMeasure);
    observer.observe(host);
    if (root.value) observer.observe(root.value);
  }
  void nextTick(scheduleMeasure);
});
onBeforeUnmount(() => {
  mounted = false;
  host?.removeEventListener("scroll", scheduleMeasure);
  window.removeEventListener("resize", scheduleMeasure);
  observer?.disconnect();
  cancelAnimationFrame(frame);
});
const currentGroup = computed(
  () => findPage(String(route.params.id ?? ""))?.group,
);
const expanded = ref(new Set<DocGroup>(groups.map((group) => group.id)));
const catalogue = groups.map((group) => ({
  ...group,
  pages: pages.filter((page) => page.group === group.id),
}));
const icons: Record<DocGroup, ZtIconName> = {
  foundation: "dashboard",
  layout: "columns",
  form: "edit",
  data: "database",
  navigation: "compass",
  feedback: "bell",
  overlay: "copy",
  media: "image",
  extensions: "package",
};
function toggle(id: DocGroup) {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
}
watch(
  () => route.params.id,
  () => {
    const id = currentGroup.value;
    if (id) expanded.value = new Set([...expanded.value, id]);
  },
);
const prefix = computed(() =>
  props.mobile ? "mobile-catalogue" : "sidebar-group",
);
</script>
<template>
  <div ref="root" class="component-navigation">
    <section
      v-for="group in catalogue"
      :key="group.id"
      class="sidebar-group"
      :data-group="group.id"
      :class="{
        'is-current': currentGroup === group.id,
        'is-expanded': expanded.has(group.id),
        'is-pinned': pinned === group.id,
      }"
      :aria-labelledby="`${prefix}-${group.id}`"
    >
      <h2 class="nav-group">
        <button
          :id="`${prefix}-${group.id}`"
          class="nav-group-toggle"
          type="button"
          :aria-expanded="expanded.has(group.id)"
          :aria-controls="`${prefix}-${group.id}-items`"
          @click="toggle(group.id)"
        >
          <span class="nav-group-symbol"
            ><ZtIcon :name="icons[group.id]" :size="16"
          /></span>
          <span class="nav-group-title">{{ group.title }}</span>
          <span class="nav-group-count" aria-hidden="true">{{
            group.pages.length
          }}</span>
          <ZtIcon class="nav-group-chevron" name="chevron-right" :size="13" />
        </button>
      </h2>
      <div
        v-show="expanded.has(group.id)"
        :id="`${prefix}-${group.id}-items`"
        class="nav-group-items"
      >
        <RouterLink
          v-for="page in group.pages"
          :key="page.id"
          :to="`/components/${page.id}`"
          :title="`${page.name} ${page.title}`"
          class="component-nav-item"
          @click="emit('navigate')"
          ><span>{{ page.name }}</span
          ><small>{{ page.title }}</small></RouterLink
        >
      </div>
    </section>
  </div>
</template>
