import { describe, expect, it } from "vitest";
import {
  extractAlertApi,
  alertDeclaration,
} from "../scripts/extract-alert-api.mjs";
import { alertPages } from "../src/content/alerts";

describe("zt-alert public declaration extraction", () => {
  const api = extractAlertApi(alertDeclaration());
  it("provides all six services and inherited overlay options", () => {
    expect(Object.keys(api)).toHaveLength(6);
    expect(
      api["zt-alert-dialog"].components[0].props.map((row) => row.name),
    ).toContain("beforeClose");
    expect(
      api["zt-alert-drawer"].components[0].props.map((row) => row.name),
    ).toContain("render");
    expect(
      api["zt-alert-message"].components[0].exposes.map((row) => row.name),
    ).toContain("success");
    expect(
      api["zt-alert-dialog"].components[0].exposes.map((row) => row.name),
    ).toContain("instance.toggleFullscreen");
  });
  it("preserves required fields, overloads and supporting types", () => {
    expect(
      api["zt-alert-message"].components[0].props.find(
        (row) => row.name === "content",
      )?.required,
    ).toBe(true);
    expect(
      api["zt-alert-message-box"].components[0].exposes.filter(
        (row) => row.name === "call",
      ),
    ).toHaveLength(3);
    expect(
      api["zt-alert-message-box"].components[0].types?.some(
        (row) => row.name === "MessageBoxButtonOptions",
      ),
    ).toBe(true);
  });
  it("publishes independent extension pages with executable sources", () => {
    expect(alertPages).toHaveLength(6);
    expect(
      alertPages.every(
        (page) => page.group === "extensions" && page.examples.length >= 2,
      ),
    ).toBe(true);
  });
});
