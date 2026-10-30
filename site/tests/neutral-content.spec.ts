import { expect, it } from "vitest";

const files = import.meta.glob<string>(
  [
    "../src/examples/**/*.vue",
    "../src/content/*.ts",
    "../src/layouts/**/*.vue",
    "../src/generated/*.json",
  ],
  { query: "?raw", import: "default", eager: true },
);
const forbidden =
  /安正|玖姿|尹默|斐娜晨|摩萨克|安娜蔻|安娜寇|\bAZ[\dA-Z]*\b|['"]az['"]|\bJN\d+\b|['"](?:jn|fiona)['"]|羊毛大衣|针织衫|秋冬商品|云感针织|轻量外套|经典衬衫|轻盈羽绒服|针织开衫|连衣裙|九堡街道|张婷|\b(?:ANZHENG|JUZUI|IMM|MOISSAC|FIONA(?: CHEN)?|ANNA KRO)\b/i;

it("keeps all documentation examples and descriptions free of private organization, brand and personal data", () => {
  expect(Object.keys(files).length).toBeGreaterThan(150);
  for (const [file, source] of Object.entries(files)) {
    expect(source, file).not.toMatch(forbidden);
  }
});
