import type { ZtComponentSize } from '../types';
export type ZtTableKey = string | number;
export type ZtTableRow = Record<string, unknown>;
export type ZtTableSortOrder = 'ascending' | 'descending' | null;
export interface ZtTableSort {
  prop: string;
  order: ZtTableSortOrder;
}
export interface ZtTableColumn {
  prop: string;
  label: string;
  width?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean;
  /** Optional comparator for local sorting. */ sortMethod?: (
    a: ZtTableRow,
    b: ZtTableRow,
  ) => number;
  /** Named cell slot; defaults to the property name. */ slot?: string;
  formatter?: (
    value: unknown,
    row: ZtTableRow,
    index: number,
  ) => string | number;
}
export interface ZtTableProps {
  /** 行对象数组；所有行必须具备稳定唯一 rowKey。 */
  data?: ZtTableRow[];
  /** 列配置数组，包含字段、标题、宽度、排序、固定位置和插槽。 */
  columns?: ZtTableColumn[];
  /** 唯一 key 字段名或函数，默认 id；必须得到 string 或 number，否则抛错。 */
  rowKey?: string | ((row: ZtTableRow) => ZtTableKey);
  /** 显示行选择和全选复选框。 */
  selection?: boolean;
  /** 受控选中行 key；全选保留当前数据之外的 key。 */
  selectedKeys?: ZtTableKey[];
  /** 返回该行是否可选择；索引对应原始 data。 */
  selectable?: (row: ZtTableRow, index: number) => boolean;
  /** 显示展开按钮和 expand 插槽行。 */
  expandable?: boolean;
  /** 受控展开行 key 数组。 */
  expandedKeys?: ZtTableKey[];
  /** 受控排序状态；省略时内部排序状态循环升序、降序、无排序。 */
  sort?: ZtTableSort;
  /** 服务端排序模式，只发出排序事件，不重排 data。 */
  remote?: boolean;
  /** 显示加载遮罩及 aria-busy，禁止选择和排序。 */
  loading?: boolean;
  /** 数据为空时的默认文本。 */
  emptyText?: string;
  /** 滚动区最大高度；数字为像素；设置后固定表头。 */
  maxHeight?: number | string;
  /** 显示交替行背景。 */
  stripe?: boolean;
  /** 显示列间边框。 */
  border?: boolean;
  /** 五档单元格尺寸，继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
