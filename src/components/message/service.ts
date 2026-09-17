import { reactive, nextTick } from 'vue';
import Toast from './Toast.vue';
import { mountFeedback, type FeedbackContext } from './runtime';
import type { ZtMessageOptions, ZtMessageHandle } from './types';
import type { ZtNotificationOptions } from '../notification/types';
interface Entry {
  state: Record<string, any>;
  handle: ZtMessageHandle;
  destroy: () => void;
  timer: ReturnType<typeof setTimeout> | undefined;
  remaining: number;
  started: number;
  key: string;
  context: FeedbackContext;
}
const entries: Entry[] = [];
function layout() {
  const offsets = new Map<string, number>();
  for (const e of entries) {
    const key =
      (e.state.notification ? 'notification' : 'message') + e.state.position;
    e.state.offset = offsets.get(key) ?? 20;
    const element = document.querySelector(`[data-toast-id="${e.key}"]`);
    offsets.set(
      key,
      e.state.offset + (element?.getBoundingClientRect().height || 72) + 12,
    );
  }
}
let sequence = 0;
export function notify(
  options: ZtMessageOptions | ZtNotificationOptions,
  notification = false,
  context: FeedbackContext = {},
): ZtMessageHandle {
  if (typeof document === 'undefined') return { close: () => {} };
  const same =
    !notification &&
    (options as ZtMessageOptions).grouping &&
    typeof options.message === 'string'
      ? entries.find(
          (e) =>
            !e.state.notification &&
            e.state.message === options.message &&
            e.state.type === (options.type ?? 'info') &&
            e.context.config === context.config &&
            e.context.owner === context.owner,
        )
      : undefined;
  if (same) {
    same.state.count++;
    same.state.restart(options.duration ?? 3000);
    return same.handle;
  }
  const state = reactive({
      ...options,
      type: options.type ?? 'info',
      notification,
      position: (options as ZtNotificationOptions).position ?? 'top-right',
      count: 1,
      offset: 20,
    }),
    entry: Entry = {
      state,
      handle: { close },
      destroy: () => {},
      timer: undefined,
      remaining: options.duration ?? (notification ? 4500 : 3000),
      started: 0,
      key: String(++sequence),
      context,
    };
  let closed = false,
    observer: ResizeObserver | undefined;
  const paused = new Set<string>();
  function pause(reason = 'pointer') {
    paused.add(reason);
    if (entry.timer === undefined) return;
    clearTimeout(entry.timer);
    entry.timer = undefined;
    entry.remaining = Math.max(
      0,
      entry.remaining - (Date.now() - entry.started),
    );
  }
  function start() {
    clearTimeout(entry.timer);
    entry.timer = undefined;
    entry.started = Date.now();
    if (entry.remaining > 0 && !closed)
      entry.timer = setTimeout(close, entry.remaining);
  }
  function resume(reason = 'pointer') {
    paused.delete(reason);
    if (!paused.size) start();
  }
  function restart(duration: number) {
    clearTimeout(entry.timer);
    entry.timer = undefined;
    entry.remaining = duration;
    if (!paused.size) start();
  }
  function close() {
    if (closed) return;
    closed = true;
    clearTimeout(entry.timer);
    observer?.disconnect();
    const index = entries.indexOf(entry);
    if (index >= 0) entries.splice(index, 1);
    entry.destroy();
    layout();
    options.onClose?.();
  }
  Object.assign(state, {
    close,
    pause,
    resume,
    restart,
    'data-toast-id': entry.key,
  });
  entries.push(entry);
  entry.destroy = mountFeedback(Toast, state, context);
  resume();
  void nextTick(() => {
    layout();
    const el = document.querySelector(`[data-toast-id="${entry.key}"]`);
    if (el && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(layout);
      observer.observe(el);
    }
  });
  return entry.handle;
}
export function closeNotifications(notification: boolean) {
  for (const entry of [...entries])
    if (entry.state.notification === notification) entry.handle.close();
}
