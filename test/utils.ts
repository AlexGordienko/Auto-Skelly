// Shared test helpers.
//
// jsdom performs no layout, so `getBoundingClientRect()` always returns an
// all-zero rect. Tests that need to exercise size-dependent behavior stub it
// out on the specific element under test.

export function stubRect(
  el: HTMLElement,
  rect: Partial<{
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
    x: number;
    y: number;
  }>
): void {
  const width = rect.width ?? 0;
  const height = rect.height ?? 0;
  const x = rect.x ?? rect.left ?? 0;
  const y = rect.y ?? rect.top ?? 0;

  const full: DOMRect = {
    x,
    y,
    width,
    height,
    top: rect.top ?? y,
    left: rect.left ?? x,
    right: rect.right ?? x + width,
    bottom: rect.bottom ?? y + height,
    toJSON() {
      return this;
    },
  };

  el.getBoundingClientRect = () => full;
}

export function makeContainer(html: string): HTMLDivElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}
