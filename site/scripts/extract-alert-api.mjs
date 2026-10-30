import ts from "typescript";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const descriptions = {
  id: "消息标识；传入已有 id 可原位更新。",
  title: "标题文本。",
  content: "主体内容，具体可传类型见类型列。",
  status: "状态颜色与图标。",
  duration: "自动关闭时间（毫秒），0 表示常驻。",
  closable: "是否显示消息关闭按钮。",
  text: "显示文本。",
  icon: "状态图标或自定义图标，支持类型见类型列。",
  buttons: "具名按钮配置与返回值。",
  button: "单个确认按钮配置。",
  className: "附加样式类。",
  closeOnClickOutside: "是否允许点击外部关闭。",
  closeOnEsc: "是否允许 Escape 关闭。",
  dangerMode: "使用危险操作强调样式。",
  shake: "是否启用震动反馈。",
  timer: "自动关闭计时（毫秒）。",
  subtitle: "头部副标题。",
  html: "HTML 内容；仅使用可信来源的内容。",
  render: "自定义 DOM 渲染；可返回清理函数。",
  ariaLabel: "辅助技术读取的浮层名称。",
  closeLabel: "关闭按钮的无障碍名称。",
  width: "面板宽度，支持数字或 CSS 长度。",
  fullscreenBelow: "低于指定视口宽度时切换全屏。",
  showHeader: "是否显示头部。",
  showClose: "是否显示关闭按钮。",
  showFooter: "是否显示底部操作区。",
  showCancelButton: "是否显示取消按钮。",
  confirmText: "确认按钮文字。",
  cancelText: "取消按钮文字。",
  confirmDisabled: "是否禁用确认按钮。",
  loading: "面板主体的加载状态。",
  loadingText: "主体加载提示文字。",
  confirmLoading: "确认按钮的加载状态。",
  maskClosable: "是否允许点击遮罩关闭。",
  escClosable: "是否允许 Escape 关闭。",
  lockScroll: "打开时锁定页面滚动。",
  focusTrap: "将键盘焦点限制在面板内部。",
  autoFocus: "打开后自动聚焦面板。",
  bodyScroll: "是否允许主体区域滚动。",
  bodyPadding: "主体内边距。",
  zIndex: "浮层初始层级。",
  beforeClose: "关闭前守卫；返回 false 可阻止关闭，支持异步。",
  onOpen: "面板打开时回调。",
  onShow: "进入动画完成时回调。",
  onConfirm: "确认操作回调，支持异步与 controls。",
  onCancel: "取消操作回调。",
  onClose: "关闭操作回调，接收关闭原因。",
  onHide: "退出动画完成时回调。",
  onCloseError: "关闭守卫异常回调。",
  onError: "操作异常回调。",
  height: "面板高度。",
  maxHeight: "面板最大高度。",
  top: "顶部偏移。",
  showZoom: "是否显示全屏切换按钮。",
  fullscreen: "初始是否全屏。",
  maskColor: "全屏遮罩背景颜色。",
  open: "打开服务并返回可管理的标识或实例。",
  success: "显示成功状态消息。",
  error: "显示错误状态消息。",
  warning: "显示警告状态消息。",
  info: "显示说明状态消息。",
  close: "关闭指定消息或当前服务，参数和返回值见类型列。",
  clear: "清空此服务所有消息；共享环境优先按 id 关闭。",
  call: "直接调用服务；Promise 返回按钮的操作值。",
  alert: "显示提醒框。",
  confirm: "显示确认框，返回是否确认。",
  prompt: "显示输入框，返回字符串或 null。",
  getState: "读取当前消息框状态。",
  setDefaults: "设置全局默认配置。",
  setActionValue: "设置消息框按钮的返回值。",
  stopLoading: "结束消息框按钮加载状态。",
  update: "更新当前实例配置。",
  setLoading: "设置主体加载状态与提示文字。",
  setConfirmLoading: "设置确认按钮加载状态。",
  focus: "将焦点移入当前面板。",
  toggleFullscreen: "切换全屏，force 可指定目标状态。",
  closed: "关闭完成的 Promise；浮层结果包含 reason 和 value。",
};

const serviceDescriptions = {
  message: {
    open: '显示消息并返回消息标识；传入已有 id 时更新对应消息。',
    close: '按 id 关闭对应消息。', clear: '关闭全部 Message 消息。',
    content: '消息正文，支持字符串或数字。',
  },
  notification: {
    open: '显示通知并返回通知标识；传入已有 id 时更新对应通知。',
    close: '按 id 关闭对应通知。', clear: '关闭全部 Notification 通知。',
    content: '通知正文，支持字符串或数字。',
  },
  'message-box': {
    call: '打开消息框；Promise 在操作结束后返回按钮的动作值。',
    close: '关闭当前消息框。',
    content: '消息框主体，支持字符串、DOM 节点或指定元素及属性的配置对象。',
    icon: '消息框图标，可使用状态名称或自定义图标字符串。',
    getState: '读取消息框是否打开、按钮动作值与加载状态以及当前计时器。',
  },
  dialog: {
    open: '打开对话框并返回实例，可通过实例更新配置或等待关闭结果。',
    content: '主体内容，支持字符串、数字或 DOM 节点；复杂内容可用 render 自定义渲染。',
    'instance.close': '请求关闭当前对话框，可传关闭原因及返回值；返回是否通过关闭守卫。',
    'instance.closed': '对话框关闭完成时兑现的 Promise，包含关闭原因 reason 和结果 value。',
    'instance.update': '合并更新当前对话框配置，并返回当前实例。',
  },
  drawer: {
    open: '打开抽屉并返回实例，可通过实例更新配置或等待关闭结果。',
    content: '主体内容，支持字符串、数字或 DOM 节点；复杂内容可用 render 自定义渲染。',
    'instance.close': '请求关闭当前抽屉，可传关闭原因及返回值；返回是否通过关闭守卫。',
    'instance.closed': '抽屉关闭完成时兑现的 Promise，包含关闭原因 reason 和结果 value。',
    'instance.update': '合并更新当前抽屉配置，并返回当前实例。',
  },
  loading: {
    open: '打开全屏加载并返回实例；已打开时更新当前单例，字符串参数用作提示文字。',
    close: '关闭当前全屏加载，Promise 在退出完成后兑现。',
    icon: '自定义加载图标，可传图标字符串、DOM 元素或 null。',
    'instance.closed': '加载遮罩关闭完成时兑现的 Promise，无返回值。',
    'instance.close': '关闭此加载遮罩，Promise 在退出完成后兑现。',
    'instance.update': '更新加载文字、图标或遮罩颜色；字符串参数仅更新文字，返回当前实例。',
  },
};

const typeDescriptions = {
  NoticeOptions: '消息与通知的配置，控制标识、标题、内容、状态、自动关闭及关闭按钮。',
  ZtNoticeApi: '消息与通知服务的调用接口，可创建、按标识更新或关闭消息及清空队列。',
  NoticeId: '消息的唯一标识，用于后续更新与关闭同一条消息。',
  NoticeContent: '消息内容，支持字符串或数字。',
  NoticeStatus: '消息状态：success、error、warning、info；决定状态颜色与图标。',
  NoticeInput: '调用消息服务时的输入，可直接传内容，也可传完整配置。',
  NoticeShortcutInput: '调用 success、error 等状态快捷方法时的内容或配置。',
  MessageBoxOptions: '消息框配置，控制标题、正文、按钮、输入框及关闭交互。',
  MessageBoxApi: '消息框服务接口，提供 alert、confirm、prompt 及消息框状态管理方法。',
  MessageBoxButtons: '消息框按钮配置，支持单个确认按钮或按操作值命名的按钮集合。',
  MessageBoxButtonOptions: '单个消息框按钮的文字、返回值、样式类、可见性及点击后是否关闭的配置。',
  MessageBoxContentOptions: '消息框主体的元素配置，指定元素名称或 DOM 节点，并通过 attributes 设置元素属性。',
  MessageBoxPublicState: '当前消息框的公开状态，包含是否打开、各按钮的动作值与加载状态，以及计时器。',
  MessageBoxButtonList: '内部解析后的具名按钮配置列表，按按钮操作值索引。',
  DialogOptions: '对话框配置，控制内容、尺寸、头尾区域、异步操作及关闭守卫。',
  DialogInstance: '对话框实例，可更新内容、控制加载、关闭面板、管理焦点并等待关闭结果。',
  OverlayLength: '浮层长度值；数字按像素处理，字符串可使用 CSS 长度单位。',
  DrawerOptions: '抽屉配置，控制标题、内容、宽度、头尾区域、异步确认及关闭交互。',
  DrawerInstance: '抽屉实例，包含更新配置、控制加载、关闭、焦点管理及等待关闭结果的方法。',
  LoadingOptions: '全屏加载配置，可设置加载文字、图标、遮罩颜色和层级。',
  LoadingInstance: '全屏加载实例，可更新显示配置并关闭加载遮罩。',
};

const definitions = [
  ["message", "ZtMessage", "NoticeOptions", "ZtNoticeApi"],
  ["notification", "ZtNotification", "NoticeOptions", "ZtNoticeApi"],
  ["message-box", "ZtMessageBox", "MessageBoxOptions", "MessageBoxApi"],
  ["dialog", "ZtDialog", "DialogOptions", "DialogInstance"],
  ["drawer", "ZtDrawer", "DrawerOptions", "DrawerInstance"],
  ["loading", "ZtLoading", "LoadingOptions", "LoadingInstance"],
];

/** Extract options, service overloads and inherited instance members from the installed public entry. */
export function extractAlertApi(declarationFile) {
  const source = ts.createSourceFile(
    declarationFile,
    readFileSync(declarationFile, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const declarations = new Map();
  const services = new Map();
  for (const statement of source.statements) {
    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)
    )
      declarations.set(statement.name.text, statement);
    if (ts.isVariableStatement(statement))
      for (const item of statement.declarationList.declarations)
        services.set(item.name.getText(source), item.type);
  }
  const text = (node) => node?.getText(source) ?? "unknown";
  function members(name, visited = new Set()) {
    if (visited.has(name)) return [];
    visited.add(name);
    const node = declarations.get(name);
    if (!node || !ts.isInterfaceDeclaration(node)) return [];
    const inherited = (node.heritageClauses ?? []).flatMap((clause) =>
      clause.types.flatMap((type) => members(text(type.expression), visited)),
    );
    const own = [...node.members];
    const names = new Set(
      own.filter((item) => item.name).map((item) => text(item.name)),
    );
    return [...inherited.filter((item) => !names.has(text(item.name))), ...own];
  }
  function row(member, prefix = "", service = "") {
    const callable =
      ts.isMethodSignature(member) || ts.isCallSignatureDeclaration(member);
    const name = ts.isCallSignatureDeclaration(member)
      ? "call"
      : text(member.name);
    const signature = callable
      ? text(member)
          .replace(/^\w+\??(?=\s*[<(])/, "")
          .trim()
      : text(member.type);
    return {
      name: prefix + name,
      type: signature,
      required: !member.questionToken,
      description: serviceDescriptions[service]?.[prefix + name] ?? descriptions[name] ?? "",
    };
  }
  return Object.fromEntries(
    definitions.map(([id, name, options, contract]) => {
      const service = services.get(name);
      if (!service || !declarations.has(options))
        throw new Error(`Missing public contract: ${name}`);
      const methods = ts.isTypeLiteralNode(service)
        ? [...service.members]
        : members(text(service));
      const exposes = methods.map((member) => row(member));
      if (id === "dialog" || id === "drawer" || id === "loading")
        exposes.push(
          ...members(contract).map((member) => row(member, "instance.", id)),
        );
      const references = new Set([options, contract]);
      function collect(node) {
        if (
          ts.isTypeReferenceNode(node) &&
          declarations.has(text(node.typeName))
        )
          references.add(text(node.typeName));
        ts.forEachChild(node, collect);
      }
      for (const ref of references) collect(declarations.get(ref));
      return [
        `zt-alert-${id}`,
        {
          components: [
            {
              name,
              kind: "service",
              props: members(options).map((member) => row(member, "", id)),
              events: [],
              slots: [],
              exposes,
              types: [...references].map((ref) => ({
                name: ref,
                type: text(declarations.get(ref)),
                description: typeDescriptions[ref],
              })),
            },
          ],
        },
      ];
    }),
  );
}

export function alertDeclaration(
  siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
) {
  const require = createRequire(resolve(siteRoot, "package.json"));
  return resolve(
    dirname(require.resolve("@ztechjs/zt-alert/style.css")),
    "../types/index.d.ts",
  );
}

export function writeAlertApi(
  siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
) {
  const result = extractAlertApi(alertDeclaration(siteRoot));
  const output = resolve(siteRoot, "src/generated/alert-api.json");
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
  return result;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  writeAlertApi();
