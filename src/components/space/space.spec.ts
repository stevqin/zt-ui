import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtSpace } from './index';
import { createCommentVNode, Fragment } from 'vue';
it('ignores empty nodes and flattens fragments before separators', () => {
  const w = mount(ZtSpace, {
    props: { gap: [8, 16], direction: 'vertical' },
    slots: {
      default: () => [
        createCommentVNode('empty'),
        h(Fragment, null, [h('b', '一'), h('b', '二')]),
      ],
      separator: () => h('i', '/'),
    },
  });
  expect(w.findAll('.zt-space__item')).toHaveLength(2);
  expect(w.findAll('.zt-space__separator')).toHaveLength(1);
  expect(w.attributes('style')).toContain('gap: 16px 8px');
});
it('updates separators after conditionally removing items', async () => {
  const { ref, nextTick } = await import('vue');
  const visible = ref(true);
  const w = mount(ZtSpace, {
    slots: {
      default: () => [
        h('b', 'A'),
        visible.value ? h('b', 'B') : createCommentVNode('hidden'),
        h('b', 'C'),
      ],
      separator: () => '|',
    },
  });
  expect(w.findAll('.zt-space__separator')).toHaveLength(2);
  visible.value = false;
  await nextTick();
  expect(w.findAll('.zt-space__separator')).toHaveLength(1);
  expect(w.text()).toBe('A|C');
});
it('keeps tuple gaps and wrapping independent of content updates', async () => {
  const w = mount(ZtSpace, {
    props: { wrap: true, gap: [12, 20], align: 'start' },
    slots: { default: () => [h('div', 'wide'), h('div', 'other')] },
  });
  expect(w.attributes('style')).toContain('flex-wrap: wrap');
  expect(w.attributes('style')).toContain('gap: 20px 12px');
  await w.setProps({ direction: 'vertical', wrap: false });
  expect(w.attributes('style')).toContain('flex-direction: column');
  expect(w.attributes('style')).toContain('flex-wrap: nowrap');
  w.unmount();
});
