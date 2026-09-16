import type { ZtComponentSize } from '../types'
export type ZtTextStatus='default'|'primary'|'success'|'warning'|'danger'|'info'
export type ZtTextTag='span'|'p'|'div'|'strong'|'em'|'label'|'code'|'del'|'ins'|'mark'
export type ZtTextWeight='normal'|'medium'|'semibold'|'bold'|number
export interface ZtTextProps{
 /** 安全的 HTML 语义标签。 */
 tag?:ZtTextTag
 /** 文本主题颜色。 */
 status?:ZtTextStatus
 /** 文本尺寸，默认继承 ConfigProvider。 */
 size?:ZtComponentSize
 /** 预设或数值字重。 */
 weight?:ZtTextWeight
 /** 单行溢出时显示省略号。 */
 truncated?:boolean
 /** 多行省略的最大行数，优先于 truncated。 */
 lineClamp?:number
 /** 原生 title；截断纯文本未设置时自动生成。 */
 title?:string
}
