import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Table from '../src/components/table/ZtTable.vue';
import Checkbox from '../src/components/checkbox/ZtCheckbox.vue';
import Radio from '../src/components/radio/ZtRadio.vue';
import CheckboxGroup from '../src/components/checkbox/ZtCheckboxGroup.vue';
import { h } from 'vue';
const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
const columns = [{ prop: 'id', label: '编号' }];
describe('Table selection controls', () => {
  it('uses library checkboxes, keeps rejected updates controlled and stops row clicks', async () => {
    const w = mount(Table, {
      props: {
        data,
        columns,
        selection: true,
        selectedKeys: [1],
        selectable: (r) => r.id !== 2,
        size: 'small',
      },
    });
    expect(w.findAllComponents(Checkbox)).toHaveLength(4);
    expect(w.get('thead .zt-checkbox').classes()).toContain('is-indeterminate');
    expect(w.get('tbody .zt-checkbox').classes()).toContain(
      'zt-checkbox--small',
    );
    await w.get('thead input').setValue(true);
    expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[1, 3]]);
    expect((w.get('thead input').element as HTMLInputElement).checked).toBe(
      false,
    );
    await w.get('tbody .zt-checkbox').trigger('click');
    expect(w.emitted('row-click')).toBeUndefined();
    await w.setProps({ selectedKeys: [1, 3] });
    expect((w.get('thead input').element as HTMLInputElement).checked).toBe(
      true,
    );
    expect(w.findAll('tbody input')[1]!.attributes('disabled')).toBeDefined();
  });
  it('supports radio selection without a select-all and only emits one key', async () => {
    const w = mount(Table, {
      props: {
        data,
        columns,
        selection: true,
        selectionType: 'radio',
        selectedKeys: [1],
      },
    });
    expect(w.findAllComponents(Radio)).toHaveLength(3);
    expect(w.find('thead input').exists()).toBe(false);
    await w.findAll('tbody input')[2]!.setValue(true);
    expect(w.emitted('update:selectedKeys')?.[0]).toEqual([[3]]);
    expect(w.emitted('selection-change')?.[0]).toEqual([[data[2]]]);
    expect(
      (w.findAll('tbody input')[2]!.element as HTMLInputElement).checked,
    ).toBe(false);
    await w.setProps({ selectedKeys: [3] });
    expect(w.findAll('.zt-radio.is-checked')).toHaveLength(1);
    expect(
      (w.findAll('tbody input')[2]!.element as HTMLInputElement).checked,
    ).toBe(true);
    await w.setProps({ loading: true });
    expect(
      w
        .findAll('tbody input')
        .every((i) => i.attributes('disabled') !== undefined),
    ).toBe(true);
  });
  it('isolates selection from outer checkbox groups and names radio inputs per table', async () => {
    const outerUpdate = () => {
      throw new Error('Table must not update outer groups');
    };
    const w = mount(CheckboxGroup, {
      props: { modelValue: [], 'onUpdate:modelValue': outerUpdate },
      slots: { default: () => h(Table, { data, columns, selection: true }) },
    });
    await w.get('tbody input').setValue(true);
    expect(w.getComponent(Table).emitted('update:selectedKeys')?.[0]).toEqual([
      [1],
    ]);
    const tables = mount({
      render: () =>
        h('div', [
          h(Table, { data, columns, selection: true, selectionType: 'radio' }),
          h(Table, { data, columns, selection: true, selectionType: 'radio' }),
        ]),
    }).findAllComponents(Table);
    expect(tables[0]!.get('input').attributes('name')).not.toBe(
      tables[1]!.get('input').attributes('name'),
    );
    expect(
      new Set(tables[0]!.findAll('input').map((i) => i.attributes('name')))
        .size,
    ).toBe(1);
  });
});
