import type { ZtComponentSize } from '../types';
import type { ZtPopoverPlacement } from '../popover/types';
export interface ZtDropdownItem {
  /** 命令唯一键。 */ key: string | number;
  /** 展示文字。 */ label?: string;
  /** 禁用该命令。 */ disabled?: boolean;
  /** 操作/分隔线/分组标题。 */ type?: 'item' | 'divider' | 'group';
  /** 文字图标或符号。 */ icon?: string;
}
export interface ZtDropdownProps {
  /** 菜单宽度，默认按内容自适应。 */ width?: number | string;
  /** 有序菜单项，key 必须唯一；提供 dropdown 插槽时以插槽为准。 */ items?: ZtDropdownItem[];
  /** click 点击或 hover 悬停。 */ trigger?: 'click' | 'hover';
  /** 禁用触发器。 */ disabled?: boolean;
  /** 首选展开位置。 */ placement?: ZtPopoverPlacement;
  /** 选择后是否关闭。 */ hideOnClick?: boolean;
  /** 全局尺寸覆盖。 */ size?: ZtComponentSize;
}
export interface ZtDropdownItemProps {
  /** 选择时发出的命令值，操作项建议设置唯一值；省略时为空字符串。 */ command?: string | number;
  /** 默认展示文字，也会作为 command 事件中菜单项的 label。 */ label?: string;
  /** 禁用该命令。 */ disabled?: boolean;
  /** 操作、分隔线或分组标题。 */ type?: 'item' | 'divider' | 'group';
  /** 文字图标或符号。 */ icon?: string;
}
