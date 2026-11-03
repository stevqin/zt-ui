import type{Component}from'vue';import type{ZtComponentSize}from'../types';import type{ZtIconName}from'../icon/types'
export type ZtAvatarShape='circle'|'square';export type ZtAvatarStatus='default'|'primary'|'success'|'warning'|'danger'|'info';export type ZtAvatarSize=ZtComponentSize|number|string
/** 绑定到头像的业务成员对象；点击头像组成员时原样返回。 */
export type ZtAvatarItem = Record<string, unknown>
export interface ZtAvatarProps{
 /** 关联的业务成员对象；头像组 member-click 优先返回此对象，不传则返回头像 props。 */item?:ZtAvatarItem
 /** 图片地址。 */src?:string
 /** 响应式图片集合。 */srcSet?:string
 /** 图片替代文字及文字后备。 */alt?:string
 /** 头像尺寸；省略时优先继承 AvatarGroup，否则继承 ConfigProvider。 */size?:ZtAvatarSize
 /** 头像形状；省略时继承 AvatarGroup，否则使用 circle。 */shape?:ZtAvatarShape
 /** 图片适应方式。 */fit?:'fill'|'contain'|'cover'|'none'|'scale-down'
 /** 状态主题。 */status?:ZtAvatarStatus
 /** 后备图标名。 */icon?:ZtIconName|Component
}

/** 重叠排列的头像组；默认插槽接受 ZtAvatar，可使用 v-for。 */
export interface ZtAvatarGroupProps {
  /** 组内头像尺寸，支持五档预设、像素数值或 CSS 长度；单个头像可覆盖。 */
  size?: ZtAvatarSize
  /** 组内头像形状；单个头像可覆盖。默认 circle。 */
  shape?: ZtAvatarShape
  /** 组内最多展示的头像数（不含 +N 按钮）；省略展示全部，0 将全部收起；展开面板始终显示全部成员。 */
  max?: number
  /** 头像组的无障碍名称。默认“头像组”。 */
  label?: string
}
