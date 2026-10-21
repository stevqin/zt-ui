import type { ComputedRef, InjectionKey } from 'vue';
import type { ZtDropdownItem, ZtDropdownItemProps } from './types';

interface DropdownContext {
  disabled: ComputedRef<boolean>;
  hasIcons: ComputedRef<boolean>;
  choose: (item: ZtDropdownItem) => void;
  register: (item: ZtDropdownItemProps) => () => void;
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('zt-dropdown');
