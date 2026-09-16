import type { ZtComponentSize } from '../types'
export interface ZtBreadcrumbProps {
  /** 分隔符文字。 */ separator?: string
  /** 尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize
  /** 导航的无障碍名称。 */ ariaLabel?: string
}
export interface ZtBreadcrumbItemProps {
  /** 原生链接地址。 */ href?: string
  /** Vue Router 路由目标。 */ to?: string | Record<string, unknown>
  /** 禁用导航。 */ disabled?: boolean
  /** 链接打开位置。 */ target?: string
}
