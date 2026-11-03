import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { releases } from "../src/content/releases";

it("keeps the current release, date and local package versions synchronized", () => {
  const json = (path: string) =>
    JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
  const pkg = json("../../package.json");
  const lock = json("../../package-lock.json");
  const siteLock = json("../package-lock.json");
  expect(releases[0].version).toBe(pkg.version);
  expect(lock.version).toBe(pkg.version);
  expect(lock.packages[""].version).toBe(pkg.version);
  expect(siteLock.packages[".."].version).toBe(pkg.version);
  expect(releases[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(new Set(releases.map((release) => release.id)).size).toBe(
    releases.length,
  );

});
