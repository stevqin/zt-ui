import type { Component } from 'vue'
import type { ZtComponentSize } from '../types'

export const ztIconNames = [
  'add','minus','close','check','search','info','warning','error','success',
  'chevron-up','chevron-right','chevron-down','chevron-left',
  'arrow-up','arrow-right','arrow-down','arrow-left','more','user','image',
  'upload','download','calendar','edit','delete','home','settings','refresh','visibility',
  'clipboard','checklist','filter-list',
] as const
export type ZtIconName = typeof ztIconNames[number]
export type ZtIconStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export interface ZtIconProps {
  /** 内置图标名称。默认插槽和 component 的优先级更高。 */
  name?: ZtIconName
  /** 自定义 Vue 图标组件。 */
  component?: Component
  /** 五档预设尺寸、像素数值或 CSS 长度，默认继承 ConfigProvider。 */
  size?: ZtComponentSize | number | string
  /** 自定义图标颜色，覆盖 status。 */
  color?: string
  /** 图标主题颜色。 */
  status?: ZtIconStatus
  /** 顺时针旋转角度。 */
  rotate?: number
  /** 是否持续旋转；系统减少动画时停止。 */
  spin?: boolean
  /** 内置线性图标的描边宽度。 */
  strokeWidth?: number
  /** 图标的无障碍名称；未设置时视为装饰内容。 */
  label?: string
}
