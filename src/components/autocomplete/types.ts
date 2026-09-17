import type { ZtComponentSize } from '../types';
export interface ZtAutocompleteOption {
  value: string;
  label?: string;
  disabled?: boolean;
}
/** 新查询、关闭、禁用和卸载时取消 AbortSignal；即使数据源忽略取消，旧响应也不会覆盖新查询。 */
export type ZtAutocompleteSource = (
  query: string,
  signal: AbortSignal,
) => ZtAutocompleteOption[] | Promise<ZtAutocompleteOption[]>;
export interface ZtAutocompleteProps {
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 文本值；清空时发出空字符串。 */
  modelValue?: string;
  /** 本地建议选项，包含 value、可选 label 和 disabled。 */
  options?: ZtAutocompleteOption[];
  /** 同步或异步建议源；接收查询文本和 AbortSignal，覆盖 options 本地过滤。 */
  fetchSuggestions?: ZtAutocompleteSource;
  /** 请求建议前等待的毫秒数，默认 200。 */
  debounce?: number;
  /** 禁用交互，默认 false；同时继承 Form 的禁用状态。 */
  disabled?: boolean;
  /** 只读模式，保留值展示与聚焦，不允许修改。 */
  readonly?: boolean;
  /** 是否显示清空操作，默认 false。 */
  clearable?: boolean;
  /** 无输入内容时的提示文本。 */
  placeholder?: string;
  /** 支持 mini、small、default、medium、large，省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
}
export interface ZtAutocompleteInstance {
  focus: () => void;
  blur: () => void;
  close: () => void;
}

/** 六种录入控件语义状态，Form 校验错误优先使用 danger。 */
export type ZtEntryStatus =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
