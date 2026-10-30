import { mount, flushPromises } from "@vue/test-utils";
import { expect, it, vi } from "vitest";
import DocDialog from "../src/components/DocDialog.vue";
it("focuses an initially open dialog and owns Tab/Escape before an underlying overlay", async () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const wrapper = mount(DocDialog, {
    props: { open: true, title: "搜索" },
    slots: { default: "<input autofocus><button>结果</button>" },
    attachTo: document.body,
  });
  await flushPromises();
  expect(document.activeElement?.tagName).toBe("INPUT");
  const underlying = vi.fn();
  document.addEventListener("keydown", underlying);
  const panel = document.querySelector<HTMLElement>(".docs-dialog")!;
  panel
    .querySelectorAll<HTMLElement>("button,input")
    .forEach((el) =>
      vi
        .spyOn(el, "getClientRects")
        .mockReturnValue({ length: 1 } as DOMRectList),
    );
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(document.activeElement?.textContent).toBe("结果");
  expect(underlying).not.toHaveBeenCalled();
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(wrapper.emitted("close")).toHaveLength(1);
  expect(underlying).not.toHaveBeenCalled();
  await wrapper.setProps({ open: false });
  expect(document.activeElement).toBe(trigger);
  document.removeEventListener("keydown", underlying);
  wrapper.unmount();
  trigger.remove();
});
