import type { VNode } from 'vue';
import type { ZtComponentSize } from '../types';

/** 引用面板的语义色；仅影响外观，不创建警告或实时播报角色。 */
export type ZtBlockquoteStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/** 引用面板属性。 */
export interface ZtBlockquoteProps {
  /** 标题纯文本；title 插槽存在时以插槽为准。 */
  title?: string;
  /** 原始引用来源 URL，写入原生 blockquote 的 cite 属性，不自动创建链接。 */
  cite?: string;
  /** 强调线和背景的语义色，默认 primary。 */
  status?: ZtBlockquoteStatus;
  /** 内容密度；省略时继承 ConfigProvider，最终默认 default。 */
  size?: ZtComponentSize;
}

/** 引用面板具名插槽。 */
export interface ZtBlockquoteSlots {
  /** 引用正文，支持段落、链接和嵌套引用。 */
  default?: () => VNode[];
  /** 标题内容，覆盖 title 属性。 */
  title?: () => VNode[];
  /** 可见的来源说明或补充操作；cite 属性本身不会显示。 */
  footer?: () => VNode[];
}
