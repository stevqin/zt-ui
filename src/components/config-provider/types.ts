import type { ZtComponentSize } from '../types'
export type ZtTheme = 'light' | 'dark'
export type ZtFocusRing = 'none' | 'keyboard' | 'all'
export interface ZtConfigProviderProps {
  /** Default size for descendant components. Explicit component sizes take precedence. */
  size?: ZtComponentSize
  /** 额外焦点环：none 默认关闭；keyboard 仅键盘操作显示；all 所有聚焦显示。嵌套配置继承上层。 */
  focusRing?: ZtFocusRing
  /** Color scheme, inherited by nested providers when omitted. */
  theme?: ZtTheme
  /** Base corner radius in pixels. Defaults to 11; 0 gives square corners. */
  borderRadius?: number
}
