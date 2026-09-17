import type { ZtComponentSize } from '../types';
export interface ZtStatisticProps {
  /** 标题，可由 title 插槽替换。 */
  title?: string;
  /** 待格式化数字；缺失、NaN 和 Infinity 显示 fallback。 */
  value?: number;
  /** 小数位数，取整并限制 0–20，默认 0。 */
  precision?: number;
  /** 千位分隔符，默认逗号，空字符串禁用分组。 */
  groupSeparator?: string;
  /** 小数分隔符，默认句点。 */
  decimalSeparator?: string;
  /** 数值前缀，可由 prefix 插槽替换。 */
  prefix?: string;
  /** 数值后缀，可由 suffix 插槽替换。 */
  suffix?: string;
  /** 自定义有限数字格式化，优先于精度和分隔符配置。 */
  formatter?: (value: number) => string;
  /** 无效数字的后备文字，默认 —，不调用 formatter。 */
  fallback?: string;
  /** 文字尺寸，默认继承 ConfigProvider。 */
  size?: ZtComponentSize;
}
