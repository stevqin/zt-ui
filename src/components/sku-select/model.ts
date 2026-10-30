import type { ZtSkuProduct } from './types'
export function skuCatalog(products: ZtSkuProduct[]) {
  return products.flatMap(source => {
    const id = source.product_no ?? source.spu ?? ''
    if (!id.trim()) return []
    const skcs = source.skcs.flatMap(color => {
      if (!color.skc.trim()) return []
      const skus = color.skus.filter(sku => sku.sku.trim()).map(sku => ({ id: sku.sku, name: sku.size_name || sku.size_code, disabled: Boolean(sku.disabled), source: sku }))
      return [{ id: color.skc, colorCode: color.color_code ?? color.skc, name: color.color_name || color.color_code || color.skc, image: color.image_url, disabled: Boolean(color.disabled) || !skus.some(sku => !sku.disabled), skus, source: color }]
    })
    return [{ id, name: source.product_name || id, skcs, source }]
  })
}
export type SkuProductView = ReturnType<typeof skuCatalog>[number]
export type SkuColorView = SkuProductView['skcs'][number]
export type SkuOptionView = SkuColorView['skus'][number]
