import { mount, flushPromises } from '@vue/test-utils';
import { expect, it } from 'vitest';
import ZtTimePicker from '../src/components/time-picker/ZtTimePicker.vue';
it('allows reaching valid times when changing an hour requires changing minutes', async () => {
  const w = mount(ZtTimePicker, {
    props: {
      modelValue: '09:30',
      disabledTime: (value: string) => !['09:30', '10:45'].includes(value),
    },
    attachTo: document.body,
  });
  (w.vm as any).open();
  await flushPromises();
  const hour = document.querySelector(
    '[data-unit="hour"] [data-value="10"]',
  ) as HTMLButtonElement;
  expect(hour.disabled).toBe(false);
  hour.click();
  await flushPromises();
  expect(
    document
      .querySelector('[data-unit="minute"] [data-value="45"]')
      ?.getAttribute('aria-selected'),
  ).toBe('true');
  (
    document.querySelector('[data-action="confirm"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  expect(w.emitted('update:modelValue')?.[0]).toEqual(['10:45']);
  w.unmount();
});
