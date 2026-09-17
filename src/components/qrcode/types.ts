export type ZtQRCodeLevel = 'L' | 'M' | 'Q' | 'H';
export interface ZtQRCodeProps {
  /** 编码的纯文本；空值显示空状态。 */ value?: string;
  /** 纠错等级，默认 M。 */ level?: ZtQRCodeLevel;
  /** 成品宽高 px，默认 160。 */ size?: number;
  /** 二维码周围空白模块数，默认 4。 */ margin?: number;
  /** 渲染为 SVG 或 Canvas，默认 svg。 */ renderAs?: 'svg' | 'canvas';
  /** 前景颜色，默认 #000000。请确保与背景有足够对比度。 */ color?: string;
  /** 背景颜色，默认 #ffffff。 */ background?: string;
  /** 辅助技术名称，默认 二维码。 */ label?: string;
}
export interface ZtQRCodeEmits {
  /** 编码、Canvas 渲染或下载失败。 */ (e: 'error', error: unknown): void;
  /** 下载已触发，参数为文件名。 */ (e: 'download', filename: string): void;
}
export interface ZtQRCodeInstance {
  /** 下载当前图像：SVG 模式保存 .svg，Canvas 保存 .png；成功触发下载返回 true。 */ download: (
    filename?: string,
  ) => boolean;
}
