import { mount, flushPromises } from '@vue/test-utils';
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
  try {
    await flushPromises();
    expect(w.get('[role="dialog"]').classes()).not.toContain('is-centered');
    target.remove();
    // MutationObserver schedules the update in requestAnimationFrame. Wait for
    // the visible result rather than assuming a zero-delay timer runs after it.
    await vi.waitFor(() => {
      expect(w.get('[role="dialog"]').classes()).toContain('is-centered');
    });
  } finally {
    w.unmount();
    target.remove();
  }
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

it('keeps the spotlight and mask opening rounded together when the provider radius changes', async () => {
  const { defineComponent, h, ref } = await import('vue');
  const { ZtConfigProvider } = await import('../config-provider');
  const radius = ref(16);
  const target = document.createElement('button');
  target.textContent = '引导目标';
  document.body.append(target);
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
    top: 100, left: 80, right: 180, bottom: 140, width: 100, height: 40,
  } as DOMRect);
  const w = mount(defineComponent({
    setup: () => () => h(ZtConfigProvider, { borderRadius: radius.value }, () =>
      h(ZtTour, { modelValue: true, scrollIntoView: false, steps: [{ target: () => target, title: '目标' }] }),
    ),
  }), { attachTo: document.body });
  try {
    await flushPromises();
    const spotlight = () => document.querySelector<HTMLElement>('.zt-tour__spotlight')!;
    const clip = () => document.querySelector<HTMLElement>('.zt-tour__mask')!.style.clipPath;
    expect(spotlight().style.borderRadius).toBe('16px');
    expect(clip()).toContain('A16 16');
    // The outline must remain outside the clipped mask so it is not cut away.
    expect(spotlight().parentElement?.classList.contains('zt-tour')).toBe(true);
    radius.value = 0;
    await flushPromises();
    expect(spotlight().style.borderRadius).toBe('0px');
    expect(clip()).not.toMatch(/A[1-9]/);
    radius.value = 100;
    await flushPromises();
    // Target plus the existing 4px gap is 108 × 48; rounding cannot exceed half its height.
    expect(spotlight().style.borderRadius).toBe('24px');
    expect(clip()).toContain('A24 24');
    // Updating appearance must not close or advance the current step.
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('目标');
  } finally {
    w.unmount();
    target.remove();
  }
});
