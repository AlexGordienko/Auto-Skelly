// CSS injected once into <head> on first apply(). Never injected at import time.
export const STYLE_ELEMENT_ID = "auto-skelly-styles";

export const SKELLY_CSS = `
.skelly-placeholder {
  display: block;
  box-sizing: border-box;
  background-color: var(--skelly-color, #e3e3e3);
}

.skelly-bar {
  box-sizing: border-box;
  background-color: var(--skelly-color, #e3e3e3);
  border-radius: 5px;
}

@media (prefers-reduced-motion: no-preference) {
  .skelly-anim-pulse {
    animation: skelly-pulse var(--skelly-duration, 2s) infinite ease-in-out;
  }

  .skelly-anim-extraPulse {
    animation: skelly-extra-pulse var(--skelly-duration, 2s) infinite;
  }

  .skelly-anim-gradient {
    animation: skelly-gradient var(--skelly-duration, 5s) ease infinite;
  }
}

.skelly-anim-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
}

@keyframes skelly-pulse {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

@keyframes skelly-extra-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

@keyframes skelly-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;

export function injectStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }
  const style = doc.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = SKELLY_CSS;
  doc.head.appendChild(style);
}
