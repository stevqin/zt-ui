import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtRate from './ZtRate.vue';
describe('Rate', () => {
  it('supports half steps, bounds and clearing', async () => {
    const w = mount(ZtRate, {
      props: { modelValue: 2, allowHalf: true, clearable: true, max: 3 },
    });
    await w.find('[role=slider]').trigger('keydown', { key: 'ArrowRight' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([2.5]);
    await w.find('[role=slider]').trigger('keydown', { key: 'End' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([3]);
    await w.find('[role=slider]').trigger('keydown', { key: 'Delete' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([0]);
  });
  it('does not change disabled values', async () => {
    const w = mount(ZtRate, { props: { disabled: true } });
    await w.find('[role=slider]').trigger('keydown', { key: 'End' });
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });
});
it('selects a half icon from its left half and clears on repeated click', async () => {
  const w = mount(ZtRate, {
    props: { modelValue: 1.5, allowHalf: true, clearable: true },
  });
  const icon = w.findAll('.zt-rate__icon')[1]!;
  icon.element.getBoundingClientRect = () =>
    ({ left: 10, width: 20 }) as DOMRect;
  await icon.trigger('click', { clientX: 12 });
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([0]);
  await w.setProps({ modelValue: 0 });
  await icon.trigger('click', { clientX: 12 });
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([1.5]);
});
