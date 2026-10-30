import type { VNode } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtSkuProduct, ZtSkuSelection } from '../sku-select/types'

/** SKU 代码与正整数数量的映射；空白或 0 不保存键。 */
export type ZtSkuQuantities = Record<string, number>
/** 数量绑定的输出格式；默认 object。 */
export type ZtSkuInputValueType = 'object' | 'array'
/** 数组模式的一条数量记录，仅携带 SKU 代码及数量。 */
export interface ZtSkuQuantityValue {
  /** 当前商品中唯一的 SKU 代码，与 skcs[].skus[].sku 对应。 */
  sku: string
  /** 此 SKU 的正整数数量；0 或空白在输出中移除该条记录。 */
  quantity: number
}
/** object 为 SKU 数量映射，array 为按矩阵行列顺序排列的 SKU 数量记录。 */
export type ZtSkuInputValue<T extends ZtSkuInputValueType = ZtSkuInputValueType> = T extends 'array' ? ZtSkuQuantityValue[] : ZtSkuQuantities
/** 一条有数量的 SKU 明细，业务对象保持原始字段。 */
export interface ZtSkuQuantityEntry extends ZtSkuSelection {
  /** 当前 SKU 的订购数量。 */
  quantity: number
}
/** 一次数量更新后的完整结果。 */
export interface ZtSkuInputChange<T extends ZtSkuInputValueType = 'object'> {
  /** 当前商品的数量结果，格式跟随 valueType；不含其他商品、未知 SKU 或零数量。 */
  values: ZtSkuInputValue<T>
  /** 按颜色行和尺码列顺序排列的正数量明细，保留禁用格已有数量。 */
  entries: ZtSkuQuantityEntry[]
  /** 所有明细的数量总和。 */
  totalQuantity: number
  /** 数量大于 0 的 SKU 个数。 */
  skuCount: number
}
/** PC SKU 数量矩阵属性。 */
export interface ZtSkuInputProps<T extends ZtSkuInputValueType = 'object'> {
  /** 当前单个 SPU，复用 SkuSelect 的 product_no/spu、skc、sku 数据结构。SKU 全局唯一，同一颜色内 size_code 不重复。 */
  product: ZtSkuProduct
  /** SKU 数量对象或数组。显式传入时受控，省略时内部保存；不会修改输入。数组记录为 { sku, quantity }，同一 SKU 最后一条生效，非法数量忽略。 */
  modelValue?: ZtSkuInputValue<T>
  /** 数量输出格式，默认 object。array 返回 { sku, quantity }[]；输入可回显对象或数组。切换模式只改变后续输出格式，不自动发事件或清空数量。 */
  valueType?: T
  /** 优先展示的尺码代码顺序，其余尺码按数据首次出现顺序追加；不会隐藏已有规格。 */
  sizeOrder?: string[]
  /** 单 SKU 最大数量，默认 999999；向下取整并限制在 0 至安全整数上限，非有限值使用默认值。 */
  max?: number
  /** 禁止全部数量编辑与粘贴，已有数量继续显示和汇总。 */
  disabled?: boolean
  /** 只读数量，可聚焦和复制，不接受编辑或粘贴。 */
  readonly?: boolean
  /** 显示矩阵上方的商品名称、商品代码和录入说明，默认 true；模板使用 :show-product-info="false" 传入布尔值关闭，不占用顶部空间，不影响数量或汇总。 */
  showProductInfo?: boolean
  /** 在颜色名称左侧显示 SKC 图片，默认 true；没有图片时使用图标占位。 */
  showImage?: boolean
  /** 显示行合计、列合计及底部总数量，默认 true。 */
  showSummary?: boolean
  /** 五档尺寸统一控制表头、数据行、合计行高度及字号、图片和留白；省略时继承 FormItem 或 ConfigProvider。尺码列均分可用宽度，过窄时保留可读宽度并内部滚动。 */
  size?: ZtComponentSize
}
/** SKU 数量矩阵事件。 */
export interface ZtSkuInputEmits<T extends ZtSkuInputValueType = 'object'> {
  /** 用户输入或粘贴后返回 valueType 对应的新对象或数组；空白或 0 移除对应记录，单次粘贴仅更新一次。 */
  'update:modelValue': [value: ZtSkuInputValue<T>]
  /** 用户有效修改后的数量结果、业务明细、总数量和 SKU 数；values 格式跟随 valueType，entries 始终为原始业务对象数组。外部赋值及数据切换不触发。 */
  change: [result: ZtSkuInputChange<T>]
}
/** SKU 数量矩阵插槽。 */
export interface ZtSkuInputSlots<T extends ZtSkuInputValueType = 'object'> {
  /** 自定义底部汇总内容；showSummary 为 true 时显示，接收当前输出值、明细、数量和 SKU 数；values 的格式跟随 valueType。 */
  summary?: (props: ZtSkuInputChange<T>) => VNode[]
}
/** SKU 数量矩阵公开方法。 */
export interface ZtSkuInputInstance {
  /** 聚焦并选中指定 SKU 的数量；省略时聚焦首个可编辑格。目标不存在、禁用或只读时返回 false。 */
  focus: (sku?: string) => boolean
}
