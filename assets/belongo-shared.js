/* ============================================================
   BELONGO SHARED INTERACTIONS (design-demo grade, not production)
   Used by all hi-fi page designs. Behaviors:
   - [data-toggle="chatbot"]      → opens/closes #chatbot-panel
   - [data-toggle="mobile-menu"]  → opens/closes #site-mobile-menu
   - .site-header                 → gains .is-scrolled past 8px
   - [data-state-group] demos     → buttons with [data-show] reveal
                                    matching [data-state] panes
   - .toast [data-dismiss]        → hides the toast
   ============================================================ */
(function () {
  "use strict";

  // Chatbot open/close
  document.querySelectorAll('[data-toggle="chatbot"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById("chatbot-panel");
      if (!panel) return;
      var open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Mobile menu
  document.querySelectorAll('[data-toggle="mobile-menu"]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var menu = document.getElementById("site-mobile-menu");
      if (!menu) return;
      var open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Sticky header shadow
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("site-header--overlay")) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Demo state switchers (foundations/spec pages)
  document.querySelectorAll("[data-state-group]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-show]");
    var panes = group.querySelectorAll("[data-state]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        panes.forEach(function (p) {
          p.style.display = p.getAttribute("data-state") === btn.getAttribute("data-show") ? "" : "none";
        });
      });
    });
  });

  // Generic full-screen overlay toggles: [data-toggle-overlay="#id"]
  // Used by g03 map view; reusable for future lightboxes/drawers.
  document.querySelectorAll("[data-toggle-overlay]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.querySelector(btn.getAttribute("data-toggle-overlay"));
      if (!el) return;
      var open = el.classList.toggle("is-open");
      el.setAttribute("aria-hidden", String(!open));
      btn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  });

  // Close open map overlay on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var ov = document.querySelector(".sr-mapoverlay.is-open");
    if (ov) { ov.classList.remove("is-open"); ov.setAttribute("aria-hidden","true"); document.body.style.overflow = ""; }
  });

  // Prototype linking: any element with [data-href] is clickable,
  // but clicks on inner controls (a/button/input/label) still work.
  document.querySelectorAll("[data-href]").forEach(function (el) {
    el.style.cursor = "pointer";
    el.addEventListener("click", function (e) {
      if (e.target.closest("a, button, input, textarea, label, select")) return;
      window.location.href = el.getAttribute("data-href");
    });
  });

  // Toast dismiss
  document.querySelectorAll(".toast [data-dismiss]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = btn.closest(".toast");
      if (t) t.style.display = "none";
    });
  });
})();
