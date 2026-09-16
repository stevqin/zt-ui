import type { Component } from 'vue'
import type { ZtComponentSize } from '../types'
import type { ZtIconName } from '../icon'
import type { ZtPopoverPlacement } from '../popover'
export type ZtPopconfirmStatus='default'|'primary'|'success'|'warning'|'danger'|'info'
export interface ZtPopconfirmProps{
 /** 是否显示，支持 v-model:visible。 */ visible?:boolean
 /** 确认标题。 */ title:string
 /** 补充说明。 */ description?:string
 /** 语义主题颜色。 */ status?:ZtPopconfirmStatus
 /** 内置图标名或 Vue 图标组件。 */ icon?:ZtIconName|Component
 /** 隐藏状态图标。 */ hideIcon?:boolean
 /** 确认按钮文字。 */ confirmText?:string
 /** 取消按钮文字。 */ cancelText?:string
 /** 按钮尺寸。 */ buttonSize?:ZtComponentSize
 /** 外部确认加载状态。 */ confirmLoading?:boolean
 /** 禁用确认按钮。 */ confirmDisabled?:boolean
 /** 禁用取消按钮。 */ cancelDisabled?:boolean
 /** 成功确认后关闭。 */ hideAfterConfirm?:boolean
 /** 确认前钩子；返回 false 或拒绝时保持打开。 */ beforeConfirm?:()=>boolean|void|Promise<boolean|void>
 /** 浮层方位。 */ placement?:ZtPopoverPlacement
 /** 整体禁用。 */ disabled?:boolean
}
