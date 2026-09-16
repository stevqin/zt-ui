import type { ZtComponentSize } from '../types'
export type ZtUploadStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ZtUploadFileStatus = 'ready' | 'uploading' | 'success' | 'fail'
export interface ZtUploadFile {
 /** 稳定且唯一的文件标识。 */
 uid: string
 name: string
 size?: number
 status: ZtUploadFileStatus
 percentage?: number
 raw?: File
 url?: string
 response?: unknown
 error?: string
}
export interface ZtUploadRequestOptions {
 file: File
 filename: string
 action: string
 method: string
 headers: Record<string,string>
 data: Record<string,string | number | boolean | Blob>
 withCredentials: boolean
 timeout: number
 signal: AbortSignal
 onProgress: (percentage: number) => void
 onSuccess: (response: unknown) => void
 onError: (error: unknown) => void
}
export type ZtUploadRequest = (options: ZtUploadRequestOptions) => void | Promise<unknown> | { abort?: () => void }
export interface ZtUploadRequestContext {
 file: File
 action: string
 method: string
 headers: Record<string,string>
 withCredentials: boolean
 timeout: number
 signal: AbortSignal
 /** 将 Axios onUploadProgress 等进度回调换算成 0–100 后传入。 */
 onProgress: (percentage: number) => void
}
/** 已封装的业务上传接口。组件构建 FormData，并根据返回 Promise 更新上传状态。 */
export type ZtUploadSubmitRequest = (formData: FormData, context: ZtUploadRequestContext) => Promise<unknown>
export interface ZtUploadProps {
 /** 文件列表，支持 v-model:file-list。回显项需有唯一 uid、name 和 status。 */
 fileList?: ZtUploadFile[]
 /** 上传地址。默认请求使用 multipart/form-data；未配置地址或自定义请求时仅选择文件。 */
 action?: string
 /** 请求方法。 */
 method?: string
 /** multipart 文件字段名。 */
 name?: string
 /** 附加请求头。 */
 headers?: Record<string,string>
 /** 附加表单字段。 */
 data?: Record<string,string | number | boolean | Blob>
 /** 跨域请求是否携带 Cookie 等凭据。 */
 withCredentials?: boolean
 /** 请求超时毫秒数，0 表示不限。 */
 timeout?: number
 /** 接受的扩展名或 MIME，逗号分隔；选择和拖拽都会校验。 */
 accept?: string
 /** 允许一次选择多个文件；false 时批量拖入只取第一个文件。 */
 multiple?: boolean
 /** 列表最多容纳文件数，0 不限制。批量选择超限时整批拒绝并触发 exceed。 */
 limit?: number
 /** 单个文件上限，单位 MB，0 不限制。 */
 maxSize?: number
 /** 选择完成后自动上传；false 时通过 submit() 上传。 */
 autoUpload?: boolean
 /** 开启拖拽区域。 */
 drag?: boolean
 disabled?: boolean
 size?: ZtComponentSize
 status?: ZtUploadStatus
 /** 列表样式：普通文件、图片缩略图列表或照片墙。照片墙达到 limit 时隐藏添加入口。 */
 listType?: 'text' | 'picture' | 'picture-card'
 /** 是否展示文件列表。 */
 showFileList?: boolean
 /** 文件加入列表前的异步校验，可返回 false 拒绝或返回 File / Blob 替换上传内容。 */
 beforeUpload?: (file: File) => boolean | void | File | Blob | Promise<boolean | void | File | Blob>
 /** 移除前校验，返回 false 或 Promise 拒绝时保留文件。 */
 beforeRemove?: (file: ZtUploadFile, files: ZtUploadFile[]) => boolean | void | Promise<boolean | void>
 /** 已封装的业务接口方法。组件传入 FormData 和请求上下文，可直接复用 Axios 实例及其拦截器。 */
 request?: ZtUploadSubmitRequest
 /** 自定义上传：返回 Promise 或调用回调；通过 signal 或返回 abort() 支持取消。 */
 httpRequest?: ZtUploadRequest
}
