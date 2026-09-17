export type ZtMessageBoxAction = 'confirm' | 'cancel' | 'close';
export interface ZtMessageBoxResult {
  action: 'confirm';
  value: string;
}
export interface ZtMessageBoxOptions {
  /** 对话框标题。 */ title?: string;
  /** 初始输入值，仅 prompt 使用。 */ inputValue?: string;
  /** 输入框占位文字。 */ inputPlaceholder?: string;
  /** 确认按钮文字。 */ confirmText?: string;
  /** 取消按钮文字。 */ cancelText?: string;
  /** 返回 true 通过，false 或字符串表示校验失败；支持 Promise。 */ inputValidator?: (
    value: string,
  ) => boolean | string | Promise<boolean | string>;
  /** 确认前执行异步提交；false 保留对话框，拒绝时展示错误。 */ beforeConfirm?: (
    value: string,
  ) => boolean | void | Promise<boolean | void>;
}
