import type { DocPage } from "../app/types";

export const alertPages: DocPage[] = [
  {
    id: "zt-alert-message",
    name: "Message",
    title: "消息提示",
    group: "extensions",
    description:
      "在页面顶部提供简短的操作结果反馈，适合保存成功、输入错误等即时提示。",
    usage: [
      "先安装 @ztechjs/zt-alert，再引入服务和 @ztechjs/zt-alert/style.css。",
      "duration 为毫秒；设为 0 后需手动关闭。使用返回的 id 管理各自消息。",
    ],
    examples: [
      {
        id: "basic",
        title: "四种状态",
        description: "发送成功、警告、错误和说明消息；重置仅关闭本例实例。",
        file: "src/examples/zt-alert-message/Basic.vue",
      },
      {
        id: "update",
        title: "更新与手动关闭",
        description: "使用同一个 id 更新常驻消息，再按 id 关闭。",
        file: "src/examples/zt-alert-message/Update.vue",
      },
    ],
  },
  {
    id: "zt-alert-notification",
    name: "Notification",
    title: "通知",
    group: "extensions",
    description:
      "以右侧通知卡片展示标题和详细说明，适合后台任务进度和需要保留的信息。",
    usage: [
      "先安装 @ztechjs/zt-alert，再引入服务和 @ztechjs/zt-alert/style.css。",
      "duration 为毫秒；设为 0 后需手动关闭。使用返回的 id 管理各自消息。",
    ],
    examples: [
      {
        id: "basic",
        title: "四种状态",
        description: "发送成功、警告、错误和说明消息；重置仅关闭本例实例。",
        file: "src/examples/zt-alert-notification/Basic.vue",
      },
      {
        id: "update",
        title: "更新与手动关闭",
        description: "使用同一个 id 更新常驻消息，再按 id 关闭。",
        file: "src/examples/zt-alert-notification/Update.vue",
      },
    ],
  },
  {
    id: "zt-alert-message-box",
    name: "MessageBox",
    title: "消息确认框",
    group: "extensions",
    description:
      "通过提醒、确认或输入框收集一次操作决定，Promise 返回按钮值或用户输入。",
    usage: [
      "MessageBox 为全局单例；先结束当前消息框，再发起下一次操作。",
      "本例仅在持有消息框时调用 close，避免卸载时关闭其他示例。",
    ],
    examples: [
      {
        id: "basic",
        title: "确认与输入",
        description: "等待 Promise 返回后显示确认结果或用户输入。",
        file: "src/examples/zt-alert-message-box/Basic.vue",
      },
      {
        id: "custom",
        title: "自定义内容和按钮值",
        description: "直接传入 DOM 节点和具名按钮，读取实际返回值。",
        file: "src/examples/zt-alert-message-box/Custom.vue",
      },
    ],
  },
  {
    id: "zt-alert-dialog",
    name: "Dialog",
    title: "对话框",
    group: "extensions",
    description:
      "居中展示详情或编辑表单，支持异步确认、全屏预览和面板内部加载。",
    usage: [
      "使用 open 返回的实例关闭和更新本次浮层。",
      "通过 render 插入 DOM，返回函数释放事件监听器。",
    ],
    examples: [
      {
        id: "basic",
        title: "打开、更新与关闭",
        description: "保存返回实例，原位更新内容并读取 closed 的关闭原因。",
        file: "src/examples/zt-alert-dialog/Basic.vue",
      },
      {
        id: "custom",
        title: "自定义表单与异步确认",
        description: "render 返回清理函数，异步确认期间展示按钮加载状态。",
        file: "src/examples/zt-alert-dialog/Custom.vue",
      },
      {
        id: "fullscreen",
        title: "全屏与内容加载",
        description: "在面板内切换全屏并启动局部加载，900 毫秒后自动恢复内容。",
        file: "src/examples/zt-alert-dialog/Fullscreen.vue",
      },
    ],
  },
  {
    id: "zt-alert-drawer",
    name: "Drawer",
    title: "抽屉",
    group: "extensions",
    description:
      "从右侧展开详情或编辑表单，保留页面上下文并支持实例更新与异步保存。",
    usage: [
      "使用 open 返回的实例关闭和更新本次浮层。",
      "抽屉当前从右侧展开；当前公开 API 不支持 placement。",
    ],
    examples: [
      {
        id: "basic",
        title: "打开、更新与关闭",
        description: "保存返回实例，原位更新内容并读取 closed 的关闭原因。",
        file: "src/examples/zt-alert-drawer/Basic.vue",
      },
      {
        id: "custom",
        title: "自定义表单与异步确认",
        description: "render 返回清理函数，异步确认期间展示按钮加载状态。",
        file: "src/examples/zt-alert-drawer/Custom.vue",
      },
    ],
  },
  {
    id: "zt-alert-loading",
    name: "Loading",
    title: "加载",
    group: "extensions",
    description:
      "为整页阻塞任务显示加载进度，支持动态更新提示、自定义装饰图标和遮罩颜色。",
    usage: [
      "ZtLoading 是全屏单例，再次 open 会更新当前实例。",
      "当前公开 API 没有 target；局部内容加载请使用 Dialog 或 Drawer 实例的 setLoading。",
    ],
    examples: [
      {
        id: "basic",
        title: "全屏任务与进度更新",
        description: "打开全屏加载，自动更新进度后关闭；重置清除本例定时器。",
        file: "src/examples/zt-alert-loading/Basic.vue",
      },
      {
        id: "custom",
        title: "自定义图标与遮罩",
        description: "传入装饰 DOM 图标、遮罩颜色，自动完成后释放实例。",
        file: "src/examples/zt-alert-loading/Custom.vue",
      },
    ],
  },
];
