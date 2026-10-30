import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ApiReference from "../src/components/ApiReference.vue";
import { apiDocuments } from "../src/app/api";

function renderPage(page: string) {
  return mount(ApiReference, { props: { components: apiDocuments[page]!.components } });
}

describe("API presentation", () => {
  it("labels Props and removes its repeated interface and empty Types section without mutating metadata", () => {
    const before = JSON.stringify(apiDocuments);
    const wrapper = renderPage("loading");
    expect(wrapper.find("h4 code").exists()).toBe(true);
    expect(wrapper.find("h4 code").text()).toBe("ZtLoadingProps");
    expect(wrapper.findAll("h4").map((heading) => heading.text())).not.toContain("Types");
    expect(wrapper.text()).not.toContain("interface ZtLoadingProps");
    expect(JSON.stringify(apiDocuments)).toBe(before);
    wrapper.unmount();
  });

  it("deduplicates sibling Props and retains nested, event and slot contracts", () => {
    const wrapper = renderPage("vtable-grid");
    const types = wrapper.findAll(".api-section").filter((section) => section.find("h4").text() === "Types").map((section) => section.text()).join(" ");
    expect(types).not.toContain("ZtVTableGridImportDialogProps");
    expect(types).not.toContain("interface ZtVTableGridProps");
    expect(types).toContain("ZtVTableGridEventProps");
    expect(types).toContain("ZtVTableGridColumn");
    expect(types).toContain("ZtVTableGridImportDialogSlots");
    expect(wrapper.find("#api-ZtVTableGridImportDialog h4 code").text()).toBe("ZtVTableGridImportDialogProps");
    wrapper.unmount();
  });

  it("removes Props interfaces referenced on other standalone pages and links search anchors to the labeled table", () => {
    const wrapper = renderPage("date-picker");
    const types = wrapper.find("#api-ZtDatePicker-types");
    const names = types.findAll("tbody tr > td:first-child code").map((cell) => cell.text());
    expect(names).not.toContain("ZtDatePickerPanelProps");
    expect(names).not.toContain("ZtDateTimePickerProps");
    wrapper.unmount();
    const panel = renderPage("date-picker-panel");
    expect(panel.find("#api-ZtDatePickerPanel-props h4 code").text()).toBe("ZtDatePickerPanelProps");
    panel.unmount();
  });

  it.each([
    ["zt-alert-message", "NoticeOptions"], ["zt-alert-notification", "NoticeOptions"],
    ["zt-alert-message-box", "MessageBoxOptions"], ["zt-alert-dialog", "DialogOptions"],
    ["zt-alert-drawer", "DrawerOptions"], ["zt-alert-loading", "LoadingOptions"],
  ])("labels %s Options and retains supporting types", (page, typeName) => {
    const wrapper = renderPage(page!);
    expect(wrapper.find("h4").text()).toBe(`Options ${typeName}`);
    const types = wrapper.findAll(".api-section").find((section) => section.find("h4").text() === "Types")!;
    expect(types.findAll("tbody tr > td:first-child code").map((cell) => cell.text())).not.toContain(typeName);
    if (page === "zt-alert-message-box") expect(types.text()).toContain("MessageBoxButtonOptions");
    wrapper.unmount();
  });
});
