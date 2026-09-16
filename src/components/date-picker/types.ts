import type { ZtComponentSize } from '../types'
import type { ZtButtonStatus } from '../button/types'

/** error is retained as a validation-state alias for backwards compatibility. */
export type ZtDatePickerStatus = ZtButtonStatus | 'error'
export type ZtDateTimePickerStatus = ZtDatePickerStatus

export interface ZtDatePickerHoliday {
  /** Local calendar date, YYYY-MM-DD. */
  key: string
  /** Holiday name displayed in the calendar cell. */
  value: string
}

export type ZtDatePickerValue = string | [string, string] | null
export interface ZtDatePickerProps {
  /** Local calendar value: YYYY-MM-DD, or YYYY-MM-DD HH:mm:ss for DateTimePicker. */
  modelValue?: ZtDatePickerValue
  range?: boolean
  holidays?: readonly ZtDatePickerHoliday[]
  showHolidays?: boolean
  placeholder?: string
  size?: ZtComponentSize
  status?: ZtDatePickerStatus
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  disabledDate?: (date: Date) => boolean
}
export type ZtDateTimePickerProps = ZtDatePickerProps
export interface ZtDatePickerInstance {
  focus: (options?: FocusOptions) => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}
export type ZtDateTimePickerInstance = ZtDatePickerInstance
