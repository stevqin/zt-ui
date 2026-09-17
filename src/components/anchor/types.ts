import type { ZtScrollTarget } from './scroll';
export type { ZtScrollTarget } from './scroll';
export interface ZtAnchorLink {
  /** 目标 CSS id，例如 #overview。 */ href: string;
  /** 可访问链接文字。 */ title: string;
  /** 嵌套章节。 */ children?: ZtAnchorLink[];
}
export interface ZtAnchorProps {
  /** 章节树，默认空数组。 */ links?: ZtAnchorLink[];
  /** 滚动容器、选择器或获取函数；默认 window。 */ container?: ZtScrollTarget;
  /** 目标相对容器顶部预留的 px，默认 0。 */ offset?: number;
  /** 使用平滑滚动，默认 true；减少动画偏好下使用即时滚动。 */ smooth?: boolean;
  /** 导航区域辅助技术名称，默认 章节导航。 */ label?: string;
}
export interface ZtAnchorEmits {
  (e: 'select', href: string): void;
  (e: 'change', href: string): void;
}
