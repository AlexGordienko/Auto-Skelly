import { describe, expect, it } from "vitest";

// This file intentionally does nothing else before the assertions below —
// no apply()/setTheme() calls anywhere else in the module graph — so it can
// verify that merely importing auto-skelly has no DOM side effects.
describe("import safety", () => {
  it("importing the module does not throw and does not mutate the DOM before apply() is called", async () => {
    await expect(import("../src/index")).resolves.toBeTruthy();

    // No stylesheet should have been injected yet.
    expect(document.head.querySelector("#auto-skelly-styles")).toBeFalsy();
    // No placeholders should exist, and the body should be untouched.
    expect(document.querySelectorAll("[data-skelly-placeholder]").length).toBe(0);
  });
});
