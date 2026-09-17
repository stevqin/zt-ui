import { it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Table from './ZtTable.vue';
const rows = [
  { id: 1, name: 'B', price: 20 },
  { id: 2, name: 'A', price: 10 },
  { id: 3, name: 'C', price: 30 },
];
const columns = [
  { prop: 'name', label: '名称', sortable: true },
  { prop: 'price', label: '价格', sortable: true },
];
it('sorts local rows and reports sort cycle', async () => {
  const w = mount(Table, { props: { data: rows, columns } });
  await w.get('[data-sort=name]').trigger('click');
  expect(w.findAll('tbody tr')[0]!.text()).toContain('A');
  expect(w.emitted('sort-change')?.[0]).toEqual([
    { prop: 'name', order: 'ascending' },
  ]);
  await w.get('[data-sort=name]').trigger('click');
  expect(w.findAll('tbody tr')[0]!.text()).toContain('C');
});
it('selection skips nonselectable rows and computes half selection', async () => {
  const w = mount(Table, {
    props: {
      data: rows,
      columns,
      selection: true,
      selectable: (row) => row.id !== 2,
      selectedKeys: [1],
    },
  });
  expect((w.get('thead input').element as HTMLInputElement).indeterminate).toBe(
    true,
  );
  await w.get('thead input').setValue(true);
  expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[1, 3]]);
});
it('expansion renders named content with controlled keys', async () => {
  const w = mount(Table, {
    props: { data: rows, columns, expandable: true },
    slots: { expand: 'Details' },
  });
  await w.get('[data-expand]').trigger('click');
  expect(w.emitted('update:expandedKeys')?.[0]).toEqual([[1]]);
  await w.setProps({ expandedKeys: [1] });
  expect(w.text()).toContain('Details');
});
it('remote sorting preserves row order', async () => {
  const w = mount(Table, { props: { data: rows, columns, remote: true } });
  await w.get('[data-sort=name]').trigger('click');
  expect(w.findAll('tbody tr')[0]!.text()).toContain('B');
});
it('renders custom cell/header and fixed column offsets', () => {
  const w = mount(Table, {
    props: {
      data: rows,
      columns: [
        { prop: 'name', label: 'Name', width: 120, fixed: 'left' },
        { prop: 'price', label: 'Price', width: 100, fixed: 'left' },
      ],
      selection: true,
      maxHeight: 200,
    },
    slots: {
      name: ({ value }: any) => `店铺 ${value}`,
      'header-name': '门店名称',
    },
  });
  expect(w.text()).toContain('店铺 B');
  expect(w.text()).toContain('门店名称');
  expect(w.findAll('tbody td')[2]!.attributes('style')).toContain(
    'left: 164px',
  );
});
it('empty/loading and controlled sort are explicit', async () => {
  const w = mount(Table, {
    props: { data: rows, columns, sort: { prop: 'name', order: null } },
  });
  await w.get('[data-sort=name]').trigger('click');
  expect(w.findAll('tbody tr')[0]!.text()).toContain('B');
  await w.setProps({ data: [], loading: true });
  expect(w.get('[role=status]').text()).toContain('加载中');
  await w.setProps({ loading: false });
  expect(w.text()).toContain('暂无数据');
});
