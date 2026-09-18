import type { ZtComponentSize } from '../types';
import type { ZtButtonStatus } from '../button/types';

/** danger denotes the visual theme; error denotes field validation failure. */
export type ZtDatePickerStatus = ZtButtonStatus | 'error';
export type ZtDateTimePickerStatus = ZtDatePickerStatus;

export interface ZtDatePickerHoliday {
  /** Local calendar date, YYYY-MM-DD. */
  key: string;
  /** Holiday name displayed in the calendar cell. */
  value: string;
}

export type ZtDatePickerType = 'date' | 'daterange' | 'month' | 'monthrange' | 'year' | 'yearrange';
export type ZtDatePickerValue = string | [string, string] | null;
export interface ZtDatePickerProps {
  /** 显式 true 启用下边框，false 强制普通边框；省略时继承最近 Form 的 underline。内部及弹出面板辅助控件保留普通边框。 */
  underline?: boolean;
  /** YYYY, YYYY-MM, YYYY-MM-DD, or YYYY-MM-DD HH:mm:ss for DateTimePicker. */
  modelValue?: ZtDatePickerValue;
  /** Selection granularity. Range suffix is equivalent to range=true. */
  type?: ZtDatePickerType;
  range?: boolean;
  holidays?: readonly ZtDatePickerHoliday[];
  showHolidays?: boolean;
  placeholder?: string;
  size?: ZtComponentSize;
  status?: ZtDatePickerStatus;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  /** For month/year selection, receives the first local day of the period. */
  disabledDate?: (date: Date) => boolean;
}
export type ZtDateTimePickerProps = ZtDatePickerProps;
export interface ZtDatePickerInstance {
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  open: () => void;
  close: () => void;
  clear: () => void;
}
export type ZtDateTimePickerInstance = ZtDatePickerInstance;

/** 内嵌日期面板，与 DatePicker 一致：单日期立即提交；范围选中第二个有效端点后提交。 */
export type ZtDatePickerPanelProps = Omit<
  ZtDatePickerProps,
  'placeholder' | 'clearable' | 'underline'
>;
