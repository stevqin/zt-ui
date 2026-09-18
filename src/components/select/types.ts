import type { ZtComponentSize } from '../types';
import type { ZtSelectOption, ZtSelectValue } from '../selection/types';

export type { ZtSelectOption, ZtSelectValue } from '../selection/types';

export type ZtSelectModelValue = ZtSelectValue | ZtSelectValue[] | null;
export type ZtSelectRemoteMethod = (
  keyword: string,
) => Promise<ZtSelectOption[]>;

export interface ZtSelectProps {
  /** 显式 true 启用下边框，false 强制普通边框；省略时继承最近 Form 的 underline。内部及弹出面板辅助控件保留普通边框。 */
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
