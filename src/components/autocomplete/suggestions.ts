import { ref, onBeforeUnmount } from 'vue';
import type { ZtAutocompleteOption, ZtAutocompleteSource } from './types';
/** Shared cancellation and keyboard state, kept independent of the input type. */
export function useSuggestions(
  source: () => ZtAutocompleteSource,
  delay: () => number,
) {
  const items = ref<ZtAutocompleteOption[]>([]),
    loading = ref(false),
    error = ref(''),
    open = ref(false),
    active = ref(-1);
  let timer: ReturnType<typeof setTimeout> | undefined,
    controller: AbortController | undefined,
    generation = 0;
  function cancel() {
    generation++;
    clearTimeout(timer);
    controller?.abort();
    loading.value = false;
  }
  function close() {
    cancel();
    open.value = false;
    active.value = -1;
  }
  function query(text: string) {
    cancel();
    const id = generation;
    items.value = [];
    active.value = -1;
    error.value = '';
    open.value = true;
    loading.value = true;
    controller = new AbortController();
    const signal = controller.signal;
    timer = setTimeout(
      async () => {
        try {
          const result = await source()(text, signal);
          if (id === generation && !signal.aborted) {
            items.value = result;
          }
        } catch (e) {
          if (id === generation && !signal.aborted)
            error.value = e instanceof Error ? e.message : '建议加载失败';
        } finally {
          if (id === generation) loading.value = false;
        }
      },
      Math.max(0, delay()),
    );
  }
  function move(direction: number) {
    const enabled = items.value
      .map((o, i) => (o.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) return;
    const at = enabled.indexOf(active.value);
    active.value =
      enabled[
        (at + (direction > 0 ? 1 : at < 0 ? 0 : -1) + enabled.length) %
          enabled.length
      ]!;
  }
  onBeforeUnmount(cancel);
  return { items, loading, error, open, active, query, close, move };
}
