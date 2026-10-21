import type { ZtComponentSize } from '../types';
export type ZtTimelineStatus =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export interface ZtTimelineItem {
  /** 节点唯一标识。 */
  key: string | number;
  /** 展示在内容上方的时间文字。 */
  time?: string;
  /** 节点内容；默认插槽优先于此文字。 */
  content?: string;
  /** 节点状态颜色，默认 default。 */
  status?: ZtTimelineStatus;
  /** 单个节点的内容方向；省略时跟随 Timeline。 */
  placement?: 'left' | 'right';
  /** 默认圆点显示为空心节点。 */
  hollow?: boolean;
}
export interface ZtTimelineProps {
  /** 时间节点数组，key 唯一；显式传入时优先于模板声明，省略时可用 ZtTimelineItem。 */
  items?: ZtTimelineItem[];
  /** 倒序展示，不改变传入数组。 */
  reverse?: boolean;
  /** 内容统一靠左、靠右或左右交替；窄屏收拢为单列。 */
  placement?: 'left' | 'right' | 'alternate';
  /** 五档字体尺寸，继承 ConfigProvider。 */
  size?: ZtComponentSize;
}

/** 模板节点属性；通过 Vue 的 key 标识动态节点。 */
export interface ZtTimelineItemProps extends Omit<ZtTimelineItem, 'key'> {}
export interface ZtTimelineItemScope {
  item: ZtTimelineItem;
  /** 当前展示顺序中的索引，倒序后重新计算。 */
  index: number;
}
