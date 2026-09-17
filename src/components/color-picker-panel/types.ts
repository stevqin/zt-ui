import type { ZtColorPickerProps } from '../color-picker/types';
/** 与 ColorPicker 值格式一致；控件编辑草稿，确定时触发 update/change，取消恢复绑定值。 */
export type ZtColorPickerPanelProps = ZtColorPickerProps;
export interface ZtColorPickerPanelInstance {
  confirm: () => void;
  cancel: () => void;
}
