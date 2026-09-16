import type { ZtComponentSize } from '../types'

export type ZtSelectValue = string | number | boolean

export interface ZtSelectOption {
  label: string
  value: ZtSelectValue
  disabled?: boolean
}

export type ZtSelectModelValue = ZtSelectValue | ZtSelectValue[] | null
export type ZtSelectRemoteMethod = (keyword: string) => Promise<ZtSelectOption[]>

export interface ZtSelectProps {
  modelValue?: ZtSelectModelValue
  options?: ZtSelectOption[]
  multiple?: boolean
  filterable?: boolean
  remote?: boolean
  remoteMethod?: ZtSelectRemoteMethod
  debounce?: number
  clearable?: boolean
  placeholder?: string
  disabled?: boolean
  size?: ZtComponentSize
  noDataText?: string
  remoteErrorText?: string
}

export interface ZtSelectInstance {
  focus: (options?: FocusOptions) => void
  blur: () => void
  open: () => void
  close: () => void
}
