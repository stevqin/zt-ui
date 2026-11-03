import type { Component } from 'vue'
import { additionalIconShapes } from './additional-icons'

export const ztIconNames = [
  'add','minus','close','check','search','info','warning','error','success',
  'chevron-up','chevron-right','chevron-down','chevron-left',
  'arrow-up','arrow-right','arrow-down','arrow-left','more','more-vertical','menu',
  'user','users','image','file','folder','paperclip',
  'upload','download','calendar','clock','edit','delete','home','settings','refresh',
  'visibility','eye-off','lock','unlock','save','copy','link','external-link','share',
  'clipboard','checklist','filter-list','filter','tag','star','heart','bookmark',
  'mail','phone','location','help','ban','play','pause','undo','redo',
  'login','logout','maximize','maximize-2','minimize-2','chart','sun','moon',
  ...Object.keys(additionalIconShapes) as (keyof typeof additionalIconShapes)[],
] as const
export type ZtIconName = typeof ztIconNames[number]
export type ZtIconStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtIconAnimation = 'spin' | 'pulse' | 'bounce' | 'shake' | 'draw'
export type ZtIconAnimationTrigger = 'always' | 'hover' | 'click'
export interface ZtIconProps {
  /** 内置图标名称。默认插槽和 component 的优先级更高。 */
  name?: ZtIconName
  /** 自定义 Vue 图标组件。 */
  component?: Component
  /** 图标 CSS 尺寸；正数按像素处理，默认 1em。 */
  size?: number | string
  /** 自定义图标颜色，覆盖 status。 */
  color?: string
  /** 图标主题颜色。 */
  status?: ZtIconStatus
  /** 顺时针旋转角度。 */
  rotate?: number
  /** 是否持续旋转；系统减少动画时停止。 */
  spin?: boolean
  /** 可选动效；不设置时静止，spin 属性优先。 */
  animation?: ZtIconAnimation
  /** 动效触发方式：持续、悬停（含外层控件聚焦）、点击（含外层按钮键盘激活）。 */
  animationTrigger?: ZtIconAnimationTrigger
  /** 内置线性图标的描边宽度。 */
  strokeWidth?: number
  /** 图标的无障碍名称；未设置时视为装饰内容。 */
  label?: string
}
