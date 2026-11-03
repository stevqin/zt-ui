import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { expect, it } from 'vitest';
import { ZtInfiniteScroll, ZtConfigProvider } from '../src';

it('inherits reactive provider size and allows an explicit override', async () => {
  const wrapper = mount(ZtConfigProvider, { props: { size: 'large' }, slots: { default: () => h(ZtInfiniteScroll, { immediate: false, finished: true }) } });
  const scroll = wrapper.getComponent(ZtInfiniteScroll);
  expect(scroll.classes()).toContain('zt-infinite-scroll--large');
  await wrapper.setProps({ size: 'small' });
  expect(scroll.classes()).toContain('zt-infinite-scroll--small');
  const explicit = mount(ZtConfigProvider, { props: { size: 'large' }, slots: { default: () => h(ZtInfiniteScroll, { size: 'mini', immediate: false, finished: true }) } });
  expect(explicit.getComponent(ZtInfiniteScroll).classes()).toContain('zt-infinite-scroll--mini');
  await explicit.setProps({ size: 'medium' });
  expect(explicit.getComponent(ZtInfiniteScroll).classes()).toContain('zt-infinite-scroll--mini');
  wrapper.unmount(); explicit.unmount();
});
