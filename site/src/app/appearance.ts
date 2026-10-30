import { computed, reactive, ref, watch } from "vue";
import type { ZtComponentSize } from "@ztechjs/zt-ui";
export type ThemePreference = "system" | "light" | "dark";
export interface Appearance {
  size: ZtComponentSize;
  borderRadius: number;
  themePreference: ThemePreference;
}
export const appearanceKey = "zt-ui-docs-appearance-v2";
const defaults: Appearance = {
  size: "default",
  borderRadius: 11,
  themePreference: "system",
};
const sizes = ["mini", "small", "default", "medium", "large"];
export function patchAppearance(
  current: Appearance,
  patch: Partial<Appearance>,
): Appearance {
  return {
    size: sizes.includes(patch.size ?? "") ? patch.size! : current.size,
    borderRadius:
      typeof patch.borderRadius === "number" &&
      Number.isFinite(patch.borderRadius) &&
      patch.borderRadius >= 0 &&
      patch.borderRadius <= 24
        ? patch.borderRadius
        : current.borderRadius,
    themePreference: ["system", "light", "dark"].includes(
      patch.themePreference ?? "",
    )
      ? patch.themePreference!
      : current.themePreference,
  };
}
export function restoreAppearance(raw: string | null): Appearance {
  try {
    const value = JSON.parse(raw ?? "null");
    return value && typeof value === "object"
      ? patchAppearance({ ...defaults }, value)
      : { ...defaults };
  } catch {
    return { ...defaults };
  }
}
export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean,
): "light" | "dark" {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}
function readStorage() {
  try {
    return localStorage.getItem(appearanceKey);
  } catch {
    return null;
  }
}
const media =
  typeof window !== "undefined"
    ? window.matchMedia?.("(prefers-color-scheme: dark)")
    : undefined;
const systemDark = ref(media?.matches ?? false);
media?.addEventListener?.("change", (event) => {
  systemDark.value = event.matches;
});
export const appearance = reactive(restoreAppearance(readStorage()));
export const resolvedTheme = computed(() =>
  resolveTheme(appearance.themePreference, systemDark.value),
);
export const providerConfig = computed(() => ({
  size: appearance.size,
  borderRadius: appearance.borderRadius,
  theme: resolvedTheme.value,
  focusRing: "none" as const,
}));
export function updateAppearance(patch: Partial<Appearance>) {
  Object.assign(appearance, patchAppearance(appearance, patch));
}
export function resetAppearance() {
  Object.assign(appearance, defaults);
}
watch(
  appearance,
  (value) => {
    try {
      localStorage.setItem(appearanceKey, JSON.stringify(value));
    } catch {
      /* Preferences remain available for the current page. */
    }
  },
  { deep: true },
);
watch(
  resolvedTheme,
  (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    }
  },
  { immediate: true },
);
