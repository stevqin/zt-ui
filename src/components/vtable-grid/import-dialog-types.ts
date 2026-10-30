export interface ZtVTableGridImportDialogProps {
  modelValue?: boolean
  file?: File | null
  loading?: boolean
  title?: string
  description?: string
  templateUrl?: string
  templateDownload?: boolean
  formatHint?: string
  instructions?: string[]
  accept?: string
  allowedExtensions?: string[]
  fileSpec?: string
  fileTypeLabel?: string
}

/** 导入插槽的共享状态；请通过动作方法更新文件或提交，以复用格式校验和忙碌保护。 */
export interface ZtVTableGridImportDialogSlotScope {
  readonly title: string
  readonly description: string
  readonly instructions: readonly string[]
  readonly formatHint: string
  readonly fileSpec: string
  readonly fileTypeLabel: string
  readonly templateUrl: string
  readonly file: File | null
  readonly format: string
  readonly loading: boolean
  readonly dragging: boolean
  readonly error: string
  readonly canConfirm: boolean
  readonly accept: string
  readonly allowedExtensions: readonly string[]
  readonly canDownloadTemplate: boolean
  openFileDialog: () => void
  selectFile: (file: File) => boolean
  removeFile: () => void
  /** 校验后触发 confirm 事件并等待状态同步；业务导入仍由调用方处理并通过 loading 控制。 */
  confirm: () => Promise<void>
  cancel: () => void
  close: () => void
  downloadTemplate: () => void
}
export interface ZtVTableGridImportDialogSlots {
  /** 替换标题左侧的文件格式图标。 */
  'title-icon'?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 替换标题文字，保留标题区域和默认格式图标。 */
  title?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 自定义说明。 */
  description?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 自定义操作步骤。 */
  instructions?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 自定义导入选项，请绑定 loading 禁用控件。 */
  options?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 自定义模板下载内容，downloadTemplate 沿用 templateUrl/templateDownload 配置。 */
  template?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 替换上传区域内部内容；仍保留文件选择器与拖拽校验容器。 */
  upload?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 替换默认上传区域中的已选文件；upload 插槽优先。 */
  file?: (scope: ZtVTableGridImportDialogSlotScope & { file: File }) => unknown
  /** 自定义格式校验错误。 */
  error?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
  /** 自定义底部操作，confirm/cancel 等方法仍有忙碌保护。 */
  footer?: (scope: ZtVTableGridImportDialogSlotScope) => unknown
}
