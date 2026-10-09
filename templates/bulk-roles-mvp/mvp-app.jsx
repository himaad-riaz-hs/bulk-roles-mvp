// Bulk roles MVP, app: state, screen deep links (#screen=1.0e), flows start page, notes sheet, mount.
const MVP_DUR = 3000;
const MVP_BOARD_URL = "Board.dc.html";
const mvpHashScreen = () => { const m = /[#&]screen=([0-9x]+\.[0-9]+[a-e]?)/.exec(location.hash || ""); return m ? m[1] : null; };
const MVP_PERMS0 = () => ({ ...{ "Publisher One":BR_P1_PERMS, "Editor":BR_P1_PERMS, "Limited":["Publish posts with approval","Comment and reply with approval","Basic Usage"], "Responder":["Comment and reply with approval","Reply to public messages in Inbox 2.0","Basic Usage"],
  "Advanced":BR_P1_PERMS.concat(["Boost posts","Manage ad accounts","Manage social account permissions","Manage social account profile"]), "Care Agent":["Approve Messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0","Reply to public messages in Inbox 2.0","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","Basic Usage"] } });
const mvpLow = (s) => s.charAt(0).toLowerCase() + s.slice(1);

function MVPApp({ screen, isStatic }) {
  const R = React;
  const sid0 = screen || (isStatic ? null : mvpHashScreen());
  const [ready, setReady] = R.useState(!sid0);
  const [view, setView] = R.useState("flows"), [row, setRow] = R.useState(null), [scr, setScr] = R.useState(null), [tplKey, setTplKey] = R.useState(0), [acctOpen, setAcctOpen] = R.useState(false);
  const [outcome, setOutcome] = R.useState("all"), [access, setAccess] = R.useState("full"), [notesOpen, setNotesOpen] = R.useState(false);
  const [people, setPeople] = R.useState(mvpPeople), [sel, setSel] = R.useState([]), [loaded, setLoaded] = R.useState(MVP_LOADED), [listKey, setListKey] = R.useState(0);
  const [search, setSearch0] = R.useState(""), [perms, setPerms0] = R.useState([]), [stat, setStat0] = R.useState([]);
  const [bulk, setBulk] = R.useState(null), [job, setJob] = R.useState(null), [notifOpen, setNotifOpen] = R.useState(false);
  const [roleRows, setRoleRows] = R.useState(MVP_ROLE_ROWS0), [rolePerms, setRolePerms] = R.useState(MVP_PERMS0), [rjob, setRjob] = R.useState(null);
  const [edit, setEdit] = R.useState(null), [create, setCreate] = R.useState(null), [saveModal, setSaveModal] = R.useState(false);
  const [toasts, setToasts] = R.useState([]), [orgModal, setOrgModal] = R.useState(null), [delModal, setDelModal] = R.useState(null);
  const timers = R.useRef([]), live = R.useRef({});
  live.current = { job, outcome, bulk };
  const later = (fn, ms) => { if (isStatic) return; const t = setTimeout(fn, ms); timers.current.push(t); };
  const toast = (msg) => { const id = Date.now() + Math.random(); setToasts((t) => t.concat({ id, msg })); if (!isStatic) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000); };
  // No live progress (8 Oct lock session): rows keep their current role until the job finishes.
  const roleOf = (p) => p.role;
  // A new search or filter clears the selection and closes the bar (PM, 7 Oct).
  const setSearch = (v) => { setSearch0(v); setSel([]); };
  const setPerms = (v) => { setPerms0(v); setSel([]); };
  const setStat = (v) => { setStat0(v); setSel([]); };

  const resetAll = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPeople(mvpPeople()); setSel([]); setLoaded(MVP_LOADED); setListKey((k) => k + 1); setSearch0(""); setPerms0([]); setStat0([]);
    setBulk(null); setJob(null); setNotifOpen(false); setRoleRows(MVP_ROLE_ROWS0()); setRolePerms(MVP_PERMS0()); setRjob(null); setEdit(null); setCreate(null); setSaveModal(false); setToasts([]); setOrgModal(null); setDelModal(null);
    mvpNotif(false); setAccess("full");
  };
  const scrollTop = () => { const c = document.querySelector(".hs-appcontent"); if (c) c.scrollTop = 0; };
  const goView = (v) => { setView(v); setBulk(null); setSaveModal(false); if (v !== "members") setSel([]); scrollTop(); };
  const go = (v) => { goView(v); if (v === "flows") { setRow(null); setScr(null); } };
  const openTpl = (id) => { window.__SS_PROPS = { startPage:id, access:"full", reconnectAlert:false, hasPassword:true }; setBulk(null); setTplKey((k) => k + 1); setView("tpl"); };
  const P1 = MVP_P1;
  const applied = (withFails) => mvpPeople().map((p, i) => (i < MVP_LOADED && mvpCanChange(p) && (withFails || !MVP_FAIL.includes(p.id))) ? { ...p, role:P1 } : p);
  const firstSel = () => mvpPeople().slice(0, MVP_LOADED).filter(mvpCanChange).map((p) => p.id);
  // The MVP applies to all 48 selected (8 Oct lock session). legacy = the cut review flow, which counted the 45 who move.
  const mkJob = (extra, legacy) => { const base = mvpPeople(), items = base.filter((p) => firstSel().includes(p.id)), ids = legacy ? mvpPlan(items, P1).groups.reduce((a, g) => a.concat(g.ids.map((p) => p.id)), []) : items.map((p) => p.id);
    return { role:P1, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail:[], legacy:!!legacy, ...extra }; };
  const startRow = (id) => {
    resetAll(); setRow(id); setScr(null); setNotesOpen(false);
    if (id === "1") { setOutcome("all"); setView("members"); }
    if (id === "1b") openScreen("1.0a");
    if (id === "2") openScreen("2.0");
    if (id === "3") { setView("accounts"); }
    if (id === "4" || id === "5") { setView("roles"); }
    if (id === "cut") openScreen("x.1");
    scrollTop();
  };

  const openScreen = (sid) => {
    resetAll(); scrollTop(); setScr(sid); setRow((mvpScreen(sid) || { row:{ id:null } }).row.id);
    const mem = () => setView("members"), fail = () => setOutcome("fail");
    // Publisher Two in the list at 0 people, as right after 4.2 (3.3, 3.4).
    const withP2 = () => { setRolePerms({ ...MVP_PERMS0(), [MVP_P2]:BR_P1_PERMS.concat("Boost posts") }); setRoleRows(MVP_ROLE_ROWS0().concat(MVP_P2_ROW())); };
    const resultJob = (extra) => mkJob({ done:48, phase:"result", failed:MVP_FAIL, ...extra });
    const S = {
      "1.0":() => { mem(); setOutcome("all"); setSel(firstSel()); },
      "1.1":() => { mem(); setOutcome("all"); setSel(firstSel()); setBulk({ step:"pick", role:P1 }); },
      "1.2":() => { mem(); setOutcome("all"); setSel(firstSel()); const j = mkJob({}); setJob(isStatic ? { ...j, frozen:true } : j); setBulk({ step:"applying", role:P1 }); },
      "1.3":() => { mem(); setOutcome("all"); setPeople(applied(true)); toast(P1 + " applied to 48 members"); },
      "x.1":() => { mem(); setOutcome("all"); setSel(firstSel()); setBulk({ step:"review", role:P1 }); },
      "x.2":() => { mem(); setOutcome("all"); const j = mkJob({}, true); setJob(isStatic ? { ...j, frozen:true } : j); },
      "1.0a":() => { mem(); setSel(firstSel()); },
      "1.0b":() => { mem(); setSel(firstSel()); setLoaded(100); setListKey((k) => k + 1); },
      "1.0c":() => { mem(); setPerms0(["Editor"]); },
      "1.0d":() => { mem(); setAccess("none"); },
      "1.0e":() => { mem(); setPerms0([P1]); },
      "2.0":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setNotifOpen(true); },
      "2.1":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob()); setBulk({ step:"result", role:P1 }); },
      "2.2":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob({ phase:"retry", frozen:isStatic })); setBulk({ step:"retry", role:P1 }); },
      "2.3":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob({ retries:1 })); setBulk({ step:"result", role:P1 }); },
      "3.0":() => setView("accounts"),
      "3.1":() => setView("roles"),
      "3.2":() => setView("roles"),
      "3.3":() => { setView("roles"); withP2(); },
      "3.4":() => { setView("roles"); withP2(); setDelModal(MVP_P2); },
      "3.5":() => { setView("roles"); toast("Role “" + MVP_P2 + "” deleted"); },
      "4.0":() => { setCreate({ name:"Publisher Two", from:null, perms:[], desc:"" }); setView("create"); },
      "4.1":() => { setCreate({ name:"Publisher Two", from:P1, perms:BR_P1_PERMS, desc:MVP_P2_DESC }); setView("create"); },
      "4.1a":() => { setCreate({ name:"Publisher One", from:null, perms:[], desc:MVP_P2_DESC }); setView("create"); },
      "4.1b":() => { setCreate({ name:"Publisher Two", from:P1, perms:BR_P1_PERMS, desc:MVP_P2_DESC, same:true }); setView("create"); },
      "4.2":() => { setView("roles"); withP2(); toast("New role “Publisher Two” created"); },
      "5.0":() => setView("roles"),
      "5.1":() => { setEdit({ name:P1, origName:P1, desc:BR_DESC[P1], origDesc:BR_DESC[P1], perms:MVP_EDIT_ON, orig:MVP_EDIT_SAVED }); setView("edit"); },
      "5.2":() => { setEdit({ name:P1, origName:P1, desc:BR_DESC[P1], origDesc:BR_DESC[P1], perms:MVP_EDIT_ON, orig:MVP_EDIT_SAVED }); setView("edit"); setSaveModal(true); },
      "5.3":() => { setView("roles"); setRjob({ name:P1, n:48 }); later(() => { setRjob(null); toast(P1 + " updated for 48 people"); }, MVP_DUR); },
      "5.4":() => { setView("roles"); toast(P1 + " updated for 48 people"); },
    };
    (S[sid] || (() => setView("flows")))();
  };
  const lastScreen = R.useRef(sid0);
  R.useLayoutEffect(() => { if (sid0) openScreen(sid0); setReady(true); }, []);
  R.useLayoutEffect(() => { if (isStatic && screen && screen !== lastScreen.current) { lastScreen.current = screen; openScreen(screen); } }, [screen]);
  R.useEffect(() => { if (isStatic) return undefined; const h = () => { const s = mvpHashScreen(); if (s) openScreen(s); }; window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  // 1.0b in the live prototype: scroll to where the second load starts, so the unticked rows show under the ticked ones.
  R.useEffect(() => { if (isStatic || scr !== "1.0b") return undefined; const t = setTimeout(() => { const c = document.querySelector(".hs-appcontent"), rowsEl = c && c.querySelectorAll("[data-mvp-table] tbody tr"); if (c && rowsEl && rowsEl[41]) c.scrollTop = rowsEl[41].getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 200; }, 300); return () => clearTimeout(t); }, [scr, ready]);
  // The notification opens who failed on the account (the link back is a nice to have, not committed).
  R.useEffect(() => {
    if (isStatic) return undefined;
    const h = (e) => { const r = e.target.closest && e.target.closest(".nfp-row"); if (r && /Publisher One on YouTube Somos/.test(r.getAttribute("aria-label") || "")) { setTimeout(() => openScreen("2.1"), 0); } };
    document.addEventListener("click", h, true); return () => document.removeEventListener("click", h, true);
  }, []);

  const openBulk = () => setBulk({ step:"pick", role:P1 });
  // MVP 1.1 -> 1.2: Apply goes straight to In progress in the drawer, for everyone selected (no review step).
  const startApply = (items) => {
    const ids = items.map((p) => p.id);
    setJob({ role:bulk.role, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail:outcome === "fail" ? MVP_FAIL.filter((x) => ids.includes(x)) : [] });
    setBulk({ step:"applying", role:bulk.role });
  };
  // Cut on 8 Oct (screen x.1): the old review's Apply closed the drawer and showed the top banner (screen x.2).
  const startLegacy = (plan) => {
    const ids = plan.groups.reduce((a, g) => a.concat(g.ids.map((p) => p.id)), []);
    setJob({ role:bulk.role, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail:outcome === "fail" ? MVP_FAIL.filter((x) => ids.includes(x)) : [], legacy:true });
    setBulk(null); setSel([]);
  };
  // Closing the drawer while it runs: no banner, the job keeps going and the notification reports back (MVP 2.0).
  const closeApplying = () => { setBulk(null); setSel([]); };
  const closeRun = () => setBulk(null);
  const finish = () => { setBulk(null); setJob(null); };
  const retry = () => { setJob((j) => ({ ...j, phase:"retry" })); setBulk({ step:"retry", role:P1 }); };
  const manageRoles = () => { setBulk(null); setSel([]); setView("roles"); scrollTop(); };

  const phase = job && job.phase, frozen = job && job.frozen;
  R.useEffect(() => {
    if (isStatic || !phase || frozen || (phase !== "run" && phase !== "retry")) return undefined;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const j = live.current.job; if (!j || j.phase !== phase) return;
      const p = Math.min(1, (Date.now() - t0) / MVP_DUR);
      if (p < 1) { if (phase === "run") setJob({ ...j, done:Math.max(j.done, Math.round(j.total * p)) }); return; }
      clearInterval(iv);
      if (phase === "run") {
        const failed = j.willFail || [], b = live.current.bulk, inDrawer = !!(b && b.step === "applying");
        setPeople((ps) => ps.map((x) => j.ids.includes(x.id) && !failed.includes(x.id) ? { ...x, role:j.role } : x)); setSel([]);
        // Everyone updated: the toast (MVP 1.3), whether or not the drawer is still open.
        if (!failed.length) { if (inDrawer) setBulk(null); toast(j.role + " applied to " + j.total + " members"); setJob(null); return; }
        // Some failed, drawer still open: who failed, in the drawer (MVP 2.1). Drawer closed: the notification (MVP 2.0).
        if (inDrawer || j.legacy) { setJob({ ...j, done:j.total, phase:"result", failed }); setBulk({ step:"result", role:j.role }); mvpNotif(true); }
        else { setJob(null); openScreen("2.0"); }
      } else { setJob({ ...j, phase:"result", retries:j.retries + 1 }); setBulk({ step:"result", role:j.role }); }
    }, 150);
    return () => clearInterval(iv);
  }, [phase, frozen]);

  const roleDesc = (r) => (roleRows.find((x) => x.name === r) || {}).desc || BR_DESC[r] || "";
  const startEdit = (name) => { const d0 = (roleRows.find((r) => r.name === name) || {}).desc || ""; const on = name === P1 ? MVP_EDIT_SAVED : (rolePerms[name] || []).filter((x) => MVP_EDIT_LIST.includes(x)); setEdit({ name, origName:name, desc:d0, origDesc:d0, perms:on, orig:on }); setView("edit"); scrollTop(); };
  const saveEdit = () => { const n = (roleRows.find((r) => r.name === edit.origName) || {}).count || 0; if (n > 0) setSaveModal(true); else confirmSave(); };
  const confirmSave = () => {
    const e = edit, n = (roleRows.find((r) => r.name === e.origName) || {}).count || 0;
    setSaveModal(false); setRolePerms((m) => ({ ...m, [e.name]:e.perms })); setRoleRows((rs) => rs.map((r) => r.name === e.origName ? { ...r, name:e.name, id:e.name } : r));
    setView("roles"); scrollTop();
    if (n > 0) { setRjob({ name:e.name, n }); later(() => { setRjob(null); toast(e.name + " updated for " + n + " people"); }, MVP_DUR); } else toast(e.name + " updated");
  };
  const startCreate = () => { setCreate({ name:roleRows.some((r) => r.name === "Publisher Two") ? "" : "Publisher Two", from:null, perms:[], desc:"" }); setView("create"); scrollTop(); };
  const nameTaken = (nm, own) => { const t = (nm || "").trim().toLowerCase(); return !!t && t !== (own || "").toLowerCase() && roleRows.some((r) => r.name.toLowerCase() === t); };
  const pickFrom = (r) => setCreate((c) => ({ ...c, from:r, perms:rolePerms[r] || [], same:false }));
  const saveCreate = () => {
    const c = create, base = c.from ? (rolePerms[c.from] || []) : [], add = c.perms.filter((p) => !base.includes(p)), rem = base.filter((p) => !c.perms.includes(p));
    const desc = c.from ? c.from + " permissions" + (add.length ? ", plus " + add.map(mvpLow).join(", ") : "") + (rem.length ? ", without " + rem.map(mvpLow).join(", ") : "") : "Custom permissions";
    setRolePerms((m) => ({ ...m, [c.name]:c.perms })); setRoleRows((rs) => rs.concat({ id:c.name, name:c.name, type:"Custom", desc, count:0 }));
    setView("roles"); scrollTop(); toast("New role “" + c.name + "” created");
  };
  const deleteRole = (name) => { setRoleRows((rs) => rs.filter((r) => r.name !== name)); toast("Role “" + name + "” deleted"); };
  // Delete (only on for a role nobody has) asks once first (MVP 3.4). Cancel or close keeps the role.
  const askDelete = (name) => setDelModal(name);
  const confirmDelete = () => { const n = delModal; setDelModal(null); if (n) deleteRole(n); };

  const A = { screen:scr, isStatic, view, access, outcome, people, roleOf, sel, setSel, toggle:(id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : s.concat(id)), loaded:scr === "1.0b" ? 100 : loaded,
    search, setSearch, perms, setPerms, stat, setStat, bulk, setBulk, job, roleRows, rolePerms, rjob, edit, setEdit, create, setCreate, saveModal, setSaveModal,
    go, goView, toast, openBulk, startApply, startLegacy, closeApplying, closeRun, finish, retry, manageRoles, roleDesc, startEdit, saveEdit, confirmSave, startCreate, nameTaken, pickFrom, saveCreate, deleteRole, askDelete, confirmDelete, delModal, closeDelete:() => setDelModal(null),
    openOrg:(kind, data) => setOrgModal({ kind, data }), setRole:(id, r) => setPeople((ps) => ps.map((p) => p.id === id ? { ...p, role:r } : p)) };

  const NS = SS_NS();
  if (!NS.SuiteShell || !ready) return null;
  const { SuiteShell, AlertToast, ToggleGroup, Button, Badge } = NS;
  const Page = { members:MVPMembers, accounts:MVPAccounts, roles:MVPRoles, create:MVPCreate, edit:MVPEdit }[view];
  const inShell = view !== "flows" && view !== "tpl";
  const orgCtx = { teams:SS_TEAMS, members:people.slice(0, 60), accounts:MVP_ACCOUNTS, toast, removeAccount:(a) => { toast(a.name + " removed"); go("flows"); } };
  const AcctPanel = window.AccountPanel;
  const railAvatar = <button key="account" type="button" className="hs-rail-item is-util" aria-label="Account" title="Account" aria-haspopup="dialog" aria-expanded={acctOpen} aria-controls="global-nav-account-panel" onClick={() => setAcctOpen((o) => !o)} style={{ border:0, background:"transparent", cursor:"pointer" }}>
    <span className="hs-rail-glyph"><span className="material-symbols-outlined" aria-hidden="true">account_circle</span></span><span className="hs-rail-label">Account</span></button>;
  const railProps = isStatic ? (scr === "2.0" ? { enableDialogs:true, defaultNotifOpen:true } : undefined) : { enableDialogs:true, avatarSlot:railAvatar, defaultNotifOpen:notifOpen };
  const sNotes = scr && mvpScreen(scr);
  return (
    <MVPC.Provider value={A}>
      <div data-flow-screen={scr || ""} style={{ height:isStatic ? "100%" : "100vh", display:"flex", flexDirection:"column", background:"var(--bento-theme-color-bg-app)", position:"relative", overflow:"hidden" }}>
        {!isStatic && <div data-mvp-strip="" style={{ flex:"none", minHeight:48, display:"flex", alignItems:"center", flexWrap:"wrap", gap:"var(--bento-space-03)", padding:"0 16px", background:"var(--hs-surface)", borderBottom:"1px solid var(--bento-theme-color-border-subtle, #EBEBEB)" }}>
          <Button variant="ghost" size="sm" icon="arrow_back" onClick={() => go("flows")}>Flows</Button>
          <Button variant="ghost" size="sm" icon="dashboard" onClick={() => { location.href = MVP_BOARD_URL + (scr ? "#step=" + scr : ""); }}>Back to board</Button>
          <strong style={{ font:"var(--hs-type-body-md-b)" }}>Bulk roles MVP</strong>
          <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{scr ? (/^x\./.test(scr) ? "Cut on 8 Oct, screen " + scr : "Screen " + scr) : row ? "Row " + row : "Updated for the 8 Oct lock session"}</span>
          {(row || scr) && <Button variant="secondary" size="sm" icon="replay" onClick={() => scr ? openScreen(scr) : startRow(row)}>Replay</Button>}
          <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"var(--bento-space-03)" }}>
            <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>When it runs</span>
            <ToggleGroup options={[{ id:"all", label:"Everyone updates" }, { id:"fail", label:"2 fail" }]} value={outcome} onChange={setOutcome} />
            <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>Admin</span>
            <ToggleGroup options={[{ id:"full", label:"Can edit custom roles" }, { id:"none", label:"Can’t" }]} value={access} onChange={(v) => { setAccess(v); setSel([]); }} />
            {sNotes && <Button variant={notesOpen ? "primary" : "secondary"} size="sm" icon="sticky_note_2" onClick={() => setNotesOpen((o) => !o)}>Notes · {sNotes.s.notes.length}</Button>}
          </span>
        </div>}
        <div style={{ flex:1, minHeight:0, position:"relative" }}>
          <div data-mvp-stage="" data-bento-frame="" style={{ position:"absolute", inset:0, overflow:"hidden" }}><MVPStyle />
            {inShell ? (
              <React.Fragment>
                <div style={{ position:"absolute", inset:0 }}>
                  <SuiteShell key={"shell" + (scr === "2.0" ? "-n" : "")} product="settings" railProps={railProps} drawerProps={{ items:MVP_NAV, value:"social-accounts", onSelect:openTpl, org:SS_ORG, orgs:SS_ORGS, onOrgChange:() => {} }}>
                    <div key={view + (scr || "") + listKey} style={{ minHeight:"100%", background:"var(--bento-theme-color-bg-app)", display:"flex", flexDirection:"column" }}><Page /></div>
                  </SuiteShell>
                </div>
                {AcctPanel && !isStatic && <AcctPanel open={acctOpen} onClose={() => setAcctOpen(false)} />}
                {bulk && <MVPBulkDrawer key={bulk.step + (scr || "")} />}{saveModal && <MVPSaveModal />}{delModal && <MVPDeleteModal />}
                {orgModal && <div className="hs-overlay" style={{ zIndex:1050 }}><SSOrgModal kind={orgModal.kind} data={orgModal.data} ctx={orgCtx} close={() => setOrgModal(null)} /></div>}
                {toasts.length > 0 && <div style={{ position:"absolute", top:80, right:24, zIndex:1100, display:"flex", flexDirection:"column", gap:8 }}>{toasts.map((t) => <AlertToast key={t.id} tone="positive" onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.msg}</AlertToast>)}</div>}
              </React.Fragment>
            ) : view === "tpl" ? <div style={{ position:"absolute", inset:0 }}><SuiteSettingsApp key={tplKey} /></div> : <div style={{ position:"absolute", inset:0, overflow:"auto" }}><MVPFlows startRow={startRow} openScreen={openScreen} /></div>}
          </div>
          {!isStatic && notesOpen && sNotes && <MVPNotesSheet s={sNotes.s} row={sNotes.row} onClose={() => setNotesOpen(false)} shift={!!bulk} />}
        </div>
      </div>
    </MVPC.Provider>
  );
}

const MVP_NOTE_LABEL = { d:"Dev note", f:"From PM or the review", p:"Proposal" };
// Dev notes look like the Figma "Dev note" component: grey card, a small grey "Dev note" chip, then the text.
function MVPNote({ n, compact }) {
  const kind = n[0], label = n[2] || MVP_NOTE_LABEL[kind], prop = kind === "p", dev = kind === "d";
  return <div data-mvp-note={kind} style={{ padding:compact ? 12 : 16, borderRadius:8, border:dev ? "0" : "1px solid " + (prop ? "var(--bento-theme-color-icon-warning)" : "var(--bento-theme-color-border-subtle, #EBEBEB)"), background:dev ? "var(--bento-theme-color-bg-surface-recessed)" : prop ? "var(--hs-bg-warning)" : "var(--hs-surface)", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:dev ? 8 : 4 }}>
    <span style={dev ? { font:"var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-base)", background:"var(--bento-theme-color-bg-surface-intense)", borderRadius:4, padding:"2px 8px" } : { font:"var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-subtle)" }}>{label}</span>
    <span style={{ font:compact ? "var(--hs-type-body-sm)" : "var(--hs-type-body-md)", color:"var(--bento-theme-color-text-base)" }}>{n[1]}</span></div>;
}
function MVPNotesSheet({ s, row, onClose, shift }) {
  const { IconButton } = SS_NS();
  return <aside data-mvp-notes="" style={{ position:"absolute", right:shift ? 400 : 0, top:0, width:320, maxHeight:"100%", overflow:"auto", zIndex:1200, padding:16, boxSizing:"border-box", background:"var(--hs-surface)", borderLeft:"1px solid var(--bento-theme-color-border-subtle, #EBEBEB)", boxShadow:"var(--bento-theme-elevation-shadow-dialog)", display:"flex", flexDirection:"column", gap:8 }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><h2 style={ssTitle(18, 24)}>{s.label || "MVP"} {s.id}</h2><IconButton icon="close" variant="ghost" size="sm" aria-label="Close notes" onClick={onClose} /></div>
    <span style={mvpStrong}>{s.caption}</span><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{row.title}</span>
    {s.notes.map((n, i) => <MVPNote key={i} n={n} compact />)}</aside>;
}

function MVPCardView({ wide }) {
  const { Badge } = SS_NS();
  return <div data-mvp-card="" style={{ display:"grid", gridTemplateColumns:wide ? "repeat(3, minmax(0, 1fr))" : "1fr", gap:24 }}>
    {MVP_CARD.groups.map((g) => <div key={g.title} style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <span style={{ display:"flex", alignItems:"center", gap:8 }}><Badge tone={g.tone}>{g.items.length}</Badge><strong style={{ font:"var(--hs-type-body-lg-b, var(--hs-type-body-md-b))", color:"var(--bento-theme-color-text-base)" }}>{g.title}</strong></span>
      <ul style={{ margin:0, paddingLeft:20, display:"flex", flexDirection:"column", gap:6 }}>{g.items.map((t) => <li key={t} style={{ font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-base)" }}>{t}</li>)}</ul></div>)}
  </div>;
}

function MVPFlows({ startRow, openScreen }) {
  const { Button, Badge, Divider } = SS_NS();
  const tone = { "In the MVP":"positive", "Open question":"warning" };
  return (
    <div data-bento-not-product="" style={{ maxWidth:1040, margin:"0 auto", padding:"40px 32px 64px", boxSizing:"border-box", fontFamily:"var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>
      <h1 style={ssTitle(32, 40)}>Bulk roles MVP</h1>
      <p style={{ ...ssBody, marginTop:8, maxWidth:720 }}>The MVP from the Figma “Bulk Roles MVP 10/8”, locked on 8 Oct: no review step, Apply goes straight to In progress in the drawer, and a notification says how it went. {MVP_ROWS.filter((r) => !r.cut).length} rows and {MVP_ROWS.filter((r) => !r.cut).reduce((k, r) => k + r.screens.length, 0)} screens on the Suite Settings shell, plus the screens cut on 8 Oct. 50 members load at a time; Dar Khan and Mateo Rossi have Unlimited access, so the header checkbox ticks 48. Start a row below, or open the board to jump to any screen.</p>
      <div style={{ marginTop:16, display:"flex", gap:8 }}><Button variant="primary" size="sm" icon="dashboard" onClick={() => { location.href = MVP_BOARD_URL; }}>Open the flow board</Button></div>
      {MVP_ROWS.map((r) => (
        <section key={r.id} style={{ marginTop:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, padding:"8px 0" }}>
            <div style={{ flex:1 }}><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{r.cut ? r.label : "Row " + r.id}</span><div style={{ ...ssTitle(22, 28) }}>{r.title}</div><span style={mvpSub}>{r.summary}</span></div>
            <span style={{ display:"flex", gap:8 }}>{r.status.map((s) => <Badge key={s} tone={tone[s] || "neutral"}>{s}</Badge>)}</span>
            <Button variant="secondary" size="sm" data-mvp-start={r.id} onClick={() => startRow(r.id)}>Start</Button></div>
          <Divider />
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, padding:"12px 0" }}>{r.screens.map((s) => <Button key={s.id} variant="ghost" size="sm" onClick={() => openScreen(s.id)}>{s.id} · {s.caption}</Button>)}</div>
        </section>))}
      <h2 style={{ ...ssTitle(22, 28), margin:"40px 0 16px" }}>{MVP_CARD.title}</h2>
      <MVPCardView />
    </div>
  );
}

// Board tiles mount the same app, frozen at one screen, no strip and no notes.
function MVPScreen({ id }) { return <MVPApp screen={id} isStatic={true} />; }
Object.assign(window, { MVPApp, MVPScreen, MVPNote, MVPCardView, MVP_BOARD_URL });

(function mvpMount() {
  const el0 = document.getElementById("root");
  if (!el0 || el0.getAttribute("data-mvp-app") === "off") return;
  const ready = () => window.BentoHootsuiteDesignSystem_a1ac47 && window.BentoHootsuiteDesignSystem_a1ac47.SuiteShell && window.MVPMembers && window.MVPBulkDrawer && window.SuiteSettingsApp;
  const start = () => { const el = document.getElementById("root"); if (!el || el.__mvpMounted) return; el.__mvpMounted = true; try { ReactDOM.createRoot(el).render(<MVPApp />); } catch (e) { el.__mvpMounted = false; console.error("Bulk roles MVP mount: " + e); } };
  const t0 = Date.now(); let warned = false;
  const iv = setInterval(() => { if (ready()) { clearInterval(iv); start(); } else if (!warned && Date.now() - t0 > 25000) { warned = true; console.error("Bulk roles MVP: bundle did not expose SuiteShell."); } }, 100);
})();
