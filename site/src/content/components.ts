import { pagesA } from "./pages-a";
import { pagesB } from "./pages-b";
import { alertPages } from "./alerts";
import type { DocGroup, DocPage } from "../app/types";
export const groups: { id: DocGroup; title: string }[] = [
  { id: "foundation", title: "基础组件" },
  { id: "layout", title: "布局" },
  { id: "form", title: "表单组件" },
  { id: "data", title: "数据展示" },
  { id: "navigation", title: "导航" },
  { id: "feedback", title: "反馈" },
  { id: "overlay", title: "浮层" },
  { id: "media", title: "媒体" },
  { id: "extensions", title: "zt-alert 扩展组件" },
];
export const pages: DocPage[] = [...pagesA, ...pagesB, ...alertPages];
export const findPage = (id: string) => pages.find((page) => page.id === id);
export const pagePath = (id: string) => `/components/${id}`;
