import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ZtInputTag from './ZtInputTag.vue';
describe('InputTag', () => {
  it('splits paste, deduplicates and respects max', async () => {
    const w = mount(ZtInputTag, { props: { modelValue: ['one'], max: 3 } });
    await w.find('input').trigger('paste', {
      clipboardData: { getData: () => 'one,two;three,four' },
    });
    expect(w.emitted('update:modelValue')?.[0]).toEqual([
      ['one', 'two', 'three'],
    ]);
  });
  it('protects IME and readonly deletion', async () => {
    const w = mount(ZtInputTag, { props: { modelValue: ['一'] } });
    await w.find('input').setValue('二');
    await w
      .find('input')
      .trigger('keydown', { key: 'Enter', isComposing: true });
    expect(w.emitted('update:modelValue')).toBeUndefined();
    await w.setProps({ readonly: true });
    expect(w.find('button').exists()).toBe(false);
  });
});
it('validates committed tags, not the unfinished draft', async () => {
  const { computed, ref } = await import('vue');
  const { ztFormItemKey } = await import('../form/context');
  let changes = 0;
  const w = mount(ZtInputTag, {
    global: {
      provide: {
        [ztFormItemKey as symbol]: {
          size: computed(() => 'small'),
          disabled: computed(() => false),
          validateState: ref(''),
          validateMessage: ref(''),
          validate: async (t: string) => {
            if (t === 'change') changes++;
            return true;
          },
        },
      },
    },
  });
  await w.find('input').setValue('draft');
  expect(changes).toBe(0);
  await w.find('input').trigger('keydown', { key: 'Enter' });
  expect(changes).toBe(1);
});
