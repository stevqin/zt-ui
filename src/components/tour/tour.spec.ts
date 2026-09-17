import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtTour } from './index';
it('centers missing targets and supports controlled steps and completion', async () => {
  const w = mount(ZtTour, {
    props: {
      modelValue: true,
      current: 0,
      steps: [
        { target: '#missing', title: '欢迎', description: '说明' },
        { title: '完成设置' },
      ],
    },
    global: { stubs: { teleport: true } },
  });
  await flushPromises();
  expect(w.get('[role="dialog"]').text()).toContain('欢迎');
  expect(w.get('[role="dialog"]').classes()).toContain('is-centered');
  await w.get('[data-tour-next]').trigger('click');
  expect(w.emitted('update:current')?.[0]).toEqual([1]);
  await w.setProps({ current: 1 });
  await w.get('[data-tour-next]').trigger('click');
  expect(w.emitted('finish')).toHaveLength(1);
  expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
  w.unmount();
});
it('locates an element, responds to Escape, and restores the opener focus', async () => {
  const opener = document.createElement('button');
  const target = document.createElement('div');
  document.body.append(opener, target);
  opener.focus();
  target.scrollIntoView = vi.fn();
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
    top: 100,
    left: 80,
    right: 180,
    bottom: 140,
    width: 100,
    height: 40,
  } as DOMRect);
  const w = mount(ZtTour, {
    attachTo: document.body,
    props: {
      modelValue: true,
      steps: [{ target: () => target, title: '目标' }],
      'onUpdate:modelValue': (value) => {
        void w.setProps({ modelValue: value });
      },
    },
  });
  await flushPromises();
  expect(target.scrollIntoView).toHaveBeenCalled();
  expect(document.querySelector('.zt-tour__spotlight')).not.toBeNull();
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
  );
  await flushPromises();
  expect(w.emitted('close')?.[0]).toEqual(['escape']);
  expect(document.activeElement).toBe(opener);
  w.unmount();
  opener.remove();
  target.remove();
});
it('falls back to centered instructions when an active target disappears', async () => {
  const target = document.createElement('div');
  document.body.append(target);
  target.scrollIntoView = vi.fn();
  const w = mount(ZtTour, {
    props: {
      modelValue: true,
      steps: [{ target: () => target, title: '动态目标' }],
    },
    global: { stubs: { teleport: true } },
  });
  await flushPromises();
  expect(w.get('[role="dialog"]').classes()).not.toContain('is-centered');
  target.remove();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
  expect(w.get('[role="dialog"]').classes()).toContain('is-centered');
  w.unmount();
});
it('normalizes invalid numeric step indices instead of opening an empty overlay', async () => {
  const w = mount(ZtTour, {
    props: {
      modelValue: true,
      current: NaN,
      steps: [{ title: '第一步' }, { title: '第二步' }],
    },
    global: { stubs: { teleport: true } },
  });
  await flushPromises();
  expect(w.find('[role=dialog]').exists()).toBe(true);
  expect(w.get('[role=dialog]').text()).toContain('第一步');
  await w.setProps({ current: 1.8 });
  expect(w.get('[role=dialog]').text()).toContain('第二步');
  w.unmount();
});
