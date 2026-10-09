// Bulk roles MVP, flow board canvas. Lays the MVP out like the Figma "Full Flows" (Page 17, 1222:258275): the
// header, the "In and out of the MVP" card (8 Oct lock session), then one row per flow with the row title, each screen's
// caption, the tile, its Dev note under it and the flow lines with their tap labels (solid red = main path, dashed grey =
// a branch), and last the "Cut on 8 Oct (lock session)" row. Tiles are the live prototype (MVPScreen), captured one at a time in an
// off-screen stage and frozen as markup, so they can't go stale. Click a tile to open the prototype at that screen.
// Pan: drag, or scroll. Zoom: Ctrl/Cmd + scroll, + and -, Fit (F or 0). Deep link: Board.dc.html#step=1.0e
const MVPB = { PAD:80, TW:378, TH:278, VW:1512, VH:1112, GAP:150, LABEL:340, CAP:72, ROWGAP:120 };
const MVP_PROTO_URL = "BulkRolesMVP.dc.html";
const MVPB_TONE = { "In the MVP":"positive", "Open question":"warning" };

function mvpbDb() { return new Promise((res, rej) => { try { const r = indexedDB.open("mvpboard", 1); r.onupgradeneeded = () => r.result.createObjectStore("snaps"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } }); }
function mvpbGet(key) { return mvpbDb().then((db) => new Promise((res) => { const q = db.transaction("snaps").objectStore("snaps").get(key); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); })).catch(() => null); }
function mvpbSet(key, val) { return mvpbDb().then((db) => new Promise((res) => { const tx = db.transaction("snaps", "readwrite"), s = tx.objectStore("snaps"); s.clear(); s.put(val, key); tx.oncomplete = () => res(); tx.onerror = () => res(); })).catch(() => {}); }
// Version stamp of the prototype scripts the boot injected, so cached tiles refresh after any edit.
function mvpbVersion() {
  let h = 5381, n = 0;
  document.querySelectorAll("script").forEach((s) => { const t = s.textContent || ""; if (t.indexOf("sourceURL=") > -1 && /bulk-roles|suite-settings|src\//.test(t.slice(-300))) { n++; for (let i = 0; i < t.length; i += 7) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; h = ((h * 33) ^ t.length) >>> 0; } });
  return "mvp-" + n + "-" + h.toString(36);
}
class MVPTileGuard extends React.Component {
  constructor(p) { super(p); this.state = { err:null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { console.error("MVP board tile " + this.props.id + ": " + err); }
  render() { return this.state.err ? <div data-flow-fail="" style={{ padding:40, font:"600 48px/1.3 var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-subtle)" }}>Screen {this.props.id} failed to render</div> : this.props.children; }
}
// The frozen markup is decoration: inert and hidden from assistive tech, so its links and buttons never take focus.
const MVPSnap = React.memo(function MVPSnap({ html }) {
  return <div aria-hidden="true" ref={(el) => { if (el) el.setAttribute("inert", ""); }} style={{ position:"absolute", left:0, top:0, width:MVPB.VW, height:MVPB.VH, transform:"scale(" + (MVPB.TW / MVPB.VW) + ")", transformOrigin:"0 0", pointerEvents:"none" }} dangerouslySetInnerHTML={{ __html:html }}></div>;
});

// One note under a tile. Dev note = the Figma Dev note (grey card, grey chip). Proposal = warning, other = positive.
function MVPBoardNote({ n }) {
  const prop = n[0] === "p", label = n[2] || MVP_NOTE_LABEL[n[0]];
  if (n[0] === "d") return <div data-mvp-note="d" style={{ padding:"16px 18px", borderRadius:8, background:"var(--bento-theme-color-bg-surface-recessed)", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:10 }}>
    <span style={{ font:"600 14px/20px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)", background:"var(--bento-theme-color-bg-surface-intense)", borderRadius:4, padding:"2px 8px" }}>{label}</span>
    <span style={{ font:"400 16px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>{n[1]}</span></div>;
  return <div data-mvp-note={n[0]} style={{ padding:"12px 14px", borderRadius:8, border:"1px solid " + (prop ? "var(--bento-theme-color-border-warning)" : "var(--bento-theme-color-border-positive)"), background:prop ? "var(--bento-theme-color-bg-warning)" : "var(--bento-theme-color-bg-positive)", display:"flex", flexDirection:"column", gap:4 }}>
    <span style={{ font:"700 13px/18px var(--bento-theme-font-families-primary)", color:prop ? "var(--bento-theme-color-text-warning)" : "var(--bento-theme-color-text-positive)" }}>{label}</span>
    <span style={{ font:"400 14px/20px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>{n[1]}</span></div>;
}

function MVPBoard() {
  const R = React, B = MVPB;
  const NS = window.BentoHootsuiteDesignSystem_a1ac47 || {};
  const { Badge, Button } = NS;
  const ink = "var(--bento-theme-color-text-base)", sub = "var(--bento-theme-color-text-subtle)", edge = "var(--bento-theme-color-border-subtle, #EBEBEB)";
  const cont = R.useRef(null), world = R.useRef(null), els = R.useRef({}), drag = R.useRef(null), moved = R.useRef(false), touched = R.useRef(false);
  const [view, setView] = R.useState({ x:0, y:0, z:0.3 }), [grab, setGrab] = R.useState(false), [focus, setFocus] = R.useState(null);
  const viewRef = R.useRef(view); viewRef.current = view;
  const ids = MVP_SCREEN_IDS;

  const size = () => { const w = world.current; return w ? { w:w.offsetWidth, h:w.offsetHeight } : { w:3000, h:4000 }; };
  const fit = () => { const c = cont.current; if (!c) return; const r = c.getBoundingClientRect(), s = size(), z = Math.max(0.04, Math.min(1, Math.min((r.width - 48) / s.w, (r.height - 96) / s.h))); setView({ z, x:(r.width - s.w * z) / 2, y:24 }); };
  const fitWidth = () => { const c = cont.current; if (!c) return; const r = c.getBoundingClientRect(), s = size(), z = Math.max(0.04, Math.min(1, (r.width - 48) / s.w)); setView({ z, x:(r.width - s.w * z) / 2, y:24 }); };
  const zoomAt = (f, cx, cy) => { touched.current = true; setView((v) => { const c = cont.current.getBoundingClientRect(); if (cx === undefined) { cx = c.width / 2; cy = c.height / 2; } const z = Math.max(0.04, Math.min(2, v.z * f)), k = z / v.z; return { z, x:cx - (cx - v.x) * k, y:cy - (cy - v.y) * k }; }); };
  const focusOn = (id) => {
    const c = cont.current, el = els.current[id], w = world.current; if (!c || !el || !w) return; touched.current = true;
    const r = c.getBoundingClientRect(); let x = 0, y = 0, n = el; while (n && n !== w) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    const bw = B.TW + 120, bh = el.offsetHeight + 60, z = Math.max(0.2, Math.min(1.6, (r.width - 80) / bw, (r.height - 120) / bh));
    setView({ z, x:r.width / 2 - (x + B.TW / 2) * z, y:(r.height - 60) / 2 - (y + el.offsetHeight / 2) * z }); setFocus(id);
  };
  R.useLayoutEffect(() => {
    const m = /step=([^&]+)/.exec(location.hash || ""), id = m && decodeURIComponent(m[1]);
    if (id && ids.includes(id)) { setTimeout(() => focusOn(id), 50); return; }
    fitWidth();
  }, []);
  R.useEffect(() => {
    const c = cont.current;
    const wheel = (e) => { e.preventDefault(); const r = c.getBoundingClientRect(); if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top); else setView((v) => ({ ...v, x:v.x - e.deltaX, y:v.y - e.deltaY })); touched.current = true; };
    c.addEventListener("wheel", wheel, { passive:false });
    const kd = (e) => { if (e.target && /input|textarea|select/i.test(e.target.tagName)) return; if (e.key === "+" || e.key === "=") zoomAt(1.25); else if (e.key === "-" || e.key === "_") zoomAt(0.8); else if (e.key === "0" || e.key.toLowerCase() === "f") { setFocus(null); fit(); } };
    const mv = (e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 4) { moved.current = true; touched.current = true; } setView({ ...viewRef.current, x:d.vx + dx, y:d.vy + dy }); };
    const up = () => { drag.current = null; setGrab(false); };
    window.addEventListener("keydown", kd); window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    return () => { c.removeEventListener("wheel", wheel); window.removeEventListener("keydown", kd); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  }, []);
  const down = (e) => { if (e.button !== 0) return; moved.current = false; drag.current = { x:e.clientX, y:e.clientY, vx:viewRef.current.x, vy:viewRef.current.y }; setGrab(true); };

  // Live tiles: one MVPScreen in an off-screen stage switches screen, waits for data-flow-screen plus two frames, and
  // its markup is frozen into the tile. Tiles in view go first. Cached in IndexedDB under the version stamp.
  const [snaps, setSnaps] = R.useState({}), [cur, setCur] = R.useState(null), [run, setRun] = R.useState(0), [gk, setGk] = R.useState(0), [status, setStatus] = R.useState("loading");
  const snapsRef = R.useRef({}), stage = R.useRef(null), ckey = R.useMemo(() => mvpbVersion(), []);
  const pickNext = (map) => {
    const todo = ids.filter((id) => map[id] === undefined); if (!todo.length) return null;
    const c = cont.current;
    if (c) { const cr = c.getBoundingClientRect(); const v = todo.find((id) => { const el = els.current[id]; if (!el) return false; const r = el.getBoundingClientRect(); return r.right > cr.left && r.left < cr.right && r.bottom > cr.top && r.top < cr.bottom; }); if (v) return v; }
    return todo[0];
  };
  R.useEffect(() => {
    let dead = false; setStatus("loading"); setCur(null);
    (run > 0 ? Promise.resolve(null) : mvpbGet(ckey)).then((obj) => {
      if (dead) return;
      if (obj && ids.every((id) => obj[id] !== undefined)) { snapsRef.current = obj; setSnaps(obj); setStatus("done"); return; }
      snapsRef.current = {}; setSnaps({}); setStatus("capture"); setCur(pickNext({}));
    });
    return () => { dead = true; };
  }, [run]);
  R.useEffect(() => {
    if (!cur) return undefined;
    let done = false, raf = 0, timer = 0; const t0 = Date.now();
    const finish = (html, failed) => {
      if (done) return; done = true;
      const next = { ...snapsRef.current, [cur]:html }; snapsRef.current = next; setSnaps(next);
      if (failed) setGk((k) => k + 1);
      const n = pickNext(next);
      if (n) setCur(n); else { setCur(null); setStatus("done"); mvpbSet(ckey, next); }
    };
    const step = () => {
      if (done) return; const st = stage.current;
      if (st && st.querySelector("[data-flow-fail]")) { finish(st.innerHTML, true); return; }
      const ready = st && (st.querySelector('[data-flow-screen="' + cur + '"]') || (Date.now() - t0 > 4000 && st.firstElementChild));
      if (ready) { timer = setTimeout(() => { raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => finish(st.innerHTML, false)); }); }, 120); return; }
      if (Date.now() - t0 > 9000) { finish(st ? st.innerHTML : "", true); return; }
      timer = setTimeout(step, 16);
    };
    step();
    return () => { done = true; cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [cur]);
  const nLive = Object.keys(snaps).length;
  const modeLabel = status === "capture" ? "Rendering " + nLive + " / " + ids.length : status === "loading" ? "Loading" : "Live tiles";

  // Flow lines, as design is adding in Figma: the main path solid red, branches dashed grey. fork = a dashed grey branch
  // that drops out of a main line to another row (MVP 1.2 to row 2 when 2 fail).
  const RED = "var(--bento-theme-color-border-negative)", GREY = "var(--bento-theme-color-text-subtle)";
  const Arrow = ({ tap, kind, fork }) => { const br = kind === "branch", col = br ? GREY : RED, L = B.GAP - 28;
    return <div data-flow-line={br ? "branch" : "main"} style={{ width:B.GAP, flex:"none", position:"relative" }}>
    <div style={{ position:"absolute", left:0, right:0, top:B.CAP + B.TH / 2 - 7, display:"flex", justifyContent:"center" }}>
      {tap && <span style={{ position:"absolute", bottom:20, left:4, right:4, textAlign:"center", font:"600 14px/18px var(--bento-theme-font-families-primary)", color:br ? GREY : ink }}>{tap}</span>}
      <svg width={L} height="14" viewBox={"0 0 " + L + " 14"} style={{ overflow:"visible" }}><line x1="0" y1="7" x2={L - 2} y2="7" stroke={col} strokeWidth={br ? 2 : 3} strokeDasharray={br ? "8 6" : undefined} /><path d={"M" + (L - 12) + " 1 L" + L + " 7 L" + (L - 12) + " 13"} fill="none" stroke={col} strokeWidth={br ? 2 : 3} strokeLinejoin="round" /></svg>
      {fork && <div data-flow-line="fork" style={{ position:"absolute", top:14, left:0, right:0, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <svg width="14" height="56" viewBox="0 0 14 56" style={{ overflow:"visible" }}><line x1="7" y1="0" x2="7" y2="54" stroke={GREY} strokeWidth="2" strokeDasharray="8 6" /><path d="M1 44 L7 56 L13 44" fill="none" stroke={GREY} strokeWidth="2" strokeLinejoin="round" /></svg>
        <span style={{ marginTop:6, padding:"0 4px", textAlign:"center", font:"600 14px/18px var(--bento-theme-font-families-primary)", color:GREY }}>{fork}</span></div>}</div></div>; };
  const Gap = () => <div style={{ width:B.GAP, flex:"none" }} />;
  // A dashed grey branch that skips screens in its row (MVP 3.1 to 3.3, over 3.2), as the Figma 10/8: up out of the
  // source tile, across above the captions, down the gap before the target and into its side. skip = screens jumped over.
  const SkipLine = ({ label, skip }) => {
    const sx = -skip * (B.TW + B.GAP) - 60, ry = -28, dx = B.GAP / 2, ty = B.CAP + B.TH / 2, tx = B.GAP - 2;
    return <div data-flow-line="branch" style={{ width:B.GAP, flex:"none", position:"relative", alignSelf:"stretch" }}>
      <svg width="1" height="1" aria-hidden="true" style={{ position:"absolute", left:0, top:0, overflow:"visible", pointerEvents:"none" }}>
        <path d={"M" + sx + " " + B.CAP + " V" + ry + " H" + dx + " V" + ty + " H" + tx} fill="none" stroke={GREY} strokeWidth="2" strokeDasharray="8 6" strokeLinejoin="round" />
        <path d={"M" + (tx - 12) + " " + (ty - 6) + " L" + tx + " " + ty + " L" + (tx - 12) + " " + (ty + 6)} fill="none" stroke={GREY} strokeWidth="2" strokeLinejoin="round" /></svg>
      <span style={{ position:"absolute", left:(sx + dx) / 2 - 200, width:400, top:ry - 26, textAlign:"center", font:"600 14px/18px var(--bento-theme-font-families-primary)", color:GREY, pointerEvents:"none" }}>{label}</span></div>; };
  const nMvp = MVP_ROWS.filter((r) => !r.cut).reduce((k, r) => k + r.screens.length, 0), nCut = ids.length - nMvp;

  return (
    <div ref={cont} data-flow-board="" data-bento-not-product="" onPointerDown={down} style={{ position:"absolute", inset:0, overflow:"hidden", cursor:grab ? "grabbing" : "grab", touchAction:"none", userSelect:"none", background:"var(--bento-theme-color-bg-app)", backgroundImage:"radial-gradient(var(--bento-theme-color-border-subtle, #EBEBEB) 1px, transparent 1px)", backgroundSize:(24 * view.z) + "px " + (24 * view.z) + "px", backgroundPosition:view.x + "px " + view.y + "px", fontFamily:"var(--bento-theme-font-families-primary)" }}>
      <div ref={world} data-flow-world="" style={{ position:"absolute", left:0, top:0, width:"max-content", padding:B.PAD, boxSizing:"border-box", transform:"translate(" + view.x + "px," + view.y + "px) scale(" + view.z + ")", transformOrigin:"0 0", display:"flex", flexDirection:"column", gap:B.ROWGAP }}>
        <div data-mvp-board-head="" style={{ display:"flex", flexDirection:"column", gap:40 }}>
          <div style={{ display:"flex", alignItems:"center", gap:24, padding:"28px 40px", borderRadius:8, background:"var(--hs-surface)", border:"1px solid " + edge, borderLeft:"8px solid var(--bento-theme-color-bg-primary)", color:ink }}>
            <span style={{ font:"700 40px/48px var(--bento-theme-font-families-primary)" }}>Bulk roles MVP, locked 8 Oct</span>
            <span style={{ marginLeft:"auto", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, font:"400 20px/28px var(--bento-theme-font-families-primary)", color:sub }}>
              <span>{MVP_ROWS.filter((r) => !r.cut).length} rows and {nMvp} screens, from the Figma “Bulk Roles MVP 10/8”, locked on 8 Oct, plus {nCut} screens cut that day. Click any screen to open it in the prototype.</span>
              <span data-flow-legend="" style={{ display:"flex", alignItems:"center", gap:24, font:"600 16px/20px var(--bento-theme-font-families-primary)" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8, color:ink }}><svg width="48" height="6" aria-hidden="true"><line x1="0" y1="3" x2="48" y2="3" stroke={RED} strokeWidth="3" /></svg>Main path</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8, color:ink }}><svg width="48" height="6" aria-hidden="true"><line x1="0" y1="3" x2="48" y2="3" stroke={GREY} strokeWidth="2" strokeDasharray="8 6" /></svg>Branch</span></span></span></div>
          <div data-mvp-board-card="" style={{ width:2400, padding:32, borderRadius:8, background:"var(--hs-surface)", border:"1px solid " + edge, boxShadow:"var(--bento-theme-elevation-shadow-dialog)", display:"flex", flexDirection:"column", gap:24, cursor:"default" }}>
            <span style={{ display:"flex", alignItems:"baseline", gap:16 }}><span style={{ font:"700 32px/40px var(--bento-theme-font-families-primary)", color:ink }}>{MVP_CARD.title}</span><span style={{ font:"400 20px/28px var(--bento-theme-font-families-primary)", color:sub }}>{MVP_CARD.subtitle}</span></span>
            <MVPCardView wide /></div>
        </div>
        {MVP_ROWS.map((r) => (
          <div key={r.id} data-flow-row={r.id} style={{ display:"flex", alignItems:"flex-start" }}>
            <div style={{ width:B.LABEL - 40, marginRight:40, marginTop:B.CAP, minHeight:B.TH, flex:"none", boxSizing:"border-box", padding:24, borderRadius:8, background:"var(--hs-surface)", border:"1px solid " + edge, borderTop:"6px solid " + (r.cut ? "var(--bento-theme-color-border-base)" : "var(--bento-theme-color-bg-primary)"), color:ink, display:"flex", flexDirection:"column", gap:12 }}>
              <span style={{ font:"600 16px/20px var(--bento-theme-font-families-primary)", color:sub }}>{r.cut ? r.label : "MVP " + r.id}</span>
              <span style={{ font:"700 26px/32px var(--bento-theme-font-families-primary)" }}>{r.title}</span>
              <span style={{ font:"400 15px/21px var(--bento-theme-font-families-primary)", color:sub }}>{r.summary}</span>
              <span style={{ display:"flex", flexWrap:"wrap", gap:8 }}>{r.status.map((s) => Badge ? <Badge key={s} tone={MVPB_TONE[s] || "neutral"}>{s}</Badge> : <span key={s}>{s}</span>)}</span></div>
            {r.screens.map((s, i) => (
              <React.Fragment key={s.id}>
                <div ref={(el) => { els.current[s.id] = el; }} data-flow-screen-col={s.id} style={{ width:B.TW, flex:"none", display:"flex", flexDirection:"column" }}>
                  <div style={{ height:B.CAP, display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:4, paddingBottom:10, boxSizing:"border-box", font:"600 17px/22px var(--bento-theme-font-families-primary)", color:ink }}>
                    {s.from && <span data-flow-from="" style={{ display:"inline-flex", alignItems:"center", gap:4, font:"600 13px/16px var(--bento-theme-font-families-primary)", color:GREY }}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:16 }}>subdirectory_arrow_right</span>{s.from}</span>}
                    <span><span style={{ color:sub }}>{s.label || "MVP " + s.id}</span>, {s.caption}</span></div>
                  <div data-flow-tile={s.id} style={{ position:"relative", width:B.TW, height:B.TH, background:"var(--hs-surface)", border:"1px solid " + edge, borderRadius:8, overflow:"hidden", boxShadow:"var(--bento-theme-elevation-shadow-dialog)", outline:focus === s.id ? "4px solid var(--bento-theme-color-bg-primary)" : undefined, outlineOffset:4 }}>
                    {snaps[s.id] ? <MVPSnap html={snaps[s.id]} /> : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", font:"600 28px/1 var(--bento-theme-font-families-primary)", color:sub }}>{s.id}</div>}
                    <a href={MVP_PROTO_URL + "#screen=" + s.id} aria-label={"Open MVP " + s.id + ", " + s.caption + ", in the prototype"} onClick={(e) => { if (moved.current) e.preventDefault(); }} style={{ position:"absolute", inset:0, zIndex:2 }}></a></div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16, cursor:"default" }}>{s.notes.map((n, k) => <MVPBoardNote key={k} n={n} />)}</div>
                </div>
                {i < r.screens.length - 1 && (r.screens[i + 1].branchIn ? <SkipLine label={r.screens[i + 1].branchIn.label} skip={i - r.screens.findIndex((x) => x.id === r.screens[i + 1].branchIn.from)} />
                  : r.states || !s.tap ? <Gap /> : <Arrow tap={s.tap} kind={r.cut ? "branch" : s.edge} fork={s.fork} />)}
              </React.Fragment>))}
          </div>))}
      </div>
      <div ref={stage} aria-hidden="true" style={{ position:"fixed", left:-30000, top:0, width:B.VW, height:B.VH, overflow:"hidden", pointerEvents:"none" }}>{cur && <MVPTileGuard key={gk} id={cur}><MVPScreen id={cur} /></MVPTileGuard>}</div>
      <div onPointerDown={(e) => e.stopPropagation()} style={{ position:"absolute", left:16, bottom:16, display:"flex", alignItems:"center", gap:8, padding:8, borderRadius:8, background:"var(--hs-surface)", border:"1px solid " + edge, boxShadow:"var(--bento-theme-elevation-shadow-dialog)", zIndex:5 }}>
        <Button variant="secondary" size="sm" aria-label="Zoom out" onClick={() => zoomAt(0.8)}>−</Button>
        <span data-flow-zoom="" style={{ minWidth:48, textAlign:"center", font:"var(--hs-type-body-md-b)", color:ink }}>{Math.round(view.z * 100)}%</span>
        <Button variant="secondary" size="sm" aria-label="Zoom in" onClick={() => zoomAt(1.25)}>+</Button>
        <Button variant="secondary" size="sm" onClick={() => { setFocus(null); fit(); }}>Fit</Button>
        <Button variant="secondary" size="sm" onClick={() => { setFocus(null); fitWidth(); }}>Fit width</Button>
        <Button variant="primary" size="sm" onClick={() => { location.href = MVP_PROTO_URL; }}>Open prototype</Button>
        {/* Full flow board not deployed in this public copy */}
        <Button variant="secondary" size="sm" onClick={() => setRun((x) => x + 1)}>Refresh tiles</Button>
        <span data-flow-mode="" style={{ font:"var(--hs-type-body-sm)", color:sub, minWidth:110, textAlign:"center" }}>{modeLabel}</span>
      </div>
    </div>
  );
}
Object.assign(window, { MVPBoard, MVP_PROTO_URL });
(function mvpBoardMount() {
  const ready = () => window.BentoHootsuiteDesignSystem_a1ac47 && window.BentoHootsuiteDesignSystem_a1ac47.SuiteShell && window.MVPScreen && window.MVPCardView && window.MVPBoard;
  const start = () => { const el = document.getElementById("root"); if (!el || el.__boardMounted) return; el.__boardMounted = true; try { ReactDOM.createRoot(el).render(<MVPBoard />); } catch (e) { el.__boardMounted = false; console.error("MVP board mount: " + e); } };
  const iv = setInterval(() => { if (ready()) { clearInterval(iv); start(); } }, 100);
})();
