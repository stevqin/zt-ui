import type { ZtComponentSize } from '../types'

export type ZtPaginationSize = ZtComponentSize

export interface ZtPaginationProps {
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
