import type { ZtComponentSize } from '../types';
import type { ZtButtonStatus } from '../button/types';

/** error is retained as a validation-state alias for backwards compatibility. */
export type ZtDatePickerStatus = ZtButtonStatus | 'error';
export type ZtDateTimePickerStatus = ZtDatePickerStatus;

export interface ZtDatePickerHoliday {
  /** Local calendar date, YYYY-MM-DD. */
  key: string;
  /** Holiday name displayed in the calendar cell. */
  value: string;
}

export type ZtDatePickerValue = string | [string, string] | null;
export interface ZtDatePickerProps {
  /** Local calendar value: YYYY-MM-DD, or YYYY-MM-DD HH:mm:ss for DateTimePicker. */
  modelValue?: ZtDatePickerValue;
  range?: boolean;
  holidays?: readonly ZtDatePickerHoliday[];
  showHolidays?: boolean;
  placeholder?: string;
  size?: ZtComponentSize;
  status?: ZtDatePickerStatus;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
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
  'placeholder' | 'clearable'
>;
