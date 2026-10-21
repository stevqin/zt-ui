import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import { ZtTable, ZtTableColumn } from '../src/components/table';
const data = [
  { id: 1, name: '杭州' },
  { id: 2, name: '上海' },
  { id: 3, name: '深圳' },
];
const field = () =>
  h(ZtTableColumn, { prop: 'name', label: '门店', width: 120, fixed: 'left' });
const utility = (
  type: string,
  extra: Record<string, unknown> = {},
  slots?: any,
) => h(ZtTableColumn, { type, ...extra } as any, slots);
describe('Table template utility columns', () => {
  it('declares a checkbox column in place, preserves controlled selection and skips disabled rows', async () => {
    const w = mount(ZtTable, {
      props: { data, selectedKeys: [1], selectable: (r) => r.id !== 2 },
      slots: { default: () => [field(), utility('selection', { width: 64 })] },
    });
    expect(
      w
        .findAll('thead th')
        .map(
          (th) =>
            th.attributes('data-table-utility') ?? th.attributes('data-column'),
        ),
    ).toEqual(['name', 'selection']);
    expect(w.findAll('tbody .zt-checkbox')).toHaveLength(3);
    expect(
      (w.get('thead input').element as HTMLInputElement).indeterminate,
    ).toBe(true);
    await w.get('thead input').setValue(true);
    expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[1, 3]]);
    expect(w.findAll('thead th')[1]!.attributes('style')).toContain(
      'width: 64px',
    );
    expect(w.findAll('tbody input')[1]!.attributes('disabled')).toBeDefined();
    await w.get('tbody .zt-checkbox').trigger('click');
    expect(w.emitted('row-click')).toBeUndefined();
  });
  it('declares radios, emits a single selected key and disables controls while loading', async () => {
    const w = mount(ZtTable, {
      props: { data, selectedKeys: [1] },
      slots: { default: () => [utility('radio'), field()] },
    });
    expect(w.findAll('tbody .zt-radio')).toHaveLength(3);
    expect(w.find('thead input').exists()).toBe(false);
    await w.findAll('tbody input')[2]!.setValue(true);
    expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[3]]);
    expect(
      (w.findAll('tbody input')[2]!.element as HTMLInputElement).checked,
    ).toBe(false);
    await w.setProps({ loading: true });
    expect(
      w
        .findAll('tbody input')
        .every((i) => i.attributes('disabled') !== undefined),
    ).toBe(true);
  });
  it('declares expansion details in its default slot and keeps column order, fixed offsets and colspan', async () => {
    const w = mount(ZtTable, {
      props: { data, expandedKeys: [1], resizable: true, maxHeight: 200 },
      slots: {
        default: () => [
          utility(
            'expand',
            { width: 56 },
            {
              default: ({ row, index }: any) =>
                h('p', `${index}:${row.name}详情`),
            },
          ),
          utility('selection', { width: 64 }),
          field(),
        ],
      },
    });
    expect(w.get('.zt-table__expanded').text()).toBe('0:杭州详情');
    expect(w.get('.zt-table__expanded td').attributes('colspan')).toBe('3');
    expect(w.get('[data-column=name]').attributes('style')).toContain(
      'left: 120px',
    );
    expect(w.findAll('thead th')[1]!.attributes('style')).toContain(
      'left: 56px',
    );
    expect(w.findAll('[data-resize]')).toHaveLength(1);
    await w.get('[data-expand]').trigger('click');
    expect(w.emitted('update:expandedKeys')?.[0]).toEqual([[]]);
    expect(w.emitted('expand-change')?.[0]).toEqual([data[0], false]);
    expect(w.emitted('row-click')).toBeUndefined();
    await w.setProps({ data: [] });
    expect(w.get('.zt-table__empty').attributes('colspan')).toBe('3');
  });
  it('deduplicates legacy props, accepts old expand slots, and reacts to conditional utility types', async () => {
    const mode = ref('selection'),
      show = ref(true);
    const w = mount({
      render: () =>
        h(
          ZtTable,
          { data, selection: true, expandable: true, expandedKeys: [1] },
          {
            default: () => [
              show.value ? utility(mode.value) : null,
              field(),
              utility('expand'),
            ],
            expand: ({ row }: any) => `旧详情${row.name}`,
          },
        ),
    });
    expect(w.findAll('thead th')).toHaveLength(3);
    expect(w.findAll('thead input')).toHaveLength(1);
    mode.value = 'radio';
    await w.vm.$nextTick();
    expect(w.findAll('tbody .zt-radio')).toHaveLength(3);
    expect(w.get('.zt-table__expanded').text()).toBe('旧详情杭州');
    show.value = false;
    await w.vm.$nextTick();
    expect(w.findAll('thead input')).toHaveLength(1);
    expect(w.findAll('thead th')).toHaveLength(3);
  });
  it('preserves a drag on data refresh and updates fixed geometry when a utility width changes', async () => {
    const width = ref(52),
      records = ref(data);
    const w = mount({
      render: () =>
        h(
          ZtTable,
          { data: records.value, resizable: true },
          {
            default: () => [
              utility('selection', { width: width.value }),
              field(),
            ],
          },
        ),
    });
    w.get('[data-resize=name]').element.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        pointerId: 1,
        clientX: 120,
      }),
    );
    document.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        pointerId: 1,
        clientX: 150,
      }),
    );
    records.value = [...data];
    await w.vm.$nextTick();
    expect(w.get('.zt-table').classes()).toContain('is-resizing');
    width.value = 72;
    await w.vm.$nextTick();
    expect(w.get('.zt-table').classes()).not.toContain('is-resizing');
    expect(w.get('[data-column=name]').attributes('style')).toContain(
      'left: 72px',
    );
    expect(
      w.get('[data-table-utility=selection]').attributes('style'),
    ).toContain('width: 72px');
    expect(w.getComponent(ZtTable).emitted('column-resize')).toBeUndefined();
    w.unmount();
  });
  it('leaves explicit columns API precedence and legacy utility behavior intact', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [{ prop: 'name', label: '数组列' }],
        selection: true,
        expandable: true,
      },
      slots: { default: () => [utility('radio'), utility('expand')] },
    });
    expect(w.findAll('thead th')).toHaveLength(3);
    expect(w.find('tbody .zt-checkbox').exists()).toBe(true);
    expect(w.find('tbody .zt-radio').exists()).toBe(false);
    expect(w.get('[data-column=name]').text()).toBe('数组列');
  });
});
