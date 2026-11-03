import { describe, expect, it } from "vitest";
import { parseReleaseNotes } from "../src/app/changelog";

describe("release notes", () => {
  it("groups real versions and categories without treating fenced examples as releases", () => {
    const releases = parseReleaseNotes(
      "# 更新日志\n\n## 0.13.0 — 2026-11-03\n\n本次重点。\n\n### 新增\n\n- **Icon**：支持 `animation`。\n\n```md\n## 99.0.0 — 2099-01-01\n### 假分类\n```\n\n### 修复\n\n- 定位。\n\n## [0.12.0](https://example.com/compare) — 2026-10-30\n\n### 优化\n\n- 保留历史。\n",
    );
    expect(releases.map((release) => release.version)).toEqual([
      "0.13.0",
      "0.12.0",
    ]);
    expect(releases[0].id).toBe("release-0-13-0");
    expect(releases[0].summary).toContain("本次重点");
    expect(releases[0].sections.map((section) => section.title)).toEqual([
      "新增",
      "修复",
    ]);
    expect(releases[0].sections[0].body).toContain("## 99.0.0");
    expect(releases[1].compareUrl).toBe("https://example.com/compare");
    expect(releases[1].date).toBe("2026-10-30");
    expect(releases[1].sections[0].body).toContain("保留历史");
  });
  it("does not preserve executable version URLs", () => {
    expect(
      parseReleaseNotes("## [0.1.0](javascript:alert) — 2026-01-01")[0]
        .compareUrl,
    ).toBeUndefined();
  });
});
