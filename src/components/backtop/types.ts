import type { ZtScrollTarget } from '../anchor/scroll';
import type { ZtComponentSize } from '../types';
export interface ZtBacktopProps {
  /** 滚动容器；默认 window。 */ container?: ZtScrollTarget;
  /** 滚动超过该 px 后显示，默认 200。 */ visibilityHeight?: number;
  /** 按钮定位方式；默认 fixed 固定在视口，absolute 可配合相对定位的外层容器显示在局部区域。 */ position?: 'fixed' | 'absolute';
  /** 距定位区域右边 px，默认 24。 */ right?: number;
  /** 距定位区域底部 px，默认 24。 */ bottom?: number;
  /** 按钮辅助技术名称，默认 返回顶部。 */ label?: string;
  /** 按钮尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize;
}
export interface ZtBacktopEmits {
  (e: 'click', event: MouseEvent): void;
}
