export type ZtAlertStatus =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export interface ZtAlertProps {
  /** 标题文本，不解析 HTML。 */ title?: string;
  /** 正文说明。 */ description?: string;
  /** 提示语义颜色。 */ status?: ZtAlertStatus;
  /** 是否展示关闭按钮。 */ closable?: boolean;
  /** 是否显示语义图标。 */ showIcon?: boolean;
  /** 受控显示状态，支持 v-model；关闭后可再次打开。 */ modelValue?: boolean;
}
