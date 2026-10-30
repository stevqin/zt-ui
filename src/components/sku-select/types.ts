import type { VNode } from 'vue'
import type { ZtComponentSize } from '../types'

/** 一个商品尺码，sku 在整个商品数据中保持唯一。 */
export interface ZtSkuOption {
  /** SKU 唯一代码，用于选择面板的绑定值及数量面板的数量索引。 */
  sku: string
  /** 尺码代码。 */
  size_code: string
  /** 尺码名称，省略时显示 size_code。 */
  size_name?: string
  /** 禁用此尺码。 */
  disabled?: boolean
}
/** 一个 SKC 颜色，图片和可选尺码属于此 SKC。 */
export interface ZtSkuColor {
  /** SKC 唯一代码。 */
  skc: string
  /** 颜色代码。 */
  color_code?: string
  /** 颜色名称，省略时显示 color_code 或 skc。 */
  color_name?: string
  /** 当前 SKC 的商品图片。 */
  image_url?: string
  /** 禁用整个颜色及其尺码；选择面板还会跳过没有可用尺码的颜色。 */
  disabled?: boolean
  /** 当前 SKC 的尺码列表。 */
  skus: ZtSkuOption[]
}
/** 当前 SPU 商品；商品代码使用 product_no 或 spu，至少提供一项。 */
export type ZtSkuProduct = {
  /** 商品名称，省略时显示商品代码。 */
  product_name?: string
  /** 当前商品的 SKC 列表。 */
  skcs: ZtSkuColor[]
} & ({
  /** 商品代码；与 spu 至少提供一项，两者同时存在时以 product_no 为准。 */
  product_no: string
  /** SPU 代码，product_no 的同义业务字段。 */
  spu?: string
} | {
  /** SPU 代码；未提供 product_no 时作为当前商品代码。 */
  spu: string
  /** 商品代码；与 spu 至少提供一项，两者同时存在时优先使用。 */
  product_no?: string
})

/** 选中的原始商品、SKC 和 SKU 对象。 */
export interface ZtSkuSelection {
  /** 选中的商品。 */
  spu: ZtSkuProduct
  /** 选中的 SKC。 */
  skc: ZtSkuColor
  /** 选中的 SKU。 */
  sku: ZtSkuOption
}
/** SKU 面板属性。 */
export interface ZtSkuSelectProps {
  /** 当前商品数据，通常传入单个 SPU；多商品数据可用于外部 SKU 回显，不提供商品切换界面。不会修改传入数据。 */
  products: ZtSkuProduct[]
  /** 绑定 SKU 代码。显式传入（包括 null）时由父级控制，省略时内部保存。默认选中首个可用 SKC，不自动选择 SKU。 */
  modelValue?: string | null
  /** 禁止用户操作；仍响应外部值和商品数据变化。 */
  disabled?: boolean
  /** 显示清空按钮；清除尺码并恢复当前商品首个可用 SKC，默认 false。 */
  clearable?: boolean
  /** 是否展示 PC 宽容器左侧的商品主图，默认 true；false 时规格区占满宽度。窄容器自动隐藏主图，不影响颜色缩略图和已选 SKU。 */
  showMainImage?: boolean
  /** 五档尺寸影响尺码按钮的宽高、字号、内边距和颜色缩略图；省略时继承 ConfigProvider。 */
  size?: ZtComponentSize
}
/** SKU 面板事件。 */
export interface ZtSkuSelectEmits {
  /** 选中尺码、用户清空或已选规格失效时更新 SKU；默认 SKC 选择不触发。 */
  'update:modelValue': [value: string | null]
  /** 用户选择、清空或已选规格失效时返回上下文；有效外部赋值只同步显示。 */
  change: [selection: ZtSkuSelection | null]
}
/** SKU 面板插槽。 */
export interface ZtSkuSelectSlots {
  /** 自定义底部摘要；未选择完整 SKU 时 selection 为 null。 */
  summary?: (props: { selection: ZtSkuSelection | null }) => VNode[]
}
