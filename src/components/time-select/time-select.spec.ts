import { describe, it, expect } from 'vitest';
import { generateTimeOptions } from './time';
describe('TimeSelect generation', () => {
  it('includes end only on the step grid, disables exclusive bounds and ranges', () => {
    const a = generateTimeOptions({
      start: '08:00',
      end: '09:00',
      step: '00:20',
      minTime: '08:00',
      disabledRanges: [['08:40', '09:00']],
    });
    expect(a.map((x) => x.value)).toEqual(['08:00', '08:20', '08:40', '09:00']);
    expect(a.map((x) => !!x.disabled)).toEqual([true, false, true, true]);
  });
  it('rejects zero step, invalid clocks and reversed ranges safely', () => {
    expect(generateTimeOptions({ step: '00:00' })).toEqual([]);
    expect(generateTimeOptions({ start: '25:00' })).toEqual([]);
    expect(generateTimeOptions({ start: '12:00', end: '08:00' })).toEqual([]);
  });
});
it('uses Select and emits null on clear', async () => {
  const { mount } = await import('@vue/test-utils');
  const { default: ZtTimeSelect } = await import('./ZtTimeSelect.vue');
  const w = mount(ZtTimeSelect, {
    props: { modelValue: '09:00', clearable: true },
  });
  expect(w.find('select').exists()).toBe(false);
  await w.find('.zt-select__clear').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([null]);
  expect(w.emitted('clear')).toHaveLength(1);
  w.unmount();
});
