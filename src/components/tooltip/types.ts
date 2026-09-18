import type { ZtPopoverPlacement } from '../popover/types';
export interface ZtTooltipProps {
  /** 简短纯文本说明。 */ content?: string;
  /** 外框宽度，数字转换为 px，字符串作为 CSS 长度；省略时为 max-content，短文本紧凑、长文本换行，受视口最大宽度约束。 */ width?: number | string;
  /** 外框高度，数字转换为 px，字符串作为 CSS 长度；省略时按内容高度展示，指定高度后仅内容区滚动，受视口边界约束。 */ height?: number | string;
  /** 禁用显示与打开行为。 */ disabled?: boolean;
  /** 首选方位。 */ placement?: ZtPopoverPlacement;
  /** 鼠标悬停打开延迟毫秒。 */ openDelay?: number;
  /** 鼠标移出关闭延迟毫秒。 */ closeDelay?: number;
  /** 控制显示，支持 v-model:visible。 */ visible?: boolean;
  /** 是否显示箭头。 */ showArrow?: boolean;
}
