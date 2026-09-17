import type { ZtComponentSize } from '../types';
export type ZtTimelineStatus =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export interface ZtTimelineItem {
  key: string | number;
  time?: string;
  content?: string;
  status?: ZtTimelineStatus;
  placement?: 'left' | 'right';
  hollow?: boolean;
}
export interface ZtTimelineProps {
  /** 时间节点数组，key 唯一，含 time、content、status、placement 和 hollow。 */
  items?: ZtTimelineItem[];
  /** 倒序展示，不改变传入数组。 */
  reverse?: boolean;
  /** 内容统一靠左、靠右或左右交替；窄屏收拢为单列。 */
  placement?: 'left' | 'right' | 'alternate';
  /** 五档字体尺寸，继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
