import type { ZtComponentSize } from '../types';
export interface ZtSpaceProps {
  /** 排列方向，默认 horizontal。 */
  direction?: 'horizontal' | 'vertical';
  /** 间距 px；元组为 [水平, 垂直]。未设置则按 size 为 4/6/8/12/16。 */
  gap?: number | [number, number];
  /** 交叉轴对齐，默认 center。 */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /** 主轴对齐，默认 start。 */
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
  /** 是否换行，默认 false。 */
  wrap?: boolean;
  /** 间距预设尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
