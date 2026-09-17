import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtCard } from './index';
it('preserves header footer and replaces body during loading', async () => {
  const w = mount(ZtCard, {
    props: { title: '订单', loading: true },
    slots: { default: () => '记录', extra: () => '操作', footer: () => '合计' },
  });
  expect(w.attributes('aria-busy')).toBe('true');
  expect(w.text()).not.toContain('记录');
  expect(w.text()).toContain('合计');
  await w.setProps({ loading: false });
  expect(w.text()).toContain('记录');
});
