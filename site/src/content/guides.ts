export interface GuideSection {
  id: string;
  title: string;
  text: string;
  code?: string;
}
export interface Guide {
  id: string;
  title: string;
  description: string;
  sections: GuideSection[];
}
export const guides: Guide[] = [
  {
    id: "installation",
    title: "安装",
    description: "在 Vue 3 项目中安装 Zt UI，并引入组件样式。",
    sections: [
      {
        id: "environment",
        title: "环境要求",
        text: "使用 Vue 3.5 及以上版本和支持 ES Modules 的构建工具。推荐 TypeScript 与 Vite。Zt UI 适用于浏览器端业务界面。",
      },
      {
        id: "package",
        title: "安装组件库",
        text: "使用项目现有的包管理器安装，不要混用多套锁文件。",
        code: "npm install @ztechjs/zt-ui vue",
      },
      {
        id: "styles",
        title: "引入样式",
        text: "在应用入口引入一次组件库样式。反馈组件的样式由组件库入口加载；直接使用 zt-alert 时请显式引入其样式。",
        code: "import '@ztechjs/zt-ui/style.css'",
      },
    ],
  },
  {
    id: "quick-start",
    title: "快速开始",
    description: "按需导入组件，用一个完整的单文件组件开始。",
    sections: [
      {
        id: "first-component",
        title: "第一个组件",
        text: "组件采用具名导出，无需全局注册。以下代码可直接放入 App.vue。",
        code: `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { ZtButton, ZtInput } from '@ztechjs/zt-ui'\nimport '@ztechjs/zt-ui/style.css'\nconst name = ref('')\n</script>\n<template>\n  <ZtInput v-model="name" placeholder="输入名称" />\n  <ZtButton status="primary" @click="name = ''">清空</ZtButton>\n</template>`,
      },
      {
        id: "on-demand",
        title: "按需使用",
        text: "直接从组件库入口导入需要的组件和类型。构建工具负责裁剪未使用的导出。VTableGrid 的 Canvas 图元使用独立子入口。",
      },
    ],
  },
  {
    id: "configuration",
    title: "全局配置",
    description: "使用 ConfigProvider 统一设置尺寸、圆角和主题。",
    sections: [
      {
        id: "focus-ring",
        title: "全局焦点环",
        text: "额外焦点环默认关闭，输入、Tab 导航、校验与选中状态仍正常工作。focusRing 可设置为 none、keyboard 或 all；keyboard 按实际键盘/指针操作切换，不依赖浏览器对文本框的 focus-visible 判断。嵌套 Provider 可覆盖，Vue 弹窗和下拉浮层继承所属配置；独立命令式服务使用应用最外层 Provider 的全局策略。多个独立应用并存时，文档级策略采用最先挂载且仍存在的根 Provider。",
        code: '<ZtConfigProvider focus-ring="keyboard">\n  <App />\n</ZtConfigProvider>',
      },
      {
        id: "provider",
        title: "统一配置",
        text: "size 支持 mini、small、default、medium、large；borderRadius 使用非负像素值，默认 11；theme 支持 light 和 dark。",
        code: `<script setup lang="ts">\nimport { ZtConfigProvider, ZtButton } from '@ztechjs/zt-ui'\n</script>\n<template>\n  <ZtConfigProvider size="default" :border-radius="11" theme="light">\n    <ZtButton status="primary">保存</ZtButton>\n  </ZtConfigProvider>\n</template>`,
      },
      {
        id: "priority",
        title: "配置优先级",
        text: "组件显式属性优先于继承值，嵌套 ConfigProvider 可以局部覆盖。没有开放相关能力的组件保持自身固定规格。使用页头的尺寸、圆角与主题控件，可直接体验这三项配置。",
      },
    ],
  },
  {
    id: "theme",
    title: "主题与样式",
    description: "切换明暗主题，并通过全局配置调整组件外观。",
    sections: [
      {
        id: "dark",
        title: "暗色模式",
        text: "将 ConfigProvider 的 theme 设置为 dark 即可切换后代组件。应用可结合 matchMedia 跟随操作系统；theme 本身只接收 light 或 dark。",
      },
      {
        id: "radius",
        title: "圆角与尺寸",
        text: "borderRadius 调整组件基础圆角，具体组件根据自身形状计算实际圆角。size 影响支持该配置的组件密度；不会改变业务数据或校验状态。",
      },
      {
        id: "scope",
        title: "样式范围",
        text: "优先使用组件公开属性、插槽及 ConfigProvider。业务布局样式在自己的容器内定义，避免全局覆盖组件内部结构。",
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "导入公共类型，使用明确的数据模型和实例方法。",
    sections: [
      {
        id: "types",
        title: "公共类型",
        text: "Props、选项和实例类型从组件库入口导出，名称与组件 API 页保持一致。",
        code: "import type { ZtComponentSize, ZtVTableGridColumn, ZtVTableGridInstance } from '@ztechjs/zt-ui'\ntype Row = { id: number; name: string }\nconst columns: ZtVTableGridColumn<Row>[] = [{ field: 'name', title: '名称' }]",
      },
      {
        id: "instances",
        title: "组件实例",
        text: "通过 Vue ref 获取组件实例。调用前检查实例已经挂载；可用方法与参数以各组件的 Exposes 表格为准。VTableGrid 等泛型组件应指定业务行类型。",
      },
    ],
  },
  {
    id: "vtable",
    title: "VTableGrid 接入",
    description: "安装表格引擎与编辑器，并按需使用 Canvas 内容。",
    sections: [
      {
        id: "peers",
        title: "安装引擎依赖",
        text: "VTableGrid 使用 VisActor VTable。在使用该组件的项目中安装兼容的 peer dependencies。",
        code: "npm install @visactor/vtable@^1.26.7 @visactor/vtable-editors@^1.26.7 @visactor/vue-vtable@^1.26.7",
      },
      {
        id: "canvas",
        title: "Canvas 子入口",
        text: "表格组件从主入口导入，Canvas 图元从独立子入口导入。DOM 控件放在表单、工具栏等 DOM 插槽内。",
        code: "import { ZtVTableGrid } from '@ztechjs/zt-ui'\nimport { VTableTag, VTableText } from '@ztechjs/zt-ui/vtable'\nimport '@ztechjs/zt-ui/style.css'",
      },
      {
        id: "records",
        title: "数据与保存",
        text: "默认本地分页；localPagination=false 展示全部本地记录。originalRecords 应是独立快照，保存成功后由应用更新。远程查询、选项加载、导入和服务端导出通过应用回调接入。",
      },
    ],
  },
];
