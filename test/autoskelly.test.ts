import { afterEach, describe, expect, it } from "vitest";
import { AutoSkelly } from "../src/index";
import { makeContainer } from "./utils";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("apply()", () => {
  it("creates placeholders for all four shape classes, hides originals, and sets shape/anim classes + aria-hidden", () => {
    const container = makeContainer(`
      <p class="skelly-text">hello</p>
      <img class="skelly-image" />
      <div class="skelly-circle"></div>
      <button class="skelly-button">Click</button>
    `);

    new AutoSkelly().apply(container);

    const shapes: Array<[string, string]> = [
      ["skelly-text", "text"],
      ["skelly-image", "image"],
      ["skelly-circle", "circle"],
      ["skelly-button", "button"],
    ];

    shapes.forEach(([cls, shape]) => {
      const original = container.querySelector(`.${cls}`) as HTMLElement;
      expect(original.style.display).toBe("none");

      const placeholder = original.previousElementSibling as HTMLElement;
      expect(placeholder).toBeTruthy();
      expect(placeholder.hasAttribute("data-skelly-placeholder")).toBe(true);
      expect(placeholder.getAttribute("aria-hidden")).toBe("true");
      expect(placeholder.classList.contains("skelly-placeholder")).toBe(true);
      expect(placeholder.classList.contains(`skelly-shape-${shape}`)).toBe(true);
      expect(placeholder.classList.contains("skelly-anim-pulse")).toBe(true);
    });
  });
});

describe("apply() -> remove() round trip", () => {
  it("restores an element that had no prior inline display", () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;
    expect(original.style.display).toBe("");

    const skelly = new AutoSkelly();
    skelly.apply(container);

    expect(original.style.display).toBe("none");
    expect(container.querySelector("[data-skelly-placeholder]")).toBeTruthy();
    expect(container.getAttribute("aria-busy")).toBe("true");

    skelly.remove(container);

    expect(container.querySelector("[data-skelly-placeholder]")).toBeFalsy();
    expect(original.style.display).toBe("");
    expect(container.hasAttribute("aria-busy")).toBe(false);
  });

  it("restores an element that had a prior inline display value", () => {
    const container = makeContainer(`<div class="skelly-circle" style="display: flex;"></div>`);
    const original = container.querySelector(".skelly-circle") as HTMLElement;
    expect(original.style.display).toBe("flex");

    const skelly = new AutoSkelly();
    skelly.apply(container);
    expect(original.style.display).toBe("none");

    skelly.remove(container);

    expect(container.querySelector("[data-skelly-placeholder]")).toBeFalsy();
    expect(original.style.display).toBe("flex");
    expect(container.hasAttribute("aria-busy")).toBe(false);
  });
});

describe("idempotency", () => {
  it("calling apply() twice does not create duplicate placeholders", () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);
    const skelly = new AutoSkelly();

    skelly.apply(container);
    skelly.apply(container);

    expect(container.querySelectorAll("[data-skelly-placeholder]").length).toBe(1);
  });
});

describe("scoping", () => {
  it("apply(containerA) does not touch matching elements outside containerA", () => {
    const wrapper = makeContainer(`
      <div id="a"><div class="skelly-circle"></div></div>
      <div id="b"><div class="skelly-circle"></div></div>
    `);
    const containerA = wrapper.querySelector("#a") as HTMLElement;
    const containerB = wrapper.querySelector("#b") as HTMLElement;

    new AutoSkelly().apply(containerA);

    expect(containerA.querySelector("[data-skelly-placeholder]")).toBeTruthy();
    expect(containerB.querySelector("[data-skelly-placeholder]")).toBeFalsy();

    const originalB = containerB.querySelector(".skelly-circle") as HTMLElement;
    expect(originalB.style.display).toBe("");
  });

  it("remove(containerA) leaves containerB's placeholders alive", () => {
    const wrapper = makeContainer(`
      <div id="a"><div class="skelly-circle"></div></div>
      <div id="b"><div class="skelly-circle"></div></div>
    `);
    const containerA = wrapper.querySelector("#a") as HTMLElement;
    const containerB = wrapper.querySelector("#b") as HTMLElement;

    const skelly = new AutoSkelly();
    skelly.apply(wrapper);

    expect(containerA.querySelector("[data-skelly-placeholder]")).toBeTruthy();
    expect(containerB.querySelector("[data-skelly-placeholder]")).toBeTruthy();

    skelly.remove(containerA);

    expect(containerA.querySelector("[data-skelly-placeholder]")).toBeFalsy();
    expect(containerB.querySelector("[data-skelly-placeholder]")).toBeTruthy();
  });
});

describe("aria-busy ref-counting", () => {
  it("keeps the parent aria-busy until every skellified sibling is removed", () => {
    const container = makeContainer(`
      <div class="skelly-circle" id="s1"></div>
      <div class="skelly-circle" id="s2"></div>
    `);
    const s1 = container.querySelector("#s1") as HTMLElement;
    const s2 = container.querySelector("#s2") as HTMLElement;

    const skelly = new AutoSkelly();
    skelly.apply(container);
    expect(container.getAttribute("aria-busy")).toBe("true");

    skelly.remove(s1);
    expect(container.getAttribute("aria-busy")).toBe("true");
    expect(s1.style.display).toBe("");

    skelly.remove(s2);
    expect(container.hasAttribute("aria-busy")).toBe(false);
    expect(s2.style.display).toBe("");
  });
});

describe("style injection", () => {
  it('injects <style id="auto-skelly-styles"> into <head> exactly once, even across multiple instances', () => {
    const container = makeContainer(`<div class="skelly-circle"></div>`);

    new AutoSkelly().apply(container);
    new AutoSkelly().apply(container);

    expect(document.head.querySelectorAll("#auto-skelly-styles").length).toBe(1);
  });
});
