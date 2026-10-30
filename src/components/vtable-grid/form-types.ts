import type { Component, VNodeChild } from 'vue'
import type { ZtFormInstance, ZtFormLabelPosition, ZtFormRule, ZtFormRules } from '../form/types'
import type { ZtComponentSize } from '../types'
import type { ZtVTableGridOption } from './option-loader'

export interface ZtVTableGridFormScope<FormData = Record<string, unknown>> {
  data: FormData
  field?: string
  property?: string
  item: ZtVTableGridFormItem<FormData>
  $form: ZtFormInstance
  size: ZtComponentSize
  disabled: boolean
  loading: boolean
}
export interface ZtVTableGridFormRenderer<FormData = Record<string, unknown>> {
  name?: string
  component?: Component
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  options?: ZtVTableGridOption[] | Record<string, unknown>[]
  optionSource?: string
  optionProps?: { label?: string; value?: string }
  content?: string
  events?: Record<string, (scope: ZtVTableGridFormScope<FormData>, ...args: unknown[]) => void>
  /** Convert business storage values to/from the chosen control's model. */
  valueAdapter?: { toControl: (value: unknown) => unknown; fromControl: (value: unknown) => unknown }
  render?: (scope: ZtVTableGridFormScope<FormData>) => VNodeChild
}
export interface ZtVTableGridFormItem<FormData = Record<string, unknown>> {
  field?: string
  title?: string
  span?: number
  titleWidth?: string | number
  titleAlign?: 'left' | 'right'
  titleColon?: boolean
  vertical?: boolean
  align?: 'left' | 'center' | 'right'
  showTitle?: boolean
  showContent?: boolean
  visible?: boolean
  visibleMethod?: (scope: ZtVTableGridFormScope<FormData>) => boolean
  folding?: boolean
  collapseNode?: boolean
  className?: string | ((scope: ZtVTableGridFormScope<FormData>) => string)
  rules?: ZtFormRule | ZtFormRule[]
  optionSource?: string
  itemRender?: ZtVTableGridFormRenderer<FormData>
  slots?: { default?: string | ((scope: ZtVTableGridFormScope<FormData>) => VNodeChild) }
}
export interface ZtVTableGridFormConfig<FormData = Record<string, unknown>> {
  data?: FormData
  items?: ZtVTableGridFormItem<FormData>[]
  rules?: ZtFormRules
  inline?: boolean
  layout?: 'inline' | 'vertical'
  labelPosition?: ZtFormLabelPosition
  labelWidth?: string | number
  span?: number
  titleWidth?: string | number
  titleAlign?: 'left' | 'right'
  titleColon?: boolean
  vertical?: boolean
  align?: 'left' | 'center' | 'right'
  collapseStatus?: boolean
  underline?: boolean
  size?: ZtComponentSize
}
