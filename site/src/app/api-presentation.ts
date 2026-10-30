import type { ApiComponent, ApiDocuments } from "./types";

const serviceOptions: Record<string, string> = {
  ZtMessage: "NoticeOptions",
  ZtNotification: "NoticeOptions",
  ZtMessageBox: "MessageBoxOptions",
  ZtDialog: "DialogOptions",
  ZtDrawer: "DrawerOptions",
  ZtLoading: "LoadingOptions",
};

/** Derive display-only aliases from all pages without changing source metadata. */
export function createApiPresentation(documents: ApiDocuments) {
  const components = Object.values(documents).flatMap((page) => page.components);
  const typeNames = new Set(
    components.flatMap((component) =>
      (component.types ?? []).map((row) => row.name),
    ),
  );
  const propsTypes = new Map<string, string>();
  const key = (component: ApiComponent) =>
    `${component.kind ?? "component"}:${component.name}`;
  for (const component of components) {
    const name = component.kind === "service"
      ? serviceOptions[component.name]
      : `${component.name}Props`;
    if (component.props.length && name && typeNames.has(name)) {
      propsTypes.set(key(component), name);
    }
  }
  const repeatedTypes = new Set(propsTypes.values());
  return {
    propsTypeName: (component: ApiComponent) => propsTypes.get(key(component)),
    visibleTypes: (component: ApiComponent) =>
      (component.types ?? []).filter((row) => !repeatedTypes.has(row.name)),
  };
}
