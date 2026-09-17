export interface ZtSplitterProps {
  /** 第一栏受控百分比，默认 50；通过 update:modelValue 通知父组件。 */
  modelValue?: number;
  /** 分栏方向，默认 horizontal。 */
  direction?: 'horizontal' | 'vertical';
  /** 第一栏展开时的最小百分比，默认 0。 */
  min?: number;
  /** 第一栏展开时的最大百分比，默认 100，不小于 min。 */
  max?: number;
  /** 方向键调整的百分比步长，默认 1；Shift 放大十倍。 */
  step?: number;
  /** 禁用拖动、键盘和收起操作，默认 false。 */
  disabled?: boolean;
  /** 允许第一栏收起为 0 并恢复之前宽度，默认 false。 */
  collapsible?: boolean;
  /** 分隔条的辅助技术名称，默认 调整分栏大小。 */
  label?: string;
}
export interface ZtSplitterEmits {
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
  (e: 'resize-start'): void;
  (e: 'resize-end', value: number): void;
  (e: 'collapse', collapsed: boolean): void;
}
