import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtPageHeader } from './index';
it('emits back and renders named header regions', async () => {
  const w = mount(ZtPageHeader, {
    props: { title: '客户', description: '查看客户资料' },
    slots: {
      breadcrumb: () => '首页 / 客户',
      extra: () => h('button', '保存'),
    },
  });
  await w.get('[aria-label="返回"]').trigger('click');
  expect(w.emitted('back')).toHaveLength(1);
  expect(w.get('h1').text()).toBe('客户');
  expect(w.text()).toContain('查看客户资料');
  expect(w.findAll('button')).toHaveLength(2);
});
