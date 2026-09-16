import type { ZtComponentSize } from '../types'
export interface ZtDescriptionsProps {
  /** 标题。 */ title?: string
  /** 桌面端列数。 */ column?: number
  /** 是否显示边框。 */ border?: boolean
  /** 标签宽度。 */ labelWidth?: string | number
  /** 标签位置。 */ direction?: 'horizontal' | 'vertical'
  /** 尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize
}
export interface ZtDescriptionsItemProps {
  /** 标签文字。 */ label?: string
  /** 占据列数。 */ span?: number
  /** 自定义标签宽度。 */ labelWidth?: string | number
  /** 自定义内容类名。 */ className?: string
}
