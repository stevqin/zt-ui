import type { ZtComponentSize } from '../types';
export interface ZtEmptyProps {
  /** 空状态说明，默认 暂无数据，可由 description 插槽替换。 */
  description?: string;
  /** 插图 URL；未设置时使用内置 SVG。 */
  image?: string;
  /** 插图区域宽高 px，默认 80。 */
  imageSize?: number;
  /** 文字和内边距尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
