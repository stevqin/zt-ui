import type { ZtComponentSize } from '../types';
export interface ZtPageHeaderProps {
  /** 默认页面标题，可由 title 插槽替换。 */ title?: string;
  /** 标题下方说明，可由 description 插槽替换。 */ description?: string;
  /** 显示返回按钮，默认 true。 */ showBack?: boolean;
  /** 返回按钮辅助技术名称，默认 返回。 */ backLabel?: string;
  /** 文字和间距尺寸，默认继承 ConfigProvider。 */ size?: ZtComponentSize;
}
export interface ZtPageHeaderEmits {
  (e: 'back', event: MouseEvent): void;
}
