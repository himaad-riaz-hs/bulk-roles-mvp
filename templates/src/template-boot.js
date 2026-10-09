// template-boot.js — runs a full-fidelity templates/src/*.jsx product screen
// inside a .dc.html canvas artboard.
//
// WHY THIS EXISTS
// The 25 product replicas in templates/src/ were unreachable from canvas builds,
// so every canvas build re-authored its screen from scratch and invented content.
// The cause was NOT that a .dc.html cannot load unpkg — measured 2026-09-10, it
// can. The real division, measured in a live .dc.html:
//   window.React    ✓ provided by the DC runtime
//   window.ReactDOM ✓ provided by the DC runtime
//   window.Babel    ✗ NOT provided — this file loads it
// Loading React or ReactDOM again from unpkg gives the page two React copies and
// it dies instantly with "Cannot read properties of null (reading 'useState')".
// Loading Babel alone is safe. So the fix is to load exactly one thing more, not
// a whole React stack.
//
// RULES
//  · NEVER add a React or ReactDOM <script> to a .dc.html. They are already there.
//  · Babel comes from here, not from the DC's helmet.
//  · This file transpiles each .jsx with the in-page Babel and injects it as a
//    CLASSIC script, so top-level `function Foo()` lands on window exactly as it
//    does in templates/<product>/index.html. The dependency order in data-jsx
//    must match that file's <script> order.
//  · The last .jsx in the list is expected to end with
//    ReactDOM.createRoot(document.getElementById("root")).render(<App/>) — the
//    host DC therefore only needs to contain <div id="root">.
//  · templates/src/*.jsx carry inline relative asset paths ("assets/nest/a1.jpg")
//    that rely on the <base href="../"> declared by templates/<product>/index.html.
//    A .dc.html CANNOT use a <base> tag: measured 2026-09-10, injecting one makes
//    the DC runtime re-resolve its own helmet <script src> against it, and
//    ds-base.js + template-boot.js themselves 404. So the paths are rewritten in
//    the transpiled source instead — string literals beginning `assets/` only.
//
// USAGE (one line, in the DC's <helmet>, AFTER ds-base.js):
//   <script src="../src/template-boot.js"
//           data-base=".."
//           data-css="src/suite-shell.css,src/nest.css"
//           data-jsx="src/suite-rail.jsx,src/nest.jsx"></script>
// data-base is resolved relative to the DC file; css/jsx paths are relative to it.
(() => {
  const el = document.currentScript;
  if (!el) { console.error("template-boot.js: no currentScript — load it as a plain <script src>."); return; }
  /* SELF-GUARD — load-bearing. The DC runtime executes <helmet> scripts MORE THAN
     ONCE per page (measured 2026-09-10: it re-runs them when it re-mounts the
     component). Without this guard every templates/src/*.jsx was injected twice
     and the whole screen died on
       "SyntaxError: Identifier 'CONVOS' has already been declared"
     — a const at the top level of a classic script cannot be redeclared. Same
     failure mode bento-boot.js guards with window.__bentoBooted. Never remove it. */
  if (window.__bentoTemplateBootStarted) return;
  window.__bentoTemplateBootStarted = true;
  const split = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
  const baseAbs = new URL((el.dataset.base || "..").replace(/\/?$/, "/"), location.href);
  const url = (p) => (/^(https?:)?\/\//.test(p) ? p : new URL(p, baseAbs).href);

  // NO <base> TAG — see the note above; it breaks the DC runtime's own loads.
  window.BENTO_TEMPLATE_BASE = baseAbs.href.replace(/\/$/, "");
  const rebase = (code) =>
    code.replace(/(["'])assets\//g, (m, q) => q + baseAbs.href + "assets/");

  const addLink = (href) => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href;
    document.head.appendChild(l);
  };
  // Material Symbols — every templates/src screen uses the glyph font.
  addLink("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0..200&display=block");
  for (const p of split(el.dataset.css)) addLink(url(p));

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (test, ms, label) => {
    const t0 = Date.now();
    while (!test() && Date.now() - t0 < ms) await sleep(50);
    if (!test()) throw new Error("template-boot.js: timed out waiting for " + label);
    return true;
  };

  (async () => {
    try {
      await waitFor(() => window.React && window.ReactDOM, 20000,
        "React / ReactDOM from the DC runtime");
      if (!window.Babel) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js";
          s.integrity = "sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y";
          s.crossOrigin = "anonymous";
          s.onload = res;
          s.onerror = () => rej(new Error("template-boot.js: could not load @babel/standalone — JSX cannot be transpiled."));
          document.head.appendChild(s);
        });
      }
      await waitFor(() => window.Babel, 20000, "Babel");
      // #root lives in the DC template, which streams in after the helmet closes.
      await waitFor(() => document.getElementById("root"), 20000,
        '<div id="root"> in the DC template');

      const preset = (() => {
        try { window.Babel.transform("var a = <b/>;", { presets: ["react"] }); return ["react"]; }
        catch (e) { return null; }
      })();
      if (!preset) throw new Error("template-boot.js: the in-page Babel has no React preset — cannot transpile JSX.");

      for (const p of split(el.dataset.jsx)) {
        const href = url(p);
        const res = await fetch(href);
        if (!res.ok) throw new Error("template-boot.js: " + res.status + " fetching " + href);
        const code = window.Babel.transform(await res.text(), { presets: preset, filename: p }).code;
        const s = document.createElement("script");
        // Classic script, appended synchronously => executes in GLOBAL scope, in order.
        s.textContent = rebase(code) + "\n//# sourceURL=" + href;
        document.body.appendChild(s);
      }
      /* The rail's own loader for shared-popovers.js looks for a <script src="…suite-rail.jsx"> tag; here the rail is transpiled and injected inline, so it
         never finds one and the Wisdom panel, org menu and the other shared controls were dead in every .dc.html boot page (kit .37). Load them from src/. */
      if (split(el.dataset.jsx).some((p) => /suite-rail\.jsx$/.test(p)) && !window.__sharedPopovers) {
        addLink(url("src/shared-popovers.css"));
        const j = document.createElement("script");
        j.src = url("src/shared-popovers.js");
        document.head.appendChild(j);
      }
      window.__bentoTemplateBooted = true;
    } catch (e) {
      console.error(String((e && e.message) || e));
      const b = document.createElement("div");
      b.setAttribute("data-bento-guard", "");
      b.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#B3271E;color:#fff;font:600 13px/1.45 ui-sans-serif,system-ui,sans-serif;padding:10px 14px;white-space:pre-wrap";
      b.textContent = "Bento guard — the template did not boot. Fix it; do not hand-roll the screen instead.\n· " + String((e && e.message) || e);
      (document.body || document.documentElement).appendChild(b);
    }
  })();
})();
