export interface ZtRowProps {
  /** 栅格间距，数字为水平间距，元组为 [水平, 垂直] px，默认 0。 */
  gutter?: number | [number, number];
  /** 主轴对齐，默认 start。 */
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly';
  /** 交叉轴对齐，middle 与 center 等价，默认 top。 */
  align?: 'top' | 'middle' | 'bottom' | 'stretch' | 'center';
  /** 是否允许换行，默认 true。 */
  wrap?: boolean;
}
