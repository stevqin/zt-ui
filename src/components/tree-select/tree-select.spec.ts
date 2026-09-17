import { it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Select from './ZtTreeSelect.vue';
import Tree from '../tree/ZtTree.vue';
it('uses Tree and emits controlled selection', async () => {
  const w = mount(Select, {
    props: {
      data: [{ key: 1, label: 'One' }],
      modelValue: null,
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  w.getComponent(Tree).vm.$emit('update:selectedKeys', [1]);
  expect(w.emitted('update:modelValue')?.[0]).toEqual([1]);
});
it('parent strategy reduces descendants and clear emits an empty array', async () => {
  const w = mount(Select, {
    props: {
      data: [{ key: 1, label: 'Root', children: [{ key: 2, label: 'Leaf' }] }],
      multiple: true,
      checkStrategy: 'parent',
      clearable: true,
      modelValue: [1],
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  w.getComponent(Tree).vm.$emit('update:checkedKeys', [1, 2]);
  expect(w.emitted('update:modelValue')?.[0]).toEqual([[1]]);
  await w.get('[aria-label=清空]').trigger('click');
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([[]]);
});
it('disabled control never opens or emits', async () => {
  const w = mount(Select, {
    props: { disabled: true, data: [{ key: 1, label: 'One' }] },
  });
  await w.get('button').trigger('click');
  expect(w.findComponent(Tree).exists()).toBe(false);
  expect(w.emitted('update:modelValue')).toBeUndefined();
});
it('ignores lazy errors belonging to replaced data', async () => {
  let reject!: (error: Error) => void;
  const w = mount(Select, {
    props: {
      data: [{ key: 1, label: 'Old', isLeaf: false }],
      load: () => new Promise((_, r) => (reject = r)),
      teleported: false,
    },
  });
  await w.get('button').trigger('click');
  await w.get('[data-expand]').trigger('click');
  await w.setProps({ data: [{ key: 1, label: 'New' }] });
  reject(new Error('old request'));
  const { flushPromises } = await import('@vue/test-utils');
  await flushPromises();
  expect(w.emitted('load-error')).toBeUndefined();
});
it('validates an unopened Form field on blur', async () => {
  const { h } = await import('vue');
  const { flushPromises } = await import('@vue/test-utils');
  const { ZtForm, ZtFormItem } = await import('../form');
  const w = mount(ZtForm, {
    props: {
      model: { node: null },
      rules: {
        node: { required: true, message: '请选择节点', trigger: 'blur' },
      },
    },
    slots: {
      default: () =>
        h(ZtFormItem, { prop: 'node', label: '节点' }, () => h(Select)),
    },
  });
  await w
    .get('.zt-tree-select')
    .trigger('focusout', { relatedTarget: document.body });
  await flushPromises();
  expect(w.get('.zt-form-item__error').text()).toBe('请选择节点');
});
