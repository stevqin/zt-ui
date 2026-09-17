import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
export interface ZtTimeSelectProps {
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** HH:mm 文本或 null；清空依次触发 update(null)、change(null) 和 clear。 */
  modelValue?: string | null;
  /** 选项生成开始时间 HH:mm；非法或反向起止时间不生成选项。 */
  start?: string;
  /** 生成选项的结束时间 HH:mm；只有落在步长网格时才包含，默认 18:00。 */
  end?: string;
  /** 正数 HH:mm 步长；非法或零步长不生成选项。 */
  step?: string;
  /** 最小可选时间下界 HH:mm；小于或等于此值的选项禁用。 */
  minTime?: string;
  /** 排除该时间及之后的选项，使用 HH:mm；未设置或非法时不限制。 */
  maxTime?: string;
  /** 禁用的闭区间 [from,to] 数组，非法区间忽略。 */
  disabledRanges?: [string, string][];
  /** 禁用交互，默认 false；同时继承 Form 的禁用状态。 */
  disabled?: boolean;
  /** 是否显示清空操作，默认 false。 */
  clearable?: boolean;
  filterable?: boolean;
  /** 无输入内容时的提示文本。 */
  placeholder?: string;
  /** 支持 mini、small、default、medium、large，省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
}
