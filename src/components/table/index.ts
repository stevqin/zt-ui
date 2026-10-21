import TableColumn from './ZtTableColumn.vue';
import type { ZtTableColumn as ColumnDefinition } from './types';
export { default as ZtTable } from './ZtTable.vue';
export * from './types';

export const ZtTableColumn = TableColumn;
// Preserve the existing type import alongside the new runtime component.
export type ZtTableColumn = ColumnDefinition;
