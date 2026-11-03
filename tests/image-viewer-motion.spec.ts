import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, it } from "vitest";
import { ZtImageViewer } from "../src";

const wrappers: ReturnType<typeof mount>[] = [];
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
});
async function loaded(selector = ".zt-image-viewer__frame img") {
  document.querySelector(selector)!.dispatchEvent(new Event("load"));
  await flushPromises();
}
function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(ZtImageViewer, {
    attachTo: document.body,
    props: { urls: ["/a.svg", "/b.svg", "/c.svg"], ...props },
  });
  wrappers.push(wrapper);
  return wrapper;
}
it("closes only a direct backdrop press when enabled, preserving image and toolbar interaction", async () => {
  const w = render({ hideOnClickModal: true });
  await flushPromises();
  document
    .querySelector("img")!
    .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  expect(w.emitted("close")).toBeUndefined();
  document
    .querySelector('[role="dialog"]')!
    .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  expect(w.emitted("close")).toHaveLength(1);
});
it("normalizes dynamic image lists and renders an empty state instead of an invalid image", async () => {
  const w = render({ initialIndex: 2 });
  await w.setProps({ urls: ["/only.svg"] });
  await loaded(".zt-image-viewer__preload");
  expect(
    document.querySelector(".zt-image-viewer__toolbar")!.textContent,
  ).toContain("1 / 1");
  expect(document.querySelector(".zt-image-viewer__next")).toBeNull();
  expect(document.querySelector("img")!.getAttribute("src")).toBe("/only.svg");
  await w.setProps({ urls: [] });
  expect(
    document.querySelector(".zt-image-viewer__toolbar")!.textContent,
  ).toContain("0 / 0");
  expect(document.querySelector(".zt-image-viewer img")).toBeNull();
});
it("keeps zoom and rotation on the image and resets them when switching", async () => {
  const w = render();
  await flushPromises();
  await loaded();
  (document.querySelector('[aria-label="放大"]') as HTMLButtonElement).click();
  (
    document.querySelector('[aria-label="向右旋转"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  expect(
    (document.querySelector("img") as HTMLImageElement).style.transform,
  ).toContain("scale(1.2) rotate(90deg)");
  (
    document.querySelector('[aria-label="下一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  expect(
    (
      document.querySelector(".zt-image-viewer__frame img") as HTMLImageElement
    ).getAttribute("src"),
  ).toBe("/a.svg");
  await loaded(".zt-image-viewer__preload");
  expect(
    (document.querySelector("img") as HTMLImageElement).style.transform,
  ).toContain("scale(1) rotate(0deg)");
  expect(w.emitted("switch")).toEqual([[1]]);
});

it("resets zoom when the next index reuses the same image URL", async () => {
  const w = render({ urls: ["/a.svg", "/a.svg"] });
  await flushPromises();
  await loaded();
  (document.querySelector('[aria-label="放大"]') as HTMLButtonElement).click();
  await flushPromises();
  (
    document.querySelector('[aria-label="下一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  expect(
    (document.querySelector(".zt-image-viewer__frame img") as HTMLImageElement)
      .style.transform,
  ).toContain("scale(1)");
  expect(w.emitted("switch")).toEqual([[1]]);
});
it("retains the previous image until loading succeeds and ignores stale image results", async () => {
  render();
  await flushPromises();
  await loaded();
  (
    document.querySelector('[aria-label="下一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  const stale = document.querySelector(".zt-image-viewer__preload")!;
  expect(
    document.querySelector(".zt-image-viewer__frame img")!.getAttribute("src"),
  ).toBe("/a.svg");
  (
    document.querySelector('[aria-label="下一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  stale.dispatchEvent(new Event("load"));
  await flushPromises();
  expect(
    document.querySelector(".zt-image-viewer__frame img")!.getAttribute("src"),
  ).toBe("/a.svg");
  await loaded(".zt-image-viewer__preload");
  expect(
    document.querySelector(".zt-image-viewer__frame img")!.getAttribute("src"),
  ).toBe("/c.svg");
});

it("retries a failed outgoing image when selected again during another pending request", async () => {
  render();
  await flushPromises();
  const first = document.querySelector(".zt-image-viewer__frame img")!;
  (
    document.querySelector('[aria-label="下一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  first.dispatchEvent(new Event("error"));
  await flushPromises();
  (
    document.querySelector('[aria-label="上一张"]') as HTMLButtonElement
  ).click();
  await flushPromises();
  expect(
    document.querySelector(".zt-image-viewer__preload")!.getAttribute("src"),
  ).toBe("/a.svg");
  await loaded(".zt-image-viewer__preload");
  expect(
    (document.querySelector('[aria-label="放大"]') as HTMLButtonElement)
      .disabled,
  ).toBe(false);
  expect(document.querySelector(".zt-image-viewer__loading")).toBeNull();
});
it("updates the displayed image alternative text when alts change", async () => {
  const w = render({ alts: ["原描述"] });
  await loaded();
  await w.setProps({ alts: ["新描述"] });
  expect(
    document.querySelector(".zt-image-viewer__frame img")!.getAttribute("alt"),
  ).toBe("新描述");
});
