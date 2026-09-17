import type { ZtEntryStatus } from '../autocomplete/types';
import type { ZtComponentSize } from '../types';
export interface ZtColorPickerProps {
  /** 六种语义状态，影响边框、焦点或选中颜色；默认 primary，表单校验错误优先。 */
  status?: ZtEntryStatus;
  /** 支持 HEX/RGB/HSL 文本；确定后输出规范 #rrggbb[aa]，空值为空字符串。 */
  modelValue?: string;
  /** 显示透明度滑杆，并在输出 HEX 中包含 alpha 字节。 */
  showAlpha?: boolean;
  /** 预设颜色数组；支持 HEX/RGB/HSL，非法预设不可选择。 */
  presets?: string[];
  /** 禁止打开面板与编辑；也继承 Form 禁用。 */
  disabled?: boolean;
  /** 保留值展示，禁止打开与修改。 */
  readonly?: boolean;
  /** 在面板显示清空操作，清空值为空字符串。 */
  clearable?: boolean;
  /** 五档尺寸，继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize;
}
export interface ZtColorPickerInstance {
  open: () => void;
  close: () => void;
  focus: () => void;
}
