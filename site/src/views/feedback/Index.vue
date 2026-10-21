<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Motion from './Motion.vue';
import MotionCode from './Motion.vue?raw';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Message from './Message.vue';
import MessageCode from './Message.vue?raw';
import Notification from './Notification.vue';
import NotificationCode from './Notification.vue?raw';
import MessageBox from './MessageBox.vue';
import MessageBoxCode from './MessageBox.vue?raw';
import MessageBoxAdvanced from './MessageBoxAdvanced.vue';
import MessageBoxAdvancedCode from './MessageBoxAdvanced.vue?raw';
import Dialog from './Dialog.vue';
import DialogCode from './Dialog.vue?raw';
import Drawer from './Drawer.vue';
import DrawerCode from './Drawer.vue?raw';
import Content from './Content.vue';
import ContentCode from './Content.vue?raw';
import Loading from './Loading.vue';
import LoadingCode from './Loading.vue?raw';
</script>

<template>
  <article class="doc-section">
    <h1>Feedback 命令式反馈 · zt-alert</h1>
    <p>
      独立包
      <a
        href="https://www.npmjs.com/package/@ztechjs/zt-alert"
        target="_blank"
        rel="noreferrer"
        >@ztechjs/zt-alert</a
      >
      提供 Message、Notification、MessageBox、Dialog、Drawer 和全屏
      Loading。无需 Vue 运行时；以下以 Vue + TypeScript 展示完整调用和交互结果。
    </p>
    <h2>安装与导入</h2>
    <pre><code>npm install @ztechjs/zt-alert</code></pre>
    <p>
      在应用入口引入 @ztechjs/zt-alert/style.css；zt-ui 不重新导出这些命令式
      API。每个示例均含独立导入、交互状态、样式和可复制源码。SSR
      中可导入，打开浮层需在浏览器中执行。
    </p>
    <h2>新版动效：果冻回弹、描边与退场对比</h2>
    <DemoBlock
      :code="MotionCode"
      desc="直接调用 0.1.3 原生动效。窄屏普通弹窗与全屏淡入分开展示，可重复打开观察差异。"
      ><Motion
    /></DemoBlock>
    <h2>快速体验</h2>
    <DemoBlock
      :code="BasicCode"
      desc="分别点击按钮，体验短消息、右上通知、确认框和全屏加载。"
      ><Basic
    /></DemoBlock>
    <h2>Message 消息：状态、堆叠与同 ID 更新</h2>
    <DemoBlock
      :code="MessageCode"
      desc="四种状态、字符串与对象调用、自动关闭、常驻、不显示关闭按钮、更新、按 ID 关闭和清空。"
      ><Message
    /></DemoBlock>
    <h2>Notification 通知：标题、长正文与独立队列</h2>
    <DemoBlock
      :code="NotificationCode"
      desc="右上角通知独立堆叠；可切换状态、常驻、更新同一通知并设置新的关闭时长。"
      ><Notification
    /></DemoBlock>
    <h2>MessageBox：提示、确认与输入</h2>
    <DemoBlock
      :code="MessageBoxCode"
      desc="体验四种图标、快捷调用、危险操作确认、输入框与 Promise 返回值。"
      ><MessageBox
    /></DemoBlock>
    <h2>MessageBox 进阶：按钮、定时器与加载态</h2>
    <DemoBlock
      :code="MessageBoxAdvancedCode"
      desc="自定义多按钮和返回对象、定时消失、关闭弹性动画、限制退出、getState / setActionValue / stopLoading / close。"
      ><MessageBoxAdvanced
    /></DemoBlock>
    <h2>Dialog：表单、异步保存与全屏</h2>
    <DemoBlock
      :code="DialogCode"
      desc="原生 DOM 表单在 render 中挂载，确认时显示加载态，保存成功关闭并通过 closed 返回业务值。"
      ><Dialog
    /></DemoBlock>
    <h2>Drawer：筛选、嵌套确认与关闭拦截</h2>
    <DemoBlock
      :code="DrawerCode"
      desc="修改关键词后尝试关闭。beforeClose 返回异步确认结果；取消放弃时继续保留编辑内容。"
      ><Drawer
    /></DemoBlock>
    <h2>Dialog / Drawer：内容输入与实例控制</h2>
    <DemoBlock
      :code="ContentCode"
      desc="对比纯文本、可信 HTML、已有 DOM 节点、render 清理函数，以及 update / setLoading / toggleFullscreen。"
      ><Content
    /></DemoBlock>
    <h2>全屏 Loading：阶段更新、图标、遮罩与单例</h2>
    <DemoBlock
      :code="LoadingCode"
      desc="加载过程中更新文字、恢复默认图标、切换遮罩并自动适配文字颜色；所有演示自动结束，finally 关闭遮罩。"
      ><Loading
    /></DemoBlock>
    <h2>API 与效果速查</h2>
    <div class="feedback-table">
      <table>
        <thead>
          <tr>
            <th>API</th>
            <th>主要配置 / 方法</th>
            <th>效果与返回值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Message / Notification</td>
            <td>
              open / success / error / warning /
              info；id、title、content、duration、closable；close(id)、clear()
            </td>
            <td>
              返回 string 或 number ID；默认 3200 / 5200ms；duration: 0 常驻。
            </td>
          </tr>
          <tr>
            <td>MessageBox</td>
            <td>
              函数快捷调用 / alert / confirm /
              prompt；buttons、content、timer、dangerMode、shake、closeOnEsc、closeOnClickOutside
            </td>
            <td>
              返回 Promise；confirm 为 boolean，prompt 为 string 或
              null；普通调用返回按钮业务值。
            </td>
          </tr>
          <tr>
            <td>MessageBox 状态</td>
            <td>
              getState / setActionValue / stopLoading / close / setDefaults
            </td>
            <td>
              closeModal: false 保留窗口并加载；Promise 只结算一次。setDefaults
              为全局配置，应在应用初始化时设置。
            </td>
          </tr>
          <tr>
            <td>Dialog / Drawer</td>
            <td>
              open；title、subtitle、width、showHeader、showClose、showFooter、showCancelButton、confirmText、cancelText、bodyPadding、bodyScroll、fullscreenBelow
            </td>
            <td>
              返回实例；默认仅正文滚动，768px 以下全屏。Drawer 固定从右侧进入。
            </td>
          </tr>
          <tr>
            <td>浮层控制</td>
            <td>
              update / close / focus / setLoading / setConfirmLoading；Dialog
              另有
              toggleFullscreen、height、maxHeight、top、showZoom、fullscreen
            </td>
            <td>
              await close() 返回是否允许关闭；await closed 得到 { reason, value
              }，在退场后结算。
            </td>
          </tr>
          <tr>
            <td>浮层生命周期</td>
            <td>
              beforeClose、onOpen、onShow、onConfirm、onCancel、onClose、onHide、onError、onCloseError
            </td>
            <td>
              关闭原因：close / cancel / mask / escape / api。beforeClose 返回
              false 或抛错会保留浮层；确认需主动 close()。
            </td>
          </tr>
          <tr>
            <td>全屏 Loading</td>
            <td>
              open(string /
              options)、update、close、closed；text、icon、maskColor、zIndex
            </td>
            <td>
              同一活动实例复用；不自动关闭、不对并发任务计数。close()
              等待退场完成。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>动画、主题与键盘操作</h2>
    <p>
      Message 从顶部、Notification 从右侧弹性入场；Dialog / MessageBox
      使用带回弹的进场与两段退场，Drawer
      使用侧向弹性。系统开启“减少动态效果”时自动降低动画。交互浮层支持焦点循环与关闭后焦点恢复；Loading
      只能通过命令关闭。
    </p>
    <p>主题通过 CSS 变量配置，例如在应用全局样式中设置：</p>
    <pre><code>:root {
  --zt-accent: #245edb;
  --zt-accent-ink: #244c9e;
  --zt-success: #1f8657;
  --zt-warning: #a96b13;
  --zt-error: #bd3f3b;
  --zt-radius: 16px;
  --zt-loading-mask: rgba(20, 24, 32, 0.2);
}</code></pre>
    <p>
      content 的字符串和数字均按纯文本处理；html 只接受可信或已消毒内容。DOM
      节点内容在关闭后尽量还原，render 应返回清理函数。完整类型可直接从
      @ztechjs/zt-alert 导入。
    </p>
    <h2>声明式组件继续使用 zt-ui</h2>
    <p>
      <RouterLink to="/loading">ZtLoading 区域加载</RouterLink> 通过 Vue
      模板状态控制局部内容。独立包全屏加载在示例中命名为 ZtFullscreenLoading。
    </p>
    <p>
      <RouterLink to="/alert">ZtAlert 页面内提示</RouterLink>、<RouterLink
        to="/modal"
        >ZtModal 弹窗</RouterLink
      >
      与
      <RouterLink to="/drawer">ZtDrawer 抽屉</RouterLink>
      提供由响应式状态控制的声明式用法。
    </p>
  </article>
</template>

<style scoped>
.feedback-table {
  max-width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.7;
}
th,
td {
  padding: 12px;
  border: 1px solid var(--zt-border, #dce2ed);
  text-align: left;
  vertical-align: top;
}
th {
  white-space: nowrap;
}
</style>
