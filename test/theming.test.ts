import { afterEach, describe, expect, it } from "vitest";
import { AutoSkelly } from "../src/index";
import { makeContainer, stubRect } from "./utils";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("theming", () => {
  it("puts the constructor color on the placeholder's inline --skelly-color", () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;

    new AutoSkelly({ color: "#123456" }).apply(container);

    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.style.getPropertyValue("--skelly-color")).toBe("#123456");
  });

  it("setTheme({ color }) updates already-applied placeholders", () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;

    const skelly = new AutoSkelly({ color: "#111111" });
    skelly.apply(container);
    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.style.getPropertyValue("--skelly-color")).toBe("#111111");

    skelly.setTheme({ color: "#ffffff" });
    expect(placeholder.style.getPropertyValue("--skelly-color")).toBe("#ffffff");
  });

  it("setTheme({ animation }) swaps the skelly-anim-* class on a single-block placeholder", () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;

    const skelly = new AutoSkelly({ animation: "pulse" });
    skelly.apply(container);
    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.classList.contains("skelly-anim-pulse")).toBe(true);

    skelly.setTheme({ animation: "gradient" });
    expect(placeholder.classList.contains("skelly-anim-pulse")).toBe(false);
    expect(placeholder.classList.contains("skelly-anim-gradient")).toBe(true);
  });

  it("setTheme({ animation }) swaps the skelly-anim-* class on every .skelly-bar of a multiline placeholder", () => {
    const container = makeContainer(`<p class="skelly-text">hello</p>`);
    const original = container.querySelector(".skelly-text") as HTMLElement;
    stubRect(original, { width: 200, height: 100 });

    const skelly = new AutoSkelly({ animation: "pulse" });
    skelly.apply(container);
    const placeholder = original.previousElementSibling as HTMLElement;
    const bars = Array.from(placeholder.querySelectorAll<HTMLElement>(".skelly-bar"));
    expect(bars.length).toBeGreaterThan(0);
    bars.forEach((bar) => expect(bar.classList.contains("skelly-anim-pulse")).toBe(true));

    skelly.setTheme({ animation: "extraPulse" });

    bars.forEach((bar) => {
      expect(bar.classList.contains("skelly-anim-pulse")).toBe(false);
      expect(bar.classList.contains("skelly-anim-extraPulse")).toBe(true);
    });
    // The container itself never carries an anim class for multiline text.
    expect(placeholder.classList.contains("skelly-anim-extraPulse")).toBe(false);
  });

  it('animation "none" means no skelly-anim-* class is present', () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;

    const skelly = new AutoSkelly({ animation: "none" });
    skelly.apply(container);
    const placeholder = original.previousElementSibling as HTMLElement;
    const hasAnimClass = Array.from(placeholder.classList).some((c) =>
      c.startsWith("skelly-anim-")
    );
    expect(hasAnimClass).toBe(false);

    // Also verify setTheme can turn animation off on an already-applied placeholder.
    const container2 = makeContainer(`<div class="skelly-circle"></div>`);
    const original2 = container2.querySelector(".skelly-circle") as HTMLElement;
    const skelly2 = new AutoSkelly({ animation: "pulse" });
    skelly2.apply(container2);
    const placeholder2 = original2.previousElementSibling as HTMLElement;
    expect(placeholder2.classList.contains("skelly-anim-pulse")).toBe(true);

    skelly2.setTheme({ animation: "none" });
    const hasAnimClass2 = Array.from(placeholder2.classList).some((c) =>
      c.startsWith("skelly-anim-")
    );
    expect(hasAnimClass2).toBe(false);
  });
});
