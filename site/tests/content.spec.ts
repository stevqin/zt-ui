import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { parse, compileScript, compileTemplate } from "vue/compiler-sfc";
import { pages } from "../src/content/components";
import { formatStandaloneSource } from "../src/app/source";
import { ZtConfigProvider } from "@ztechjs/zt-ui";
vi.mock("@ztechjs/zt-ui/vtable", () => ({
  VTableTag: { render: () => null },
  VTableText: { render: () => null },
  VTableGroup: { render: () => null },
  VTableImage: { render: () => null },
  VTableCheckBox: { render: () => null },
  VTableRadio: { render: () => null },
  VTableRawTag: { render: () => null },
}));
const modules = import.meta.glob<{ default: any }>("../src/examples/**/*.vue");
const source = import.meta.glob<string>("../src/examples/**/*.vue", {
  query: "?raw",
  import: "default",
});
const examples = pages.flatMap((page) => page.examples);
afterEach(() => {
  document.body.innerHTML = "";
});
describe("independent component examples", () => {
  it("has complete unique content and every listed example is a real source file", () => {
    expect(new Set(pages.map((p) => p.id)).size).toBe(pages.length);
    for (const page of pages) {
      expect(page.description).toBeTruthy();
      expect(page.usage.length).toBeGreaterThan(0);
      expect(page.examples.length).toBeGreaterThan(0);
    }
    expect(
      examples.every((e) => modules[e.file.replace("src/", "../src/")]),
    ).toBe(true);
    expect(examples.length).toBe(Object.keys(modules).length);
  });
  it.each(examples)(
    "$file compiles as a complete copied SFC with active global settings",
    async (example) => {
      const raw = await source[example.file.replace("src/", "../src/")]();
      const copied = await formatStandaloneSource(raw, {
        size: "large",
        borderRadius: 0,
        theme: "dark",
      });
      const { descriptor, errors } = parse(copied, { filename: example.file });
      expect(errors).toEqual([]);
      const script = compileScript(descriptor, { id: example.id });
      expect(
        compileTemplate({
          id: example.id,
          filename: example.file,
          source: descriptor.template!.content,
          compilerOptions: { bindingMetadata: script.bindings },
        }).errors,
      ).toEqual([]);
    },
  );
  it.each(examples)(
    "$file mounts with its own data and inherited appearance",
    async (example) => {
      const component = (
        await modules[example.file.replace("src/", "../src/")]()
      ).default;
      const warnings: string[] = [];
      const wrapper = mount(component, {
        attachTo: document.body,
        global: {
          stubs: { ZtVTableGrid: true },
          config: { warnHandler: (message) => warnings.push(message) },
          plugins: [],
        },
      });
      try {
        await flushPromises();
        expect(wrapper.html().length).toBeGreaterThan(0);
        expect(
          warnings.filter((w) =>
            /not defined|Failed to resolve|Invalid prop|injection .*not found/.test(
              w,
            ),
          ),
        ).toEqual([]);
      } finally {
        wrapper.unmount();
      }
    },
    15000,
  );
});
