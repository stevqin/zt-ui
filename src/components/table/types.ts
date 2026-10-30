import type { CSSProperties } from 'vue';
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
  /** index 渲染序号列；默认 default 数据列。 */
  type?: 'default' | 'index';
  /** 序号起始值（默认 1）或自定义函数；函数接收显示索引（从 0 开始）和原始行。 */
  index?: number | ((index: number, row: ZtTableRow) => string | number);
  /** 筛选选项；同列多个值为或关系，不同列为且关系。默认无筛选。 */
  filters?: ZtTableFilterOption[];
  /** 自定义本地筛选；默认严格比较字段值，rowIndex 对应原始 data。 */
  filterMethod?: (
    value: ZtTableFilterValue,
    row: ZtTableRow,
    rowIndex: number,
  ) => boolean;
  /** 是否允许多选筛选值，默认 true。 */
  filterMultiple?: boolean;
  /** 单元格单行截断并在实际溢出时显示可键盘访问的提示；覆盖表格配置。 */
  showOverflowTooltip?: boolean;
  /** 初始列宽，像素；拖动时不会修改传入对象。 */
  width?: number;
  /** 列宽下限，像素；启用调宽后未指定时为 60。 */
  minWidth?: number;
  /** 单元格与表头的默认水平对齐，默认 left；单元格自定义 cellStyle.textAlign 优先。 */
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
  /** 受控列筛选值，按 prop 索引；省略时内部维护，默认空对象。 */
  filters?: ZtTableFilters;
  /** 显示底部汇总行，默认 false；对筛选排序后的数据求和。 */
  showSummary?: boolean;
  /** 默认汇总第一列文字，默认「合计」。 */
  sumText?: string;
  /** 自定义汇总值，数组与渲染列顺序一致（包括工具列）；工具列默认留空。 */
  summaryMethod?: (
    scope: ZtTableSummaryScope,
  ) => (string | number | null | undefined)[];
  /** 合并单元格；rowIndex 为原始索引，columnIndex 包含工具列；0 隐藏，正整数跨度截断到表格及同类固定列边界。工具列和序号列不可合并。 */
  spanMethod?: (
    scope: ZtTableCellContext,
  ) => [number, number] | { rowspan: number; colspan: number } | undefined;
  /** 点击数据行高亮，默认 false；选择和展开控件不触发。 */
  highlightCurrentRow?: boolean;
  /** 受控当前行 key；null 清除，省略时内部维护。 */
  currentRowKey?: ZtTableKey | null;
  /** 全部数据列启用溢出提示，默认 false。 */
  showOverflowTooltip?: boolean;
  /** 行类名或回调；rowIndex 始终对应原始 data。默认无。 */
  rowClassName?: string | ((scope: ZtTableRowContext) => string);
  /** 行内联样式或回调，默认无。 */
  rowStyle?:
    CSSProperties | ((scope: ZtTableRowContext) => CSSProperties | undefined);
  /** 单元格类名或回调（包含工具列），默认无。 */
  cellClassName?: string | ((scope: ZtTableCellContext) => string);
  /** 单元格样式或回调（包含工具列），默认无；一般样式覆盖列默认值（含 align），固定列的位置、偏移、层级及宽度布局样式最后应用。 */
  cellStyle?:
    CSSProperties | ((scope: ZtTableCellContext) => CSSProperties | undefined);
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
export interface ZtTableColumnProps extends Omit<
  ZtTableColumn,
  'prop' | 'label' | 'type'
> {
  /** 默认 default。default 普通列；index 序号列；selection 复选列；radio 单选列；expand 展开列。 */
  type?: 'default' | 'index' | 'selection' | 'radio' | 'expand';
  /** 数据列对应的唯一字段；工具列可省略。 */
  prop?: string;
  /** 列标题；工具列可省略，普通列省略时使用 prop。 */
  label?: string;
}
export interface ZtTableHeaderScope {
  column: ZtTableColumn;
}
export interface ZtTableCellScope extends ZtTableHeaderScope {
  row: ZtTableRow;
  value: unknown;
  /** 当前显示行索引，排序筛选后从 0 开始；保留既有语义。 */
  index: number;
  /** 行在原始 data 中的索引，从 0 开始。 */
  rowIndex: number;
}

/** 列筛选允许的原始值；避免将数字、布尔值隐式转为字符串。 */
export type ZtTableFilterValue = string | number | boolean;
/** 一个筛选选项。 */
export interface ZtTableFilterOption {
  /** 选项显示文本。 */
  text: string;
  /** 与字段严格比较的值。 */
  value: ZtTableFilterValue;
}
/** 以列 prop 为键的受控筛选值；空数组表示不筛选。 */
export type ZtTableFilters = Record<string, ZtTableFilterValue[]>;
/** 行回调上下文。 */
export interface ZtTableRowContext {
  /** 原始行对象，不做复制。 */
  row: ZtTableRow;
  /** 行在原始 data 中的索引，从 0 开始。 */
  rowIndex: number;
}
/** 单元格回调上下文。 */
export interface ZtTableCellContext extends ZtTableRowContext {
  /** 当前列；工具列也具有唯一 prop。 */
  column: ZtTableColumn;
  /** 当前渲染列索引，从 0 开始，包含工具列。 */
  columnIndex: number;
}
/** 汇总回调上下文。 */
export interface ZtTableSummaryScope {
  /** 渲染列，包含选择、展开等工具列。 */
  columns: ZtTableColumn[];
  /** 本地筛选排序后的行；remote 时为传入数据。 */
  data: ZtTableRow[];
}
