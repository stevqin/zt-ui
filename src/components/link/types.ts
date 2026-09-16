import type { Component } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtIconName } from '../icon'
export type ZtLinkStatus='default'|'primary'|'success'|'warning'|'danger'|'info'
export type ZtLinkUnderline='always'|'hover'|'never'
export type ZtLinkRoute=string|{path?:string;name?:string|symbol;params?:Record<string,unknown>;query?:Record<string,unknown>;hash?:string}
export interface ZtLinkProps{
 /** 原生链接地址。 */
 href?:string
 /** Vue Router 路由目标；没有 Router 时字符串目标回退为 href。 */
 to?:ZtLinkRoute
 /** 路由导航时使用 replace。 */
 replace?:boolean
 /** 原生链接打开目标。 */
 target?:string
 /** 原生链接关系；target=_blank 时默认补充安全值。 */
 rel?:string
 /** 原生下载属性。 */
 download?:string|boolean
 /** 链接主题颜色。 */
 status?:ZtLinkStatus
 /** 链接尺寸，默认继承 ConfigProvider。 */
 size?:ZtComponentSize
 /** 禁用导航、点击事件和键盘聚焦。 */
 disabled?:boolean
 /** 下划线显示策略。 */
 underline?:ZtLinkUnderline
 /** 左侧内置图标名或 Vue 图标组件。 */
 icon?:ZtIconName|Component
 /** 右侧内置图标名或 Vue 图标组件。 */
 suffixIcon?:ZtIconName|Component
}
