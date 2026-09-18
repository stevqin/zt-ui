import type { ZtComponentSize } from '../types'

export type ZtFormProp = string | string[]
export type ZtFormValidateTrigger = 'change' | 'blur'
export type ZtFormLabelPosition = 'left' | 'right' | 'top'
export type ZtFormRuleType = 'string' | 'number' | 'email' | 'url'
export type ZtFormItemValidateStatus = '' | 'validating' | 'success' | 'error'

export interface ZtFormRule {
  required?: boolean
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  type?: ZtFormRuleType
  whitespace?: boolean
  trigger?: ZtFormValidateTrigger | ZtFormValidateTrigger[]
  message?: string
  validator?: (
    rule: ZtFormRule,
    value: unknown,
    model: Record<string, unknown>,
  ) => boolean | string | Error | void | Promise<boolean | string | Error | void>
}

export type ZtFormRules = Record<string, ZtFormRule | ZtFormRule[]>
export type ZtFormValidationErrors = Record<string, string[]>

export interface ZtFormProps {
  underline?: boolean
  model?: Record<string, unknown>
  rules?: ZtFormRules
  size?: ZtComponentSize
  disabled?: boolean
  inline?: boolean
  labelPosition?: ZtFormLabelPosition
  labelWidth?: number | string | 'auto'
  hideRequiredAsterisk?: boolean
  showMessage?: boolean
  scrollToError?: boolean
}

export interface ZtFormItemProps {
  /** 字段标签位置，默认继承 Form。 */ labelPosition?: ZtFormLabelPosition
  label?: string
  prop?: ZtFormProp
  required?: boolean
  rules?: ZtFormRule | ZtFormRule[]
  error?: string
  showMessage?: boolean
  labelWidth?: number | string | 'auto'
  size?: ZtComponentSize
}

export interface ZtFormGroupProps {
  title?: string
  description?: string
  disabled?: boolean
  bordered?: boolean
}

export interface ZtFormValidateOptions {
  trigger?: ZtFormValidateTrigger
  model?: Record<string, unknown>
  field?: string
}

export interface ZtFormInstance {
  validate: () => Promise<true>
  validateField: (props: string | string[]) => Promise<true>
  resetFields: (props?: string | string[]) => void
  clearValidate: (props?: string | string[]) => void
  scrollToField: (prop: string) => void
}
