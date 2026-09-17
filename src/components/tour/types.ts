import type { ZtPopoverPlacement } from '../popover/types';
export interface ZtTourStep {
  /** 目标元素、CSS 选择器或获取回调；缺失或已移除时居中显示。 */ target?:
    string | HTMLElement | (() => HTMLElement | null | undefined);
  /** 当前步骤标题。 */ title: string;
  /** 纯文本步骤说明，可由默认插槽替换。 */ description?: string;
  /** 当前步骤首选方位，默认 bottom。 */ placement?: ZtPopoverPlacement;
}
export interface ZtTourProps {
  /** 是否显示，支持 v-model，默认 false。 */ modelValue?: boolean;
  /** 受控步骤索引，默认 0；小数向下取整、越界值限制到有效范围、非有限值按 0。 */ current?: number;
  /** 步骤列表；空数组不创建浮层。 */ steps?: ZtTourStep[];
  /** 显示遮罩和目标高亮，默认 true。 */ mask?: boolean;
  /** 步骤变更时将目标滚入可视区域，默认 true。 */ scrollIntoView?: boolean;
  /** 提示面板宽度 px，窄屏自动收缩，默认 320。 */ width?: number;
  /** 初始层级，交由共用浮层管理器排序，默认 1000。 */ zIndex?: number;
}
export interface ZtTourEmits {
  (e: 'update:modelValue', open: boolean): void;
  (e: 'update:current', index: number): void;
  (e: 'change', index: number): void;
  (e: 'finish'): void;
  (e: 'close', reason: string): void;
}
