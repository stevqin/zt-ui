import { onBeforeUnmount } from 'vue';
import MessageBoxView from './MessageBoxView.vue';
import {
  mountFeedback,
  useFeedbackContext,
  type FeedbackContext,
} from '../message/runtime';
import type {
  ZtMessageBoxOptions,
  ZtMessageBoxAction,
  ZtMessageBoxResult,
} from './types';
export class ZtMessageBoxDismissed extends Error {
  constructor(public action: 'cancel' | 'close') {
    super(action);
    this.name = 'ZtMessageBoxDismissed';
  }
}
const closers = new Set<() => void>();
function open(
  kind: 'alert' | 'confirm' | 'prompt',
  message: string,
  options: ZtMessageBoxOptions = {},
  context: FeedbackContext = {},
  owned?: Set<() => void>,
): Promise<ZtMessageBoxResult> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('MessageBox requires a browser'));
      return;
    }
    let destroy = () => {},
      settled = false;
    function finish(action: ZtMessageBoxAction, value: string) {
      if (settled) return;
      settled = true;
      destroy();
      closers.delete(close);
      owned?.delete(close);
      if (action === 'confirm') resolve({ action, value });
      else reject(new ZtMessageBoxDismissed(action));
    }
    const close = () => finish('close', '');
    closers.add(close);
    owned?.add(close);
    destroy = mountFeedback(
      MessageBoxView,
      { ...options, kind, message, finish },
      context,
    );
  });
}
function service(context: FeedbackContext = {}, owned?: Set<() => void>) {
  return {
    alert: (message: string, options?: ZtMessageBoxOptions) =>
      open('alert', message, options, context, owned),
    confirm: (message: string, options?: ZtMessageBoxOptions) =>
      open('confirm', message, options, context, owned),
    prompt: (message: string, options?: ZtMessageBoxOptions) =>
      open('prompt', message, options, context, owned),
    closeAll: () => {
      for (const close of [...(owned ?? closers)]) close();
    },
  };
}
export const ZtMessageBox = service();
export function useZtMessageBox() {
  const owned = new Set<() => void>(),
    result = service(useFeedbackContext(), owned);
  onBeforeUnmount(result.closeAll);
  return result;
}
export type * from './types';
