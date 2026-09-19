export type ZtImageFit='fill'|'contain'|'cover'|'none'|'scale-down'
export interface ZtImageProps{
 /** 图片地址。 */src:string
 /** 替代文字。 */alt?:string
 /** object-fit 模式。 */fit?:ZtImageFit
 /** object-position。 */position?:string
 /** 启用原生懒加载。 */lazy?:boolean
 /** 点击图片时是否打开预览。 */showPreview?:boolean
 /** 预览图片地址列表，未传时使用 src，显式传入后覆盖默认列表。 */previewSrcList?:string[]
 /** 预览初始索引。 */initialIndex?:number
 /** 是否循环预览。 */infinite?:boolean
 /** 点击遮罩关闭预览。 */hideOnClickModal?:boolean
 /** Escape 关闭预览。 */closeOnPressEscape?:boolean
 /** 预览层级。 */zIndex?:number
}
export interface ZtImageViewerProps{
 /** 图片地址列表。 */urls:string[]
 /** 初始索引。 */initialIndex?:number
 /** 是否循环。 */infinite?:boolean
 /** 缩放倍率。 */zoomRate?:number
 /** 最小缩放。 */minScale?:number
 /** 最大缩放。 */maxScale?:number
 /** 点击遮罩关闭。 */hideOnClickModal?:boolean
 /** Escape 关闭。 */closeOnPressEscape?:boolean
 /** 层级。 */zIndex?:number
}
