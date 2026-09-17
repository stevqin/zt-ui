import type { ZtPopoverPlacement } from '../popover/types';
export interface ZtTooltipProps {
  /** 简短纯文本说明。 */ content?: string;
  /** 禁用显示与打开行为。 */ disabled?: boolean;
  /** 首选方位。 */ placement?: ZtPopoverPlacement;
  /** 鼠标悬停打开延迟毫秒。 */ openDelay?: number;
  /** 鼠标移出关闭延迟毫秒。 */ closeDelay?: number;
  /** 控制显示，支持 v-model:visible。 */ visible?: boolean;
  /** 是否显示箭头。 */ showArrow?: boolean;
}
