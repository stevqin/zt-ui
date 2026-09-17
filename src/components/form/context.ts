import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ZtComponentSize } from '../types'
import type {
  ZtFormItemValidateStatus,
  ZtFormLabelPosition,
  ZtFormRules,
  ZtFormValidateTrigger,
} from './types'

export interface ZtFormFieldContext {
  prop: string
  inputId: string
  errorId: string
  element: Ref<HTMLElement | undefined>
  size: ComputedRef<ZtComponentSize>
  disabled: ComputedRef<boolean>
  validateState: Ref<ZtFormItemValidateStatus>
  validateMessage: Ref<string>
  validate: (trigger?: ZtFormValidateTrigger) => Promise<boolean>
  resetField: () => void
  clearValidate: () => void
}

export interface ZtFormContext {
  model: Record<string, unknown>
  rules: ComputedRef<ZtFormRules>
  size: ComputedRef<ZtComponentSize>
  disabled: ComputedRef<boolean>
  labelPosition: ComputedRef<ZtFormLabelPosition>
  labelWidth: ComputedRef<number | string | 'auto'>
  autoLabelWidth: ComputedRef<number>
  setLabelWidth: (id: number, width: number) => void
  removeLabelWidth: (id: number) => void
  hideRequiredAsterisk: ComputedRef<boolean>
  showMessage: ComputedRef<boolean>
  addField: (field: ZtFormFieldContext) => void
  removeField: (field: ZtFormFieldContext) => void
  notifyValidate: (prop: string, valid: boolean, message: string) => void
}

export const ztFormKey: InjectionKey<ZtFormContext> = Symbol('ztForm')
export const ztFormItemKey: InjectionKey<ZtFormFieldContext> = Symbol('ztFormItem')
