import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { ZtComponentSize } from '../types'

export type ZtCheckboxStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtCheckboxSize = ZtComponentSize

export interface ZtCheckboxProps {
  modelValue?: boolean
  label?: string
  value?: unknown
  disabled?: boolean
  indeterminate?: boolean
  size?: ZtCheckboxSize
  status?: ZtCheckboxStatus
  border?: boolean
  checked?: boolean
  name?: string
}

export interface ZtCheckboxGroupProps {
  modelValue?: unknown[]
  /** 将复选框组显示为可多选的连体按钮。 */
  segmented?: boolean
  disabled?: boolean
  min?: number
  max?: number
  size?: ZtCheckboxSize
  status?: ZtCheckboxStatus
}

export interface CheckboxGroupContext {
  modelValue: Ref<unknown[]>
  disabled: ComputedRef<boolean>
  size: ComputedRef<ZtCheckboxSize>
  status: ComputedRef<ZtCheckboxStatus>
  min: ComputedRef<number>
  max: ComputedRef<number>
  segmented: ComputedRef<boolean>
  toggle: (val: unknown) => void
  isChecked: (val: unknown) => boolean
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('ZtCheckboxGroup')
