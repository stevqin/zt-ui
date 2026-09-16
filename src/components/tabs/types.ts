import type { ZtComponentSize } from '../types'
export type ZtTabName=string|number
export type ZtTabsType='line'|'card'|'border-card'
export type ZtTabsPosition='top'|'right'|'bottom'|'left'
export type ZtTabsStatus='default'|'primary'|'success'|'warning'|'danger'|'info'
export interface ZtTabsProps{
 /** 当前标签名称，支持 v-model。 */ modelValue?:ZtTabName
 /** 标签外观。 */ type?:ZtTabsType
 /** 标签导航位置。 */ position?:ZtTabsPosition
 /** 全部标签允许关闭。 */ closable?:boolean
 /** 显示新增按钮。 */ addable?:boolean
 /** 同时启用新增和关闭。 */ editable?:boolean
 /** 标签平均铺满可用空间。 */ stretch?:boolean
 /** 切换前守卫，返回 false 或拒绝时保留当前项。 */ beforeLeave?:(next:ZtTabName,previous:ZtTabName)=>boolean|void|Promise<boolean|void>
 /** 选中主题颜色。 */ status?:ZtTabsStatus
 /** 尺寸，默认继承 ConfigProvider。 */ size?:ZtComponentSize
}
export interface ZtTabPaneProps{
 /** 标签唯一名称。 */ name:ZtTabName
 /** 标签文字。 */ label?:string
 /** 禁用选择。 */ disabled?:boolean
 /** 当前标签允许关闭。 */ closable?:boolean
 /** 首次激活时才渲染内容。 */ lazy?:boolean
}
