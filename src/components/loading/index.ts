import ZtLoading from './ZtLoading.vue';
import {
  mountFeedback,
  useOwnedService,
  type FeedbackContext,
} from '../message/runtime';
import type { ZtLoadingProps, ZtLoadingHandle } from './types';
export { ZtLoading };
function service(
  options: ZtLoadingProps = {},
  context: FeedbackContext = {},
): ZtLoadingHandle {
  let destroy = mountFeedback(
    ZtLoading,
    { ...options, loading: true, fullscreen: true },
    context,
  );
  return {
    close() {
      destroy();
      destroy = () => {};
    },
  };
}
export const ZtLoadingService = (options: ZtLoadingProps = {}) =>
  service(options);
export function useZtLoading() {
  return useOwnedService(
    (context) =>
      (options: ZtLoadingProps = {}) =>
        service(options, context),
  );
}
export type * from './types';
