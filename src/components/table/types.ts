import type { ZtComponentSize } from '../types';
export type ZtTableKey = string | number;
export type ZtTableRow = Record<string, unknown>;
export type ZtTableSortOrder = 'ascending' | 'descending' | null;
export interface ZtTableSort {
  prop: string;
  order: ZtTableSortOrder;
}
export interface ZtTableColumnResize {
  /** 已调整列的 prop。 */
  prop: string;
  /** 调整后的像素宽度。 */
  width: number;
}
export interface ZtTableColumn {
  /** 列对应的行字段，同时作为列的唯一标识。 */
  prop: string;
  label: string;
  /** 初始列宽，像素；拖动时不会修改传入对象。 */
  width?: number;
  /** 列宽下限，像素；启用调宽后未指定时为 60。 */
  minWidth?: number;
  /** 单元格与表头的水平对齐方式，默认 left。 */
  align?: 'left' | 'center' | 'right';
  /** 固定在表格左侧或右侧；需为固定列设置宽度。 */
  fixed?: 'left' | 'right';
  /** 点击表头循环升序、降序和未排序状态。 */
  sortable?: boolean;
  /** Table 启用 resizable 时，此列是否允许调宽；false 禁用，默认允许。 */
  resizable?: boolean;
  /** Optional comparator for local sorting. */ sortMethod?: (
    a: ZtTableRow,
    b: ZtTableRow,
  ) => number;
  /** Named cell slot; defaults to the property name. */ slot?: string;
  /** 格式化单元格内容；自定义单元格插槽优先。 */
  formatter?: (
    value: unknown,
    row: ZtTableRow,
    index: number,
  ) => string | number;
}
export interface ZtTableProps {
  /** 行对象数组；所有行必须具备稳定唯一 rowKey。 */
  data?: ZtTableRow[];
  /** 列配置数组；显式传入时优先于默认插槽中的 ZtTableColumn。省略时可使用模板列。 */
  columns?: ZtTableColumn[];
  /** 唯一 key 字段名或函数，默认 id；必须得到 string 或 number，否则抛错。 */
  rowKey?: string | ((row: ZtTableRow) => ZtTableKey);
  /** 显示选择列，默认多选复选框。 */
  selection?: boolean;
  /** 行选择类型；checkbox 多选，radio 单选；需启用 selection。 */
  selectionType?: 'checkbox' | 'radio';
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
  /** 启用表头拖拽调宽，默认 false；列 minWidth 限制下限，未设置时为 60px。 */
  resizable?: boolean;
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

/** 模板列支持普通数据列、多选、单选及展开列。 */
export interface ZtTableColumnProps extends Omit<ZtTableColumn, 'prop' | 'label'> {
  /** default 普通列；selection 复选列；radio 单选列；expand 展开列。 */
  type?: 'default' | 'selection' | 'radio' | 'expand';
  /** 数据列对应的唯一字段；工具列可省略。 */
  prop?: string;
  /** 列标题；工具列可省略，普通列省略时使用 prop。 */
  label?: string;
}
export interface ZtTableHeaderScope { column: ZtTableColumn }
export interface ZtTableCellScope extends ZtTableHeaderScope {
  row: ZtTableRow;
  value: unknown;
  index: number;
}
