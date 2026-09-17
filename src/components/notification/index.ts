import { notify, closeNotifications } from '../message/service';
import { useOwnedService } from '../message/runtime';
import type { ZtNotificationOptions } from './types';
export const ZtNotification = Object.assign(
  (options: ZtNotificationOptions) => notify(options, true),
  { closeAll: () => closeNotifications(true) },
);
export function useZtNotification() {
  return useOwnedService(
    (context) => (options: ZtNotificationOptions) =>
      notify(options, true, context),
  );
}
export type * from './types';
