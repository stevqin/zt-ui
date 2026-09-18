import {
  computed,
  inject,
  provide,
  readonly,
  ref,
  type ComputedRef,
  type InjectionKey,
} from 'vue';
import type { ComponentVisualStatusMeta, DemoVisualStatus } from './catalog';

export const DEMO_STATUS_STORAGE_KEY = 'zt-ui:demo-status';
export const demoVisualStatuses: DemoVisualStatus[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export function createDemoStatusStore(storage?: StorageLike) {
  const selected = ref<DemoVisualStatus>();
  try {
    const saved = storage?.getItem(DEMO_STATUS_STORAGE_KEY);
    if (demoVisualStatuses.includes(saved as DemoVisualStatus))
      selected.value = saved as DemoVisualStatus;
  } catch {
    /* Private browsing may disable storage. The controls still work. */
  }
  return {
    selected: readonly(selected),
    select(status: DemoVisualStatus) {
      if (!demoVisualStatuses.includes(status)) return;
      selected.value = status;
      try {
        storage?.setItem(DEMO_STATUS_STORAGE_KEY, status);
      } catch {
        /* Keep in-memory selection. */
      }
    },
  };
}
let sharedStore: ReturnType<typeof createDemoStatusStore> | undefined;
function sharedDemoStatusStore() {
  if (!sharedStore) {
    let storage: StorageLike | undefined;
    try {
      storage = window.localStorage;
    } catch {
      /* SSR or unavailable storage. */
    }
    sharedStore = createDemoStatusStore(storage);
  }
  return sharedStore;
}
export function resolveDemoStatus(
  meta: ComponentVisualStatusMeta,
  selected?: DemoVisualStatus,
): DemoVisualStatus {
  return meta.controller && selected && meta.supported.includes(selected)
    ? selected
    : meta.default;
}
type DemoStatusContext = {
  metadata: ComputedRef<ComponentVisualStatusMeta>;
  status: ComputedRef<DemoVisualStatus>;
  select: (status: DemoVisualStatus) => void;
};
const demoStatusKey: InjectionKey<DemoStatusContext> =
  Symbol('site-demo-status');
/** Documentation-only provider, deliberately separate from public ConfigProvider. */
export function provideDemoStatus(
  metadata: ComputedRef<ComponentVisualStatusMeta>,
  store = sharedDemoStatusStore(),
) {
  const context = {
    metadata,
    status: computed(() =>
      resolveDemoStatus(metadata.value, store.selected.value),
    ),
    select: store.select,
  };
  provide(demoStatusKey, context);
  return context;
}
export function injectDemoStatus() {
  return inject(demoStatusKey, undefined);
}
