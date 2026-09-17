import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtEmpty } from './index';
it('supports custom image description and action', () => {
  const w = mount(ZtEmpty, {
    props: { description: '无订单' },
    slots: {
      image: () => h('span', '图形'),
      default: () => h('button', '新建'),
    },
  });
  expect(w.attributes('role')).toBe('status');
  expect(w.text()).toContain('无订单');
  expect(w.get('button').text()).toBe('新建');
});
