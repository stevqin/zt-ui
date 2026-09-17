import type { ZtComponentSize } from '../types';
export interface ZtCardProps {
  /** 默认头部标题，可由 header 插槽替换。 */
  title?: string;
  /** 显示边框，默认 true。 */
  bordered?: boolean;
  /** 阴影显示策略，默认 never。 */
  shadow?: 'always' | 'hover' | 'never';
  /** 头部、正文和底部内边距；数字为 px，未设置根据 size 为 8/12/16/20/24。 */
  padding?: number | string;
  /** 隐藏正文并显示骨架屏，保留头尾插槽，默认 false。 */
  loading?: boolean;
  /** 内边距预设尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
