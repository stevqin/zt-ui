import type { ZtComponentSize } from '../types';
import type { ZtDatePickerHoliday } from '../date-picker/types';
export type ZtCalendarView = 'month' | 'week';
export interface ZtCalendarProps {
  /** 受控本地日期 YYYY-MM-DD 或 null；非法值展示今天所在月但不选中今天。 */
  modelValue?: string | null;
  /** 受控 month 或 week 视图；省略时工具栏可直接切换。 */
  view?: ZtCalendarView;
  /** 可选日期闭区间 [开始,结束]；非法或倒置区间禁用全部日期。 */
  range?: [string, string];
  /** 返回指定本地日期是否禁用。 */
  disabledDate?: (date: Date) => boolean;
  /** 禁用日期选择和工具栏按钮。 */
  disabled?: boolean;
  /** 本地日期 key 和节假日名称 value，默认显示于日期格。 */
  holidays?: readonly ZtDatePickerHoliday[];
  /** 五档字体尺寸，继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
export interface ZtCalendarCell {
  date: Date;
  day: string;
  selected: boolean;
  currentMonth: boolean;
  disabled: boolean;
  holiday?: string;
}
