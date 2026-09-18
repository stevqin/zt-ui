import type { ZtComponentSize } from '../types';
import type { ZtSelectOption, ZtSelectValue } from '../selection/types';

export type { ZtSelectOption, ZtSelectValue } from '../selection/types';

export type ZtSelectModelValue = ZtSelectValue | ZtSelectValue[] | null;
export type ZtSelectRemoteMethod = (
  keyword: string,
) => Promise<ZtSelectOption[]>;

export interface ZtSelectProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean;
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
