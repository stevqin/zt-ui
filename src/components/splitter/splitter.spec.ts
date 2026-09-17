import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { it, expect, vi } from 'vitest';
import { ZtSplitter } from './index';
it('constrains keyboard resize, collapse and restore with controlled value', async () => {
  const w = mount(ZtSplitter, {
    props: { modelValue: 40, min: 20, max: 60, collapsible: true },
    slots: { first: () => '左', second: () => '右' },
  });
  const bar = w.get('[role="separator"]');
  await bar.trigger('keydown', { key: 'End' });
  expect(w.emitted('update:modelValue')?.[0]).toEqual([60]);
  await w.setProps({ modelValue: 60 });
  await w.get('button').trigger('click');
  expect(w.emitted('update:modelValue')?.[1]).toEqual([0]);
  await w.setProps({ modelValue: 0 });
  await w.get('button').trigger('click');
  expect(w.emitted('update:modelValue')?.[2]).toEqual([60]);
});
it('resizes with pointer and stops emitting after pointer release', async () => {
  const w = mount(ZtSplitter, { props: { modelValue: 50, min: 10, max: 80 } });
  vi.spyOn(w.element, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 200,
    height: 100,
    right: 200,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  await w
    .get('[role="separator"]')
    .trigger('pointerdown', { clientX: 100, button: 0 });
  window.dispatchEvent(new PointerEvent('pointermove', { clientX: 150 }));
  expect(w.emitted('update:modelValue')?.[0]).toEqual([75]);
  window.dispatchEvent(new PointerEvent('pointerup'));
  window.dispatchEvent(new PointerEvent('pointermove', { clientX: 180 }));
  expect(w.emitted('update:modelValue')).toHaveLength(1);
  w.unmount();
});
it('honors vertical keys and ignores unrelated keys or disabled input', async () => {
  const w = mount(ZtSplitter, {
    props: {
      direction: 'vertical',
      modelValue: 50,
      min: 20,
      max: 70,
      step: 2,
      collapsible: true,
    },
  });
  const bar = w.get('[role="separator"]');
  expect(bar.attributes('aria-orientation')).toBe('horizontal');
  await bar.trigger('keydown', { key: 'ArrowDown', shiftKey: true });
  expect(w.emitted('update:modelValue')?.[0]).toEqual([70]);
  await bar.trigger('keydown', { key: 'ArrowLeft' });
  expect(w.emitted('update:modelValue')).toHaveLength(1);
  await w.setProps({ disabled: true });
  await bar.trigger('keydown', { key: 'Home' });
  await bar.trigger('pointerdown', { button: 0 });
  expect(w.emitted('update:modelValue')).toHaveLength(1);
  expect(w.emitted('resize-start')).toBeUndefined();
  expect(w.get('button').attributes('disabled')).toBeDefined();
});
it('cleans pointer listeners on unmount', async () => {
  const w = mount(ZtSplitter);
  await w.get('[role="separator"]').trigger('pointerdown', { button: 0 });
  const remove = vi.spyOn(window, 'removeEventListener');
  w.unmount();
  expect(remove.mock.calls.map((args) => args[0])).toEqual(
    expect.arrayContaining(['pointermove', 'pointerup', 'pointercancel']),
  );
  remove.mockRestore();
});
it('ignores unrelated pointers while a resize gesture owns the handle', async () => {
  const w = mount(ZtSplitter);
  vi.spyOn(w.element, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 200,
    height: 100,
  } as DOMRect);
  await w
    .get('[role=separator]')
    .trigger('pointerdown', { button: 0, pointerId: 1 });
  window.dispatchEvent(
    new PointerEvent('pointermove', { pointerId: 2, clientX: 180 }),
  );
  expect(w.emitted('change')).toBeUndefined();
  window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2 }));
  window.dispatchEvent(
    new PointerEvent('pointermove', { pointerId: 1, clientX: 140 }),
  );
  expect(w.emitted('change')?.[0]).toEqual([70]);
  window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }));
  expect(w.emitted('resize-end')?.[0]).toEqual([70]);
  w.unmount();
});
