const method = (name, type, description) => ({
  name,
  type,
  description,
  kind: 'method',
});
export const serviceApis = {
  loading: [
    method(
      'ZtLoadingService',
      '(options?: ZtLoadingProps) => ZtLoadingHandle',
      '创建全屏加载遮罩，返回 close() 句柄；服务始终启用 loading 和 fullscreen。',
    ),
    method(
      'useZtLoading',
      '() => (options?: ZtLoadingProps) => ZtLoadingHandle',
      '在 setup 中获取继承 ConfigProvider 的加载服务，随宿主卸载自动清理。',
    ),
  ],
  message: [
    method(
      'ZtMessage',
      '(options: ZtMessageOptions | string) => ZtMessageHandle',
      '创建消息；返回 close() 句柄。应用外调用使用默认主题，可通过 options.style 覆盖。',
    ),
    method(
      'success / info / warning / error',
      '(options: ZtMessageOptions | string) => ZtMessageHandle',
      '以指定反馈类型创建消息，其余选项与 ZtMessage 相同。',
    ),
    method(
      'closeAll',
      '() => void',
      '关闭当前全部 Message 实例，不影响 Notification。',
    ),
    method(
      'useZtMessage',
      '() => (options: ZtMessageOptions | string) => ZtMessageHandle',
      '在 setup 中获取继承最近 ConfigProvider 的消息函数；宿主卸载时清理其消息。',
    ),
  ],
  notification: [
    method(
      'ZtNotification',
      '(options: ZtNotificationOptions) => ZtMessageHandle',
      '创建通知，返回可手动关闭的句柄。',
    ),
    method(
      'closeAll',
      '() => void',
      '关闭所有 Notification 实例，不影响 Message。',
    ),
    method(
      'useZtNotification',
      '() => (options: ZtNotificationOptions) => ZtMessageHandle',
      'setup 中创建继承当前外观、随宿主卸载清理的通知函数。',
    ),
  ],
  'message-box': [
    ...['alert', 'confirm', 'prompt'].map((kind) =>
      method(
        kind,
        '(message: string, options?: ZtMessageBoxOptions) => Promise<ZtMessageBoxResult>',
        `${kind === 'alert' ? '提示' : kind === 'confirm' ? '确认' : '输入'}对话框；确认时 resolve({action:'confirm', value})，取消或关闭时 reject ZtMessageBoxDismissed，可读取 action 区分。`,
      ),
    ),
    method(
      'closeAll',
      '() => void',
      '关闭该服务所有未完成对话框，未完成 Promise 以 action=close 拒绝。',
    ),
    method(
      'useZtMessageBox',
      '() => typeof ZtMessageBox',
      'setup 中获取继承最近 ConfigProvider 的服务；closeAll 及卸载仅清理当前宿主创建的实例。',
    ),
  ],
};
