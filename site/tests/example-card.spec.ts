import { mount, flushPromises } from "@vue/test-utils";
import { expect, it, vi } from "vitest";
import ExampleCard from "../src/components/ExampleCard.vue";
import { ZtSelect } from "@ztechjs/zt-ui";
import AppearanceControls from "../src/components/AppearanceControls.vue";
import {
  appearance,
  updateAppearance,
  resetAppearance,
} from "../src/app/appearance";
const until = async (fn: () => boolean) => {
  for (let i = 0; i < 100 && !fn(); i++) {
    await new Promise((r) => setTimeout(r, 10));
    await flushPromises();
  }
  expect(fn()).toBe(true);
};
it("shows and copies the same formatted code, and updates only code when global settings change", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
  const wrapper = mount(ExampleCard, {
    props: {
      example: {
        id: "basic",
        title: "操作",
        description: "操作反馈",
        file: "src/examples/button/Basic.vue",
      },
    },
    global: { stubs: { RouterLink: { template: "<a><slot/></a>" } } },
  });
  try {
    await wrapper.get(".code-toggle").trigger("click");
    await until(() => wrapper.find("pre").exists());
    expect(wrapper.get(".code-toggle").attributes("aria-expanded")).toBe(
      "true",
    );
    const code = wrapper.get("pre").element.textContent ?? "";
    expect(code).toContain("\n    <ZtSpace");
    const copy = wrapper
      .findAll("button")
      .find((b) => b.text() === "复制完整示例")!;
    await copy.trigger("click");
    await until(() => writeText.mock.calls.length === 1);
    expect(writeText).toHaveBeenLastCalledWith(code);
    updateAppearance({ size: "mini", borderRadius: 0 });
    await until(() => wrapper.get("pre").text().includes('size="mini"'));
    expect(wrapper.get("pre").text()).toContain(':border-radius="0"');
    await wrapper.get(".code-toggle").trigger("click");
    expect(wrapper.find("pre").exists()).toBe(false);
  } finally {
    wrapper.unmount();
    resetAppearance();
    vi.unstubAllGlobals();
  }
}, 15000);
it("uses public size values and a radius slider without numeric input or a settings modal", async () => {
  const wrapper = mount(AppearanceControls, { attachTo: document.body });
  try {
    expect(wrapper.findComponent(ZtSelect).exists()).toBe(true);
    expect(wrapper.find("select").exists()).toBe(false);
    await wrapper.get("[role=combobox]").trigger("click");
    await flushPromises();
    const options = Array.from(
      document.querySelectorAll<HTMLElement>("[role=option]"),
    );
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      "mini",
      "small",
      "default",
      "medium",
      "large",
    ]);
    options.at(-1)!.click();
    await flushPromises();
    await wrapper.get("[role=slider]").trigger("keydown", { key: "Home" });
    await wrapper.get('button[aria-label="深色主题"]').trigger("click");
    expect(appearance.size).toBe("large");
    expect(appearance.borderRadius).toBe(0);
    expect(appearance.themePreference).toBe("dark");
    expect(wrapper.find("[role=dialog]").exists()).toBe(false);
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(0);
    await wrapper.get("[role=slider]").trigger("keydown", { key: "End" });
    expect(appearance.borderRadius).toBe(24);
    expect(
      wrapper.get('button[aria-label="深色主题"]').attributes("aria-pressed"),
    ).toBe("true");
  } finally {
    wrapper.unmount();
    resetAppearance();
  }
});
