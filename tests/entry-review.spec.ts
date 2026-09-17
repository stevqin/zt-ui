import { afterEach, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import Mention from '../src/components/mention/ZtMention.vue';
import ColorPanel from '../src/components/color-picker-panel/ZtColorPickerPanel.vue';
import { parseColor } from '../src/components/color-picker/color';
import DatePanel from '../src/components/date-picker/ZtDatePickerPanel.vue';
import DatePicker from '../src/components/date-picker/ZtDatePicker.vue';
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});
it('Mention End key stays on final suggestion through keyup', async () => {
  vi.useFakeTimers();
  const w = mount(Mention, {
    props: {
      modelValue: '@',
      debounce: 0,
      options: [{ value: 'first' }, { value: 'last' }],
    },
    attachTo: document.body,
  });
  const el = w.get('textarea').element;
  el.value = '@';
  el.setSelectionRange(1, 1);
  await w.get('textarea').trigger('click');
  await vi.runAllTimersAsync();
  await w.get('textarea').trigger('keydown', { key: 'End' });
  await w.get('textarea').trigger('keyup', { key: 'End' });
  await vi.runAllTimersAsync();
  await w.get('textarea').trigger('keydown', { key: 'Enter' });
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['@last ']);
  w.unmount();
});
it('rejects nonfinite HSL channels', () => {
  expect(parseColor(`hsl(${'9'.repeat(400)}, 50%, 50%)`)).toBeNull();
});
it('color panel keeps alpha, blocks invalid text, then accepts valid RGB', async () => {
  const w = mount(ColorPanel, {
    props: { modelValue: '#ff000080', showAlpha: true },
  });
  expect(
    Number((w.get('[aria-label=透明度]').element as HTMLInputElement).value),
  ).toBeCloseTo(128 / 255);
  await w.get('[aria-label="HEX RGB HSL 颜色"]').setValue('not a color');
  expect(w.get('[data-action=confirm]').attributes('disabled')).toBeDefined();
  await w
    .get('[aria-label="HEX RGB HSL 颜色"]')
    .setValue('rgba(0, 255, 0, .5)');
  await w.get('[data-action=confirm]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['#00ff0080']);
  w.unmount();
});
it('inline date panel stays mounted on select and Escape without popup regression', async () => {
  const panel = mount(DatePanel, {
    props: { modelValue: '2026-09-17' },
    attachTo: document.body,
  });
  expect(panel.find('input[role=combobox]').exists()).toBe(false);
  await panel.get('[data-date="2026-09-18"]').trigger('click');
  expect(panel.emitted('update:modelValue')?.[0]).toEqual(['2026-09-18']);
  await panel
    .get('[data-date="2026-09-18"]')
    .trigger('keydown', { key: 'Escape' });
  expect(panel.find('[role=group]').exists()).toBe(true);
  panel.unmount();
  const popup = mount(DatePicker, { props: { modelValue: '2026-09-17' } });
  expect(document.querySelector('.zt-date-picker__panel')).toBeNull();
  await popup.get('input').trigger('click');
  await flushPromises();
  expect(document.querySelector('[role=dialog]')).not.toBeNull();
  popup.unmount();
});
