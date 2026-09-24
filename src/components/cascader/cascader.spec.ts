import { it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Cascader from './ZtCascader.vue';
it('emits full path after traversing columns', async () => {
  const w = mount(Cascader, {
    props: {
      options: [{ key: 'a', label: 'A', children: [{ key: 'b', label: 'B' }] }],
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  await w.get('[data-option]').trigger('click');
  await w.findAll('[data-option]')[1]!.trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']]);
});
it('lazy failure exposes retry', async () => {
  let n = 0;
  const w = mount(Cascader, {
    props: {
      options: [{ key: 'a', label: 'A', isLeaf: false }],
      teleported: false,
      load: async () => {
        if (!n++) throw Error();
        return [{ key: 'b', label: 'B' }];
      },
    },
  });
  await w.get('button').trigger('click');
  await w.get('[data-option]').trigger('click');
  await flushPromises();
  await w.get('[data-retry]').trigger('click');
  await flushPromises();
  expect(w.text()).toContain('B');
});
it('supports mapped fields, strict branch selection, and controlled clear', async () => {
  const w = mount(Cascader, {
    props: {
      options: [{ id: 1, title: 'Root', nodes: [{ id: 2, title: 'Leaf' }] }],
      fields: { key: 'id', label: 'title', children: 'nodes' },
      checkStrictly: true,
      clearable: true,
      modelValue: [1],
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  await w.get('input[type=radio]').trigger('change');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[1]]);
  await w.get('[aria-label=清空]').trigger('click');
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null]);
});
it('search matches a full path and multiple selections retain paths', async () => {
  const w = mount(Cascader, {
    props: {
      options: [
        {
          key: 'a',
          label: 'A',
          children: [
            { key: 'b', label: 'B' },
            { key: 'c', label: 'C', disabled: true },
          ],
        },
      ],
      multiple: true,
      filterable: true,
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  await w.get('input[aria-label=搜索路径]').setValue('A / B');
  await w.get('[role=option]').trigger('click');
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[['a', 'b']]]);
});
it('keeps checkbox DOM controlled until model props are accepted', async () => {
  const w = mount(Cascader, {
    props: {
      multiple: true,
      options: [{ key: 'a', label: 'A' }],
      teleported: false,
      modelValue: [],
    },
  });
  await w.get('button').trigger('click');
  await w.get('input[type=checkbox]').setValue(true);
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[['a']]]);
  expect(
    (w.get('input[type=checkbox]').element as HTMLInputElement).checked,
  ).toBe(false);
  await w.setProps({ modelValue: [['a']] });
  expect(
    (w.get('input[type=checkbox]').element as HTMLInputElement).checked,
  ).toBe(true);
});
it('ArrowRight on a leaf does not commit a selection', async () => {
  const w = mount(Cascader, {
    props: { options: [{ key: 'a', label: 'A' }], teleported: false },
  });
  await w.get('button').trigger('click');
  await w.get('[data-option]').trigger('keydown', { key: 'ArrowRight' });
  expect(w.emitted('update:modelValue')).toBeUndefined();
});
it('links Form errors and validates an unopened field on blur', async () => {
  const { h } = await import('vue');
  const { ZtForm, ZtFormItem } = await import('../form');
  const w = mount(ZtForm, {
    props: {
      model: { path: [] },
      rules: {
        path: { required: true, message: '请选择路径', trigger: 'blur' },
      },
    },
    slots: {
      default: () =>
        h(ZtFormItem, { prop: 'path', label: '路径' }, () => h(Cascader)),
    },
  });
  await w
    .get('.zt-cascader')
    .trigger('focusout', { relatedTarget: document.body });
  await flushPromises();
  const error = document.getElementById(w.get('[role=combobox]').attributes('aria-describedby') || '');
  expect(error).not.toBeNull();
  expect(w.get('[role=combobox]').attributes('aria-describedby') || '').toBe(
    error?.id,
  );
});
it('applies inherited size to the teleported panel', async () => {
  const { h } = await import('vue');
  const { ZtConfigProvider } = await import('../config-provider');
  const w = mount(ZtConfigProvider, {
    props: { size: 'large' },
    slots: {
      default: () =>
        h(Cascader, { options: [{ key: 'a', label: 'A' }], teleported: false }),
    },
  });
  await w.get('button').trigger('click');
  expect(w.get('.zt-cascader__panel').classes()).toContain(
    'zt-cascader__panel--large',
  );
});
