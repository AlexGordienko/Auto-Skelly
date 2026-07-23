import { injectStyles } from "./styles";

export type SkellyAnimation = "pulse" | "extraPulse" | "gradient" | "none";

export interface AutoSkellyOptions {
  /** Placeholder background color. Default "#e3e3e3". */
  color?: string;
  /** Placeholder animation. Default "pulse". */
  animation?: SkellyAnimation;
  /** Root to search/restore within by default. Default document. */
  root?: ParentNode;
}

type Shape = "text" | "image" | "circle" | "button";

interface SkellyRecord {
  original: HTMLElement;
  placeholder: HTMLElement;
  parent: Node;
  priorInlineDisplay: string;
  ariaBusyParent: Element | null;
}

const SELECTOR = ".skelly-text, .skelly-image, .skelly-circle, .skelly-button";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getDocument(root: ParentNode): Document {
  const node = root as unknown as Node;
  if (node.nodeType === 9 /* Node.DOCUMENT_NODE */) {
    return node as unknown as Document;
  }
  const owner = node.ownerDocument;
  if (!owner) {
    throw new Error("AutoSkelly: unable to resolve a document from the given root");
  }
  return owner;
}

function getShape(el: Element): Shape | null {
  if (el.classList.contains("skelly-text")) return "text";
  if (el.classList.contains("skelly-image")) return "image";
  if (el.classList.contains("skelly-circle")) return "circle";
  if (el.classList.contains("skelly-button")) return "button";
  return null;
}

function hasNonZeroRadius(value: string | undefined | null): boolean {
  if (!value) return false;
  const numbers = value.match(/[\d.]+/g);
  if (!numbers) return false;
  return numbers.some((n) => parseFloat(n) !== 0);
}

function defaultRadius(shape: Shape): string {
  switch (shape) {
    case "text":
    case "button":
      return "5px";
    case "circle":
      return "50%";
    case "image":
    default:
      return "0";
  }
}

function resolveRadius(computed: CSSStyleDeclaration, shape: Shape): string {
  const value = computed.borderRadius;
  return hasNonZeroRadius(value) ? value : defaultRadius(shape);
}

function applyMargin(target: HTMLElement, computed: CSSStyleDeclaration): void {
  target.style.marginTop = computed.marginTop;
  target.style.marginRight = computed.marginRight;
  target.style.marginBottom = computed.marginBottom;
  target.style.marginLeft = computed.marginLeft;
}

function resolveLineHeightPx(computed: CSSStyleDeclaration): number {
  const fontSize = parseFloat(computed.fontSize) || 16;
  const lh = computed.lineHeight;
  if (!lh || lh === "normal") {
    return fontSize * 1.2;
  }
  if (lh.endsWith("px")) {
    const parsed = parseFloat(lh);
    return Number.isNaN(parsed) ? fontSize * 1.2 : parsed;
  }
  const parsed = parseFloat(lh);
  if (Number.isNaN(parsed)) {
    return fontSize * 1.2;
  }
  // Unitless line-height is a multiplier of font-size.
  return parsed * fontSize;
}

function resolveWidth(shape: Shape, el: Element, rect: DOMRect): string {
  if (rect.width > 0) return `${rect.width}px`;
  if (shape === "image" && el.tagName === "IMG") {
    const attr = el.getAttribute("width");
    if (attr) return `${attr}px`;
  }
  return "100%";
}

function resolveHeight(
  shape: "button" | "image",
  el: Element,
  rect: DOMRect
): { height?: string; aspectRatio?: string } {
  if (rect.height > 0) return { height: `${rect.height}px` };
  if (shape === "image") {
    if (el.tagName === "IMG") {
      const attr = el.getAttribute("height");
      if (attr) return { height: `${attr}px` };
    }
    return { aspectRatio: "16 / 9" };
  }
  return { height: "2.5em" };
}

function resolveCircleSize(rect: DOMRect): string {
  const measured = Math.max(rect.width, rect.height);
  return measured > 0 ? `${measured}px` : "3em";
}

function createPlaceholderShell(doc: Document, shape: Shape): HTMLDivElement {
  const div = doc.createElement("div");
  div.setAttribute("data-skelly-placeholder", "");
  div.setAttribute("aria-hidden", "true");
  div.classList.add("skelly-placeholder", `skelly-shape-${shape}`);
  return div;
}

function swapAnimationClass(el: HTMLElement, animation: SkellyAnimation): void {
  const toRemove: string[] = [];
  el.classList.forEach((cls) => {
    if (cls.startsWith("skelly-anim-")) toRemove.push(cls);
  });
  toRemove.forEach((cls) => el.classList.remove(cls));
  if (animation !== "none") el.classList.add(`skelly-anim-${animation}`);
}

function buildMultilineBars(
  doc: Document,
  placeholder: HTMLDivElement,
  heightPx: number,
  lineHeight: number,
  radius: string,
  color: string,
  animation: SkellyAnimation
): void {
  const n = Math.max(2, Math.round(heightPx / lineHeight));
  const barHeight = 0.6 * lineHeight;
  const gap = 0.4 * lineHeight;

  placeholder.style.display = "flex";
  placeholder.style.flexDirection = "column";
  placeholder.style.gap = `${gap}px`;
  placeholder.style.height = `${heightPx}px`;
  // The container itself is transparent; the bars carry the visible fill.
  placeholder.style.backgroundColor = "transparent";

  for (let i = 0; i < n; i++) {
    const bar = doc.createElement("div");
    bar.classList.add("skelly-bar");
    if (animation !== "none") bar.classList.add(`skelly-anim-${animation}`);
    bar.style.setProperty("--skelly-color", color);
    bar.style.height = `${barHeight}px`;
    bar.style.width = i === n - 1 ? "60%" : "100%";
    bar.style.borderRadius = radius;
    placeholder.appendChild(bar);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class AutoSkelly {
  private color: string;
  private animation: SkellyAnimation;
  private defaultRoot?: ParentNode;
  private records: SkellyRecord[] = [];
  private originalToRecord = new Map<Element, SkellyRecord>();
  private parentBusyCounts = new Map<Element, number>();

  constructor(options: AutoSkellyOptions = {}) {
    this.color = options.color ?? "#e3e3e3";
    this.animation = options.animation ?? "pulse";
    this.defaultRoot = options.root ?? (typeof document !== "undefined" ? document : undefined);
  }

  apply(
    root: ParentNode = this.defaultRoot ??
      ((typeof document !== "undefined" ? document : undefined) as unknown as ParentNode)
  ): void {
    if (!root) return;

    const doc = getDocument(root);
    injectStyles(doc);

    const matches = root.querySelectorAll<HTMLElement>(SELECTOR);

    matches.forEach((original) => {
      if (original.hasAttribute("data-skelly-placeholder")) return;
      if (this.originalToRecord.has(original)) return;

      const shape = getShape(original);
      if (!shape) return;

      const rect = original.getBoundingClientRect();
      const computed = getComputedStyle(original);
      const placeholder = createPlaceholderShell(doc, shape);
      applyMargin(placeholder, computed);

      if (shape === "circle") {
        const size = resolveCircleSize(rect);
        placeholder.style.width = size;
        placeholder.style.height = size;
        placeholder.style.borderRadius = resolveRadius(computed, "circle");
        placeholder.style.setProperty("--skelly-color", this.color);
        if (this.animation !== "none") {
          placeholder.classList.add(`skelly-anim-${this.animation}`);
        }
      } else if (shape === "text") {
        const widthStr = resolveWidth("text", original, rect);
        const lineHeight = resolveLineHeightPx(computed);
        const radius = resolveRadius(computed, "text");
        placeholder.style.width = widthStr;

        if (rect.height >= 2 * lineHeight) {
          buildMultilineBars(
            doc,
            placeholder,
            rect.height,
            lineHeight,
            radius,
            this.color,
            this.animation
          );
        } else {
          placeholder.style.height = rect.height > 0 ? `${rect.height}px` : "1em";
          placeholder.style.borderRadius = radius;
          placeholder.style.setProperty("--skelly-color", this.color);
          if (this.animation !== "none") {
            placeholder.classList.add(`skelly-anim-${this.animation}`);
          }
        }
      } else {
        // "button" | "image"
        const widthStr = resolveWidth(shape, original, rect);
        const heightInfo = resolveHeight(shape, original, rect);
        placeholder.style.width = widthStr;
        if (heightInfo.height) placeholder.style.height = heightInfo.height;
        if (heightInfo.aspectRatio) placeholder.style.aspectRatio = heightInfo.aspectRatio;
        placeholder.style.borderRadius = resolveRadius(computed, shape);
        placeholder.style.setProperty("--skelly-color", this.color);
        if (this.animation !== "none") {
          placeholder.classList.add(`skelly-anim-${this.animation}`);
        }
      }

      const parentNode = original.parentNode;
      if (!parentNode) return;
      parentNode.insertBefore(placeholder, original);

      const priorInlineDisplay = original.style.display;
      original.style.display = "none";

      const ariaBusyParent = original.parentElement;
      this.markBusy(ariaBusyParent);

      const record: SkellyRecord = {
        original,
        placeholder,
        parent: parentNode,
        priorInlineDisplay,
        ariaBusyParent,
      };
      this.records.push(record);
      this.originalToRecord.set(original, record);
    });
  }

  remove(root?: ParentNode): void {
    const targets = root
      ? this.records.filter((r) => (root as unknown as Node).contains(r.original))
      : this.records.slice();

    targets.forEach((record) => this.restore(record));
  }

  setTheme(theme: { color?: string; animation?: SkellyAnimation }): void {
    if (theme.color !== undefined) this.color = theme.color;
    if (theme.animation !== undefined) this.animation = theme.animation;

    this.records.forEach((record) => {
      const { placeholder } = record;
      placeholder.style.setProperty("--skelly-color", this.color);

      const bars = placeholder.querySelectorAll<HTMLElement>(".skelly-bar");
      if (bars.length > 0) {
        bars.forEach((bar) => {
          bar.style.setProperty("--skelly-color", this.color);
          swapAnimationClass(bar, this.animation);
        });
      } else {
        swapAnimationClass(placeholder, this.animation);
      }
    });
  }

  get active(): boolean {
    return this.records.length > 0;
  }

  private restore(record: SkellyRecord): void {
    record.placeholder.parentNode?.removeChild(record.placeholder);
    record.original.style.display = record.priorInlineDisplay;
    this.originalToRecord.delete(record.original);
    const idx = this.records.indexOf(record);
    if (idx !== -1) this.records.splice(idx, 1);
    this.unmarkBusy(record.ariaBusyParent);
  }

  private markBusy(parent: Element | null): void {
    if (!parent) return;
    const count = this.parentBusyCounts.get(parent) ?? 0;
    if (count === 0) {
      parent.setAttribute("aria-busy", "true");
    }
    this.parentBusyCounts.set(parent, count + 1);
  }

  private unmarkBusy(parent: Element | null): void {
    if (!parent) return;
    const count = this.parentBusyCounts.get(parent);
    if (count === undefined) return;
    if (count <= 1) {
      this.parentBusyCounts.delete(parent);
      parent.removeAttribute("aria-busy");
    } else {
      this.parentBusyCounts.set(parent, count - 1);
    }
  }
}

export default AutoSkelly;

// ---------------------------------------------------------------------------
// Auto-init for script-tag users. SSR-safe: only touches `document` when it
// exists, and only runs when the current script opted in via
// data-skelly-auto. No other import-time side effects (no style injection
// here — that happens lazily inside apply()).
// ---------------------------------------------------------------------------

if (typeof document !== "undefined") {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.hasAttribute("data-skelly-auto")) {
    const run = (): void => {
      new AutoSkelly().apply();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
  }
}
