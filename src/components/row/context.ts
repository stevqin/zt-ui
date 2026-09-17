import type { InjectionKey, ComputedRef } from 'vue';
export const rowGutterKey: InjectionKey<ComputedRef<number>> =
  Symbol('ztRowGutter');
