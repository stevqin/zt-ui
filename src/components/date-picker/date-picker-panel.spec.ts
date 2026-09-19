import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtDatePickerPanel from './ZtDatePickerPanel.vue';
describe('DatePickerPanel', () => {
  it('renders inline and shares single date selection and holiday rules', async () => {
    const w = mount(ZtDatePickerPanel, {
      props: {
        modelValue: '2026-09-17',
        holidays: [{ key: '2026-09-18', value: '测试节日' }],
      },
    });
    expect(w.find('input').exists()).toBe(false);
    await w.find('[data-date="2026-09-18"]').trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['2026-09-18']);
    expect(w.find('.zt-date-picker__panel').exists()).toBe(true);
    w.unmount();
  });
  it('shares disabled date and two-click range rules', async () => {
    const w = mount(ZtDatePickerPanel, {
      props: {
        range: true,
        modelValue: ['2026-09-17', '2026-09-19'],
        disabledDate: (d: Date) => d.getDate() === 18,
      },
    });
    expect(
      w.find('[data-date="2026-09-18"]').attributes('disabled'),
    ).toBeDefined();
    await w.find('[data-date="2026-09-20"]').trigger('click');
    expect(w.emitted('change')).toBeUndefined();
    expect(w.text()).toContain('请选择结束日期');
    await w.find('[data-date="2026-09-22"]').trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([
      ['2026-09-20', '2026-09-22'],
    ]);
    w.unmount();
  });
});
it('keeps year/month navigation in the inline panel and disables picking via Form', async () => {
  const w = mount(ZtDatePickerPanel, { props: { modelValue: '2026-09-17' } });
  expect(w.find('.zt-date-picker__footer').exists()).toBe(true);
  expect(w.find('.zt-date-picker__footer').text()).not.toContain('取消');
  expect(w.find('[data-shortcut="今日"]').attributes('disabled')).toBeUndefined();
  await w.find('[aria-label="选择年份"]').trigger('click');
  expect(w.find('.zt-date-picker__period-grid').exists()).toBe(true);
  expect(w.find('.zt-date-picker__panel').attributes('style')).toContain(
    'position: relative',
  );
  await w.setProps({ disabled: true });
  expect(w.find('[data-shortcut="今日"]').attributes('disabled')).toBeDefined();
  expect(w.emitted('change')).toBeUndefined();
  w.unmount();
});

it('disables inline shortcuts while readonly', () => {
  const w = mount(ZtDatePickerPanel, { props: { modelValue: '2026-09-17', readonly: true } });
  expect(w.find('[data-shortcut="今日"]').attributes('disabled')).toBeDefined();
  w.unmount();
});
