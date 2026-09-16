import type { Component } from 'vue'
import type { ZtComponentSize } from '../types'
export type ZtMenuRoute = string | { path?: string; name?: string | symbol; params?: Record<string, string | number | (string | number)[]>; query?: Record<string, string | number | null | undefined | (string | number | null | undefined)[]>; hash?: string; replace?: boolean }
export interface ZtMenuItem {
  /** 唯一标识，包含分组和子菜单在内均不可重复。 */
  key: string
  /** 显示文本。 */
  label: string
  /** 分组标题，不参与选择；children 为组内菜单。 */
  type?: 'group'
  /** 子菜单或分组内容。 */
  children?: ZtMenuItem[]
  /** 禁用当前项及其后代。 */
  disabled?: boolean
  /** 辅助说明，显示在菜单右侧。 */
  description?: string
  /** Vue 图标组件。 */
  icon?: Component
  /** 叶子菜单链接。不依赖 Vue Router，可在 select 事件中阻止默认导航。 */
  href?: string
  /** router 模式的目标路由；未设置时以 key 作为路径。支持命名路由、params、query 和 hash。href 显式设置时仍按普通链接处理。 */
  route?: ZtMenuRoute
}
export type ZtMenuStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export interface ZtMenuProps {
  /** 当前选中叶子项的 key，支持 v-model。 */
  modelValue?: string
  /** 菜单配置，支持分组和多级子菜单。 */
  items?: ZtMenuItem[]
  /** 纵向/双栏树中展开的子菜单 key；支持 v-model:expanded-keys。 */
  expandedKeys?: string[]
  /** 非受控模式的初始展开项。 */
  defaultExpandedKeys?: string[]
  /** 同一父级下只展开一个子菜单。 */
  accordion?: boolean
  /** 禁用全部交互。 */
  disabled?: boolean
  /** 尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize
  /** 选中项的主题颜色。 */
  status?: ZtMenuStatus
  /** 布局：纵向树形、模块与内容双栏、横向导航。横向模式不使用折叠和宽度拖动。 */
  mode?: 'vertical' | 'double' | 'horizontal'
  /** 启用应用已安装的 Vue Router，点击叶子项跳转并跟随当前路由选中。 */
  router?: boolean
  /** 横向子菜单触发方式；键盘和触屏始终支持点击。 */
  menuTrigger?: 'hover' | 'click'
  /** 整栏折叠，支持 v-model:collapsed；折叠时点击父菜单弹出子菜单，选择叶子项后自动收起浮层。 */
  collapsed?: boolean
  /** 显示底部折叠按钮。 */
  collapsible?: boolean
  /** default 尺寸下的展开基准宽度；其他 size 加上对应偏移（mini -60、small -32、medium +28、large +56px）。支持数字、CSS 长度及 v-model:width；拖动回传基准值。 */
  width?: number | string
  /** default 尺寸下的折叠基准宽度，单位 px；其他 size 偏移为 -8/-4/+4/+8px；双栏折叠时最小 60px，保留四字标签空间。 */
  collapsedWidth?: number
  /** default 尺寸下的双栏主栏基准宽度，单位 px；其他 size 偏移为 -4/0/+4/+8px；不低于对应尺寸的默认主栏宽度。 */
  railWidth?: number
  /** 允许拖动右边缘调整展开宽度。 */
  resizable?: boolean
  /** 拖动宽度的最小值。 */
  minWidth?: number
  /** 拖动宽度的最大值。 */
  maxWidth?: number
  /** 双栏模式当前业务模块 key，支持 v-model:active-key。 */
  activeKey?: string
  /** 菜单的无障碍名称。 */
  ariaLabel?: string
}
