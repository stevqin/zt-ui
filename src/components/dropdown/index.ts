export { default as ZtDropdown } from './ZtDropdown.vue';
import DropdownItemComponent from './ZtDropdownItem.vue';
import type { ZtDropdownItem as DropdownItemData } from './types';

// Keep the existing data type available alongside the component of the same name.
export const ZtDropdownItem = DropdownItemComponent;
export type ZtDropdownItem = DropdownItemData;
export type { ZtDropdownProps, ZtDropdownItemProps } from './types';
