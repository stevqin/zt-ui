import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { ZtComponentSize } from '../types'

export type ZtRadioStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtRadioSize = ZtComponentSize

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
  /** 启用连体分段样式，可直接传递 segmented 属性。 */
  segmented?: boolean
  /** 使用透明背景和整组外框，在选中项的文字前显示对勾。 */
  checkmark?: boolean
  /** 使用复选框外观的方形标记，组内仍为单选。 */
  checkboxStyle?: boolean
  name?: string
  modelValue?: unknown
  disabled?: boolean
  size?: ZtRadioSize
  status?: ZtRadioStatus
}

export interface RadioGroupContext {
  name: ComputedRef<string>
  modelValue: Ref<unknown>
  disabled: ComputedRef<boolean>
  size: ComputedRef<ZtRadioSize>
  status: ComputedRef<ZtRadioStatus>
  change: (val: unknown) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('ZtRadioGroup')
