import type { ZtIconName } from '../icon/types'
export type ZtResultStatus='success'|'warning'|'danger'|'info'|'404'|'403'|'500'
export interface ZtResultProps{
 /** 结果状态或 HTTP 状态。 */status?:ZtResultStatus
 /** 主标题。 */title?:string
 /** 补充说明。 */subTitle?:string
 /** 自定义图标名。 */icon?:ZtIconName
}
