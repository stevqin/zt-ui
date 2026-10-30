import { expect, it } from "vitest";
import { parse, compileScript, compileTemplate } from "vue/compiler-sfc";
import { standaloneSource, highlightCode } from "../src/app/source";
it("copies independent SFC source with current global config and nested slots intact", () => {
  const raw =
    '<script setup lang="ts">import {ref} from "vue"; const count = ref(0)</script>\n<template><div><template v-if="count">{{count}}</template><button @click="count++">增加</button></div></template>\n<style scoped>button{color:blue}</style>';
  const source = standaloneSource(raw, {
    size: "large",
    borderRadius: 0,
    theme: "dark",
  });
  const { descriptor, errors } = parse(source);
  expect(errors).toEqual([]);
  expect(source).toContain(':border-radius="0"');
  expect(source).toContain('size="large"');
  expect(source).toContain("import '@ztechjs/zt-ui/style.css'");
  const script = compileScript(descriptor, { id: "copied" });
  expect(
    compileTemplate({
      id: "copied",
      source: descriptor.template!.content,
      filename: "Copy.vue",
      compilerOptions: { bindingMetadata: script.bindings },
    }).errors,
  ).toEqual([]);
  expect(source).not.toContain("appearance.value");
});
it("escapes source markup before rendering syntax highlighting", () => {
  const html = highlightCode('<img src=x onerror="alert(1)">');
  expect(html).not.toContain("<img");
  expect(html).toContain("&lt;");
});
