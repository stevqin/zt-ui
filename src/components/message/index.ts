import { notify, closeNotifications } from './service';
import { useOwnedService } from './runtime';
import type { ZtMessageOptions, ZtMessageType } from './types';
const show = (options: ZtMessageOptions | string) =>
  notify(typeof options === 'string' ? { message: options } : options);
const typed = (type: ZtMessageType) => (options: ZtMessageOptions | string) =>
  show({
    ...(typeof options === 'string' ? { message: options } : options),
    type,
  });
export const ZtMessage = Object.assign(show, {
  success: typed('success'),
  info: typed('info'),
  warning: typed('warning'),
  error: typed('error'),
  closeAll: () => closeNotifications(false),
});
/** 在 setup 中调用，返回继承当前 ConfigProvider 且随宿主卸载清理的消息函数。 */
export function useZtMessage() {
  return useOwnedService(
    (context) => (options: ZtMessageOptions | string) =>
      notify(
        typeof options === 'string' ? { message: options } : options,
        false,
        context,
      ),
  );
}
export type * from './types';
