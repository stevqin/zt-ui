import type { DocPage, ApiDocuments } from "./types";
import { createApiPresentation } from "./api-presentation";
import type { Guide } from "../content/guides";
export interface SearchRecord {
  title: string;
  detail: string;
  path: string;
}
export function buildSearchIndex(
  pages: DocPage[],
  guides: Guide[],
  api: ApiDocuments,
): SearchRecord[] {
  const presentation = createApiPresentation(api);
  return [
    ...guides.flatMap((guide) => [
      {
        title: guide.title,
        detail: guide.description,
        path: `/guide/${guide.id}`,
      },
      ...guide.sections.map((section) => ({
        title: `${guide.title} · ${section.title}`,
        detail: section.text,
        path: `/guide/${guide.id}#${section.id}`,
      })),
    ]),
    ...pages.flatMap((page) => [
      {
        title: `${page.name} ${page.title}`,
        detail: page.description,
        path: `/components/${page.id}`,
      },
      ...page.examples.map((example) => ({
        title: `${page.title} · ${example.title}`,
        detail: example.description,
        path: `/components/${page.id}#example-${example.id}`,
      })),
      ...(api[page.id]?.components ?? []).flatMap((component) => [
        ...(presentation.propsTypeName(component)
          ? [{
              title: `${component.name} · ${component.kind === "service" ? "options" : "props"} · ${presentation.propsTypeName(component)}`,
              detail: component.kind === "service" ? "Options 配置类型" : "Props 属性类型",
              path: `/components/${page.id}#api-${component.name}-props`,
            }]
          : []),
        ...(["props", "events", "slots", "exposes", "types"] as const).flatMap(
          (section) =>
            (section === "types"
              ? presentation.visibleTypes(component)
              : component[section] ?? []).map((row) => ({
              title: `${component.name} · ${section} · ${row.name}`,
              detail: row.description
                ? `${row.description} ${row.type}`
                : row.type,
              path: `/components/${page.id}#api-${component.name}`,
            })),
        ),
      ]),
    ]),
  ];
}
export function searchDocuments(
  index: SearchRecord[],
  query: string,
): SearchRecord[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return index
    .filter((row) =>
      terms.every((term) =>
        `${row.title} ${row.detail}`.toLowerCase().includes(term),
      ),
    )
    .slice(0, 30);
}
