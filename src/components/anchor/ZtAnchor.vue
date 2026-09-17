<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import {
  useScrollTarget,
  scrollTop,
  viewport,
  findTarget,
  motion,
} from './scroll';
import type { ZtAnchorProps, ZtAnchorLink, ZtAnchorEmits } from './types';
const props = withDefaults(defineProps<ZtAnchorProps>(), {
  links: () => [],
  offset: 0,
  smooth: true,
  label: '章节导航',
});
const emit = defineEmits<ZtAnchorEmits>(),
  active = ref('');
function flatten(
  links: ZtAnchorLink[],
  depth = 0,
): Array<ZtAnchorLink & { depth: number }> {
  return links.flatMap((link) => [
    { ...link, depth },
    ...flatten(link.children ?? [], depth + 1),
  ]);
}
const links = computed(() => flatten(props.links));
function setActive(href: string) {
  if (active.value !== href) {
    active.value = href;
    emit('change', href);
  }
}
const binding = useScrollTarget(
  () => props.container,
  (target) => {
    const top = viewport(target).top + props.offset + 1;
    let current = '';
    for (const link of links.value) {
      const el = findTarget(link.href);
      if (el && el.getBoundingClientRect().top <= top) current = link.href;
    }
    setActive(current);
  },
);
function select(link: ZtAnchorLink) {
  const el = findTarget(link.href);
  if (!el) return;
  const target = binding.getTarget();
  target.scrollTo({
    top: Math.max(
      0,
      scrollTop(target) +
        el.getBoundingClientRect().top -
        viewport(target).top -
        props.offset,
    ),
    behavior: props.smooth ? motion() : 'auto',
  });
  setActive(link.href);
  emit('select', link.href);
}
watch(
  () => [props.links, props.offset],
  () => void nextTick(binding.update),
  { deep: true },
);
</script>
<template>
  <nav class="zt-anchor" :aria-label="label">
    <ul>
      <li v-for="link in links" :key="link.href">
        <a
          :href="link.href"
          :aria-current="active === link.href ? 'location' : undefined"
          :class="{ 'is-active': active === link.href }"
          :style="{ paddingInlineStart: 12 + link.depth * 16 + 'px' }"
          @click.prevent="select(link)"
          ><slot name="link" :link="link" :active="active === link.href">{{
            link.title
          }}</slot></a
        >
      </li>
    </ul>
  </nav>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-anchor {
  @include glass.tokens;
  font: var(--glass-size-default) var(--glass-font);
  color: var(--glass-default-ink);
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border-inline-start: 2px solid var(--glass-line);
  }
  a {
    display: block;
    padding: 8px 12px;
    color: inherit;
    text-decoration: none;
    overflow-wrap: anywhere;
    border-inline-start: 2px solid transparent;
    margin-inline-start: -2px;
    &:hover,
    &.is-active {
      color: var(--glass-accent);
    }
    &.is-active {
      border-inline-start-color: var(--glass-accent);
      background: var(--glass-accent-soft);
    }
    &:focus-visible {
      outline: 2px solid var(--glass-accent);
      outline-offset: -2px;
    }
  }
}
</style>
