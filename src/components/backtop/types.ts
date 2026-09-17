import type { ZtScrollTarget } from '../anchor/scroll';
import type { ZtComponentSize } from '../types';
export interface ZtBacktopProps {
  /** 滚动容器；默认 window。 */ container?: ZtScrollTarget;
  /** 滚动超过该 px 后显示，默认 200。 */ visibilityHeight?: number;
  /** 距窗口右边 px，默认 24。 */ right?: number;
  /** 距窗口底部 px，默认 24。 */ bottom?: number;
  /** 按钮辅助技术名称，默认 返回顶部。 */ label?: string;
  /** 按钮尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize;
}
export interface ZtBacktopEmits {
  (e: 'click', event: MouseEvent): void;
}
