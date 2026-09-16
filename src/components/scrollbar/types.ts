import type { CSSProperties } from 'vue'
import type { ZtComponentSize } from '../types'
export interface ZtScrollbarScroll{scrollTop:number;scrollLeft:number}
export interface ZtScrollbarProps{
 /** 滚动区域高度，数值按像素处理。 */
 height?:number|string
 /** 滚动区域最大高度，数值按像素处理。 */
 maxHeight?:number|string
 /** 使用系统原生滚动条。 */
 native?:boolean
 /** 内容溢出时始终显示自定义轨道。 */
 always?:boolean
 /** 自定义滑块最小长度，单位像素。 */
 minSize?:number
 /** 关闭 ResizeObserver 自动尺寸更新。 */
 noresize?:boolean
 /** 滚动容器的附加类。 */
 wrapClass?:string|string[]|Record<string,boolean>
 /** 滚动容器的附加样式。 */
 wrapStyle?:CSSProperties|string
 /** 内容视图的附加类。 */
 viewClass?:string|string[]|Record<string,boolean>
 /** 内容视图的附加样式。 */
 viewStyle?:CSSProperties|string
 /** 内容视图使用的 HTML 标签。 */
 tag?:string
 /** 轨道密度尺寸，默认继承 ConfigProvider。 */
 size?:ZtComponentSize
}
export interface ZtScrollbarInstance{
 readonly wrapRef:HTMLElement|undefined
 update:()=>void
 scrollTo:(options:ScrollToOptions|number,y?:number)=>void
 setScrollTop:(value:number)=>void
 setScrollLeft:(value:number)=>void
}
