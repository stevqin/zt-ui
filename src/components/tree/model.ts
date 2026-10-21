import type { ZtTreeFields, ZtTreeKey, ZtTreeNode } from './types';
export interface TreeRow {
  key: ZtTreeKey;
  label: string;
  node: ZtTreeNode;
  parent?: ZtTreeKey;
  path: ZtTreeKey[];
  depth: number;
  disabled: boolean;
  checkable: boolean;
  branch: boolean;
}
export function flattenTree(
  data: ZtTreeNode[],
  fields: ZtTreeFields = {},
  loaded = new Map<ZtTreeKey, ZtTreeNode[]>(),
): TreeRow[] {
  const rows: TreeRow[] = [];
  const seen = new Set<ZtTreeKey>();
  function visit(nodes: ZtTreeNode[], path: ZtTreeKey[], inherited = false) {
    for (const node of nodes) {
      const key = node[fields.key ?? 'key'] as ZtTreeKey;
      if (seen.has(key)) continue;
      seen.add(key);
      const children =
        loaded.get(key) ??
        (node[fields.children ?? 'children'] as ZtTreeNode[] | undefined);
      const disabled =
        inherited || Boolean(node[fields.disabled ?? 'disabled']);
      rows.push({
        key,
        label: String(node[fields.label ?? 'label'] ?? ''),
        node,
        parent: path.at(-1),
        path: [...path, key],
        depth: path.length,
        disabled,
        checkable: node[fields.checkable ?? 'checkable'] !== false,
        branch:
          Boolean(children?.length) ||
          (node[fields.isLeaf ?? 'isLeaf'] === false && !loaded.has(key)),
      });
      if (children) visit(children, [...path, key], disabled);
    }
  }
  visit(data, []);
  return rows;
}
function childrenByParent(rows: TreeRow[]) {
  const map = new Map<ZtTreeKey, TreeRow[]>();
  const byKey = new Map(rows.map((row) => [row.key, row]));
  for (const row of rows)
    if (!row.disabled && row.checkable) {
      // Display-only groups are transparent to check propagation. Their enabled
      // descendants participate in the nearest checkable ancestor's state.
      let parent = row.parent;
      while (parent !== undefined && !byKey.get(parent)?.checkable)
        parent = byKey.get(parent)?.parent;
      if (parent === undefined) continue;
      const children = map.get(parent) ?? [];
      children.push(row);
      map.set(parent, children);
    }
  return map;
}
export function toggleChecked(
  rows: TreeRow[],
  keys: ZtTreeKey[],
  key: ZtTreeKey,
  strict: boolean,
) {
  const target = rows.find((r) => r.key === key);
  const checkableKeys = checkedKeysForRows(rows, keys);
  if (!target || target.disabled || !target.checkable) return checkableKeys;
  const set = new Set(checkableKeys),
    on = !set.has(key),
    childMap = childrenByParent(rows);
  for (const row of rows)
    if (
      !row.disabled &&
      row.checkable &&
      (row.key === key || (!strict && row.path.includes(key)))
    ) {
      if (on) set.add(row.key);
      else set.delete(row.key);
    }
  if (!strict)
    for (const row of [...rows].reverse()) {
      const children = childMap.get(row.key) ?? [];
      if (!row.disabled && row.checkable && children.length) {
        if (children.every((r) => set.has(r.key))) set.add(row.key);
        else set.delete(row.key);
      }
    }
  return [...set];
}
export function partialChecked(
  rows: TreeRow[],
  keys: ZtTreeKey[],
  key: ZtTreeKey,
) {
  return (
    rows.some((row) => row.key === key && row.checkable) &&
    !keys.includes(key) &&
    rows.some(
      (row) =>
        row.checkable &&
        row.key !== key &&
        row.path.includes(key) &&
        keys.includes(row.key),
    )
  );
}

export function checkedKeysForRows(rows: TreeRow[], keys: ZtTreeKey[]) {
  const nonCheckable = new Set(
    rows.filter((row) => !row.checkable).map((row) => row.key),
  );
  return keys.filter((key) => !nonCheckable.has(key));
}

export function normalizeChecked(rows: TreeRow[], keys: ZtTreeKey[]) {
  const set = new Set(checkedKeysForRows(rows, keys)),
    childMap = childrenByParent(rows);
  for (const row of rows)
    if (
      !row.disabled &&
      row.checkable &&
      row.path.slice(0, -1).some((k) => set.has(k))
    )
      set.add(row.key);
  for (const row of [...rows].reverse()) {
    const children = childMap.get(row.key) ?? [];
    if (
      !row.disabled &&
      row.checkable &&
      children.length &&
      children.every((r) => set.has(r.key))
    )
      set.add(row.key);
  }
  return [...set];
}
