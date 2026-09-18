import type { ZtSelectOption, ZtSelectValue } from '../selection/types'
import type { ZtComponentSize } from '../types'

export type { ZtSelectOption, ZtSelectValue } from '../selection/types'

export type ZtSelectBoxRemoteRequest =
  | { mode: 'search'; keyword: string; page: number; pageSize: number }
  | { mode: 'batch'; keywords: string[] }

export interface ZtSelectBoxBatchMatch {
  keyword: string
  option: ZtSelectOption
}

export type ZtSelectBoxRemoteResult =
  | { mode: 'search'; options: ZtSelectOption[]; total: number }
  | { mode: 'batch'; matches: ZtSelectBoxBatchMatch[] }

export type ZtSelectBoxRemoteMethod = (
  request: ZtSelectBoxRemoteRequest,
) => Promise<ZtSelectBoxRemoteResult>

export interface ZtSelectBoxProps {
  /** 下划线外观；省略时继承最近的 Form，显式 false 恢复描边。 */
  underline?: boolean
  /** 已确认的选项值；面板草稿只在确定时提交。 */
  modelValue?: ZtSelectValue[]
  options?: ZtSelectOption[]
  /** 选择框宽度，数字按 px 处理，也支持百分比等 CSS 长度。 */
  width?: number | string
  disabled?: boolean
  placeholder?: string
  size?: ZtComponentSize
  filterable?: boolean
  clearable?: boolean
  /** 远程搜索返回的结果在面板内分页。 */
  remote?: boolean
  remoteMethod?: ZtSelectBoxRemoteMethod
  debounce?: number
  pageSize?: number
  pageSizes?: number[]
  noDataText?: string
  remoteErrorText?: string
}

export interface ZtSelectBoxInstance {
  focus: (options?: FocusOptions) => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}
