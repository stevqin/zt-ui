import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtDivider } from './index';
it('announces orientation and positions slotted text', () => {
  const w = mount(ZtDivider, {
    props: { dashed: true, contentPosition: 'left' },
    slots: { default: () => '章节' },
  });
  expect(w.get('[role="separator"]').attributes('aria-orientation')).toBe(
    'horizontal',
  );
  expect(w.classes()).toContain('zt-divider--left');
  expect(w.text()).toBe('章节');
});
