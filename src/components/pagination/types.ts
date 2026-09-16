import type { ZtComponentSize } from '../types'

export type ZtPaginationStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type ZtPaginationSize = ZtComponentSize

export interface ZtPaginationProps {
  status?: ZtPaginationStatus
  currentPage?: number
  pageSize?: number
  total?: number
  pageCount?: number
  pagerCount?: number
  pageSizes?: number[]
  layout?: string
  size?: ZtPaginationSize
  small?: boolean
  background?: boolean
  disabled?: boolean
  hideOnSinglePage?: boolean
  prevText?: string
  nextText?: string
}
