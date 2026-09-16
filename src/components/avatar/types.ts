import type{Component}from'vue';import type{ZtComponentSize}from'../types';import type{ZtIconName}from'../icon/types'
export type ZtAvatarShape='circle'|'square';export type ZtAvatarStatus='default'|'primary'|'success'|'warning'|'danger'|'info';export type ZtAvatarSize=ZtComponentSize|number|string
export interface ZtAvatarProps{
 /** 图片地址。 */src?:string
 /** 响应式图片集合。 */srcSet?:string
 /** 图片替代文字及文字后备。 */alt?:string
 /** 头像尺寸。 */size?:ZtAvatarSize
 /** 形状。 */shape?:ZtAvatarShape
 /** 图片适应方式。 */fit?:'fill'|'contain'|'cover'|'none'|'scale-down'
 /** 状态主题。 */status?:ZtAvatarStatus
 /** 后备图标名。 */icon?:ZtIconName|Component
}
