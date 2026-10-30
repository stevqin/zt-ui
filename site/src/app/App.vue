<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRoute, RouterLink, RouterView } from "vue-router";
import { ZtConfigProvider } from "@ztechjs/zt-ui";
import { groups, pages, findPage } from "../content/components";
import { guides } from "../content/guides";
import AppearanceControls from "../components/AppearanceControls.vue";
import DocSearch from "../components/DocSearch.vue";
import DocDialog from "../components/DocDialog.vue";
import { providerConfig, resolvedTheme } from "./appearance";
import pkg from "../../../package.json";
const route = useRoute(),
  searchOpen = ref(false),
  menuOpen = ref(false),
  active = ref(""),
  nav = ref<HTMLElement>();
const current = computed(() => findPage(String(route.params.id ?? "")));
const isGuide = computed(() => route.path.startsWith("/guide"));
const guide = computed(() =>
  guides.find((g) => route.path === `/guide/${g.id}`),
);
const outline = computed(() =>
  current.value
    ? [
        ...current.value.examples.map((e) => ({
          id: `example-${e.id}`,
          title: e.title,
        })),
        { id: "api", title: "API" },
      ]
    : (guide.value?.sections.map((s) => ({ id: s.id, title: s.title })) ?? []),
);
function showPanel(kind: "search" | "navigation") {
  searchOpen.value = kind === "search";
  menuOpen.value = kind === "navigation";
}
function key(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (searchOpen.value) searchOpen.value = false;
    else showPanel("search");
  }
}
let frame = 0;
function updateOutline() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    active.value =
      outline.value
        .filter(
          (item) =>
            (document.getElementById(item.id)?.getBoundingClientRect().top ??
              Infinity) <= 130,
        )
        .at(-1)?.id ??
      outline.value[0]?.id ??
      "";
  });
}
watch(
  () => route.fullPath,
  async () => {
    menuOpen.value = false;
    searchOpen.value = false;
    document.title = `${current.value ? current.value.name + " " + current.value.title : (guide.value?.title ?? (route.path === "/" ? "Vue 3 组件库" : "组件文档"))} · Zt UI`;
    await nextTick();
    nav.value
      ?.querySelector(".router-link-exact-active")
      ?.scrollIntoView({ block: "nearest" });
    updateOutline();
  },
);
onMounted(() => {
  document.addEventListener("keydown", key);
  window.addEventListener("scroll", updateOutline, { passive: true });
  updateOutline();
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", key);
  window.removeEventListener("scroll", updateOutline);
  cancelAnimationFrame(frame);
});
</script>
<template>
  <ZtConfigProvider
    v-bind="providerConfig"
    class="docs-site"
    :data-doc-theme="resolvedTheme"
  >
    <a class="skip-link" href="#main-content">跳到正文</a>
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="Zt UI 首页"
        ><span class="brand-mark">zt<span>·</span></span
        ><strong>Zt UI</strong></RouterLink
      >
      <nav class="top-nav" aria-label="主导航">
        <RouterLink to="/guide/installation" :class="{ selected: isGuide }"
          >指南</RouterLink
        ><RouterLink
          to="/components"
          :class="{
            selected:
              route.path.startsWith('/components') &&
              current?.group !== 'extensions',
          }"
          >组件</RouterLink
        ><RouterLink
          to="/extensions"
          :class="{
            selected:
              route.path === '/extensions' || current?.group === 'extensions',
          }"
          >扩展</RouterLink
        >
      </nav>
      <button class="search-trigger" @click="showPanel('search')">
        <span>⌕</span> 搜索文档 <kbd>⌘ K</kbd>
      </button>
      <div class="header-tools">
        <AppearanceControls /><span class="version">v{{ pkg.version }}</span
        ><a
          class="github-link"
          href="https://github.com/stevqin/zt-ui"
          target="_blank"
          rel="noreferrer"
          >GitHub ↗</a
        ><button
          class="mobile-menu icon-button"
          @click="showPanel('navigation')"
          aria-label="打开文档导航"
        >
          ☰
        </button>
      </div>
    </header>
    <div
      class="documentation-layout"
      :class="{ 'is-home': route.path === '/' }"
    >
      <aside
        v-if="route.path !== '/'"
        ref="nav"
        class="sidebar"
        aria-label="文档导航"
      >
        <template v-if="isGuide"
          ><p class="nav-group">开发指南</p>
          <RouterLink v-for="g in guides" :key="g.id" :to="`/guide/${g.id}`">{{
            g.title
          }}</RouterLink
          ><RouterLink to="/guide/changelog">更新日志</RouterLink></template
        ><template v-else
          ><RouterLink class="overview-link" to="/components"
            >组件总览</RouterLink
          >
          <section
            v-for="group in groups"
            :key="group.id"
            class="sidebar-group"
          >
            <p class="nav-group">{{ group.title }}</p>
            <RouterLink
              v-for="page in pages.filter((p) => p.group === group.id)"
              :key="page.id"
              :to="`/components/${page.id}`"
              :title="`${page.name} ${page.title}`"
              class="component-nav-item"
              ><span>{{ page.name }}</span
              ><small>{{ page.title }}</small></RouterLink
            >
          </section></template
        >
      </aside>
      <main id="main-content" tabindex="-1"><RouterView /></main>
      <aside v-if="outline.length" class="page-outline" aria-label="本页目录">
        <strong>本页内容</strong
        ><a
          v-for="item in outline"
          :key="item.id"
          :href="`#${route.path}#${item.id}`"
          :class="{ active: active === item.id }"
          @click.prevent="
            $router.push({ path: route.path, hash: `#${item.id}` })
          "
          >{{ item.title }}</a
        >
      </aside>
    </div>
    <DocSearch :open="searchOpen" @close="searchOpen = false" />
    <DocDialog :open="menuOpen" title="文档导航" @close="menuOpen = false"
      ><nav class="mobile-navigation">
        <RouterLink to="/guide/installation" @click="menuOpen = false"
          >开发指南</RouterLink
        ><RouterLink to="/components" @click="menuOpen = false"
          >组件总览</RouterLink
        ><template v-for="group in groups" :key="group.id"
          ><strong>{{ group.title }}</strong
          ><RouterLink
            v-for="page in pages.filter((p) => p.group === group.id)"
            :key="page.id"
            :to="`/components/${page.id}`"
            @click="menuOpen = false"
            :title="`${page.name} ${page.title}`"
            ><span>{{ page.name }}</span
            ><small>{{ page.title }}</small></RouterLink
          ></template
        >
      </nav></DocDialog
    >
  </ZtConfigProvider>
</template>
