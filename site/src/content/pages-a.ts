import type { DocPage } from '../app/types'

export const pagesA: DocPage[] = [
  {
    "id": "button",
    "name": "Button",
    "title": "按钮",
    "group": "foundation",
    "description": "触发提交、保存和取消等操作，以语义色和交互状态区分动作优先级。",
    "usage": [
      "表单提交使用 type=\"submit\"，普通动作使用默认 button。",
      "异步操作期间开启 loading，避免用户重复触发。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "操作与语义",
        "description": "点击提交会更新计数，清零按钮和禁用按钮展示次要及不可用操作。",
        "file": "src/examples/button/Basic.vue"
      },
      {
        "id": "variants",
        "title": "填充、虚线与加载",
        "description": "不同外观用于同一工具栏中的操作分级；模拟保存结束后显示成功结果。",
        "file": "src/examples/button/Variants.vue"
      },
    ]
  },
  {
    "id": "icon",
    "name": "Icon",
    "title": "图标",
    "group": "foundation",
    "description": "提供统一线性图标、语义色、旋转和自定义 SVG 的展示容器。",
    "usage": [
      "工具栏图标可与按钮文字搭配。",
      "独立表达信息的图标应设置 label，装饰图标无需重复朗读。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "语义与旋转",
        "description": "内置名称、状态色和持续旋转适用于查找、成功反馈与加载指示。",
        "file": "src/examples/icon/Basic.vue"
      },
      {
        "id": "gallery",
        "title": "完整图标检索",
        "description": "根据当前公开图标名称生成图标库，输入关键词筛选并点击查看导入使用方式。",
        "file": "src/examples/icon/Gallery.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "link",
    "name": "Link",
    "title": "链接",
    "group": "foundation",
    "description": "在正文和操作区域提供可访问的超链接、下载及路由入口。",
    "usage": [
      "跳转外站使用 href 与 target。",
      "文档中的次要跳转可使用 hover 下划线，禁用链接不会导航。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "原生链接",
        "description": "使用 href 跳转官方站点，外链图标表明将打开新窗口。",
        "file": "src/examples/link/Basic.vue"
      },
      {
        "id": "underline",
        "title": "下划线与文件下载",
        "description": "比较下划线策略，并用自包含的数据 URL 下载一份 CSV。",
        "file": "src/examples/link/Underline.vue"
      }
    ]
  },
  {
    "id": "text",
    "name": "Text",
    "title": "文本",
    "group": "foundation",
    "description": "提供语义标签、颜色、字重以及单行、多行文本截断。",
    "usage": [
      "数值状态或辅助说明使用 status 区分语义。",
      "在宽度受限的单元格中截断长名称，同时保留原生 title 提示。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "文本语义",
        "description": "正文、强调、辅助文字及代码采用不同的语义标签。",
        "file": "src/examples/text/Basic.vue"
      },
      {
        "id": "truncation",
        "title": "长文本截断",
        "description": "单行名称与两行摘要在固定内容宽度内省略，适合列表与卡片。",
        "file": "src/examples/text/Truncation.vue"
      }
    ]
  },
  {
    "id": "typography",
    "name": "Typography",
    "title": "排版",
    "group": "foundation",
    "description": "用标题、段落和行内格式组织说明文档，并支持纯文本复制反馈。",
    "usage": [
      "公告或帮助中心用标题层级建立结构。",
      "订单号、代码片段用 copyable 提供直接复制。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "标题与段落",
        "description": "标题使用真实 h3 语义，段落和行内强调组织业务说明。",
        "file": "src/examples/typography/Basic.vue"
      },
      {
        "id": "copy",
        "title": "复制文本与反馈",
        "description": "复制订单号后展示成功或失败反馈，copy-text 可与显示内容不同。",
        "file": "src/examples/typography/Copy.vue"
      }
    ]
  },
  {
    "id": "tag",
    "name": "Tag",
    "title": "标签",
    "group": "data",
    "description": "用紧凑标签标记分类、业务状态与可移除的筛选条件。",
    "usage": [
      "业务状态用 status 及 effect 展示。",
      "筛选条件关闭后由应用更新数据，组件不会自行删除业务项。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "状态与外观",
        "description": "同一批状态可用浅色、深色和描边外观，按业务层级选择。",
        "file": "src/examples/tag/Basic.vue"
      },
      {
        "id": "closable",
        "title": "移除筛选条件",
        "description": "关闭标签会更新筛选数组，恢复操作重建初始条件。",
        "file": "src/examples/tag/Closable.vue"
      }
    ]
  },
  {
    "id": "badge",
    "name": "Badge",
    "title": "徽标",
    "group": "data",
    "description": "在业务入口旁显示未读数量、溢出计数或小圆点提醒。",
    "usage": [
      "工作台消息入口显示待办数量。",
      "无须精确数字的更新提示使用 is-dot。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "数量与溢出",
        "description": "超过 max 的数量以加号显示，支持清除和新增未读消息。",
        "file": "src/examples/badge/Basic.vue"
      },
      {
        "id": "dot",
        "title": "圆点与零值",
        "description": "点击查看更新后隐藏圆点；show-zero 保留零值计数，非圆形徽标继承全局圆角。",
        "file": "src/examples/badge/Dot.vue"
      }
    ]
  },
  {
    "id": "alert",
    "name": "Alert",
    "title": "提示",
    "group": "feedback",
    "description": "在页面内展示可关闭的业务提示、风险说明和操作反馈。",
    "usage": [
      "表单顶部提示校验结果或审批风险。",
      "需要反复打开的提示使用 v-model 受控显示。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "业务提示",
        "description": "标题和详细说明配合语义图标，提醒用户核对导出范围。",
        "file": "src/examples/alert/Basic.vue"
      },
      {
        "id": "controlled",
        "title": "关闭后再次打开",
        "description": "关闭按钮会更新 v-model，再次查看可以恢复同一提示。",
        "file": "src/examples/alert/Controlled.vue"
      }
    ]
  },
  {
    "id": "loading",
    "name": "Loading",
    "title": "加载",
    "group": "feedback",
    "description": "在局部内容或全屏操作中显示加载指示和状态文字。",
    "usage": [
      "保留已有内容并覆盖加载层，适合报表刷新。",
      "必须等待的提交可用短暂全屏遮罩，并提供加载说明。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "局部加载",
        "description": "切换加载状态，观察遮罩只覆盖报表预览区域。",
        "file": "src/examples/loading/Basic.vue"
      },
      {
        "id": "fullscreen",
        "title": "全屏加载",
        "description": "点击后锁定滚动并显示全屏进度，模拟任务在 800ms 后自动结束。",
        "file": "src/examples/loading/Fullscreen.vue"
      }
    ]
  },
  {
    "id": "progress",
    "name": "Progress",
    "title": "进度条",
    "group": "feedback",
    "description": "显示可量化的任务完成率，或不确定耗时任务的循环状态。",
    "usage": [
      "上传和批处理按已完成量计算 percentage。",
      "无法提供总量时使用 indeterminate，避免虚构百分比。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "任务进度",
        "description": "按钮推动批处理进度，完成后切换成功状态。",
        "file": "src/examples/progress/Basic.vue"
      },
      {
        "id": "indeterminate",
        "title": "不确定进度与文字格式",
        "description": "未知总量时显示循环动画，已知数量时将百分比转换为记录数。",
        "file": "src/examples/progress/Indeterminate.vue"
      }
    ]
  },
  {
    "id": "result",
    "name": "Result",
    "title": "结果",
    "group": "feedback",
    "description": "用结果图标、标题及后续操作承接完成、异常和权限场景。",
    "usage": [
      "提交成功后给出返回列表或继续新建的入口。",
      "权限或服务异常页展示具体原因与重试操作。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "提交成功",
        "description": "结果区域提供继续新建动作，点击后更新本地业务反馈。",
        "file": "src/examples/result/Basic.vue"
      },
      {
        "id": "error",
        "title": "错误结果与重试",
        "description": "模拟服务异常，重试后替换成成功结果。",
        "file": "src/examples/result/Error.vue"
      }
    ]
  },
  {
    "id": "empty",
    "name": "Empty",
    "title": "空状态",
    "group": "feedback",
    "description": "在没有数据时解释原因，并给出创建或清除筛选等下一步操作。",
    "usage": [
      "首次进入无内容列表时提供创建入口。",
      "筛选无结果时说明筛选条件，允许恢复全部。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "暂无业务数据",
        "description": "默认插图搭配明确说明，帮助用户理解列表当前为空。",
        "file": "src/examples/empty/Basic.vue"
      },
      {
        "id": "action",
        "title": "从空状态创建内容",
        "description": "点击新建后展示实际草稿列表，空状态随数据变化消失。",
        "file": "src/examples/empty/Action.vue"
      }
    ]
  },
  {
    "id": "skeleton",
    "name": "Skeleton",
    "title": "骨架屏",
    "group": "feedback",
    "description": "内容加载前用轮廓占位，完成后替换为真实内容，减少布局跳动。",
    "usage": [
      "列表和详情首次请求时显示文本轮廓。",
      "结构复杂时用 SkeletonItem 自定义图片、头像和文本占位。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "文本骨架与真实内容",
        "description": "切换 loading 对比占位行与加载后的业务正文。",
        "file": "src/examples/skeleton/Basic.vue"
      },
      {
        "id": "custom",
        "title": "组合头像与图片占位",
        "description": "template 插槽定义符合商品卡片结构的骨架，不依赖固定行数。",
        "file": "src/examples/skeleton/Custom.vue"
      }
    ]
  },
  {
    "id": "statistic",
    "name": "Statistic",
    "title": "统计数值",
    "group": "data",
    "description": "格式化展示金额、数量、比例等关键指标，支持前后缀与缺失值。",
    "usage": [
      "看板 KPI 使用 title、precision 和 suffix 解释数值含义。",
      "缺失数据传入 undefined，避免把无效数据展示为零。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "金额和比例",
        "description": "同一区域展示销售额与达成率，数值按精度和千分位格式化。",
        "file": "src/examples/statistic/Basic.vue"
      },
      {
        "id": "formatter",
        "title": "自定义计量单位",
        "description": "将原始元换算为万元，并用插槽补充增长方向。",
        "file": "src/examples/statistic/Formatter.vue"
      }
    ]
  },
  {
    "id": "avatar",
    "name": "Avatar",
    "title": "头像",
    "group": "media",
    "description": "展示用户图片、名称缩写和图标，并为图片加载失败提供后备内容。",
    "usage": [
      "用户导航和操作记录使用头像帮助识别人员。",
      "无图片或图片失败时提供 alt、插槽文字或 icon。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "人员与后备头像",
        "description": "文字、图标和方形头像用于不同业务对象。",
        "file": "src/examples/avatar/Basic.vue"
      },
      {
        "id": "image",
        "title": "图片与加载失败",
        "description": "自包含 SVG 展示图片头像；无效图片地址触发后备文字并显示错误反馈。",
        "file": "src/examples/avatar/Image.vue"
      }
    ]
  },
  {
    "id": "image",
    "name": "Image",
    "title": "图片",
    "group": "media",
    "description": "展示图片适应方式、加载后备和可缩放切换的预览浮层。",
    "usage": [
      "商品缩略图使用 cover 保持卡片比例。",
      "详情大图启用 show-preview 与 preview-src-list 形成相册。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "适应容器",
        "description": "同一张横图分别使用 cover 与 contain，比较裁切和完整显示。",
        "file": "src/examples/image/Basic.vue"
      },
      {
        "id": "preview",
        "title": "相册预览与错误后备",
        "description": "点击任意缩略图打开对应位置的相册，可缩放、切换和 Escape 关闭；无效图片使用 error 插槽。",
        "file": "src/examples/image/Preview.vue"
      }
    ]
  },
  {
    "id": "watermark",
    "name": "Watermark",
    "title": "水印",
    "group": "media",
    "description": "在业务内容上叠加重复文字或图片标识，作为视觉归属提示。",
    "usage": [
      "内部报表显示组织与查看人信息。",
      "需要多行信息时传入字符串数组；水印只提供视觉提示。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "报表文字水印",
        "description": "多行水印覆盖内容，底层业务按钮仍可操作。",
        "file": "src/examples/watermark/Basic.vue"
      },
      {
        "id": "adjust",
        "title": "调整密度和角度",
        "description": "控制旋转角与透明度，观察敏感报表上的水印密度。",
        "file": "src/examples/watermark/Adjust.vue"
      }
    ]
  },
  {
    "id": "qrcode",
    "name": "QRCode",
    "title": "二维码",
    "group": "media",
    "description": "将纯文本编码为 SVG 或 Canvas 二维码，支持纠错等级及当前图像下载。",
    "usage": [
      "分享应用地址或订单查询链接时展示二维码。",
      "需要导出图片时通过实例 download 下载 SVG 或 PNG。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "实时编码",
        "description": "编辑查询地址立即生成二维码，空字符串显示组件空状态。",
        "file": "src/examples/qrcode/Basic.vue"
      },
      {
        "id": "download",
        "title": "Canvas 与图片下载",
        "description": "切换渲染模式后下载当前图像，下载结果和编码异常都有反馈；颜色保持高对比度。",
        "file": "src/examples/qrcode/Download.vue"
      }
    ]
  },
  {
    "id": "layout",
    "name": "Layout",
    "title": "布局",
    "group": "layout",
    "description": "用 Header、Aside、Main、Footer 组合应用级框架，自动推断常见排列方向。",
    "usage": [
      "管理后台使用顶部加侧栏结构。",
      "嵌套 Layout 组织主内容和辅助面板。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "上下布局",
        "description": "直接子节点包含 Header 或 Footer 时自动纵向排列。",
        "file": "src/examples/layout/Basic.vue",
        "wide": true
      },
      {
        "id": "nested",
        "title": "顶部与侧栏",
        "description": "通过嵌套 Layout 将侧栏和主内容并排，外层保持纵向。",
        "file": "src/examples/layout/Nested.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "row",
    "name": "Row",
    "title": "栅格行",
    "group": "layout",
    "description": "以 24 栅格为基础组织列间距、换行以及主轴和交叉轴对齐。",
    "usage": [
      "报表筛选条件按行组织，gutter 控制水平和垂直间距。",
      "配合 Col 构造响应式看板卡片。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "24 栅格与换行间距",
        "description": "三个八列卡片占满一行，第四个自动换行；元组 gutter 同时控制横纵间距。",
        "file": "src/examples/row/Basic.vue",
        "wide": true
      },
      {
        "id": "alignment",
        "title": "主轴和交叉轴对齐",
        "description": "使用 space-between 分开两侧，middle 让不同高度的列垂直居中。",
        "file": "src/examples/row/Alignment.vue"
      }
    ]
  },
  {
    "id": "col",
    "name": "Col",
    "title": "栅格列",
    "group": "layout",
    "description": "在 24 栅格内指定占比、偏移及各响应式断点的跨度。",
    "usage": [
      "看板在手机单列、平板两列、桌面三列。",
      "用 offset 在表单末尾保留标签对齐空间。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "跨度和偏移",
        "description": "列跨度与偏移的总和按 24 栅格计算，不需要为每个元素写百分比。",
        "file": "src/examples/col/Basic.vue"
      },
      {
        "id": "responsive",
        "title": "断点布局",
        "description": "调整浏览器宽度：小屏一列、768px 起两列、1200px 起三列；此例响应窗口宽度。",
        "file": "src/examples/col/Responsive.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "space",
    "name": "Space",
    "title": "间距",
    "group": "layout",
    "description": "为一组内容设置方向、间距、对齐方式和自动换行。",
    "usage": [
      "操作按钮组使用默认横向间距。",
      "纵向表单辅助区使用 stretch 让子内容铺满。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "按钮组与换行",
        "description": "按钮继承全局尺寸，Space 的默认间距也随全局 size 调整。",
        "file": "src/examples/space/Basic.vue"
      },
      {
        "id": "vertical",
        "title": "纵向信息与两端对齐",
        "description": "纵向 stretch 适合设置区，内部 space-between 将标签和操作放在两侧。",
        "file": "src/examples/space/Vertical.vue"
      }
    ]
  },
  {
    "id": "divider",
    "name": "Divider",
    "title": "分割线",
    "group": "layout",
    "description": "在内容区块之间提供水平、垂直和带文字的分隔。",
    "usage": [
      "详情页用带标题的分隔线组织信息。",
      "同一行的次要链接用垂直分割线区分。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "标题分隔",
        "description": "文字位置可左对齐，虚线适合区分附加信息。",
        "file": "src/examples/divider/Basic.vue"
      },
      {
        "id": "vertical",
        "title": "行内操作分隔",
        "description": "纵向分割线与行内文字共同排列，不使用文字插槽。",
        "file": "src/examples/divider/Vertical.vue"
      }
    ]
  },
  {
    "id": "card",
    "name": "Card",
    "title": "卡片",
    "group": "layout",
    "description": "将标题、正文、额外操作和页脚组织成独立内容区块。",
    "usage": [
      "报表摘要或设置面板使用卡片分组。",
      "请求内容时开启 loading，保留头部与页脚上下文。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "标题、工具与页脚",
        "description": "extra 插槽放置刷新动作，footer 展示数据说明；刷新实际更新次数。",
        "file": "src/examples/card/Basic.vue"
      },
      {
        "id": "loading",
        "title": "加载和阴影策略",
        "description": "切换卡片加载状态，骨架仅替代正文；hover 阴影用于可交互卡片。",
        "file": "src/examples/card/Loading.vue"
      }
    ]
  },
  {
    "id": "splitter",
    "name": "Splitter",
    "title": "分栏器",
    "group": "layout",
    "description": "通过鼠标拖动或键盘调整两个内容区域的占比，支持收起第一栏。",
    "usage": [
      "查询器中调整目录与详情宽度。",
      "上下预览区域使用 vertical，限制 min/max 避免内容过窄。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "可拖动和收起的左右分栏",
        "description": "拖动分隔条或聚焦后用方向键调整，收起按钮可恢复先前宽度。",
        "file": "src/examples/splitter/Basic.vue",
        "wide": true
      },
      {
        "id": "vertical",
        "title": "上下分栏",
        "description": "上下分配编辑区和结果区，Shift 配合方向键可放大调整步长。",
        "file": "src/examples/splitter/Vertical.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "scrollbar",
    "name": "Scrollbar",
    "title": "滚动条",
    "group": "layout",
    "description": "为固定高度或最大高度内容提供自定义滚动条及程序化滚动接口。",
    "usage": [
      "长列表或侧边菜单保持固定阅读区域。",
      "通过实例 setScrollTop、scrollTo 定位特定内容。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "纵向列表",
        "description": "固定高度内展示门店列表，滚动事件反馈当前位置。",
        "file": "src/examples/scrollbar/Basic.vue"
      },
      {
        "id": "control",
        "title": "程序化滚动与横向内容",
        "description": "按钮定位最后一行或返回顶部，宽表头允许横向滚动。",
        "file": "src/examples/scrollbar/Control.vue"
      }
    ]
  },
  {
    "id": "tabs",
    "name": "Tabs",
    "title": "标签页",
    "group": "navigation",
    "description": "在同一区域切换相关内容，支持不同外观、延迟渲染、编辑和切换守卫。",
    "usage": [
      "详情页按基本信息、库存和操作记录分组。",
      "多文档编辑区使用可新增关闭的标签，并在切换前检查未保存内容。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "切换详情内容",
        "description": "v-model 保存当前页签，禁用项不会切换；库存页首次激活时渲染。",
        "file": "src/examples/tabs/Basic.vue"
      },
      {
        "id": "editable",
        "title": "多草稿新增与关闭",
        "description": "新增标签后自动激活，关闭当前标签后选择相邻草稿；仅剩一份时保留最后草稿。",
        "file": "src/examples/tabs/Editable.vue"
      },
      {
        "id": "guard",
        "title": "切换守卫",
        "description": "模拟未保存状态，取消勾选保存状态时阻止离开编辑页，页面内提供明确原因。",
        "file": "src/examples/tabs/Guard.vue"
      }
    ]
  },
  {
    "id": "menu",
    "name": "Menu",
    "title": "菜单",
    "group": "navigation",
    "description": "用树形、双栏或横向结构组织业务入口，支持折叠、分组、键盘和路由导航。",
    "usage": [
      "后台侧栏使用 vertical，多模块工作台可用 double。",
      "已安装 Vue Router 的应用启用 router，并使用 route 指定命名路由和查询参数。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "树形侧栏与折叠",
        "description": "展开子菜单、切换业务项和折叠侧栏，当前选择通过 v-model 显示在右侧。",
        "file": "src/examples/menu/Basic.vue",
        "wide": true
      },
      {
        "id": "modes",
        "title": "双栏工作台与横向菜单",
        "description": "共享四级菜单数据，演示模块、业务分类、分析主题与功能页面的逐层导航；双栏默认展开深层分支，横向点击逐级展开浮层，二者独立显示完整选中路径。",
        "file": "src/examples/menu/Modes.vue",
        "wide": true
      },
      {
        "id": "router",
        "title": "独立路由应用模拟",
        "description": "示例使用 Vue Router 的内存历史，菜单实际跳转命名路由并同步选择；不会离开当前文档地址。",
        "file": "src/examples/menu/Router.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "breadcrumb",
    "name": "Breadcrumb",
    "title": "面包屑",
    "group": "navigation",
    "description": "展示当前页面所在的层级位置，为上级页面提供跳转入口。",
    "usage": [
      "详情页顶部展示首页、列表与当前记录。",
      "最后一项使用纯文本表示当前位置，避免无意义跳转。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "层级导航",
        "description": "前两级为可访问链接，当前页为纯文本；地址使用外部示例站点。",
        "file": "src/examples/breadcrumb/Basic.vue"
      },
      {
        "id": "separator",
        "title": "自定义分隔符与禁用入口",
        "description": "自定义 separator，禁用的目录项保留层级信息并阻止导航。",
        "file": "src/examples/breadcrumb/Separator.vue"
      }
    ]
  },
  {
    "id": "segmented",
    "name": "Segmented",
    "title": "分段选择器",
    "group": "navigation",
    "description": "在少量互斥选项之间切换，用于视图模式、统计周期等轻量筛选。",
    "usage": [
      "周、月、年等统计口径切换。",
      "使用 block 在容器中均分选项，图标选项表达视图布局。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "统计周期",
        "description": "切换周期会改变实际显示的销售数据，而非只更新控件选中样式。",
        "file": "src/examples/segmented/Basic.vue"
      },
      {
        "id": "icons",
        "title": "图标选项与禁用项",
        "description": "网格和列表切换改变商品呈现方式，未开放的图表视图保持禁用。",
        "file": "src/examples/segmented/Icons.vue"
      }
    ]
  },
  {
    "id": "steps",
    "name": "Steps",
    "title": "步骤条",
    "group": "navigation",
    "description": "展示业务流程的当前阶段、已完成阶段和异常节点。",
    "usage": [
      "多阶段表单指示填写、确认和提交进度。",
      "审核或配送流程可用纵向步骤显示阶段说明。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "分步填写流程",
        "description": "点击下一步推进业务状态，完成后可以重新开始。",
        "file": "src/examples/steps/Basic.vue"
      },
      {
        "id": "vertical",
        "title": "异常流程说明",
        "description": "纵向流程为每个阶段提供详细说明，当前阶段使用 error 告知失败位置。",
        "file": "src/examples/steps/Vertical.vue"
      }
    ]
  },
  {
    "id": "pagination",
    "name": "Pagination",
    "title": "分页",
    "group": "navigation",
    "description": "控制大列表的当前页、每页数量和跳转，支持总数与独立页数。",
    "usage": [
      "服务端列表通过 current-change 或 change 发起请求。",
      "本地列表也应按 currentPage 和 pageSize 对数据切片。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "真实列表分页",
        "description": "分页器控制订单切片，每页五条，点击页码会展示对应订单。",
        "file": "src/examples/pagination/Basic.vue"
      },
      {
        "id": "pagesize",
        "title": "页容量与快速跳转",
        "description": "切换页容量后回到第一页，并同步显示本次查询参数，适合服务端列表。",
        "file": "src/examples/pagination/PageSize.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "anchor",
    "name": "Anchor",
    "title": "锚点",
    "group": "navigation",
    "description": "为页面或指定滚动容器内的章节提供跳转与当前位置跟踪。",
    "usage": [
      "长报告使用章节树快速定位。",
      "嵌入式内容区域传入 container，避免驱动整个页面滚动。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "容器章节导航",
        "description": "点击章节只滚动右侧报告区域，章节进入视口后同步高亮。",
        "file": "src/examples/anchor/Basic.vue",
        "wide": true
      },
      {
        "id": "nested",
        "title": "嵌套章节",
        "description": "子章节与业务结构对应，关闭 smooth 可直接定位到目标标题。",
        "file": "src/examples/anchor/Nested.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "affix",
    "name": "Affix",
    "title": "固钉",
    "group": "navigation",
    "description": "滚动超过原始位置后，将操作区域固定在窗口或滚动容器的边缘。",
    "usage": [
      "长表单顶部保留保存工具栏。",
      "容器内报表工具随区域滚动固定，避免覆盖文档其他区域。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "容器顶部固定",
        "description": "向下滚动示例区域，工具栏抵达顶部后固定；状态文字反映 change 事件。",
        "file": "src/examples/affix/Basic.vue",
        "wide": true
      },
      {
        "id": "disabled",
        "title": "按需启用固定",
        "description": "关闭固定行为时工具栏随内容正常滚动，可用于比较两种阅读方式。",
        "file": "src/examples/affix/Disabled.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "backtop",
    "name": "Backtop",
    "title": "回到顶部",
    "group": "navigation",
    "description": "当页面或指定区域滚动超过阈值时，提供快速返回顶部的按钮。",
    "usage": [
      "长数据列表提供返回顶部入口。",
      "示例使用局部滚动容器，按钮仍按组件契约固定在窗口右下角。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "滚动后出现",
        "description": "滚动列表超过 100px 后，窗口右下角显示返回顶部按钮，点击会滚动此列表。",
        "file": "src/examples/backtop/Basic.vue"
      },
      {
        "id": "custom",
        "title": "自定义按钮内容",
        "description": "使用默认插槽展示 TOP；滚动区域超过阈值后出现在另一位置。",
        "file": "src/examples/backtop/Custom.vue"
      }
    ]
  },
  {
    "id": "page-header",
    "name": "PageHeader",
    "title": "页头",
    "group": "navigation",
    "description": "组织详情页的返回动作、标题、说明、面包屑和右侧工具。",
    "usage": [
      "列表进入详情后用 back 事件返回业务列表。",
      "顶级页面可隐藏返回按钮，通过 extra 放置主要操作。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "返回列表",
        "description": "返回按钮由业务处理：点击后将详情区域替换为本地列表。",
        "file": "src/examples/page-header/Basic.vue"
      },
      {
        "id": "actions",
        "title": "面包屑和操作区",
        "description": "隐藏顶级页面返回按钮，工具区保存报表并显示反馈。",
        "file": "src/examples/page-header/Actions.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "carousel",
    "name": "Carousel",
    "title": "走马灯",
    "group": "media",
    "description": "在有限区域轮流展示图片或内容，支持受控索引、自动播放和实例切换。",
    "usage": [
      "展示活动公告和商品主题图。",
      "自动播放在悬停、聚焦或页面不可见时暂停，保留手动控制。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "手动切换活动",
        "description": "箭头与指示器控制活动页，当前索引通过 v-model 同步显示。",
        "file": "src/examples/carousel/Basic.vue",
        "wide": true
      },
      {
        "id": "autoplay",
        "title": "自动轮播与外部控制",
        "description": "勾选启用自动播放，也可调用实例上一张、下一张和指定页；关闭循环后停在边界。",
        "file": "src/examples/carousel/Autoplay.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "tour",
    "name": "Tour",
    "title": "漫游引导",
    "group": "overlay",
    "description": "用浮层分步介绍当前界面的功能，支持目标高亮、步骤控制和完成反馈。",
    "usage": [
      "首次使用复杂报表工具时引导筛选和导出。",
      "无目标的步骤可以居中展示流程介绍或结束说明。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "目标高亮导览",
        "description": "开始后依次介绍两个真实按钮，通过元素回调定位，支持下一步、关闭和重新开始。",
        "file": "src/examples/tour/Basic.vue"
      },
      {
        "id": "centered",
        "title": "无目标的流程说明",
        "description": "不指定 target 时居中展示，关闭遮罩适合轻量流程提示。",
        "file": "src/examples/tour/Centered.vue"
      }
    ]
  },
  {
    "id": "infinite-scroll",
    "name": "InfiniteScroll",
    "title": "无限滚动",
    "group": "data",
    "description": "接近滚动底部时分批加载内容，处理请求并发、加载结束和失败重试。",
    "usage": [
      "消息流或日志列表分批追加数据。",
      "load 接收 AbortSignal，异步完成前应检查是否中止。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "滚动加载与完成状态",
        "description": "在局部滚动容器内每次增加五条记录，达到二十条后停止自动加载。",
        "file": "src/examples/infinite-scroll/Basic.vue"
      },
      {
        "id": "retry",
        "title": "请求失败与重试",
        "description": "第一次请求模拟网络失败，错误插槽显示原因并调用组件提供的 retry，第二次请求成功追加。",
        "file": "src/examples/infinite-scroll/Retry.vue"
      }
    ]
  },
  {
    "id": "collapse",
    "name": "Collapse",
    "title": "折叠面板",
    "group": "data",
    "description": "以展开收起的面板组织辅助信息，支持多项展开或单项手风琴。",
    "usage": [
      "常见问题、筛选条件或详情补充内容按需展开。",
      "重内容用 lazy 延迟到首次展开时渲染。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "常见问题",
        "description": "展开帮助面板查看操作说明，多个问题可同时保持打开。",
        "file": "src/examples/collapse/Basic.vue"
      },
      {
        "id": "accordion",
        "title": "手风琴与延迟内容",
        "description": "同一时刻只展开一个面板，lazy 内容在首次展开后创建。",
        "file": "src/examples/collapse/Accordion.vue"
      }
    ]
  },
  {
    "id": "descriptions",
    "name": "Descriptions",
    "title": "描述列表",
    "group": "data",
    "description": "以标签和值的形式展示只读详情，支持跨列、边框和纵向标签。",
    "usage": [
      "订单、商品与人员详情展示字段。",
      "长地址或备注用 span 合并列，避免内容过窄。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "订单详情",
        "description": "两列详情中，收货地址跨两列，状态字段嵌入业务标签。",
        "file": "src/examples/descriptions/Basic.vue",
        "wide": true
      },
      {
        "id": "vertical",
        "title": "纵向标签与插槽",
        "description": "标签位于内容上方，label 插槽组合图标与字段名。",
        "file": "src/examples/descriptions/Vertical.vue",
        "wide": true
      }
    ]
  },
  {
    "id": "timeline",
    "name": "Timeline",
    "title": "时间线",
    "group": "data",
    "description": "按时间组织业务事件，支持倒序、交替布局、自定义节点与模板子项。",
    "usage": [
      "订单物流、审批记录和操作审计沿时间展示。",
      "items 适合服务数据，TimelineItem 适合包含复杂内容的模板。"
    ],
    "examples": [
      {
        "id": "basic",
        "title": "物流事件与倒序",
        "description": "时间线由业务数组驱动，切换倒序不会修改原始事件数组。",
        "file": "src/examples/timeline/Basic.vue"
      },
      {
        "id": "custom",
        "title": "模板节点与交替布局",
        "description": "用 TimelineItem 承载审批说明，通过 node 插槽自定义完成节点图标。",
        "file": "src/examples/timeline/Custom.vue",
        "wide": true
      }
    ]
  }
]
