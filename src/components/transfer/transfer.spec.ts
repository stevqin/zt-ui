import { it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Transfer from './ZtTransfer.vue';
it('moves only enabled selected keys and reports direction', async () => {
  const w = mount(Transfer, {
    props: {
      data: [
        { key: 1, label: 'One' },
        { key: 2, label: 'Two', disabled: true },
      ],
      modelValue: [],
    },
  });
  await w.findAll('input[type=checkbox]')[0]!.setValue(true);
  await w.get('[data-move=right]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[1]]);
  expect(w.emitted('change')?.[0]).toEqual([[1], 'right', [1]]);
});
it('search scopes select all and controlled move left retains unknown keys', async () => {
  const w = mount(Transfer, {
    props: {
      data: [
        { key: 1, label: 'One' },
        { key: 2, label: 'Two' },
      ],
      modelValue: [1, 2, 99],
      filterable: true,
    },
  });
  await w.get('input[aria-label=搜索已选]').setValue('Two');
  await w.get('input[aria-label=全选已选]').setValue(true);
  await w.get('[data-move=left]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[1, 99]]);
  expect(w.emitted('change')?.[0]).toEqual([[1, 99], 'left', [2]]);
});
it('keeps Form blur validation within the composite field until focus leaves', async () => {
  const { h } = await import('vue');
  const { flushPromises } = await import('@vue/test-utils');
  const { ZtForm, ZtFormItem } = await import('../form');
  const w = mount(ZtForm, {
    props: {
      model: { keys: [] },
      rules: {
        keys: { required: true, message: '至少选择一项', trigger: 'blur' },
      },
    },
    slots: {
      default: () =>
        h(ZtFormItem, { prop: 'keys', label: '权限' }, () =>
          h(Transfer, { data: [{ key: 1, label: 'One' }] }),
        ),
    },
  });
  await w
    .get('.zt-transfer')
    .trigger('focusout', { relatedTarget: w.get('input').element });
  await flushPromises();
  expect(w.find('.zt-form-item__error').exists()).toBe(false);
  await w
    .get('.zt-transfer')
    .trigger('focusout', { relatedTarget: document.body });
  await flushPromises();
  const error = document.getElementById(w.get('.zt-transfer').attributes('aria-describedby') || '');
  expect(error).not.toBeNull();
  expect(error?.classList.contains('zt-form-item__error')).toBe(true);
});
