export interface ZtDividerProps {
  /** 分隔方向，默认 horizontal；纵向不显示文字。 */
  direction?: 'horizontal' | 'vertical';
  /** 使用虚线，默认 false。 */
  dashed?: boolean;
  /** 横向插槽文字位置，默认 center。 */
  contentPosition?: 'left' | 'center' | 'right';
}
