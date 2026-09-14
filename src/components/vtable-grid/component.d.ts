import type { VNode } from 'vue'
import type {
  ZtVTableGridEmits,
  ZtVTableGridEventProps,
  ZtVTableGridExpose,
  ZtVTableGridProps,
  ZtVTableGridSlots,
} from './types'

export declare const ZtVTableGrid: <
  Row extends object = Record<string, unknown>,
  FormData extends object = Record<string, unknown>,
>(props: ZtVTableGridProps<Row, FormData> & ZtVTableGridEventProps<Row>) => VNode & {
  __ctx?: {
    slots: ZtVTableGridSlots<Row, FormData>
    emit: ZtVTableGridEmits<Row>
    expose: ZtVTableGridExpose<Row>
  }
}
