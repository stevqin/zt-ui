export interface ZtColBreakpoint {
  /** 断点下占据的栅格数，0 隐藏，范围 0–24。 */
  span?: number;
  /** 断点下左侧偏移栅格数，范围 0–24。 */
  offset?: number;
}
export interface ZtColProps {
  /** 占据栅格数，默认 24；0 隐藏，数字取整并限制在 0–24。 */
  span?: number;
  /** 左侧偏移栅格数，默认 0，限制在 0–24。 */
  offset?: number;
  /** 0px 起生效的跨度或跨度与偏移。 */
  xs?: number | ZtColBreakpoint;
  /** 576px 起生效的跨度或跨度与偏移。 */
  sm?: number | ZtColBreakpoint;
  /** 768px 起生效的跨度或跨度与偏移。 */
  md?: number | ZtColBreakpoint;
  /** 992px 起生效的跨度或跨度与偏移。 */
  lg?: number | ZtColBreakpoint;
  /** 1200px 起生效的跨度或跨度与偏移。 */
  xl?: number | ZtColBreakpoint;
}
