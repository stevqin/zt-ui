import type { ZtTableColumn, ZtTableColumnProps, ZtTableProps } from './types';
export type TableUtility = 'selection' | 'expansion';
export interface TableLayoutColumn extends ZtTableColumn {
  utility?: TableUtility;
  selectionType?: 'checkbox' | 'radio';
}
export function utilityColumn(
  type: 'selection' | 'radio' | 'expand',
  options: Partial<ZtTableColumnProps> = {},
): TableLayoutColumn {
  const utility = type === 'expand' ? 'expansion' : 'selection';
  return {
    ...options,
    prop: `__zt-table-${utility}`,
    label: options.label ?? (utility === 'expansion' ? '展开行' : '选择行'),
    utility,
    selectionType: type === 'radio' ? 'radio' : 'checkbox',
    fixed: options.fixed ?? 'left',
    width: options.width ?? 44,
    sortable: false,
    resizable: false,
  };
}
export function legacyTableLayout(props: ZtTableProps): TableLayoutColumn[] {
  return [
    ...(props.selection
      ? [utilityColumn(props.selectionType === 'radio' ? 'radio' : 'selection')]
      : []),
    ...(props.expandable ? [utilityColumn('expand')] : []),
    ...(props.columns ?? []),
  ];
}
