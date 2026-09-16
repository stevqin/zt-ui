import type { ZtComponentSize } from '../types'
export type ZtProgressStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export interface ZtProgressProps {
  /** 完成百分比，自动限制在 0 到 100。 */
  percentage?: number
  /** 主题颜色。 */
  status?: ZtProgressStatus
  /** 尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize
  /** 是否显示进度文字。 */
  showText?: boolean
  /** 无法确定进度时使用循环动画，不向辅助技术报告百分比。 */
  indeterminate?: boolean
  /** 格式化完成率文字。 */
  format?: (percentage: number) => string
  /** 无障碍名称。 */
  ariaLabel?: string
}
