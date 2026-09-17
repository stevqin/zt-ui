import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtTimePicker from './ZtTimePicker.vue';
describe('TimePicker', () => {
  it('commits custom panel values and never renders native time inputs', async () => {
    const w = mount(ZtTimePicker, {
      props: { modelValue: '10:15', minuteStep: 15 },
    });
    await w.find('input').trigger('click');
    expect(document.querySelector('input[type=time]')).toBeNull();
    (
      document.querySelector(
        '[data-unit=hour] [data-value="11"]',
      ) as HTMLElement
    ).click();
    await w.vm.$nextTick();
    (document.querySelector('[data-action=confirm]') as HTMLElement).click();
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['11:15']);
    w.unmount();
  });
  it('keeps invalid ranges uncommitted and supports clear', async () => {
    const w = mount(ZtTimePicker, {
      props: { modelValue: ['10:00', '09:00'], range: true, clearable: true },
    });
    await w.find('input').trigger('click');
    expect(
      (document.querySelector('[data-action=confirm]') as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    await w.find('[aria-label="清空时间"]').trigger('click');
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null]);
    w.unmount();
  });
});
it('skips disabled time candidates with keyboard and isolates cancel drafts', async () => {
  const w = mount(ZtTimePicker, {
    props: {
      modelValue: '10:00',
      disabledTime: (v: string) => v.startsWith('11:'),
    },
  });
  await w.find('input').trigger('click');
  const selected = document.querySelector(
    '[data-unit=hour] [data-value="10"]',
  ) as HTMLButtonElement;
  selected.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
  );
  await w.vm.$nextTick();
  expect(
    document
      .querySelector('[data-unit=hour] [data-value="12"]')
      ?.getAttribute('aria-selected'),
  ).toBe('true');
  expect(
    (
      document.querySelector(
        '[data-unit=hour] [data-value="11"]',
      ) as HTMLButtonElement
    ).disabled,
  ).toBe(true);
  expect(w.emitted('update:modelValue')).toBeUndefined();
  w.unmount();
});
it('inherits disabled and size from Form and respects readonly', async () => {
  const { computed, ref } = await import('vue');
  const { ztFormItemKey } = await import('../form/context');
  const disabled = ref(true);
  const w = mount(ZtTimePicker, {
    global: {
      provide: {
        [ztFormItemKey as symbol]: {
          disabled: computed(() => disabled.value),
          size: computed(() => 'large'),
          validateState: ref(''),
          validateMessage: ref(''),
        },
      },
    },
  });
  expect(w.find('input').attributes('disabled')).toBeDefined();
  expect(w.find('.zt-input--large').exists()).toBe(true);
  await w.find('input').trigger('click');
  expect(w.emitted('visible-change')).toBeUndefined();
  disabled.value = false;
  await w.setProps({ readonly: true });
  await w.find('input').trigger('click');
  expect(w.emitted('visible-change')).toBeUndefined();
  w.unmount();
});
