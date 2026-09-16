import type { ZtComponentSize } from '../types'
export type ZtTheme = 'light' | 'dark'
export interface ZtConfigProviderProps {
  /** Default size for descendant components. Explicit component sizes take precedence. */
  size?: ZtComponentSize
  /** Color scheme, inherited by nested providers when omitted. */
  theme?: ZtTheme
  /** Base corner radius in pixels. Defaults to 11; 0 gives square corners. */
  borderRadius?: number
}
