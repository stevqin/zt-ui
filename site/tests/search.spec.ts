import { expect, it } from "vitest";
import { buildSearchIndex, searchDocuments } from "../src/app/search";
import { pages } from "../src/content/components";
import { guides } from "../src/content/guides";
import { apiDocuments as api } from "../src/app/api";
import type { ApiDocuments } from "../src/app/types";
it("finds public methods, events and slots as well as props and examples", () => {
  const index = buildSearchIndex(pages, guides, api as ApiDocuments);
  for (const name of [
    "validateField",
    "scrollToField",
    "resetFields",
    "remove-tag",
  ]) {
    const matches = searchDocuments(index, name);
    expect(matches.length, name).toBeGreaterThan(0);
    expect(
      matches.some((m) => m.path.includes("#api-")),
      name,
    ).toBe(true);
  }
  expect(searchDocuments(index, "VTableGrid").length).toBeGreaterThan(0);
  expect(searchDocuments(index, "不存在的组件xyz")).toEqual([]);
});

it("routes cross-page Props names to their actual table without indexing repeated interfaces", () => {
  const component = (name: string, hasProps = true) => ({ name, props: hasProps ? [{ name: "value", type: "string" }] : [], events: [], slots: [], exposes: [], types: [] as { name: string; type: string }[] });
  const owner = component("ZtOwner");
  owner.types = [
    { name: "ZtChildProps", type: "interface ZtChildProps { secretDuplicateBody: string }" },
    { name: "ZtOrphanProps", type: "interface ZtOrphanProps { businessField: string }" },
    { name: "ZtOwnerEventProps", type: "interface ZtOwnerEventProps { event: string }" },
  ];
  const fixture: ApiDocuments = { owner: { components: [owner, component("ZtOrphan", false)] }, child: { components: [component("ZtChild")] } };
  const fixturePages = ["owner", "child"].map((id) => ({ id, name: id, title: id, group: "data" as const, description: "", usage: [], examples: [] }));
  const before = JSON.stringify(fixture);
  const index = buildSearchIndex(fixturePages, [], fixture);
  expect(searchDocuments(index, "ZtChildProps")).toEqual([
    expect.objectContaining({ title: "ZtChild · props · ZtChildProps", path: "/components/child#api-ZtChild-props" }),
  ]);
  expect(searchDocuments(index, "secretDuplicateBody")).toEqual([]);
  expect(searchDocuments(index, "ZtOrphanProps")[0]?.title).toBe("ZtOwner · types · ZtOrphanProps");
  expect(searchDocuments(index, "ZtOwnerEventProps")[0]?.title).toBe("ZtOwner · types · ZtOwnerEventProps");
  expect(JSON.stringify(fixture)).toBe(before);
});

it("routes service Options names to Options tables and preserves nested options", () => {
  const index = buildSearchIndex(pages, [], api);
  for (const [name, page, component] of [
    ["NoticeOptions", "zt-alert-message", "ZtMessage"], ["MessageBoxOptions", "zt-alert-message-box", "ZtMessageBox"],
    ["DialogOptions", "zt-alert-dialog", "ZtDialog"], ["DrawerOptions", "zt-alert-drawer", "ZtDrawer"],
    ["LoadingOptions", "zt-alert-loading", "ZtLoading"],
  ]) {
    expect(index).toContainEqual(expect.objectContaining({ title: `${component} · options · ${name}`, path: `/components/${page}#api-${component}-props` }));
    expect(index.some((row) => row.title.includes(` · types · ${name}`))).toBe(false);
  }
  expect(index.some((row) => row.title.endsWith(" · types · MessageBoxButtonOptions"))).toBe(true);
});
