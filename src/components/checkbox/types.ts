import type { InjectionKey, Ref, ComputedRef } from 'vue'

export type ZtCheckboxStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtCheckboxSize = 'mini' | 'small' | 'default' | 'medium' | 'large'

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
  toggle: (val: unknown) => void
  isChecked: (val: unknown) => boolean
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol('ZtCheckboxGroup')
