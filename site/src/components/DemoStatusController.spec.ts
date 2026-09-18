import { mount } from '@vue/test-utils';
import { computed, defineComponent, h, nextTick, ref } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import DocSearch from './DocSearch.vue';
import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { components } from '../docs/catalog';
import { createDemoStatusStore, provideDemoStatus } from '../docs/demo-status';
import { useDemoStatus } from '../docs/useDemoStatus';
import DemoStatusController from './DemoStatusController.vue';
const wrappers: ReturnType<typeof mount>[] = [];
function fixture(path = '/radio', width = 1440) {
  window.innerWidth = width;
  const store = createDemoStatusStore();
  const Sample = defineComponent({
    setup() {
      const status = useDemoStatus('default');
      return () => h('output', status.value);
    },
  });
  const host = defineComponent({
    setup() {
      provideDemoStatus(
        computed(() => components.find((c) => c.path === path)!.visualStatus!),
        store,
      );
      return () => [h(DemoStatusController), h(Sample), h(Sample)];
    },
  });
  const wrapper = mount(host, { attachTo: document.body });
  wrappers.push(wrapper);
  return { wrapper, store };
}
afterEach(() => wrappers.splice(0).forEach((w) => w.unmount()));
describe('contextual demo status controls', () => {
  it('shows six color blocks with labels below, a checked selection and synchronized consumers', async () => {
    const { wrapper } = fixture();
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(6);
    const selected = wrapper.get('[role="radio"][aria-checked="true"]');
    expect(selected.text()).toContain('primary');
    expect(selected.find('.demo-status__check').exists()).toBe(true);
    expect(selected.classes()).toContain('is-selected');
    expect(selected.element.firstElementChild?.className).toBe(
      'demo-status__swatch',
    );
    await wrapper.get('[data-status="danger"]').trigger('click');
    expect(wrapper.findAll('output').map((w) => w.text())).toEqual([
      'danger',
      'danger',
    ]);
  });
  it('uses roving arrow/Home/End navigation and keeps keyboard focus visible', async () => {
    const { wrapper } = fixture();
    const start = wrapper.get('[data-status="primary"]');
    (start.element as HTMLElement).focus();
    await start.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('data-status')).toBe('success');
    expect(
      wrapper.get('[data-status="success"]').attributes('aria-checked'),
    ).toBe('true');
    await wrapper
      .get('[data-status="success"]')
      .trigger('keydown', { key: 'End' });
    expect(document.activeElement?.getAttribute('data-status')).toBe('info');
    await wrapper
      .get('[data-status="info"]')
      .trigger('keydown', { key: 'Home' });
    expect(document.activeElement?.getAttribute('data-status')).toBe('default');
    const css = readFileSync('src/docs/docs.scss', 'utf8');
    expect(css).toMatch(/demo-status[^{}]*:focus-visible\s*\{[^}]*outline:/);
    expect(css).toMatch(
      /demo-status__grid\s*\{[^}]*grid-template-columns:\s*repeat\(3/,
    );
    expect(css).toMatch(
      /demo-status__choice\.is-selected\s*\{[^}]*background:[^}]*outline:/,
    );
  });
  it('opens a mobile bottom dialog, contains focus, and restores it on Escape', async () => {
    const { wrapper } = fixture('/radio', 390);
    const pill = wrapper.get('.demo-status__pill');
    expect(pill.text()).toBe('状态 · primary');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await pill.trigger('click');
    await nextTick();
    expect(wrapper.get('.demo-status').classes()).toContain('is-open');
    expect(wrapper.get('[role="dialog"]').attributes('aria-modal')).toBe(
      'true',
    );
    expect(document.activeElement?.getAttribute('data-status')).toBe('primary');
    await wrapper.get('[data-status="warning"]').trigger('click');
    expect(pill.text()).toBe('状态 · warning');
    await wrapper
      .get('[data-status="warning"]')
      .trigger('keydown', { key: 'Tab' });
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      '关闭状态面板',
    );
    await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    expect(document.activeElement).toBe(pill.element);
  });
  it('keeps an open panel through mobile viewport changes and transfers focus across the desktop breakpoint', async () => {
    const { wrapper } = fixture('/radio', 390);
    await wrapper.get('.demo-status__pill').trigger('click');
    window.innerWidth = 400;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(wrapper.find('.demo-status__pill').exists()).toBe(false);
    expect(document.activeElement?.getAttribute('data-status')).toBe('primary');
  });
  it.each(['/button', '/tag', '/steps', '/result', '/input', '/select'])(
    'does not render for excluded %s',
    (path) => {
      expect(fixture(path).wrapper.find('.demo-status').exists()).toBe(false);
    },
  );
});

describe('status modal ownership with the actual document search', () => {
  function searchFixture() {
    window.innerWidth = 390;
    const showController = ref(true);
    const store = createDemoStatusStore();
    const host = defineComponent({
      setup() {
        provideDemoStatus(
          computed(
            () => components.find((c) => c.path === '/radio')!.visualStatus,
          ),
          store,
        );
        return () => [
          h(DocSearch),
          showController.value ? h(DemoStatusController) : null,
        ];
      },
    });
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: defineComponent({ render: () => null }) },
      ],
    });
    const wrapper = mount(host, {
      attachTo: document.body,
      global: { plugins: [router] },
    });
    wrappers.push(wrapper);
    return { wrapper, showController };
  }
  function key(key: string, modifier: 'metaKey' | 'ctrlKey' = 'metaKey') {
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        [modifier]: key === 'k',
      }),
    );
  }
  it.each(['metaKey', 'ctrlKey'] as const)(
    'contains %s+K, programmatic focus, Tab and Escape until the modal closes',
    async (modifier) => {
      const { wrapper } = searchFixture();
      const search = wrapper.get<HTMLInputElement>('[aria-label="搜索文档"]');
      search.element.focus();
      await search.setValue('Radio');
      await wrapper.get('.demo-status__pill').trigger('click');
      await wrapper
        .get('[data-status="warning"]')
        .trigger('keydown', { key: 'Home' });
      key('k', modifier);
      await nextTick();
      expect(document.activeElement?.getAttribute('data-status')).toBe(
        'default',
      );
      expect(search.attributes('aria-expanded')).toBe('false');
      search.element.focus();
      await nextTick();
      expect(document.activeElement?.getAttribute('data-status')).toBe(
        'default',
      );
      expect(search.attributes('aria-expanded')).toBe('false');
      key('Tab');
      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        '关闭状态面板',
      );
      key('Escape');
      await nextTick();
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
      expect(document.activeElement).toBe(
        wrapper.get('.demo-status__pill').element,
      );
      key('k', modifier);
      await nextTick();
      expect(document.activeElement).toBe(search.element);
      expect(search.element.value).toBe('Radio');
      expect(search.attributes('aria-expanded')).toBe('true');
    },
  );
  it('releases ownership on a breakpoint change and unmount', async () => {
    const { wrapper, showController } = searchFixture();
    await wrapper.get('.demo-status__pill').trigger('click');
    window.innerWidth = 1440;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    key('k');
    await nextTick();
    expect(document.activeElement).toBe(
      wrapper.get('[aria-label="搜索文档"]').element,
    );
    window.innerWidth = 390;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    await wrapper.get('.demo-status__pill').trigger('click');
    showController.value = false;
    await nextTick();
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }),
    );
    await nextTick();
    expect(document.activeElement).toBe(
      wrapper.get('[aria-label="搜索文档"]').element,
    );
  });
});
