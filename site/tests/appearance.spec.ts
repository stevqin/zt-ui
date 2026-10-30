import { describe, it, expect } from "vitest";
import {
  restoreAppearance,
  patchAppearance,
  resolveTheme,
} from "../src/app/appearance";
describe("global documentation appearance", () => {
  it("restores all public settings and rejects malformed storage", () => {
    expect(restoreAppearance("{broken")).toEqual({
      size: "default",
      borderRadius: 11,
      themePreference: "system",
    });
    expect(
      restoreAppearance(
        '{"size":"large","borderRadius":0,"themePreference":"dark"}',
      ),
    ).toEqual({ size: "large", borderRadius: 0, themePreference: "dark" });
    expect(
      restoreAppearance(
        '{"size":"unknown","borderRadius":-1,"themePreference":"blue"}',
      ),
    ).toEqual({ size: "default", borderRadius: 11, themePreference: "system" });
  });
  it("preserves other settings when one control changes and resolves system theme", () => {
    const initial = restoreAppearance(null);
    expect(patchAppearance(initial, { size: "mini" })).toEqual({
      ...initial,
      size: "mini",
    });
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });
});
