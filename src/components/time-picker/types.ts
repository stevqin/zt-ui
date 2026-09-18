import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
export type ZtTimePickerValue = string | [string, string] | null;
export type ZtTimePickerEndpoint = 'start' | 'end';
export interface ZtTimePickerProps {
  /** 显式 true 启用下边框，false 强制普通边框；省略时继承最近 Form 的 underline。内部及弹出面板辅助控件保留普通边框。 */
  underline?: boolean;
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 根据 format 使用 HH:mm 或 HH:mm:ss；范围为 [开始,结束]，空值为 null。 */
  modelValue?: ZtTimePickerValue;
  /** 启用开始/结束双值模式；两个端点共享面板并明确标识当前端点。 */
  range?: boolean;
  /** 值及可见列格式，默认 HH:mm；HH:mm:ss 显示秒列。 */
  format?: 'HH:mm' | 'HH:mm:ss';
  /** 小时列正整数步长，非法值按 1。 */
  hourStep?: number;
  /** 分钟列正整数步长，非法值按 1。 */
  minuteStep?: number;
  /** 秒列正整数步长，非法值按 1。 */
  secondStep?: number;
  /** 按候选完整时间和当前端点返回是否禁用。 */
  disabledTime?: (value: string, endpoint: ZtTimePickerEndpoint) => boolean;
  /** 禁止打开、选择、确认和清空；也继承 Form 禁用。 */
  disabled?: boolean;
  /** 禁止编辑和打开面板，保留文本显示。 */
  readonly?: boolean;
  /** 显示清空按钮；清空依次发出 update:modelValue(null)、change(null)、clear。 */
  clearable?: boolean;
  /** 无值时显示的占位文本。 */
  placeholder?: string;
  /** 五档尺寸；省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
}
export interface ZtTimePickerInstance {
  focus: () => void;
  blur: () => void;
  open: () => void;
  close: () => void;
  clear: () => void;
}
