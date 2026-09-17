import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtCarousel } from './index';
it('supports controlled arrow keyboard and touch navigation', async () => {
  const w = mount(ZtCarousel, {
    props: { modelValue: 0, autoplay: false },
    slots: { default: () => [h('div', '一'), h('div', '二'), h('div', '三')] },
  });
  await w.get('[aria-label="下一张"]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([1]);
  await w.setProps({ modelValue: 2 });
  await w.trigger('keydown', { key: 'ArrowRight' });
  expect(w.emitted('update:modelValue')?.[1]).toEqual([0]);
  await w.trigger('touchstart', { touches: [{ clientX: 180 }] });
  await w.trigger('touchend', { changedTouches: [{ clientX: 240 }] });
  expect(w.emitted('update:modelValue')?.[2]).toEqual([1]);
  w.unmount();
});
it('pauses autoplay during hover and resumes with clean timers', async () => {
  vi.useFakeTimers();
  const w = mount(ZtCarousel, {
    props: { autoplay: true, interval: 500 },
    slots: { default: () => [h('div', '一'), h('div', '二')] },
  });
  await w.trigger('mouseenter');
  vi.advanceTimersByTime(1000);
  expect(w.emitted('update:modelValue')).toBeUndefined();
  await w.trigger('mouseleave');
  vi.advanceTimersByTime(500);
  expect(w.emitted('update:modelValue')?.[0]).toEqual([1]);
  w.unmount();
  expect(vi.getTimerCount()).toBe(0);
  vi.useRealTimers();
});
it('pauses for reduced motion and removes the media listener', async () => {
  vi.useFakeTimers();
  const remove = vi.fn();
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: remove,
  }));
  const w = mount(ZtCarousel, {
    props: { autoplay: true, interval: 100 },
    slots: { default: () => [h('div', '一'), h('div', '二')] },
  });
  vi.advanceTimersByTime(400);
  expect(w.emitted('update:modelValue')).toBeUndefined();
  w.unmount();
  expect(remove).toHaveBeenCalled();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it('does not loop when disabled and ignores editable keyboard events', async () => {
  const w = mount(ZtCarousel, {
    props: { modelValue: 0, loop: false },
    slots: { default: () => [h('input'), h('div', '二')] },
  });
  await w.trigger('keydown', { key: 'ArrowLeft' });
  expect(w.emitted('update:modelValue')).toBeUndefined();
  await w.get('input').trigger('keydown', { key: 'ArrowRight' });
  expect(w.emitted('update:modelValue')).toBeUndefined();
  expect(w.get('[aria-label="上一张"]').attributes('disabled')).toBeDefined();
  w.unmount();
});
it('advances visual slides without v-model and normalizes arbitrary public indices', async () => {
  const w = mount(ZtCarousel, {
    slots: { default: () => [h('div', 'A'), h('div', 'B'), h('div', 'C')] },
  });
  await w.get('[aria-label="下一张"]').trigger('click');
  expect(w.findAll('.zt-carousel__slide')[1]!.attributes('aria-hidden')).toBe(
    'false',
  );
  (w.vm as unknown as { goTo: (n: number) => void }).goTo(-7);
  await nextTick();
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([2]);
  (w.vm as unknown as { goTo: (n: number) => void }).goTo(Number.NaN);
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([2]);
  w.unmount();
});
it('does not visually override an explicitly controlled index before parent update', async () => {
  const w = mount(ZtCarousel, {
    props: { modelValue: 0 },
    slots: { default: () => [h('div', 'A'), h('div', 'B')] },
  });
  await w.get('[aria-label="下一张"]').trigger('click');
  expect(w.findAll('.zt-carousel__slide')[0]!.attributes('aria-hidden')).toBe(
    'false',
  );
  await w.setProps({ modelValue: 1 });
  expect(w.findAll('.zt-carousel__slide')[1]!.attributes('aria-hidden')).toBe(
    'false',
  );
  w.unmount();
});
