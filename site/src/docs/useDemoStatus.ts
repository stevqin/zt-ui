import { computed, type ComputedRef } from 'vue';
import type { DemoVisualStatus } from './catalog';
import { injectDemoStatus } from './demo-status';

/** The fallback also makes each live SFC independently mountable. */
export function useDemoStatus<T extends string = DemoVisualStatus>(
  fallback: T,
): ComputedRef<T> {
  const context = injectDemoStatus();
  return computed(
    () =>
      (context?.metadata.value.controller
        ? context.status.value
        : fallback) as T,
  );
}
