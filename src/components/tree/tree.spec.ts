import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Tree from './ZtTree.vue';
import { flattenTree, toggleChecked } from './model';
const data = [
  {
    key: 'a',
    label: 'A',
    children: [
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C', disabled: true },
    ],
  },
];
describe('tree model', () => {
  it('checks enabled descendants and derives parents', () => {
    const rows = flattenTree(data);
    expect(toggleChecked(rows, [], 'a', false)).toEqual(['a', 'b']);
    expect(toggleChecked(rows, ['a', 'b'], 'b', false)).toEqual([]);
  });
  it('strict checks are independent', () =>
    expect(toggleChecked(flattenTree(data), [], 'a', true)).toEqual(['a']));
});
describe('tree', () => {
  it('filters with ancestors and supports keyboard', async () => {
    const w = mount(Tree, { props: { data, filter: 'B' } });
    expect(w.findAll('[role=treeitem]')).toHaveLength(2);
    await w.get('[role=tree]').trigger('keydown', { key: 'ArrowDown' });
    await w.get('[role=tree]').trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:selectedKeys')).toBeTruthy();
  });
  it('virtualizes 10000 rows', () => {
    const w = mount(Tree, {
      props: {
        data: Array.from({ length: 10000 }, (_, key) => ({
          key,
          label: String(key),
        })),
        virtual: true,
        height: 200,
      },
    });
    expect(w.findAll('[role=treeitem]').length).toBeLessThan(30);
  });
  it('retries lazy failures', async () => {
    let calls = 0;
    const w = mount(Tree, {
      props: {
        data: [{ key: 1, label: 'Root', isLeaf: false }],
        load: async () => {
          if (++calls === 1) throw Error('failed');
          return [{ key: 2, label: 'Child' }];
        },
      },
    });
    await w.get('[data-expand]').trigger('click');
    await flushPromises();
    await w.get('[data-retry]').trigger('click');
    await flushPromises();
    expect(w.text()).toContain('Child');
  });
});
it('controlled checks propagate, skip disabled, and wait for props', async () => {
  const w = mount(Tree, {
    props: { data, checkable: true, defaultExpandedKeys: ['a'] },
  });
  await w.findAll('input')[0]!.setValue(true);
  expect(w.emitted('update:checkedKeys')?.[0]).toEqual([['a', 'b']]);
  expect(w.findAll('input')[0]!.element.checked).toBe(false);
  await w.setProps({ checkedKeys: ['a', 'b'] });
  expect(w.findAll('input')[1]!.element.checked).toBe(true);
  expect(w.findAll('input')[2]!.element.disabled).toBe(true);
});
it('strict mode does not mark descendants', async () => {
  const w = mount(Tree, {
    props: {
      data,
      checkable: true,
      checkStrictly: true,
      checkedKeys: ['a'],
      defaultExpandedKeys: ['a'],
    },
  });
  expect(w.findAll('input')[1]!.element.checked).toBe(false);
});
it('virtual keyboard End mounts and selects the last key', async () => {
  const w = mount(Tree, {
    props: {
      data: Array.from({ length: 1000 }, (_, key) => ({
        key,
        label: String(key),
      })),
      virtual: true,
      height: 120,
    },
  });
  await w.get('[role=tree]').trigger('keydown', { key: 'End' });
  await w.get('[role=tree]').trigger('keydown', { key: 'Enter' });
  expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[999]]);
  expect(w.text()).toContain('999');
});
it('ignores stale lazy results when data is replaced', async () => {
  let resolve!: (value: any[]) => void;
  const w = mount(Tree, {
    props: {
      data: [{ key: 1, label: 'Old', isLeaf: false }],
      load: () => new Promise((r) => (resolve = r)),
    },
  });
  await w.get('[data-expand]').trigger('click');
  await w.setProps({ data: [{ key: 1, label: 'New' }] });
  resolve([{ key: 2, label: 'Stale' }]);
  await flushPromises();
  expect(w.text()).not.toContain('Stale');
});
it('ArrowRight on a leaf keeps focus and does not select its sibling', async () => {
  const w = mount(Tree, {
    props: {
      data: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B' },
      ],
    },
  });
  await w.trigger('keydown', { key: 'ArrowRight' });
  await w.trigger('keydown', { key: 'Enter' });
  expect(w.emitted('update:selectedKeys')?.[0]).toEqual([['a']]);
});
it('ArrowRight skips disabled children of an expanded parent', async () => {
  const w = mount(Tree, {
    props: {
      data: [
        {
          key: 'parent',
          label: 'Parent',
          children: [
            { key: 'disabled', label: 'Disabled', disabled: true },
            { key: 'enabled', label: 'Enabled' },
          ],
        },
      ],
      defaultExpandedKeys: ['parent'],
    },
  });
  await w.trigger('keydown', { key: 'ArrowRight' });
  await w.trigger('keydown', { key: 'Enter' });
  expect(w.emitted('update:selectedKeys')?.[0]).toEqual([['enabled']]);
});
it('virtual manual scrolling never points aria-activedescendant at absent DOM', async () => {
  const w = mount(Tree, {
    props: {
      data: Array.from({ length: 1000 }, (_, key) => ({
        key,
        label: String(key),
      })),
      virtual: true,
      height: 120,
    },
  });
  w.element.scrollTop = 2000;
  await w.trigger('scroll');
  const id = w.attributes('aria-activedescendant');
  expect(
    id === undefined ||
      w.findAll('[role=treeitem]').some((row) => row.attributes('id') === id),
  ).toBe(true);
});
