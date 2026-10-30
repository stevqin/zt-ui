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
