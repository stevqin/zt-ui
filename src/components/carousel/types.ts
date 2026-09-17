export interface ZtCarouselProps {
  /** 受控当前索引，从 0 开始；省略时使用内部索引（初始 0）。 */ modelValue?: number;
  /** 自动轮播，默认 false；悬停、焦点位于内部、页面不可见和减少动画偏好均暂停。 */ autoplay?: boolean;
  /** 轮播间隔 ms，最小 100，默认 3000。 */ interval?: number;
  /** 首尾循环，默认 true。 */ loop?: boolean;
  /** 显示上一张/下一张按钮，默认 true。 */ arrows?: boolean;
  /** 显示指示器，默认 true。 */ indicators?: boolean;
  /** 高度，数字为 px，默认 240。 */ height?: number | string;
  /** 轮播区域辅助技术名称，默认 图片轮播。 */ label?: string;
}
export interface ZtCarouselEmits {
  (e: 'update:modelValue', index: number): void;
  (e: 'change', index: number): void;
}
export interface ZtCarouselInstance {
  prev: () => void;
  next: () => void;
  goTo: (index: number) => void;
}
