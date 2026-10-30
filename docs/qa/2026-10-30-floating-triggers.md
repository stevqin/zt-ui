# 浮层触发器与下拉菜单回归验证

## 修复范围

- Popover 触发器采用内容宽度，避免 Grid/Flex 的拉伸区域参与定位。修复 Popconfirm、Tooltip 和 Dropdown 共享的定位偏移。
- Autocomplete、Mention、TimePicker 显式保留满宽触发区，避免输入控件宽度收缩。
- Dropdown 遇到单个 Button 或原生交互控件时直接使用该控件，保留原有样式、引用与事件。文本及非交互内容继续使用默认按钮和箭头。
- 自定义语义按钮补齐 Tab 焦点及 Enter/Space 激活；菜单保留方向键、Escape、Tab、禁用状态和命令选择后的焦点行为。

## 浏览器回归

在 `site/` 运行 `npm run test:browser`，首次运行前安装 Chromium：`npx playwright install chromium`。可用 `ZT_DOCS_BROWSER_CHANNEL=msedge` 选择本机 Edge。

8 项真实布局测试覆盖：

- Popover、Popconfirm、Tooltip 的触发器宽度、浮层对齐、8px 间距与页面滚动后的定位。
- 右侧手动 Popover 相对于按钮右边缘定位。
- Dropdown 自定义按钮仅渲染一个按钮，方向键打开、Escape 关闭、命令选择与焦点恢复。
- Autocomplete、Mention、TimePicker 触发区域保持完整控件宽度。

桌面 1440×1000 实际浏览器全部通过，视口截图确认浮层位置及 Dropdown 无重复边框。GitHub Pages 工作流增加 Chromium 回归步骤。

## 回归有效性

- 原始布局下，浮层触发区域比实际按钮宽 738–750px，4 项浮层定位测试失败；修复后通过。
- 共享样式收窄输入控件时，3 项满宽测试失败；添加限定样式后通过。
- Dropdown 单元测试覆盖默认触发器、自定义按钮、事件和引用保留、语义按钮键盘操作及动态禁用。

## 完整检查结果

- 组件库：165 个测试文件、1721 项测试全部通过。
- 文档站：14 个测试文件、417 项测试全部通过。
- 浏览器：8 项真实布局与交互测试全部通过。
- 组件库类型检查、ESM/UMD/Canvas 构建及文档站类型检查和生产构建通过。
- 公开组件契约审计：167 个公开组件，0 项未豁免违规。

## Dropdown 箭头

- 自定义 Button、原生按钮及语义触发器保留按钮内部的装饰箭头，展开旋转 180°、关闭复位；不增加按钮或边框。
- 保留渲染函数的文本、数组及作用域插槽内容，动态文字更新后箭头仍存在。
- Dropdown 相关 28 项测试、类型检查及浏览器按钮/箭头数量、垂直对齐和旋转状态检查通过。
