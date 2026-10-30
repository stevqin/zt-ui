import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ZtMessage, ZtMessageBox } from "@ztechjs/zt-alert";
import Message from "../src/examples/zt-alert-message/Update.vue";
import Notice from "../src/examples/zt-alert-notification/Basic.vue";
import Box from "../src/examples/zt-alert-message-box/Basic.vue";
import CustomBox from "../src/examples/zt-alert-message-box/Custom.vue";
import Dialog from "../src/examples/zt-alert-dialog/Basic.vue";
import Form from "../src/examples/zt-alert-dialog/Custom.vue";
import Fullscreen from "../src/examples/zt-alert-dialog/Fullscreen.vue";
import Drawer from "../src/examples/zt-alert-drawer/Basic.vue";
import DrawerForm from "../src/examples/zt-alert-drawer/Custom.vue";
import Loading from "../src/examples/zt-alert-loading/Basic.vue";
import CustomLoading from "../src/examples/zt-alert-loading/Custom.vue";
const wrappers: VueWrapper[] = [];
function render(component: Parameters<typeof mount>[0]) {
  const w = mount(component, { attachTo: document.body });
  wrappers.push(w);
  return w;
}
async function click(w: VueWrapper, text: string) {
  await w
    .findAll("button")
    .find((button) => button.text() === text)!
    .trigger("click");
  await flushPromises();
}
async function bodyClick(text: string) {
  const button = [...document.body.querySelectorAll("button")].find(
    (button) => button.textContent === text,
  );
  expect(button).toBeDefined();
  button!.click();
  await flushPromises();
}
beforeAll(() => {
  Object.defineProperty(SVGElement.prototype, "getTotalLength", {
    value: () => 20,
    configurable: true,
  });
});
afterEach(async () => {
  wrappers.splice(0).forEach((w) => w.unmount());
  ZtMessageBox.close();
  ZtMessage.clear();
  await flushPromises();
  vi.useRealTimers();
  document.body.innerHTML = "";
});
describe("zt-alert standalone examples use the actual service DOM", () => {
  it("updates a message by id and closes only messages it owns", async () => {
    const outside = ZtMessage.info({ content: "其他任务", duration: 0 });
    const w = render(Message);
    await click(w, "开始任务");
    await click(w, "完成并更新");
    expect(document.body.textContent).toContain("已整理 12 份示例文件");
    expect(
      document.querySelectorAll(".zt-message-stack .zt-notice"),
    ).toHaveLength(2);
    await click(w, "关闭本例消息");
    expect(document.body.textContent).toContain("其他任务");
    await click(w, "完成并更新");
    expect(document.body.textContent).not.toContain("已整理 12 份示例文件");
    ZtMessage.close(outside);
  });
  it("shows notification statuses through shortcut APIs", async () => {
    const w = render(Notice);
    await click(w, "warning");
    expect(document.body.textContent).toContain("任务状态：warning");
    expect(w.text()).toContain("已发送 warning");
  });
  it("resolves confirmation results and does not take over an existing singleton", async () => {
    const w = render(Box);
    await click(w, "归档确认");
    expect(document.body.textContent).toContain("是否归档当前草稿？");
    await bodyClick("确定");
    expect(w.text()).toContain("草稿已归档");
    const external = ZtMessageBox.alert("外部消息");
    await click(w, "输入名称");
    expect(w.text()).toContain("请先完成当前确认框");
    w.unmount();
    wrappers.splice(wrappers.indexOf(w), 1);
    expect(ZtMessageBox.getState().isOpen).toBe(true);
    ZtMessageBox.close();
    await external;
  });
  it("returns the typed prompt text", async () => {
    const w = render(Box);
    await click(w, "输入名称");
    const input = document.querySelector<HTMLInputElement>(".zt-box__input")!;
    expect(input).not.toBeNull();
    input.value = "示例名称";
    input.dispatchEvent(new Event("input"));
    await bodyClick("确定");
    expect(w.text()).toContain("名称：示例名称");
  });
  it("cancels a drawer save timer when the example resets", async () => {
    vi.useFakeTimers();
    const w = render(DrawerForm);
    await click(w, "编辑草稿");
    await bodyClick("确定");
    await click(w, "重置");
    await vi.advanceTimersByTimeAsync(1000);
    await flushPromises();
    expect(w.text()).not.toContain("已保存：");
    expect(document.querySelector(".zt-drawer")).toBeNull();
  });
  it("returns the value of a custom MessageBox button", async () => {
    const w = render(CustomBox);
    await click(w, "选择操作");
    expect(document.body.textContent).toContain("草稿共 3 段内容");
    await bodyClick("保留草稿");
    expect(w.text()).toContain("操作结果：keep");
  });
  for (const [name, component] of [
    ["Dialog", Dialog],
    ["Drawer", Drawer],
  ] as const) {
    it(`${name} opens, updates content and reports the API close reason`, async () => {
      const w = render(component);
      await click(w, "打开详情");
      await bodyClick("更新内容");
      expect(document.body.textContent).toContain("草稿内容已更新。");
      await bodyClick("关闭详情");
      expect(w.text()).toContain("关闭原因：api");
    });
  }
  it("saves a real rendered form after an asynchronous confirmation", async () => {
    vi.useFakeTimers();
    const w = render(Form);
    await click(w, "编辑草稿");
    const input = document.querySelector<HTMLInputElement>(".zt-dialog input")!;
    expect(input).not.toBeNull();
    input.value = "新的草稿";
    input.dispatchEvent(new Event("input"));
    await bodyClick("确定");
    expect(document.body.textContent).toContain("编辑草稿");
    await vi.advanceTimersByTimeAsync(700);
    await flushPromises();
    expect(w.text()).toContain("已保存：新的草稿");
    expect(document.querySelector(".zt-dialog")).toBeNull();
  });
  it("uses the instance loading state within a dialog", async () => {
    vi.useFakeTimers();
    const w = render(Fullscreen);
    await click(w, "打开预览");
    await bodyClick("切换全屏");
    expect(document.querySelector(".zt-dialog--fullscreen")).not.toBeNull();
    await bodyClick("加载内容");
    expect(document.body.textContent).toContain("正在重新读取文档…");
    await vi.advanceTimersByTimeAsync(950);
    await flushPromises();
    expect(document.body.textContent).toContain("已重新读取 3 段示例内容。");
  });
  for (const [name, component, button, result] of [
    ["basic", Loading, "开始全屏任务", "预览已生成"],
    ["custom", CustomLoading, "准备下载", "可以下载示例文件"],
  ] as const) {
    it(`updates and closes ${name} fullscreen loading automatically`, async () => {
      vi.useFakeTimers();
      const w = render(component);
      await click(w, button);
      expect(document.querySelector(".zt-loading")).not.toBeNull();
      await vi.advanceTimersByTimeAsync(1600);
      await flushPromises();
      expect(w.text()).toContain(result);
      expect(document.querySelector(".zt-loading")).toBeNull();
    });
  }
});
