import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
export interface ZtRateProps {
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 受控分值，0 表示未评分，提交限制在 [0,max]。 */
  modelValue?: number;
  /** 最大分值，默认 5；有限整数且至少为 1。 */
  max?: number;
  /** 允许鼠标左半区选择半分，键盘方向键步长相应改为 0.5。 */
  allowHalf?: boolean;
  /** 重复点击当前分值或按 Delete/Backspace 清空为 0。 */
  clearable?: boolean;
  /** 禁用交互，默认 false；同时继承 Form 的禁用状态。 */
  disabled?: boolean;
  /** 只读模式，保留值展示与聚焦，不允许修改。 */
  readonly?: boolean;
  /** 支持 mini、small、default、medium、large，省略时继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
  /** 评分控件的辅助技术名称。 */
  label?: string;
  /** 在图标后显示当前评分，texts 对应项存在时优先显示文本。 */
  showScore?: boolean;
  /** 按 1 到 max 分顺序提供显示文案；半分使用向上取整对应项。 */
  texts?: string[];
}
