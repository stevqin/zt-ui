import { expect, it } from "vitest";
import { makeRouter, legacyPath } from "../src/app/routes";
import { pages } from "../src/content/components";
it("maps old component links to current routes and retains anchors", async () => {
  const router = makeRouter(true);
  for (const page of pages) {
    expect(legacyPath(`/${page.id}`)).toBe(`/components/${page.id}`);
  }
  await router.push("/button#api");
  expect(router.currentRoute.value.fullPath).toBe("/components/button#api");
  expect(legacyPath("/api")).toBe("/components");
});
it("resolves every component and guide through the new router", () => {
  const router = makeRouter(true);
  for (const page of pages)
    expect(
      router.resolve(`/components/${page.id}`).matched.length,
    ).toBeGreaterThan(0);
  expect(router.resolve("/guide/installation").matched.length).toBeGreaterThan(
    0,
  );
});
