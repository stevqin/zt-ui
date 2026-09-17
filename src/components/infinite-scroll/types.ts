import type { ZtScrollTarget } from '../anchor/scroll';
export interface ZtInfiniteScrollProps {
  /** 加载回调。Promise 期间防止重复，拒绝后显示可重试错误。卸载时传入的 signal 中止。 */ load?: (
    signal: AbortSignal,
  ) => void | Promise<void>;
  /** 容器或页面窗口；默认 window。 */ container?: ZtScrollTarget;
  /** 到底部不足该 px 时加载，默认 100。 */ distance?: number;
  /** 挂载后立即检测，默认 true。 */ immediate?: boolean;
  /** 外部加载状态，也会阻止并发加载，默认 false。 */ loading?: boolean;
  /** 暂停自动加载，默认 false。 */ disabled?: boolean;
  /** 全部加载完成，默认 false。 */ finished?: boolean;
}
export interface ZtInfiniteScrollEmits {
  (e: 'load'): void;
  (e: 'error', error: unknown): void;
}
export interface ZtInfiniteScrollInstance {
  check: () => Promise<void>;
  retry: () => Promise<void>;
}
