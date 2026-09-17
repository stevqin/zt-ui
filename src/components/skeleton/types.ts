export interface ZtSkeletonProps {
  /** true 显示占位，false 渲染默认内容，默认 true。 */
  loading?: boolean;
  /** 默认占位的动画开关，默认 true；遵循减少动画偏好。 */
  animated?: boolean;
  /** 占位行数，整数 0–100，默认 3。 */
  rows?: number;
  /** 各行宽度，数字为 px；未指定行默认 100%，末行 60%。 */
  widths?: Array<number | string>;
}
export interface ZtSkeletonItemProps {
  /** 形状：文本、矩形、圆形或图片区域，默认 text。 */
  shape?: 'text' | 'rect' | 'circle' | 'image';
  /** 宽度，数字为 px；圆形默认 48px，其余 100%。 */
  width?: number | string;
  /** 高度，数字为 px；文本默认 1em，圆形 48px，其余 100px。 */
  height?: number | string;
  /** 动画开关，默认 true；遵循减少动画偏好。 */
  animated?: boolean;
}
