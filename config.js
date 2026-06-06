/* ===========================================================
   config.js — content-injection layer
   Reads replacement.json (or window.REPLACEMENT) and injects
   all dynamic text / links / images / colors into the DOM.
   No external libraries. Fails gracefully: a missing key
   leaves the element's existing fallback content untouched.
   =========================================================== */
(function () {
  "use strict";

  // Camel/kebab map for theme keys -> CSS custom properties.
  var THEME_VARS = {
    greenBg: "--green-bg",
    greenCard: "--green-card",
    greenDark: "--green-dark",
    greenAccent: "--green-accent",
    offwhite: "--offwhite",
    white: "--white",
    textBody: "--text-body",
    textMuted: "--text-muted"
  };

  // Tiny dot-path resolver: "content.sidebar.bio" -> value (or undefined).
  function resolve(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc != null && typeof acc === "object" ? acc[key] : undefined;
    }, obj);
  }

  function apply(data) {
    var unresolved = [];

    function get(path) {
      var v = resolve(data, path);
      if (v === undefined || v === null) {
        unresolved.push(path);
        return undefined;
      }
      return v;
    }

    // 1. Text content
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var v = get(el.getAttribute("data-bind"));
      if (v !== undefined) el.textContent = v;
    });

    // 2. href
    document.querySelectorAll("[data-bind-href]").forEach(function (el) {
      var v = get(el.getAttribute("data-bind-href"));
      if (v !== undefined) el.setAttribute("href", v);
    });

    // 3. src
    document.querySelectorAll("[data-bind-src]").forEach(function (el) {
      var v = get(el.getAttribute("data-bind-src"));
      if (v !== undefined) el.setAttribute("src", v);
    });

    // 4. background-image
    document.querySelectorAll("[data-bind-bg]").forEach(function (el) {
      var v = get(el.getAttribute("data-bind-bg"));
      if (v !== undefined) el.style.backgroundImage = 'url("' + v + '")';
    });

    // 5. alt
    document.querySelectorAll("[data-bind-alt]").forEach(function (el) {
      var v = get(el.getAttribute("data-bind-alt"));
      if (v !== undefined) el.setAttribute("alt", v);
    });

    // 6. Email link — mailto: href + visible text.
    var emailLink = document.getElementById("email-link");
    var email = resolve(data, "links.email");
    if (emailLink && email) {
      emailLink.setAttribute("href", "mailto:" + email);
    }
    // (#email-text also carries data-bind="links.email" so its text is set above.)

    // 7. Values array -> populate value items (keeps HTML fallback if absent).
    var values = resolve(data, "content.values");
    if (Array.isArray(values)) {
      var nodes = document.querySelectorAll("#values .value");
      values.forEach(function (item, i) {
        var node = nodes[i];
        if (!node || !item) return;
        var title = node.querySelector(".value-title");
        var sub = node.querySelector(".value-sub");
        if (title && item.title != null) title.textContent = item.title;
        if (sub && item.text != null) sub.textContent = item.text;
      });
    }

    // 8. Theme colors -> CSS custom properties on :root.
    var theme = resolve(data, "theme");
    if (theme && typeof theme === "object") {
      Object.keys(THEME_VARS).forEach(function (key) {
        if (theme[key]) {
          document.documentElement.style.setProperty(THEME_VARS[key], theme[key]);
        }
      });
    }

    // 9. <title> + meta description.
    var pageTitle = resolve(data, "content.meta.pageTitle");
    if (pageTitle) document.title = pageTitle;
    var desc = resolve(data, "content.meta.description");
    if (desc) {
      var meta = document.getElementById("meta-description");
      if (meta) meta.setAttribute("content", desc);
    }

    if (unresolved.length) {
      console.warn(
        "[config.js] Unresolved binding path(s) in replacement.json — " +
        "kept fallback content for:\n  " + unresolved.join("\n  ")
      );
    }
  }

  function boot() {
    // Zero-server option: prefer an inlined window.REPLACEMENT if present.
    if (typeof window !== "undefined" && window.REPLACEMENT) {
      apply(window.REPLACEMENT);
      return;
    }

    fetch("replacement.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(apply)
      .catch(function (err) {
        console.warn(
          "[config.js] Could not load replacement.json (" + err.message + "). " +
          "Showing built-in fallback content. If you opened this file directly " +
          "(file://), serve it over HTTP instead — e.g. `python -m http.server 8000`."
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
