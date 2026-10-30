import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { h } from 'vue';
import TableOverflow from '../src/components/table/TableOverflow.vue';
import ZtTooltip from '../src/components/tooltip/ZtTooltip.vue';
import ZtTableColumn from '../src/components/table/ZtTableColumn.vue';
import ZtTable from '../src/components/table/ZtTable.vue';
const data = [
  { id: 1, name: '甲', group: 'A', amount: 4 },
  { id: 2, name: '乙', group: 'B', amount: 6 },
];
const columns = [
  { prop: 'no', label: '序号', type: 'index' as const, index: 5 },
  { prop: 'name', label: '名称' },
  { prop: 'amount', label: '金额' },
];
describe('Table 增强', () => {
  it('支持序号和默认汇总', () => {
    const w = mount(ZtTable, { props: { data, columns, showSummary: true } });
    expect(w.find('tbody tr td').text()).toBe('5');
    expect(w.find('tfoot').text()).toContain('10');
  });
  it('本地筛选保留格式化显示索引', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '名称', formatter: (_v, _r, i) => `显示${i}` },
          { prop: 'group', label: '分组' },
        ],
        filters: { group: ['B'] },
      },
    });
    expect(w.findAll('tbody tr')).toHaveLength(1);
    expect(w.find('tbody').text()).toContain('显示0');
  });
  it('远程模式不在本地筛选', () => {
    const w = mount(ZtTable, {
      props: { data, columns, remote: true, filters: { group: ['B'] } },
    });
    expect(w.findAll('tbody tr')).toHaveLength(2);
  });
  it('合并截断到固定列边界并隐藏0跨度', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [
          { prop: 'name', label: '名称', fixed: 'left' },
          { prop: 'amount', label: '金额' },
        ],
        spanMethod: ({ rowIndex, columnIndex }) =>
          rowIndex === 0 ? [2, 99] : columnIndex === 0 ? [0, 0] : [1, 1],
      },
    });
    expect(w.find('tbody td').attributes('colspan')).toBe('1');
    expect(w.find('tbody td').attributes('rowspan')).toBe('2');
  });
  it('高亮与样式使用原始行上下文', async () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns,
        highlightCurrentRow: true,
        rowClassName: ({ rowIndex }) => `row-${rowIndex}`,
        cellStyle: () => ({ color: 'red' }),
      },
    });
    await w.find('tbody tr').trigger('click');
    expect(w.find('tbody tr').classes()).toContain('is-current');
    expect(w.emitted('current-change')?.[0]?.[0]).toEqual(data[0]);
    expect(w.find('tbody tr').classes()).toContain('row-0');
    expect(w.find('tbody td').attributes('style')).toContain('color: red');
  });
  it('自定义汇总收到当前可见数据列与数据', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns,
        showSummary: true,
        summaryMethod: ({ data }) => ['统计', '', data.length],
      },
    });
    expect(w.find('tfoot').text()).toContain('统计2');
  });
  it('筛选保留插槽原始索引，且不修改原数据', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [{ prop: 'name', label: '名称' }],
        filters: { group: ['B'] },
      },
      slots: { name: ({ rowIndex, index }) => `${rowIndex}/${index}` },
    });
    expect(w.find('tbody td').text()).toBe('1/0');
    expect(data[0].id).toBe(1);
  });
  it('筛选控件发出完整受控值但不自行改变受控数据', async () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [
          {
            prop: 'group',
            label: '分组',
            filters: [
              { text: '甲组', value: 'A' },
              { text: '乙组', value: 'B' },
            ],
          },
        ],
        filters: {},
      },
    });
    await w.get('[data-filter="group"]').trigger('click');
    const input = document.querySelector<HTMLInputElement>(
      '.zt-table__filter-options input',
    )!;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(w.emitted('filter-change')?.[0]).toEqual([{ group: ['A'] }]);
    await w.vm.$nextTick();
    expect(input.checked).toBe(false);
    expect(w.findAll('tbody tr')).toHaveLength(2);
    w.unmount();
  });
  it('模板序号列无需 prop 且允许函数', () => {
    const w = mount(ZtTable, {
      props: { data },
      slots: {
        default: () =>
          h(ZtTableColumn, {
            type: 'index',
            index: (index: number) => `第${index + 1}项`,
          }),
      },
    });
    expect(w.find('th').text()).toBe('序号');
    expect(w.find('tbody td').text()).toBe('第1项');
  });
  it('受控当前行保持不变并给出上一行', async () => {
    const w = mount(ZtTable, {
      props: { data, columns, highlightCurrentRow: true, currentRowKey: 2 },
    });
    await w.find('tbody tr').trigger('click');
    expect(w.findAll('tbody tr')[1].classes()).toContain('is-current');
    expect(w.emitted('current-change')?.[0]).toEqual([data[0], data[1]]);
  });
  it('零跨度隐藏单元格，工具列不会被合并', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [{ prop: 'name', label: '名称' }],
        selection: true,
        spanMethod: ({ rowIndex }) => (rowIndex === 0 ? [2, 99] : [0, 0]),
      },
    });
    expect(w.findAll('tbody tr')[1].findAll('td')).toHaveLength(1);
    expect(w.find('tbody td').attributes('rowspan')).toBeUndefined();
    expect(
      w.findAll('tbody tr')[0].findAll('td')[1].attributes('rowspan'),
    ).toBe('2');
  });
  it('溢出提示只在内容超出实际宽度时启用', async () => {
    const scroll = vi
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockReturnValue(300);
    const client = vi
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockReturnValue(100);
    const w = mount(TableOverflow, { slots: { default: '完整说明' } });
    await w.vm.$nextTick();
    expect(w.findComponent(ZtTooltip).props('disabled')).toBe(false);
    expect(w.findComponent(ZtTooltip).props('content')).toBe('完整说明');
    w.unmount();
    scroll.mockRestore();
    client.mockRestore();
  });
  it('短内容不启用提示', () => {
    const w = mount(TableOverflow, { slots: { default: '说明' } });
    expect(w.findComponent(ZtTooltip).props('disabled')).toBe(true);
    w.unmount();
  });
  it('当前行支持键盘选择且不会劫持子控件按键', async () => {
    const w = mount(ZtTable, {
      props: { data, columns, highlightCurrentRow: true },
    });
    await w.find('tbody tr').trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:currentRowKey')?.[0]).toEqual([1]);
  });
  it('自定义筛选回调使用原始索引且支持数值选项', () => {
    const filter = vi.fn((value, row, rowIndex) => value === rowIndex);
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [{ prop: 'name', label: '名称', filterMethod: filter }],
        filters: { name: [1] },
      },
    });
    expect(w.findAll('tbody tr')).toHaveLength(1);
    expect(filter).toHaveBeenCalledWith(1, data[1], 1);
  });
  it('跨展开详情的纵向合并截断，避免覆盖详情', () => {
    const w = mount(ZtTable, {
      props: {
        data,
        columns: [{ prop: 'name', label: '名称' }],
        expandable: true,
        expandedKeys: [1],
        spanMethod: () => [99, 99],
      },
    });
    expect(
      w.findAll('tbody tr')[0].findAll('td')[1].attributes('rowspan'),
    ).toBe('1');
  });
  it('展开边界裁剪合并后恢复失去覆盖的零跨度单元格', () => {
    const w = mount(ZtTable, { props: {
      data, columns: [{ prop: 'name', label: '名称' }, { prop: 'amount', label: '金额' }],
      expandable: true, expandedKeys: [1],
      spanMethod: ({ rowIndex, columnIndex }) => columnIndex === 1 ? (rowIndex === 0 ? [2, 1] : [0, 0]) : [1, 1],
    } });
    const second = w.findAll('tbody tr')[2];
    expect(second.findAll('td')).toHaveLength(3);
    expect(second.findAll('td')[1].text()).toBe('乙');
    expect(second.findAll('td')[2].text()).toBe('6');
  });
  it('固定分区裁剪合并后恢复失去覆盖的零跨度单元格', () => {
    const w = mount(ZtTable, { props: {
      data: data.slice(0, 1), columns: [{ prop: 'name', label: '名称', fixed: 'left' }, { prop: 'amount', label: '金额' }],
      spanMethod: ({ columnIndex }) => columnIndex === 0 ? [1, 2] : [0, 0],
    } });
    expect(w.findAll('tbody td')).toHaveLength(2);
    expect(w.findAll('tbody td')[1].text()).toBe('4');
  });
  it('工具列与序号列截断合并后恢复零跨度，仍保留合法覆盖及独立零跨度', () => {
    for (const middle of ['selection', 'index'] as const) {
      const w = mount(ZtTable, {
        props: { data: data.slice(0, 1), spanMethod: ({ columnIndex }) => columnIndex === 0 ? [1, 3] : [0, 0] },
        slots: { default: () => [h(ZtTableColumn, { prop: 'name' }), h(ZtTableColumn, { type: middle }), h(ZtTableColumn, { prop: 'amount' })] },
      });
      expect(w.findAll('tbody td')).toHaveLength(3);
      expect(w.findAll('tbody td')[2].text()).toBe('4');
      w.unmount();
    }
    const w = mount(ZtTable, { props: {
      data, columns: [{ prop: 'name', label: '名称' }, { prop: 'amount', label: '金额' }],
      spanMethod: ({ rowIndex, columnIndex }) => columnIndex === 0 ? (rowIndex === 0 ? [2, 1] : [0, 0]) : [0, 0],
    } });
    expect(w.findAll('tbody tr')[0].findAll('td')).toHaveLength(1);
    expect(w.findAll('tbody tr')[1].findAll('td')).toHaveLength(0);
  });

  it('单元格样式覆盖默认和显式对齐，固定列布局保持受保护', () => {
    const w = mount(ZtTable, { props: {
      data: data.slice(0, 1),
      columns: [{ prop: 'name', label: '名称' }, { prop: 'group', label: '分组', align: 'center' }, { prop: 'amount', label: '金额', fixed: 'right', width: 100 }],
      cellStyle: () => ({ textAlign: 'right', position: 'relative', right: '99px', zIndex: 99, width: '999px', color: 'red' }),
    } });
    const cells = w.findAll('tbody td');
    expect(cells[0].element.style.textAlign).toBe('right');
    expect(cells[1].element.style.textAlign).toBe('right');
    expect(cells[2].element.style.textAlign).toBe('right');
    expect(cells[2].element.style.position).toBe('sticky');
    expect(cells[2].element.style.right).toBe('0px');
    expect(cells[2].element.style.zIndex).toBe('2');
    expect(cells[2].element.style.width).toBe('100px');
    expect(cells[2].element.style.color).toBe('red');
  });
  it('筛选排序后的展开插槽同时提供原始和显示索引', () => {
    const w = mount(ZtTable, { props: {
      data, columns: [{ prop: 'amount', label: '金额' }], filters: { group: ['B'] },
      sort: { prop: 'amount', order: 'descending' }, expandable: true, expandedKeys: [2],
    }, slots: { expand: ({ rowIndex, index }) => `原始${rowIndex}/显示${index}` } });
    expect(w.get('.zt-table__expanded').text()).toBe('原始1/显示0');
  });

  it.each([false, true])('边界计算保持线性读取量（spanMethod=%s）', (withSpan) => {
    let keyReads = 0;
    const count = 150;
    const rows = Array.from({ length: count }, (_, id) => ({
      get id() { keyReads++; return id; }, a: id, b: id, c: id, d: id,
    }));
    const w = mount(ZtTable, { props: {
      data: rows, columns: ['a', 'b', 'c', 'd'].map(prop => ({ prop, label: prop })),
      expandable: true, expandedKeys: [],
      ...(withSpan ? { spanMethod: () => [1, 1] as [number, number] } : {}),
    } });
    expect(w.findAll('tbody tr')).toHaveLength(count);
    expect(keyReads).toBeLessThan(count * 40);
    w.unmount();
  });
  it('原始行索引按数据变化缓存，避免逐单元格线性搜索', async () => {
    let rowReads = 0;
    const count = 80;
    const source = Array.from({ length: count }, (_, id) => ({ id, a: id, b: id, c: id, d: id }));
    const rows = new Proxy(source, { get(target, property, receiver) {
      if (typeof property === 'string' && /^\d+$/.test(property)) rowReads++;
      return Reflect.get(target, property, receiver);
    } });
    const style = vi.fn(({ rowIndex }) => ({ color: rowIndex % 2 ? 'red' : 'blue' }));
    const w = mount(ZtTable, { props: {
      data: rows, columns: ['a', 'b', 'c', 'd'].map(prop => ({ prop, label: prop })), cellStyle: style,
    } });
    expect(rowReads).toBeLessThan(count * 40);
    expect(style).toHaveBeenCalledWith(expect.objectContaining({ rowIndex: count - 1 }));
    await w.setProps({ data: [...source].reverse() });
    expect(w.find('tbody td').attributes('style')).toContain('color: blue');
    expect(style).toHaveBeenLastCalledWith(expect.objectContaining({ row: source[0], rowIndex: count - 1 }));
    w.unmount();
  });

});
