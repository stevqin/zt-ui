export type ZtPaginationSize = 'small' | 'default' | 'large'

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
