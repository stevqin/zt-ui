export interface ZtWatermarkProps {
  /** 水印文字，支持多行；仅为视觉提示。 */ content?: string | string[];
  /** 可选图片 URL，加载失败触发 error 并显示文字水印。 */ image?: string;
  /** 单个水印内容宽度 px，默认 140。 */ width?: number;
  /** 单个水印内容高度 px，默认 64。 */ height?: number;
  /** [水平, 垂直] 单元间隔 px，默认 [80,80]。 */ gap?: [number, number];
  /** 每个单元旋转角度，默认 -22。 */ rotate?: number;
  /** 透明度 0–1，默认 0.15。 */ opacity?: number;
  /** 文字颜色，默认继承当前文本色。 */ color?: string;
  /** 文字大小 px，默认 14。 */ fontSize?: number;
  /** 覆盖层层级，默认 9。 */ zIndex?: number;
}
export interface ZtWatermarkEmits {
  (e: 'error', event: Event): void;
}
