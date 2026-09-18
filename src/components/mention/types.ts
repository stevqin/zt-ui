import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
import type { ZtAutocompleteOption } from '../autocomplete/types';
export type ZtMentionOption = ZtAutocompleteOption;
/** 建议源接收当前前缀后的查询文本、前缀以及可取消信号。 */
export type ZtMentionSource = (
  query: string,
  prefix: string,
  signal: AbortSignal,
) => ZtMentionOption[] | Promise<ZtMentionOption[]>;
export interface ZtMentionProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean;
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 普通多行文本值；选择仅替换前缀到光标之间的内容，保留其后的文本。 */
  modelValue?: string;
  /** 触发提及的前缀数组，默认 [@]；前缀须位于文本开头或空白之后。 */
  prefixes?: string[];
  /** 本地建议选项，包含 value、可选 label 和 disabled。 */
  options?: ZtMentionOption[];
  /** 异步或同步建议源，接收查询文本、前缀及 AbortSignal，旧响应不会覆盖新查询。 */
  fetchSuggestions?: ZtMentionSource;
  /** 建议查询的防抖时间，单位毫秒，默认 200。 */
  debounce?: number;
  /** 禁用交互，默认 false；同时继承 Form 的禁用状态。 */
  disabled?: boolean;
  /** 只读模式，保留值展示与聚焦，不允许修改。 */
  readonly?: boolean;
  /** 是否显示清空操作，默认 false。 */
  clearable?: boolean;
  /** 无输入内容时的提示文本。 */
  placeholder?: string;
  /** textarea 的可见文本行数，默认 3。 */
  rows?: number;
  /** 支持 mini、small、default、medium、large，省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
}
export interface ZtMentionInstance {
  focus: () => void;
  blur: () => void;
}
