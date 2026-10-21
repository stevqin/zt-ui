import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import * as library from '../src/components/table';
import Table from '../src/components/table/ZtTable.vue';
import Config from '../src/components/config-provider/ZtConfigProvider.vue';
const data = [
  { id: 1, name: 'B', sales: 20 },
  { id: 2, name: 'A', sales: 10 },
];
// Resolve dynamically so the red phase reports the missing public export.
const Column = () => (library as Record<string, any>).ZtTableColumn;
it('exports a declarative column component', () =>
  expect(Column()).toBeDefined());
describe('template columns', () => {
  it('renders scoped cells/header, formatting, sorting and resizing through the same table', async () => {
    const w = mount(Table, {
      props: { data, resizable: true, selection: true },
      slots: {
        default: () => [
          h(
            Column(),
            {
              prop: 'name',
              label: '门店',
              width: 120,
              fixed: 'left',
              sortable: true,
            },
            {
              default: ({ value, index }: any) =>
                h('strong', `${index}:${value}`),
              header: ({ column }: any) => `自定义${column.label}`,
            },
          ),
          h(Column(), {
            prop: 'sales',
            label: '销售额',
            width: 160,
            align: 'right',
            formatter: (value: number) => `¥${value}`,
          }),
        ],
      },
    });
    expect(w.findAll('thead th')).toHaveLength(3);
    expect(w.get('[data-sort=name]').text()).toBe('自定义门店');
    expect(w.get('tbody strong').text()).toBe('0:B');
    expect(w.text()).toContain('¥20');
    await w.get('[data-sort=name]').trigger('click');
    expect(w.get('tbody strong').text()).toBe('0:A');
    await w.get('[data-resize=name]').trigger('keydown', { key: 'ArrowRight' });
    expect(w.emitted('column-resize')?.[0]).toEqual([
      { prop: 'name', width: 130 },
    ]);
    expect(w.get('[data-column=name]').attributes('style')).toContain(
      'left: 44px',
    );
  });
  it('reacts to v-if/v-for, reorder and changed column props without stale columns', async () => {
    const show = ref(true),
      fields = ref(['name', 'sales']),
      title = ref('旧标题');
    const Host = defineComponent({
      components: { Table, Column: Column() },
      setup: () => ({ data, show, fields, title }),
      template: `<Table :data="data"><template v-for="field in fields" :key="field"><Column v-if="show || field === 'name'" :prop="field" :label="field === 'name' ? title : field" /></template></Table>`,
    });
    const w = mount(Host);
    expect(w.findAll('thead th').map((th) => th.text())).toEqual([
      '旧标题',
      'sales',
    ]);
    title.value = '新标题';
    fields.value = ['sales', 'name'];
    await w.vm.$nextTick();
    expect(w.findAll('thead th').map((th) => th.text())).toEqual([
      'sales',
      '新标题',
    ]);
    show.value = false;
    await w.vm.$nextTick();
    expect(w.findAll('thead th').map((th) => th.text())).toEqual(['新标题']);
  });
  it('updates when a parent replaces slot functions without changing props', async () => {
    const alternate = ref(false);
    const Host = defineComponent({
      setup() {
        return () => {
          const label = alternate.value ? '更新列' : '原列';
          const fields = alternate.value ? ['sales', 'name'] : ['name'];
          return h(
            Table,
            { data, 'aria-label': '门店表' },
            {
              default: () => fields.map((prop) => h(Column(), { prop, label })),
              ...(alternate.value ? { 'header-name': () => '动态表头' } : {}),
            },
          );
        };
      },
    });
    const w = mount(Host);
    expect(w.findAll('thead th').map((th) => th.text())).toEqual(['原列']);
    alternate.value = true;
    await w.vm.$nextTick();
    expect(w.findAll('thead th').map((th) => th.text())).toEqual([
      '更新列',
      '动态表头',
    ]);
    expect(w.get('.zt-table').attributes('aria-label')).toBe('门店表');
  });
  it('keeps resizing when data refreshes with equivalent template declarations', async () => {
    const w = mount(Table, {
      props: { data, resizable: true },
      slots: {
        default: () => h(Column(), { prop: 'name', label: '门店', width: 120 }),
      },
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
    await w.setProps({ data: [...data, { id: 3, name: 'C', sales: 30 }] });
    expect(w.classes()).toContain('is-resizing');
    document.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        pointerId: 1,
        clientX: 160,
      }),
    );
    await w.vm.$nextTick();
    expect(w.emitted('column-resize')?.[0]).toEqual([
      { prop: 'name', width: 160 },
    ]);
    w.unmount();
  });
  it('preserves an explicit default cell slot in columns mode', () => {
    const w = mount(Table, { props: { data, columns: [{prop:'name', label:'门店', slot:'default'}] }, slots: {default: ({value}: any) => `原默认单元格${value}`} });
    expect(w.get('tbody td').text()).toBe('原默认单元格B');
  });
  it('keeps columns API precedence and forwards named cell/expand/empty slots and attrs', async () => {
    const w = mount(Table, {
      attrs: { 'aria-label': '门店表' },
      props: {
        data,
        columns: [{ prop: 'name', label: '数组列' }],
        expandable: true,
        expandedKeys: [1],
      },
      slots: {
        default: () => h(Column(), { prop: 'sales', label: '模板列' }),
        name: ({ value }: any) => `旧插槽${value}`,
        expand: ({ row }: any) => `详情${row.id}`,
        empty: '空列表',
      },
    });
    expect(w.get('[data-column=name]').text()).toBe('数组列');
    expect(w.find('[data-column=sales]').exists()).toBe(false);
    expect(w.text()).toContain('旧插槽B');
    expect(w.text()).toContain('详情1');
    expect(w.attributes('aria-label')).toBe('门店表');
    await w.setProps({ data: [] });
    expect(w.text()).toContain('空列表');
  });
});
it('scales sort glyphs for each size, including provider inheritance and runtime updates', async () => {
  const size = ref('mini');
  const w = mount({
    render: () =>
      h(Config, { size: size.value as any }, () =>
        h(Table, {
          data,
          columns: [{ prop: 'name', label: '门店', sortable: true }],
        }),
      ),
  });
  const expected = [10, 11, 12, 13, 14];
  for (const [i, value] of [
    'mini',
    'small',
    'default',
    'medium',
    'large',
  ].entries()) {
    size.value = value;
    await w.vm.$nextTick();
    expect(
      w.get('.zt-table__sort-icons .zt-icon-glyph').attributes('style'),
    ).toContain(`--zt-icon-size: ${expected[i]}px`);
  }
});
