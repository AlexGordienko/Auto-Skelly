// example.js — wires the live demo card on the docs site to the AutoSkelly
// API. Vanilla JS only (no jQuery). Loaded after ./auto-skelly.global.js,
// which exposes window.AutoSkelly (no data-skelly-auto — this demo drives
// its own instance manually so it can reveal content on demand).

(function () {
  "use strict";

  var demoRoot = document.getElementById("demo-card");
  if (!demoRoot || !window.AutoSkelly) return;

  // Scope this instance to the demo card only, so apply()/remove() with no
  // arguments never touch anything else on the page.
  var skelly = new AutoSkelly({
    root: demoRoot,
    color: "#e3e3e3",
    animation: "pulse",
  });

  var showBtn = document.getElementById("demo-show");
  var revealBtn = document.getElementById("demo-reveal");
  var reloadBtn = document.getElementById("demo-reload");
  var statusEl = document.getElementById("demo-status");
  var colorInput = document.getElementById("theme-color");
  var animButtons = document.querySelectorAll("[data-skelly-animation]");

  var currentAnimation = "pulse";

  function updateAnimButtons() {
    animButtons.forEach(function (btn) {
      var isActive = btn.getAttribute("data-skelly-animation") === currentAnimation;
      btn.classList.toggle("anim-btn-active", isActive);
    });
  }

  function updateButtons() {
    var isSkellified = skelly.active;
    showBtn.disabled = isSkellified;
    revealBtn.disabled = !isSkellified;
    showBtn.classList.toggle("opacity-50", isSkellified);
    revealBtn.classList.toggle("opacity-50", !isSkellified);
    statusEl.textContent = isSkellified ? "Showing: skeleton" : "Showing: content";
  }

  showBtn.addEventListener("click", function () {
    skelly.apply();
    updateButtons();
  });

  revealBtn.addEventListener("click", function () {
    skelly.remove();
    updateButtons();
  });

  reloadBtn.addEventListener("click", function () {
    if (reloadBtn.disabled) return;
    reloadBtn.disabled = true;
    skelly.apply();
    updateButtons();
    window.setTimeout(function () {
      skelly.remove();
      updateButtons();
      reloadBtn.disabled = false;
    }, 2000);
  });

  document.getElementById("theme-light").addEventListener("click", function () {
    var color = "#e5e7eb";
    skelly.setTheme({ color: color });
    colorInput.value = color;
  });

  document.getElementById("theme-dark").addEventListener("click", function () {
    var color = "#4b5563";
    skelly.setTheme({ color: color });
    colorInput.value = color;
  });

  colorInput.addEventListener("input", function () {
    skelly.setTheme({ color: colorInput.value });
  });

  animButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentAnimation = btn.getAttribute("data-skelly-animation");
      skelly.setTheme({ animation: currentAnimation });
      updateAnimButtons();
    });
  });

  updateButtons();
  updateAnimButtons();
})();
