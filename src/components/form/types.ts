import type { ZtComponentSize } from '../types'

export type ZtFormProp = string | string[]
export type ZtFormValidateTrigger = 'change' | 'blur'
export type ZtFormLabelPosition = 'left' | 'right' | 'top'
export type ZtFormRuleType = 'string' | 'number' | 'email' | 'url'
/** 校验提示形式：原有图标浮层、行内说明、聚焦浮层、顶部汇总、标签旁说明。 */
export type ZtFormMessageDisplay = 'tooltip' | 'inline' | 'popover' | 'summary' | 'label'
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
  /** 错误提示形式；FormItem 省略时继承 Form，默认 tooltip。 */
  messageDisplay?: ZtFormMessageDisplay
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
  /** 错误提示形式；FormItem 省略时继承 Form，默认 tooltip。 */
  messageDisplay?: Exclude<ZtFormMessageDisplay, 'summary'>
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
