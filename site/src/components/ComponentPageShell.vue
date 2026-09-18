<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { components, scenarios, type ComponentMeta } from '../docs/catalog';
import ApiReference from './ApiReference.vue';
import DemoStatusController from './DemoStatusController.vue';
import { provideDemoStatus } from '../docs/demo-status';

const props = defineProps<{ component: ComponentMeta }>();
provideDemoStatus(computed(() => props.component.visualStatus));
const related = computed(() => {
  const id = props.component.path.slice(1);
  return [
    ...scenarios
      .filter((scene) => scene.components.includes(id))
      .map((scene) => ({
        path: `/scenarios/${scene.id}`,
        title: scene.title,
      })),
    ...(props.component.page.related ?? []),
    ...components
      .filter(
        (item) =>
          item.group === props.component.group &&
          item.path !== props.component.path,
      )
      .slice(0, 3)
      .map((item) => ({
        path: item.path,
        title: `${item.name} ${item.title}`,
      })),
    { path: '/conventions', title: '通用约定' },
  ];
});
</script>

<template>
  <article
    class="doc-section component-page-shell"
    :data-component="component.path.slice(1)"
  >
    <DemoStatusController />
    <header class="component-page__intro" data-page-section="purpose">
      <h1>{{ component.name }} {{ component.title }}</h1>
      <p>{{ component.page.purpose }}</p>
    </header>
    <section
      id="usage"
      class="component-page__guidance"
      data-page-section="guidance"
      aria-labelledby="usage-title"
    >
      <h2 id="usage-title">使用建议</h2>
      <ul class="doc-points">
        <li v-for="point in component.page.guidance" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>
    <section
      id="examples"
      data-page-section="examples"
      aria-labelledby="examples-title"
    >
      <h2 id="examples-title">交互示例</h2>
      <slot />
    </section>
    <section
      id="design-notes"
      class="component-page__notes"
      data-page-section="notes"
      aria-labelledby="design-notes-title"
    >
      <h2 id="design-notes-title">设计与无障碍</h2>
      <div class="component-page__notes-grid">
        <div>
          <h3>设计建议</h3>
          <ul class="doc-points">
            <li v-for="note in component.page.designNotes" :key="note">
              {{ note }}
            </li>
          </ul>
        </div>
        <div>
          <h3>无障碍</h3>
          <ul class="doc-points">
            <li v-for="note in component.page.accessibilityNotes" :key="note">
              {{ note }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <ApiReference :component-id="component.path.slice(1)" />
    <section
      class="doc-related"
      data-page-section="related"
      aria-labelledby="related-title"
    >
      <h2 id="related-title">相关场景与组件</h2>
      <div class="related-links">
        <RouterLink v-for="link in related" :key="link.path" :to="link.path"
          >{{ link.title }} <span aria-hidden="true">↗</span></RouterLink
        >
      </div>
    </section>
  </article>
</template>
