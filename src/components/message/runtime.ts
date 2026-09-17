import {
  computed,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  provide,
  render,
  type AppContext,
  type Component,
  type VNode,
  type CSSProperties,
} from 'vue';
import {
  configProviderKey,
  useZtConfig,
  type ZtConfigContext,
} from '../config-provider/context';
export interface FeedbackContext {
  appContext?: AppContext;
  config?: ZtConfigContext;
  owner?: number;
}
export function useFeedbackContext(): FeedbackContext {
  return {
    appContext: getCurrentInstance()?.appContext,
    owner: getCurrentInstance()?.uid,
    config: useZtConfig(),
  };
}
export function mountFeedback(
  component: Component,
  props: Record<string, unknown>,
  context: FeedbackContext = {},
) {
  if (typeof document === 'undefined') return () => {};
  const host = document.createElement('div');
  document.body.appendChild(host);
  const Root = defineComponent({
    setup() {
      if (context.config) provide(configProviderKey, context.config);
      return () => h(component, props);
    },
  });
  const vnode = createVNode(Root);
  if (context.appContext) vnode.appContext = context.appContext;
  render(vnode, host);
  return () => {
    render(null, host);
    host.remove();
  };
}
export function useOwnedService<
  T extends (...args: any[]) => { close: () => void },
>(factory: (context: FeedbackContext) => T): T {
  const context = useFeedbackContext(),
    owned = new Set<{ close: () => void }>(),
    service = factory(context),
    wrapped = new WeakSet<object>();
  onBeforeUnmount(() => {
    for (const item of [...owned]) item.close();
    owned.clear();
  });
  return ((...args: Parameters<T>) => {
    let handle: ReturnType<T>;
    const first = args[0];
    if (first && typeof first === 'object') {
      const onClose = first.onClose;
      args[0] = {
        ...first,
        onClose: () => {
          if (handle) owned.delete(handle);
          onClose?.();
        },
      };
    } else if (typeof first === 'string')
      args[0] = {
        message: first,
        onClose: () => {
          if (handle) owned.delete(handle);
        },
      };
    handle = service(...args) as ReturnType<T>;
    owned.add(handle);
    if (!wrapped.has(handle)) {
      const close = handle.close;
      handle.close = () => {
        owned.delete(handle);
        close();
      };
      wrapped.add(handle);
    }
    return handle;
  }) as unknown as T;
}
