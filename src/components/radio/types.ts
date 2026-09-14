import type { InjectionKey, Ref, ComputedRef } from 'vue'

export type ZtRadioStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtRadioSize = 'mini' | 'small' | 'default' | 'medium' | 'large'

export interface ZtRadioProps {
  modelValue?: unknown
  label?: unknown
  disabled?: boolean
  size?: ZtRadioSize
  status?: ZtRadioStatus
  border?: boolean
  name?: string
}

export interface ZtRadioGroupProps {
  modelValue?: unknown
  disabled?: boolean
  size?: ZtRadioSize
  status?: ZtRadioStatus
}

export interface RadioGroupContext {
  modelValue: Ref<unknown>
  disabled: ComputedRef<boolean>
  size: ComputedRef<ZtRadioSize>
  status: ComputedRef<ZtRadioStatus>
  change: (val: unknown) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('ZtRadioGroup')
