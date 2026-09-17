import type { ZtMessageOptions } from '../message/types';
export type ZtNotificationPosition =
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export interface ZtNotificationOptions extends Omit<
  ZtMessageOptions,
  'grouping'
> {
  /** 通知标题。 */ title?: string;
  /** 屏幕角落位置。 */ position?: ZtNotificationPosition;
}
