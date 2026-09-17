import type { ZtTextProps } from '../text/types';
export interface ZtTypographyProps extends Pick<
  ZtTextProps,
  'size' | 'status' | 'weight' | 'truncated' | 'lineClamp'
> {
  /** 文本、标题或段落，默认 text。 */
  variant?: 'text' | 'title' | 'paragraph';
  /** 标题语义级别 h1–h6，默认 2，字号按继承尺寸缩放。 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 默认纯文本内容，可由默认插槽覆盖。 */
  text?: string;
  /** 使用 strong 语义和粗体。 */
  strong?: boolean;
  /** 使用 em 语义和斜体。 */
  italic?: boolean;
  /** 使用 u 语义和下划线。 */
  underline?: boolean;
  /** 使用 del 语义和删除线。 */
  deleted?: boolean;
  /** 使用 mark 标签和高亮背景。 */
  mark?: boolean;
  /** 使用 code 标签，优先于 mark。 */
  code?: boolean;
  /** 显示复制按钮与成功/失败状态反馈。 */
  copyable?: boolean;
  /** 复制的纯文本；默认 text，其次渲染后的内容文本。 */
  copyText?: string;
}
export interface ZtTypographyEmits {
  /** 剪贴板写入成功后携带实际复制文本。 */
  (e: 'copy', text: string): void;
  /** 剪贴板不可用或写入失败时携带原始错误。 */
  (e: 'copy-error', error: unknown): void;
}
