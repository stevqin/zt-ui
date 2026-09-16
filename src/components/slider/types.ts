import type { ZtComponentSize } from '../types'
export type ZtSliderValue = number | [number, number]
export type ZtSliderStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export interface ZtSliderProps {
  /** 当前数值；range 时使用 [起点, 终点]。 */
  modelValue?: ZtSliderValue
  /** 最小值。 */
  min?: number
  /** 最大值，必须大于 min；否则禁用交互。 */
  max?: number
  /** 步长，以 min 为起点；无效值按 1 处理。 */
  step?: number
  /** 双滑块范围选择，不允许交叉。 */
  range?: boolean
  /** 禁用交互。 */
  disabled?: boolean
  /** 尺寸，默认继承 Form 或 ConfigProvider。 */
  size?: ZtComponentSize
  /** 主题颜色。 */
  status?: ZtSliderStatus
  /** 悬停、拖动或键盘聚焦时显示数值。 */
  showTooltip?: boolean
  /** 格式化数值提示和辅助技术读数。 */
  formatTooltip?: (value: number) => string
  /** 控件的无障碍名称，范围模式会附加起点或终点。 */
  ariaLabel?: string
}
