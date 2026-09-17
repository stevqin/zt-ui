import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtLayout, ZtHeader, ZtAside, ZtMain, ZtFooter } from './index';
it('infers vertical for header and exposes semantic areas', () => {
  const w = mount(ZtLayout, {
    slots: {
      default: () => [
        h(ZtHeader, () => '标题'),
        h(ZtMain, () => '正文'),
        h(ZtFooter, () => '页脚'),
      ],
    },
  });
  expect(w.classes()).toContain('zt-layout--vertical');
  expect(w.find('header').exists()).toBe(true);
  expect(w.find('main').exists()).toBe(true);
  expect(w.find('footer').exists()).toBe(true);
});
it('keeps aside width and explicit direction', () => {
  const w = mount(ZtLayout, {
    props: { direction: 'horizontal' },
    slots: { default: () => h(ZtAside, { width: 180 }, () => '导航') },
  });
  expect(w.classes()).toContain('zt-layout--horizontal');
  expect(w.get('aside').attributes('style')).toContain('180px');
});
