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
  /** 有序菜单项，key 必须唯一。 */ items: ZtDropdownItem[];
  /** click 点击或 hover 悬停。 */ trigger?: 'click' | 'hover';
  /** 禁用触发器。 */ disabled?: boolean;
  /** 首选展开位置。 */ placement?: ZtPopoverPlacement;
  /** 选择后是否关闭。 */ hideOnClick?: boolean;
  /** 全局尺寸覆盖。 */ size?: ZtComponentSize;
}
