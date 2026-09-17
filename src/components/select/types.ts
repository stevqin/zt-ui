import type { ZtComponentSize } from '../types';

export type ZtSelectValue = string | number | boolean;

export interface ZtSelectOption {
  label: string;
  value: ZtSelectValue;
  disabled?: boolean;
}

export type ZtSelectModelValue = ZtSelectValue | ZtSelectValue[] | null;
export type ZtSelectRemoteMethod = (
  keyword: string,
) => Promise<ZtSelectOption[]>;

export interface ZtSelectProps {
  /** 仅挂载可视选项窗口，适合大量数据；自定义选项需保持固定行高。 */
  virtual?: boolean;
  /** 虚拟列表行高（px），未设置时跟随 size。 */
  itemHeight?: number;
  /** 下拉列表最大高度（px），视口不足时自动缩小。 */
  height?: number;
  modelValue?: ZtSelectModelValue;
  options?: ZtSelectOption[];
  multiple?: boolean;
  /** 多选时折叠超出数量的标签，剩余项显示为 +N。 */
  collapseTags?: boolean;
  /** 开启 collapseTags 后最多展示的标签数，默认 1，最小为 1。 */
  maxCollapseTags?: number;
  filterable?: boolean;
  remote?: boolean;
  remoteMethod?: ZtSelectRemoteMethod;
  debounce?: number;
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  size?: ZtComponentSize;
  noDataText?: string;
  remoteErrorText?: string;
}

export interface ZtSelectInstance {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  open: () => void;
  close: () => void;
}
