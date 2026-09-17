import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtSkeleton, ZtSkeletonItem } from './index';
it('switches from placeholders to content and applies widths', async () => {
  const w = mount(ZtSkeleton, {
    props: { rows: 3, widths: ['100%', '80%', 60] },
    slots: { default: () => '已加载' },
  });
  expect(w.findAll('.zt-skeleton-item')).toHaveLength(3);
  expect(w.findAll('.zt-skeleton-item')[2].attributes('style')).toContain(
    'width: 60px',
  );
  await w.setProps({ loading: false });
  expect(w.text()).toBe('已加载');
  expect(w.findAll('.zt-skeleton-item')).toHaveLength(0);
});
it('supports circular items', () => {
  expect(
    mount(ZtSkeletonItem, { props: { shape: 'circle' } }).classes(),
  ).toContain('zt-skeleton-item--circle');
});
it('accepts custom placeholder template and zero rows', () => {
  const w = mount(ZtSkeleton, { props: { rows: 0 } });
  expect(w.findAll('.zt-skeleton-item')).toHaveLength(0);
  expect(w.attributes('aria-busy')).toBe('true');
  const custom = mount(ZtSkeleton, {
    slots: {
      template: () => h(ZtSkeletonItem, { shape: 'image', animated: false }),
    },
  });
  expect(custom.findAll('.zt-skeleton-item')).toHaveLength(1);
  expect(custom.get('.zt-skeleton-item').classes()).not.toContain(
    'is-animated',
  );
});
