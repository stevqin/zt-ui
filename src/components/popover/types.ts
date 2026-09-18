export type ZtPopoverTrigger = 'click' | 'hover' | 'focus' | 'manual';
export type ZtPopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
export interface ZtPopoverProps {
  /** 浮层是否显示，支持 v-model:visible。 */ visible?: boolean;
  /** 触发方式。 */ trigger?: ZtPopoverTrigger;
  /** 首选出现方位，空间不足时自动翻转。 */ placement?: ZtPopoverPlacement;
  /** 浮层宽度，数值按像素处理。 */ width?: number | string;
  /** 浮层外层高度，数值按像素处理；内容超出时内部滚动。 */ height?: number | string;
  /** 浮层与触发器的间距。 */ offset?: number;
  /** 禁用全部打开交互。 */ disabled?: boolean;
  /** 是否显示指向触发器的箭头。 */ showArrow?: boolean;
  /** 是否 Teleport 到 body。 */ teleported?: boolean;
  /** 打开延迟毫秒数。 */ openDelay?: number;
  /** 关闭延迟毫秒数。 */ closeDelay?: number;
  /** 浮层层级。 */ zIndex?: number;
  /** 关闭时将焦点返回触发器；输入建议类浮层可关闭以保留正常 Tab 顺序。 */ restoreFocus?: boolean;
  /** 关闭后保留浮层 DOM。 */ persistent?: boolean;
}
export interface ZtPopoverInstance {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  updatePosition: () => void;
}
