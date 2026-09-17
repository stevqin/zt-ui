import type { ZtScrollTarget } from '../anchor/scroll';
export interface ZtAffixProps {
  /** 滚动容器；默认 window，固定位置相对该容器可视区域。 */ container?: ZtScrollTarget;
  /** 固定到可视区域顶部或底部，默认 top。 */ position?: 'top' | 'bottom';
  /** 到对应边界的距离 px，默认 0。 */ offset?: number;
  /** 固定层级，默认 100。 */ zIndex?: number;
  /** 禁用固定行为，默认 false。 */ disabled?: boolean;
}
export interface ZtAffixEmits {
  (e: 'change', fixed: boolean): void;
}
export interface ZtAffixInstance {
  update: () => void;
}
