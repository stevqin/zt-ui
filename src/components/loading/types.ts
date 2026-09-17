import type { ZtComponentSize } from '../types';
export interface ZtLoadingProps {
  /** 是否展示加载遮罩。 */ loading?: boolean;
  /** 是否覆盖整个视口并传送到 body。 */ fullscreen?: boolean;
  /** 全屏时是否锁定页面滚动。 */ lock?: boolean;
  /** 加载说明。 */ text?: string;
  /** 指示器尺寸；未设置时继承全局。 */ size?: ZtComponentSize;
}
export interface ZtLoadingHandle {
  close: () => void;
}
