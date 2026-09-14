import type { VNode } from 'vue'
import type { ZtVTableGridProps } from './types'

export declare const ZtVTableGrid: <
  Row extends Record<string, unknown> = Record<string, unknown>,
  FormData extends Record<string, unknown> = Record<string, unknown>,
>(props: ZtVTableGridProps<Row, FormData>) => VNode
