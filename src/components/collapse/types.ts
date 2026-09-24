import type { ZtComponentSize } from '../types'
export type ZtCollapseName=string|number
export interface ZtCollapseProps {
 /** 展开的面板名称，支持 v-model；手风琴收起时为 null。 */ modelValue?:ZtCollapseName|ZtCollapseName[]|null
 /** 手风琴模式。 */ accordion?:boolean
 /** 尺寸，默认继承 ConfigProvider。 */ size?:ZtComponentSize
}
export interface ZtCollapseItemProps {
 /** 面板唯一名称。 */ name:ZtCollapseName
 /** 标题。 */ title?:string
 /** 禁用面板。 */ disabled?:boolean
 /** 首次展开时才渲染内容。 */ lazy?:boolean
}
