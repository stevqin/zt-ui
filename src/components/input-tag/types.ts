import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
export interface ZtInputTagProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean;
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 受控标签数组，空值为 []；仅标签变化时触发 update/change。 */
  modelValue?: string[];
  /** 是否精确去重，区分大小写，默认 true。 */
  deduplicate?: boolean;
  /** 标签数量上限，超出项丢弃并触发 limit；默认不限制。 */
  max?: number;
  /** 除 Enter 外的提交分隔符，同时用于拆分粘贴文本。 */
  separators?: string[];
  /** 禁用交互，默认 false；同时继承 Form 的禁用状态。 */
  disabled?: boolean;
  /** 只读模式，保留值展示与聚焦，不允许修改。 */
  readonly?: boolean;
  /** 是否显示清空操作，默认 false。 */
  clearable?: boolean;
  /** 支持 mini、small、default、medium、large，省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
  /** 无输入内容时的提示文本。 */
  placeholder?: string;
}
