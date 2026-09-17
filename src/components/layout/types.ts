export interface ZtLayoutProps {
  /** 显式排列方向；未设置时，直接子节点有 Header/Footer 则纵向。 */
  direction?: 'horizontal' | 'vertical';
}
export interface ZtHeaderProps {
  /** 头部高度，数字为 px，默认 60。 */
  height?: number | string;
}
export interface ZtFooterProps {
  /** 底部高度，数字为 px，默认 60。 */
  height?: number | string;
}
export interface ZtAsideProps {
  /** 侧栏宽度，数字为 px，默认 200。 */
  width?: number | string;
}
export interface ZtMainProps {}
