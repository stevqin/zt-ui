import { Fragment, isVNode, type VNode, type Slots } from 'vue';
import ZtTableColumn from './ZtTableColumn.vue';
import type {
  ZtTableColumn as ColumnDefinition,
  ZtTableColumnProps,
  ZtTableProps,
} from './types';
import { utilityColumn, type TableLayoutColumn } from './layout';

/** Read declaration VNodes without mounting them or adding elements to the table. */
export function resolveTableColumns(nodes: unknown, legacy: ZtTableProps = {}) {
  const columns: ColumnDefinition[] = [];
  const layout: TableLayoutColumn[] = [];
  const slots: Record<string, Slots[string]> = {};
  function visit(children: unknown) {
    if (Array.isArray(children)) {
      children.forEach(visit);
      return;
    }
    if (!isVNode(children)) return;
    const node: VNode = children;
    if (node.type === Fragment) {
      visit(node.children);
      return;
    }
    if (node.type !== ZtTableColumn) return;
    const column = Object.fromEntries(
      Object.entries(node.props ?? {})
        .filter(([name]) => !['key', 'ref'].includes(name))
        .map(([name, value]) => [
          name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
          value,
        ]),
    ) as unknown as ZtTableColumnProps;
    for (const prop of ['sortable', 'resizable'] as const) {
      if ((column[prop] as unknown) === '') column[prop] = true;
    }
    const content = node.children as Slots | null;
    if (
      column.type === 'selection' ||
      column.type === 'radio' ||
      column.type === 'expand'
    ) {
      const item = utilityColumn(column.type, column);
      // A table has one selection model and one expanded-row model.
      if (layout.some((existing) => existing.utility === item.utility)) return;
      layout.push(item);
      if (item.utility === 'expansion' && content?.default) {
        slots.expand = (scope) =>
          content.default!({ ...scope, column: item, value: undefined });
      }
      if (content?.header) slots[`header-${item.prop}`] = content.header;
      return;
    }
    if (!column.prop) return;
    const item: ColumnDefinition = {
      ...column,
      prop: column.prop,
      label: column.label ?? column.prop,
    };
    if (content?.default) slots[item.slot ?? item.prop] = content.default;
    if (content?.header) slots[`header-${item.prop}`] = content.header;
    columns.push(item);
    layout.push(item);
  }
  visit(nodes);
  const prefix: TableLayoutColumn[] = [];
  if (legacy.selection && !layout.some((c) => c.utility === 'selection'))
    prefix.push(
      utilityColumn(legacy.selectionType === 'radio' ? 'radio' : 'selection'),
    );
  if (legacy.expandable && !layout.some((c) => c.utility === 'expansion'))
    prefix.push(utilityColumn('expand'));
  layout.unshift(...prefix);
  return {
    columns,
    slots,
    layout,
    selection: layout.some((c) => c.utility === 'selection'),
    selectionType:
      layout.find((c) => c.utility === 'selection')?.selectionType ??
      legacy.selectionType,
    expandable: layout.some((c) => c.utility === 'expansion'),
  };
}
