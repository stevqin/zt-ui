export type ZtTagStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtTagSize = 'mini' | 'small' | 'default' | 'medium' | 'large'
export type ZtTagEffect = 'light' | 'dark' | 'plain'

export interface ZtTagProps {
  status?: ZtTagStatus
  size?: ZtTagSize
  effect?: ZtTagEffect
  closable?: boolean
  round?: boolean
  hit?: boolean
}
