<script setup lang="ts">
import { h, type Slots, type VNode } from 'vue';
import { useZtSize } from '../config-provider/context';
import TableContent from './TableContent.vue';
import { resolveTableColumns } from './columns';
import type {
  ZtTableProps,
  ZtTableKey,
  ZtTableRow,
  ZtTableSort,
  ZtTableColumnResize,
  ZtTableCellScope,
  ZtTableHeaderScope,
  ZtTableFilters,
} from './types';
defineOptions({ name: 'ZtTable', inheritAttrs: false });
const props = withDefaults(defineProps<ZtTableProps>(), {
  data: () => [],
  rowKey: 'id',
  selectedKeys: () => [],
  expandedKeys: () => [],
  emptyText: '暂无数据',
  resizable: false,
  selectionType: 'checkbox',
});
const size = useZtSize(props);
const emit = defineEmits<{
  'update:selectedKeys': [keys: ZtTableKey[]];
  'selection-change': [rows: ZtTableRow[]];
  'update:expandedKeys': [keys: ZtTableKey[]];
  'expand-change': [row: ZtTableRow, expanded: boolean];
  'column-resize': [value: ZtTableColumnResize];
  'sort-change': [sort: ZtTableSort];
  'update:sort': [sort: ZtTableSort];
  /** 完整筛选值变化；remote 时触发远程请求。 */
  'filter-change': [filters: ZtTableFilters];
  /** 更新受控筛选值。 */
  'update:filters': [filters: ZtTableFilters];
  /** 更新当前行 key。 */
  'update:currentRowKey': [key: ZtTableKey | null];
  /** 当前行及上一行；缺失时为 null。 */
  'current-change': [row: ZtTableRow | null, previous: ZtTableRow | null];
  'row-click': [row: ZtTableRow, event: MouseEvent];
}>();

defineSlots<{
  /** 通过 ZtTableColumn 声明列；显式传入 columns 时以数组配置为准。 */
  default?: (scope: ZtTableCellScope) => VNode[];
  /** 展开行详情；index 为显示索引，rowIndex 为原始 data 索引。 */
  expand?: (scope: { row: ZtTableRow; index: number; rowIndex: number }) => VNode[];
  /** 自定义空状态。 */
  empty?: () => VNode[];
  [name: string]:
    ((scope: ZtTableCellScope & ZtTableHeaderScope) => VNode[]) | undefined;
}>();
// Resolve declarations during render, so conditional columns and scoped slots stay reactive.
const RenderTable = (input: {
  tableSlots: Slots;
  tableAttrs: Record<string, unknown>;
}) => {
  const slots = input.tableSlots;
  const resolved =
    props.columns !== undefined
      ? {
          columns: props.columns,
          slots: {},
          layout: undefined,
          selection: props.selection,
          selectionType: props.selectionType,
          expandable: props.expandable,
        }
      : resolveTableColumns(slots.default?.(), props);
  const { default: declarations, ...namedSlots } = slots;
  return h(
    TableContent,
    {
      ...input.tableAttrs,
      ...props,
      size: size.value,
      columns: resolved.columns,
      columnLayout: resolved.layout,
      selection: resolved.selection,
      selectionType: resolved.selectionType,
      expandable: resolved.expandable,
      'onUpdate:selectedKeys': (keys: ZtTableKey[]) =>
        emit('update:selectedKeys', keys),
      onSelectionChange: (rows: ZtTableRow[]) => emit('selection-change', rows),
      'onUpdate:expandedKeys': (keys: ZtTableKey[]) =>
        emit('update:expandedKeys', keys),
      onExpandChange: (row: ZtTableRow, expanded: boolean) =>
        emit('expand-change', row, expanded),
      onColumnResize: (value: ZtTableColumnResize) =>
        emit('column-resize', value),
      onSortChange: (sort: ZtTableSort) => emit('sort-change', sort),
      'onUpdate:sort': (sort: ZtTableSort) => emit('update:sort', sort),
      'onUpdate:filters': (value: ZtTableFilters) =>
        emit('update:filters', value),
      onFilterChange: (value: ZtTableFilters) => emit('filter-change', value),
      'onUpdate:currentRowKey': (value: ZtTableKey | null) =>
        emit('update:currentRowKey', value),
      onCurrentChange: (row: ZtTableRow | null, previous: ZtTableRow | null) =>
        emit('current-change', row, previous),
      onRowClick: (row: ZtTableRow, event: MouseEvent) =>
        emit('row-click', row, event),
    },
    {
      ...(props.columns !== undefined ? slots : namedSlots),
      ...resolved.slots,
    },
  );
};
RenderTable.props = ['tableSlots', 'tableAttrs'];
</script>
<template>
  <RenderTable :table-slots="{ ...$slots }" :table-attrs="{ ...$attrs }" />
</template>
