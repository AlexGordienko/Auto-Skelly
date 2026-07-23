import { afterEach, describe, expect, it } from "vitest";
import { AutoSkelly } from "../src/index";
import { makeContainer, stubRect } from "./utils";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("text sizing", () => {
  it("renders a single block placeholder sized from a mocked rect", () => {
    const container = makeContainer(`<p class="skelly-text">hello</p>`);
    const original = container.querySelector(".skelly-text") as HTMLElement;
    stubRect(original, { width: 200, height: 20 });

    new AutoSkelly().apply(container);

    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.style.width).toBe("200px");
    expect(placeholder.style.height).toBe("20px");
    expect(placeholder.querySelectorAll(".skelly-bar").length).toBe(0);
  });

  it("renders multiple .skelly-bar lines when the rect is at least 2x the line-height, with the last bar at 60% width", () => {
    const container = makeContainer(`<p class="skelly-text">hello</p>`);
    const original = container.querySelector(".skelly-text") as HTMLElement;
    // Default line-height resolves to ~19.2px (16px font-size * 1.2), so a
    // 100px-tall rect is comfortably >= 2 lines.
    stubRect(original, { width: 200, height: 100 });

    new AutoSkelly().apply(container);

    const placeholder = original.previousElementSibling as HTMLElement;
    const bars = Array.from(placeholder.querySelectorAll<HTMLElement>(".skelly-bar"));

    expect(bars.length).toBeGreaterThanOrEqual(2);
    expect(bars[bars.length - 1].style.width).toBe("60%");
    bars.slice(0, -1).forEach((bar) => {
      expect(bar.style.width).toBe("100%");
    });
  });
});

describe("image sizing", () => {
  it("uses width/height attributes when the rect is zero", () => {
    const container = makeContainer(`<img class="skelly-image" width="300" height="150" />`);
    const original = container.querySelector(".skelly-image") as HTMLElement;
    stubRect(original, { width: 0, height: 0 });

    new AutoSkelly().apply(container);

    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.style.width).toBe("300px");
    expect(placeholder.style.height).toBe("150px");
  });

  it("falls back to a 16/9 aspect-ratio when the rect is zero and there are no size attributes", () => {
    const container = makeContainer(`<img class="skelly-image" />`);
    const original = container.querySelector(".skelly-image") as HTMLElement;
    stubRect(original, { width: 0, height: 0 });

    new AutoSkelly().apply(container);

    const placeholder = original.previousElementSibling as HTMLElement;
    expect(placeholder.style.width).toBe("100%");
    expect(placeholder.style.aspectRatio).toBe("16 / 9");
    expect(placeholder.style.height).toBe("");
  });
});
