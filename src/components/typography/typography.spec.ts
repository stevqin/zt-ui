import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtTypography } from './index';
it('copies text with explicit success and failure feedback', async () => {
  const copy = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText: copy } });
  const w = mount(ZtTypography, {
    props: { copyable: true, text: '报表', variant: 'title', level: 2 },
  });
  expect(w.find('h2').exists()).toBe(true);
  await w.get('button').trigger('click');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(copy).toHaveBeenCalledWith('报表');
  expect(w.get('[role="status"]').text()).toBe('已复制');
  copy.mockRejectedValue(new Error('denied'));
  await w.get('button').trigger('click');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(w.emitted('copy-error')).toHaveLength(1);
  expect(w.get('[role="status"]').text()).toBe('复制失败');
  vi.unstubAllGlobals();
});
it('uses semantic modifiers and inherited title size', () => {
  const w = mount(ZtTypography, {
    props: {
      variant: 'title',
      level: 3,
      size: 'large',
      strong: true,
      italic: true,
      deleted: true,
      underline: true,
      text: '修订',
    },
  });
  expect(w.find('strong').exists()).toBe(true);
  expect(w.find('em').exists()).toBe(true);
  expect(w.find('del').exists()).toBe(true);
  expect(w.find('u').exists()).toBe(true);
  expect(w.attributes('style')).toContain('--glass-size-large');
});
it('copies rendered slot text and reports an unavailable clipboard', async () => {
  vi.stubGlobal('navigator', {});
  const w = mount(ZtTypography, {
    props: { copyable: true },
    slots: { default: () => h('b', '插槽内容') },
  });
  await w.get('button').trigger('click');
  expect(w.get('[role="status"]').text()).toBe('复制失败');
  expect(w.emitted('copy-error')).toHaveLength(1);
  vi.unstubAllGlobals();
});
