import type { VNode, CSSProperties } from 'vue';
import type { ZtComponentSize } from '../types';
export type ZtMessageType = 'success' | 'info' | 'warning' | 'error';
export interface ZtMessageOptions {
  /** 消息文本或 VNode，不解析字符串 HTML。 */ message: string | VNode;
  /** 反馈类型。 */ type?: ZtMessageType;
  /** 自动关闭毫秒数；0 不自动关闭。 */ duration?: number;
  /** 是否显示关闭按钮。 */ showClose?: boolean;
  /** 相同文本及类型合并并重新计时。 */ grouping?: boolean;
  /** 显式全局尺寸。 */ size?: ZtComponentSize;
  /** 独立调用时的主题变量。 */ style?: CSSProperties;
  /** 关闭回调。 */ onClose?: () => void;
}
export interface ZtMessageHandle {
  close: () => void;
}
