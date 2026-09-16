import type { Component } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtIconName } from '../icon/types'
export type ZtSegmentedValue = string | number | boolean
export type ZtSegmentedStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export interface ZtSegmentedOption { label: string; value: ZtSegmentedValue; disabled?: boolean; icon?: ZtIconName | Component }
export interface ZtSegmentedProps {
  /** 当前值，支持 v-model。 */ modelValue?: ZtSegmentedValue
  /** 字符串、数字、布尔值或完整选项。 */ options: Array<ZtSegmentedValue | ZtSegmentedOption>
  /** 整体禁用。 */ disabled?: boolean
  /** 平均铺满容器。 */ block?: boolean
  /** 选中主题颜色。 */ status?: ZtSegmentedStatus
  /** 尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize
  /** 无障碍名称。 */ ariaLabel?: string
}
