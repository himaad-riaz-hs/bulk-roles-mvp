// Bulk roles MVP, app: state, screen deep links (#screen=1.0e), flows start page, notes sheet, mount.
const MVP_DUR = 3000;
const MVP_FRAMED = ["members", "create", "edit", "person"];   // pages drawn in MVPFrame (mvp-pages.jsx)
const MVP_BOARD_URL = "Board.dc.html";
// Screen ids: 1.0, 1.0a, 1.2b, 2.0b, x.1 (cut), p.0 (person side), n.0 (Figma MVP 6, the notification states).
const mvpHashScreen = () => { const m = /[#&]screen=([0-9a-z]+\.[0-9]+[a-z]?)/.exec(location.hash || ""); return m ? m[1] : null; };
// Screens that open the notification panel (Figma 2.0 and MVP 6.1 to 6.3), and the outcome each one shows.
const MVP_NOTIF_SCREENS = { "2.0":"some", "n.1":"all", "n.2":"some", "n.3":"none" };
const MVP_PERMS0 = () => ({ ...{ "Publisher One":BR_P1_PERMS, "Editor":BR_P1_PERMS, "Limited":["Publish posts with approval","Comment and reply with approval","Basic Usage"], "Responder":["Comment and reply with approval","Reply to public messages in Inbox 2.0","Basic Usage"],
  "Advanced":BR_P1_PERMS.concat(["Boost posts","Manage ad accounts","Manage social account permissions","Manage social account profile"]), "Care Agent":["Approve Messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0","Reply to public messages in Inbox 2.0","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","Basic Usage"] } });
// Toast copy: Figma (review mode) and the copy test mode keeps (the live UserTesting study).
const mvpToastApplied = (role, n) => MVP_UT ? role + " applied to " + mvpMembers(n) : "Role changed to " + role + " for " + mvpMembers(n);
const mvpToastCreated = (name) => MVP_UT ? "New role “" + name + "” created" : name + " role created";
const mvpToastDeleted = (name) => MVP_UT ? "Role “" + name + "” deleted" : name + " role deleted";
const mvpToastUpdated = (name, n) => MVP_UT ? name + " updated" + (n ? " for " + n + " people" : "") : name + " role updated" + (n ? " for " + mvpMembers(n) : "");
const mvpLow = (s) => /^(Facebook|Instagram|LinkedIn|YouTube|TikTok|X) /.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
// Row 6: describe a set by the largest role it contains, plus what it adds ("Publisher One permissions, plus Facebook private messages").
const mvpNearDesc = (perms, rp) => { const r = Object.keys(rp).filter((k) => rp[k].length && rp[k].every((x) => perms.includes(x))).sort((a, b) => rp[b].length - rp[a].length)[0];
  if (!r) return "Custom permissions"; const add = perms.filter((x) => !rp[r].includes(x)); return r + " permissions" + (add.length ? ", plus " + add.map(mvpLow).join(", ") : ""); };

function MVPApp({ screen, isStatic }) {
  const R = React;
  const sid0 = screen || (isStatic || MVP_UT ? null : mvpHashScreen());
  const [ready, setReady] = R.useState(!sid0);
  const [view, setView] = R.useState(MVP_UT ? "accounts" : "flows"), [row, setRow] = R.useState(null), [scr, setScr] = R.useState(null), [tplKey, setTplKey] = R.useState(0), [acctOpen, setAcctOpen] = R.useState(false);
  const [editSaved, setEditSaved] = R.useState({});
  const [utFailed, setUtFailed] = R.useState(false);
  const [outcome, setOutcome] = R.useState("all"), [access, setAccess] = R.useState("full"), [notesOpen, setNotesOpen] = R.useState(false);
  const [people, setPeople] = R.useState(mvpPeople), [sel, setSel] = R.useState([]), [loaded, setLoaded] = R.useState(MVP_LOADED), [listKey, setListKey] = R.useState(0);
  const [search, setSearch0] = R.useState(""), [perms, setPerms0] = R.useState([]), [stat, setStat0] = R.useState([]);
  const [bulk, setBulk] = R.useState(null), [job, setJob] = R.useState(null), [notifOpen, setNotifOpen] = R.useState(false);
  // Test mode adds one custom role nobody has, so deleting a role can be tried (T7).
  const [roleRows, setRoleRows] = R.useState(() => MVP_UT ? MVP_ROLE_ROWS0().concat({ id:"Social Intern", name:"Social Intern", type:"Custom", desc:"Limited permissions, plus schedule posts", count:0 }) : MVP_ROLE_ROWS0()), [rolePerms, setRolePerms] = R.useState(() => MVP_UT ? { ...MVP_PERMS0(), "Social Intern":["Basic Usage","Publish posts with approval","Schedule posts"] } : MVP_PERMS0()), [rjob, setRjob] = R.useState(null);
  const [edit, setEdit] = R.useState(null), [create, setCreate] = R.useState(null), [saveModal, setSaveModal] = R.useState(false);
  const [toasts, setToasts] = R.useState([]), [orgModal, setOrgModal] = R.useState(null), [delModal, setDelModal] = R.useState(null);
  // Figma 1.0 variants (review mode): selMode "all" = the bar offers Select all 498 and then the way back (1.0h, 1.0k, 1.0l),
  // "of" = the bar says 48 of 500 selected (1.0i); keepSel = the selection and the bar stay after Change role (1.0j).
  const [selMode, setSelMode] = R.useState("mvp"), [keepSel, setKeepSel] = R.useState(false);
  // Figma MVP 6.0: a dot on the bell once a bulk change finishes, until the panel is opened.
  const [bell, setBell] = R.useState(false);
  // Person side (Figma row MVP person side): Asha Patel's social accounts, the ticked ones, the drawer and the job.
  const [pacc, setPacc] = R.useState(MVP_PERSON_ACCTS0), [psel, setPsel] = R.useState([]), [pbulk, setPbulk] = R.useState(null), [pjob, setPjob] = R.useState(null);
  const [acct, setAcct] = R.useState("a3"), [shellKey, setShellKey] = R.useState(0), store = R.useRef({});
  const timers = R.useRef([]), live = R.useRef({});
  live.current = { job, outcome, bulk, acct, people, keepSel, pbulk, pacc };
  const later = (fn, ms) => { if (isStatic) return; const t = setTimeout(fn, ms); timers.current.push(t); };
  const toast = (msg, undo) => { const id = Date.now() + Math.random(); setToasts((t) => (undo ? t.filter((x) => !x.undo) : t).concat({ id, msg, undo })); if (!isStatic) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), undo ? 10000 : 4000); };
  // Some didn't update and the drawer is closed: a warning toast that stays until dismissed, with Show details (openResult).
  const dropFail = () => setToasts((t) => t.filter((x) => !x.warn));
  // Review mode follows Figma 2.0b: "Role change incomplete", the counts, Undo (puts back the ones that changed) and Show details.
  // Test mode keeps the toast it had in the live study. None updated (Figma 2.4): a negative toast with Show details only.
  const toastFail = (role, total, n, undo) => { const id = Date.now() + Math.random();
    const warn = n >= total && !MVP_UT ? { tone:"negative", title:"Role change failed", body:"We couldn’t update " + mvpMembers(total) + ". Their roles didn’t change." }
      : MVP_UT ? { title:n + " of " + total + " couldn’t be updated", body:"The other " + (total - n) + " now have " + role + "." }
      : { title:"Role change incomplete", body:(total - n) + " of " + mvpMembers(total) + " updated to " + role + ". " + n + (n === 1 ? " needs" : " need") + " review.", undo };
    setToasts((t) => t.filter((x) => !x.warn).concat({ id, warn })); };
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
    setSelMode("mvp"); setKeepSel(false); setBell(false); setPacc(MVP_PERSON_ACCTS0()); setPsel([]); setPbulk(null); setPjob(null);
    mvpNotif(false); setAccess("full");
  };
  const scrollTop = () => { document.querySelectorAll(".hs-appcontent, [data-mvp-scroll]").forEach((c) => { c.scrollTop = 0; }); };
  const goView = (v) => { setView(v); setBulk(null); setSaveModal(false); if (v !== "members") setSel([]); if (v !== "person") { setPsel([]); setPbulk(null); } scrollTop(); };
  const go = (v) => { goView(v); if (v === "flows") { setRow(null); setScr(null); } };
  const openTpl = (id) => { window.__SS_PROPS = { startPage:id, access:"full", reconnectAlert:false, hasPassword:true }; setBulk(null); setTplKey((k) => k + 1); setView("tpl"); };
  const P1 = MVP_P1;
  const acctOf = (id) => MVP_ACCOUNTS.find((a) => a.id === id) || MVP_ACCOUNTS[3];
  // Test mode: each account keeps its own members (the same 500 people to start), and role counts follow what changes.
  const peopleNow = (id) => id === live.current.acct ? live.current.people : (store.current[id] || mvpPeople());
  const peopleFor = (id, fn) => { if (id === live.current.acct) setPeople(fn); else store.current[id] = fn(peopleNow(id)); };
  const bumpCounts = (id, ids, role) => {
    const d = {}; peopleNow(id).forEach((p) => { if (ids.includes(p.id) && p.role !== role) { d[p.role] = (d[p.role] || 0) - 1; d[role] = (d[role] || 0) + 1; } });
    setRoleRows((rs) => rs.map((r) => d[r.name] ? { ...r, count:Math.max(0, r.count + d[r.name]) } : r));
  };
  // Round 2 (14 Oct, test mode): Undo on the bulk success toast puts back the role each person had before (design system, 12 Oct;
  // round 1: P549 gave the wrong role to 48 people with no way back). It skips anyone changed again since.
  const prevRoles = (id, ids, role) => { const m = {}; peopleNow(id).forEach((p) => { if (ids.includes(p.id) && p.role !== role) m[p.id] = p.role; }); return m; };
  const undoBulk = (id, role, prev) => {
    const back = peopleNow(id).filter((p) => prev[p.id] && p.role === role), by = {};
    back.forEach((p) => { (by[prev[p.id]] = by[prev[p.id]] || []).push(p.id); });
    if (MVP_UT) Object.keys(by).forEach((r) => bumpCounts(id, by[r], r));   // review mode doesn't move the roles list counts on apply either
    peopleFor(id, (ps) => ps.map((x) => prev[x.id] && x.role === role ? { ...x, role:prev[x.id] } : x));
    toast("Undone. " + mvpMembers(back.length) + (back.length === 1 ? " has their previous role back" : " have their previous roles back"));
  };
  const undoToast = (msg, id, role, prev) => toast(msg, Object.keys(prev).length ? () => undoBulk(id, role, prev) : null);
  const switchAcct = (id) => {
    const L = live.current; if (id === L.acct) return;
    store.current[L.acct] = L.people; live.current = { ...L, acct:id }; setAcct(id); setPeople(store.current[id] || mvpPeople());
    setSel([]); setLoaded(MVP_LOADED); setListKey((k) => k + 1); setSearch0(""); setPerms0([]); setStat0([]);
  };
  const openAcct = (a) => { switchAcct(a.id); goView("members"); };
  // Show details on the warning toast (and, in test mode, the notification) opens that account with who didn't update. Nothing resets.
  const openResult = () => { dropFail(); const j = live.current.job; if (!j || j.phase !== "result") return; if (j.acct) switchAcct(j.acct); setView("members"); setBulk({ step:"result", role:j.role }); setShellKey((k) => k + 1); scrollTop(); };
  const applied = (withFails) => mvpPeople().map((p, i) => (i < MVP_LOADED && mvpCanChange(p) && (withFails || !MVP_FAIL.includes(p.id))) ? { ...p, role:P1 } : p);
  const firstSel = () => mvpPeople().slice(0, MVP_LOADED).filter(mvpCanChange).map((p) => p.id);
  const allSel = () => mvpPeople().filter(mvpCanChange).map((p) => p.id);   // the 498 who can change (Figma 1.0k, 1.0l)
  // The roles the 48 had before Publisher One (Undo on the toasts).
  const prev48 = (skip) => { const m = {}; mvpPeople().forEach((p) => { if (firstSel().includes(p.id) && p.role !== P1 && !(skip || []).includes(p.id)) m[p.id] = p.role; }); return m; };
  // The MVP applies to all 48 selected (8 Oct lock session). legacy = the cut review flow, which counted the 45 who move.
  const mkJob = (extra, legacy) => { const base = mvpPeople(), items = base.filter((p) => firstSel().includes(p.id)), ids = legacy ? mvpPlan(items, P1).groups.reduce((a, g) => a.concat(g.ids.map((p) => p.id)), []) : items.map((p) => p.id);
    return { role:P1, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail:[], legacy:!!legacy, ...extra }; };
  const startRow = (id) => {
    resetAll(); setRow(id); setScr(null); setNotesOpen(false);
    if (id === "1") { setOutcome("all"); setView("members"); }
    if (id === "1b") openScreen("1.0a");
    if (id === "ps") { setView("person"); }
    if (id === "n") openScreen("n.0");
    if (id === "2") openScreen("2.0");
    if (id === "3") { setView("accounts"); }
    if (id === "4" || id === "5") { setView("roles"); }
    if (id === "6") { setPeople(mvpWithCustom(mvpPeople())); setView("members"); }
    if (id === "cut") openScreen("x.1");
    scrollTop();
  };

  const openScreen = (sid) => {
    resetAll(); scrollTop(); setScr(sid); setRow((mvpScreen(sid) || { row:{ id:null } }).row.id);
    const mem = () => setView("members"), fail = () => setOutcome("fail");
    // Publisher Two in the list at 0 people, as right after 4.2 (3.3, 3.4).
    const withP2 = () => { setRolePerms({ ...MVP_PERMS0(), [MVP_P2]:BR_P1_PERMS.concat("Boost posts") }); setRoleRows(MVP_ROLE_ROWS0().concat(MVP_P2_ROW())); };
    const resultJob = (extra) => mkJob({ done:48, phase:"result", failed:MVP_FAIL, prev:prev48(MVP_FAIL), ...extra });
    // None updated (Figma 2.4, 2.5): every one of the 48 failed and nobody's role changed.
    const noneJob = (extra) => mkJob({ done:48, phase:"result", failed:firstSel(), ...extra });
    // Row 6: custom sets seeded; moved = Bryn and the 8 with exactly his set have Inbox Lead (Figma Exploration 1.2).
    const custom = (moved) => setPeople(mvpWithCustom(mvpPeople()).map((p) => moved && MVP_SET_A_IDS.includes(p.id) ? { ...p, role:MVP_NEW } : p));
    const withNew = (count) => { setRolePerms({ ...MVP_PERMS0(), [MVP_NEW]:MVP_SET_A }); setRoleRows(MVP_ROLE_ROWS0().concat({ id:MVP_NEW, name:MVP_NEW, type:"Custom", desc:mvpNearDesc(MVP_SET_A, MVP_PERMS0()), count })); };
    // Figma 1.0c and 1.0e filter to Editor and show the 5 named Editors (Asha, Chaya, Hana, Ivo, Omar) only; the generated rows
    // that are Editor elsewhere read Limited on these two screens.
    const editors5 = () => mvpPeople().map((p, i) => i >= MVP_NAMED_N && p.role === "Editor" ? { ...p, role:"Limited" } : p);
    const S = {
      "1.0":() => { mem(); setOutcome("all"); setSel(firstSel()); },
      "1.1":() => { mem(); setOutcome("all"); setSel(firstSel()); setBulk({ step:"pick", role:P1 }); },
      "1.2":() => { mem(); setOutcome("all"); setSel(firstSel()); const j = mkJob({}); setJob(isStatic ? { ...j, frozen:true } : j); setBulk({ step:"applying", role:P1 }); },
      // Figma 1.2b: the drawer was closed while it runs, so role changes are paused. Live, it runs on and ends in 1.3.
      "1.2b":() => { mem(); setOutcome("all"); const j = mkJob({}); setJob(isStatic ? { ...j, frozen:true, hold:true } : j); },
      "1.3":() => { mem(); setOutcome("all"); setPeople(applied(true)); undoToast(mvpToastApplied(P1, 48), "a3", P1, prev48()); },
      // Figma 1.0 variants: the bar from these screens on (selMode, keepSel).
      "1.0h":() => { mem(); setSelMode("all"); setSel(firstSel()); },
      "1.0i":() => { mem(); setSelMode("of"); setSel(firstSel()); },
      "1.0j":() => { mem(); setOutcome("all"); setKeepSel(true); setPeople(applied(true)); setSel(firstSel()); undoToast(mvpToastApplied(P1, 48), "a3", P1, prev48()); },
      "1.0k":() => { mem(); setSelMode("all"); setSel(allSel()); },
      "1.0l":() => { mem(); setSelMode("all"); setSel(allSel()); },
      "1.0f":() => { mem(); setSel(firstSel()); },
      "1.0g":() => { mem(); setSel(firstSel()); },
      // Person side: Asha Patel, Facebook Somos and YouTube Somos ticked.
      "p.0":() => { setView("person"); setPsel(["a2", "a3"]); },
      "p.1":() => { setView("person"); setPsel(["a2", "a3"]); setPbulk({ step:"pick", role:P1 }); },
      "p.2":() => { setView("person"); setPsel(["a2", "a3"]); const j = { role:P1, ids:["a2", "a3"] }; setPbulk({ step:"applying", role:P1 }); setPjob(isStatic ? { ...j, frozen:true } : j); later(() => finishPerson(j), MVP_DUR); },
      "p.3":() => { setView("person"); const j = { role:P1, ids:["a2", "a3"] }, prev = { a2:"Limited", a3:"Editor" };
        setPacc(MVP_PERSON_ACCTS0().map((a) => j.ids.includes(a.id) ? { ...a, role:P1 } : a)); setPeople(mvpPeople().map((p) => p.id === MVP_PERSON.id ? { ...p, role:P1 } : p)); personToast(j, prev); },
      "x.1":() => { mem(); setOutcome("all"); setSel(firstSel()); setBulk({ step:"review", role:P1 }); },
      "x.2":() => { mem(); setOutcome("all"); const j = mkJob({}, true); setJob(isStatic ? { ...j, frozen:true } : j); },
      "1.0a":() => { mem(); setSel(firstSel()); },
      "1.0b":() => { mem(); setSel(firstSel()); setLoaded(100); setListKey((k) => k + 1); },
      "1.0c":() => { mem(); setPeople(editors5()); setPerms0(["Editor"]); },
      "1.0d":() => { mem(); setAccess("none"); },
      "1.0e":() => { mem(); setPeople(editors5()); setPerms0(["Editor"]); },
      "2.0":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setNotifOpen(true); },
      "2.1":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob()); setBulk({ step:"result", role:P1 }); },
      "2.2":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob({ phase:"retry", frozen:isStatic })); setBulk({ step:"retry", role:P1 }); },
      "2.3":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); setJob(resultJob({ retries:1 })); setBulk({ step:"result", role:P1 }); },
      // Figma 2.0b: the drawer was closed and 2 didn't update: the warning toast with Undo and Show details.
      "2.0b":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true); const j = resultJob(); setJob(j); toastFail(P1, 48, MVP_FAIL.length, () => undoBulk("a3", P1, j.prev)); },
      // Figma 2.4 and 2.5: nobody was updated.
      "2.4":() => { mem(); setOutcome("none"); mvpNotif(true, mvpNotifRow("none")); setJob(noneJob()); toastFail(P1, 48, 48); },
      "2.5":() => { mem(); setOutcome("none"); mvpNotif(true, mvpNotifRow("none")); setJob(noneJob()); setBulk({ step:"result", role:P1 }); },
      // Figma MVP 6 (n.0 to n.3): the members page as Figma draws it behind each one (2 didn't update), the dot on the bell,
      // then the notification for each outcome.
      "n.0":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true, mvpNotifRow("some")); setBell(true); },
      "n.1":() => { mem(); setOutcome("all"); setPeople(applied(false)); mvpNotif(true, mvpNotifRow("all")); setNotifOpen(true); },
      "n.2":() => { mem(); fail(); setPeople(applied(false)); mvpNotif(true, mvpNotifRow("some")); setNotifOpen(true); },
      "n.3":() => { mem(); setOutcome("none"); setPeople(applied(false)); mvpNotif(true, mvpNotifRow("none")); setNotifOpen(true); },
      "3.0":() => setView("accounts"),
      "3.1":() => setView("roles"),
      "3.2":() => setView("roles"),
      "3.3":() => { setView("roles"); withP2(); },
      "3.4":() => { setView("roles"); withP2(); setDelModal(MVP_P2); },
      "3.5":() => { setView("roles"); toast(mvpToastDeleted(MVP_P2)); },
      "4.0":() => { setCreate({ name:"Publisher Two", from:null, perms:[], desc:"Publisher One permissions, plus boost posts" }); setView("create"); },
      "4.1":() => { setCreate({ name:"Publisher Two", from:P1, perms:BR_P1_PERMS, desc:MVP_P2_DESC }); setView("create"); },
      "4.1a":() => { setCreate({ name:"Publisher One", from:null, perms:[], desc:"" }); setView("create"); },   // Figma 4.1a: no description
      "4.1b":() => { setCreate({ name:"Publisher Two", from:P1, perms:BR_P1_PERMS, desc:MVP_P2_DESC, same:true }); setView("create"); },
      "4.2":() => { setView("roles"); withP2(); toast(mvpToastCreated(MVP_P2)); },
      "5.0":() => setView("roles"),
      "5.1":() => { setEdit({ name:P1, origName:P1, desc:BR_DESC[P1], origDesc:BR_DESC[P1], perms:MVP_EDIT_ON, orig:MVP_EDIT_SAVED }); setView("edit"); },
      "5.2":() => { setEdit({ name:P1, origName:P1, desc:BR_DESC[P1], origDesc:BR_DESC[P1], perms:MVP_EDIT_ON, orig:MVP_EDIT_SAVED }); setView("edit"); setSaveModal(true); },
      "5.3":() => { setView("roles"); setRjob({ name:P1, n:48 }); later(() => { setRjob(null); toast(mvpToastUpdated(P1, 48)); }, MVP_DUR); },
      "5.4":() => { setView("roles"); toast(mvpToastUpdated(P1, 48)); },
      "6.0":() => { mem(); custom(false); },
      // Figma 6.1: the name is typed (Inbox Lead). Figma 6.1a: name and description filled, the Start from menu open on the roles
      // with A person's current permissions at the bottom (picking it opens the member search).
      "6.1":() => { custom(false); setCreate({ name:MVP_NEW, from:null, perms:MVP_SET_A, desc:"", src:"person", person:"p1", lock:true, back:"members" }); setView("create"); },
      "6.1a":() => { custom(false); setCreate({ name:MVP_NEW, from:null, perms:[], desc:mvpNearDesc(MVP_SET_A, MVP_PERMS0()), src:null, person:null }); setView("create"); },
      // Figma Exploration 1.2: Create role on 6.1 lands back on the Members tab; Bryn and the 8 with exactly his set now show
      // Inbox Lead, the 4 one permission away stay Custom, and a toast with no Undo says so.
      "6.2":() => { mem(); custom(true); withNew(MVP_SET_A_IDS.length); toast(mvpToastMatched(MVP_NEW, MVP_SET_A_IDS.length - 1)); },
    };
    (S[sid] || (() => setView("flows")))();
  };
  const lastScreen = R.useRef(sid0);
  R.useLayoutEffect(() => { if (sid0) openScreen(sid0); setReady(true); }, []);
  R.useLayoutEffect(() => { if (isStatic && screen && screen !== lastScreen.current) { lastScreen.current = screen; openScreen(screen); } }, [screen]);
  R.useEffect(() => { if (isStatic || MVP_UT) return undefined; const h = () => { const s = mvpHashScreen(); if (s) openScreen(s); }; window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  // 1.0b in the live prototype: scroll to where the second load starts, so the unticked rows show under the ticked ones.
  // 1.0b (Figma 10/8): the top of the table, header checkbox partly ticked; no scroll to the second load.
  // The notification opens who failed on the account (the link back is a nice to have, not committed).
  R.useEffect(() => {
    if (isStatic) return undefined;
    const h = (e) => {
      // Opening the bell clears its dot (Figma MVP 6.0).
      if (e.target.closest && e.target.closest('[aria-controls="global-nav-notifications-panel"]')) setBell(false);
      const r = e.target.closest && e.target.closest(".nfp-row"); if (!r) return; const lab = r.getAttribute("aria-label") || "";
      if (MVP_UT) { const j = live.current.job; if (j && j.note && lab.includes(j.note)) setTimeout(openResult, 0); return; }
      // Review mode: a live job that ended with failures opens its own result; otherwise the Figma screen (2.1, or 2.5 when none updated).
      const j = live.current.job, failed = /^(Unread\. )?Role change failed on /.test(lab);
      if (!/^(Unread\. )?Role change (incomplete|failed) on /.test(lab)) return;
      if (j && j.phase === "result" && !j.legacy) { setTimeout(openResult, 0); return; }
      setTimeout(() => openScreen(failed ? "2.5" : "2.1"), 0); };
    document.addEventListener("click", h, true); return () => document.removeEventListener("click", h, true);
  }, []);

  const openBulk = () => setBulk({ step:"pick", role:MVP_UT ? null : P1 });
  // MVP 1.1 -> 1.2: Apply goes straight to In progress in the drawer, for everyone selected (no review step).
  const startApply = (items) => {
    const ids = items.map((p) => p.id);
    // Test mode (14 Oct, session P493): Hana Kim and Omar Said fail on the first apply that includes them only, so a fresh
    // apply afterwards works the same as Try again instead of failing for good.
    const fails = MVP_UT ? acct === MVP_UT_FAIL_ACCT && !utFailed : outcome === "fail";
    if (MVP_UT && fails && MVP_FAIL.some((x) => ids.includes(x))) setUtFailed(true);
    dropFail();
    // Review mode, "All fail" (Figma 2.4): nobody is updated.
    const willFail = !MVP_UT && outcome === "none" ? ids.slice() : fails ? MVP_FAIL.filter((x) => ids.includes(x)) : [];
    setJob({ role:bulk.role, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail, acct });
    setBulk({ step:"applying", role:bulk.role });
  };
  // Cut on 8 Oct (screen x.1): the old review's Apply closed the drawer and showed the top banner (screen x.2).
  const startLegacy = (plan) => {
    const ids = plan.groups.reduce((a, g) => a.concat(g.ids.map((p) => p.id)), []);
    dropFail();
    setJob({ role:bulk.role, total:ids.length, done:0, phase:"run", failed:[], retries:0, ids, order:mvpOrder(ids), willFail:outcome === "fail" ? MVP_FAIL.filter((x) => ids.includes(x)) : [], legacy:true });
    setBulk(null); setSel([]);
  };
  // Closing the drawer while it runs: the job keeps going and the page is paused (banner, checkboxes and role menus off) until it ends.
  // Then a toast (everyone updated) or the warning toast with Show details (some didn't) reports back (MVP 2.0).
  const closeApplying = () => { setBulk(null); setSel([]); };
  const closeRun = () => setBulk(null);
  const finish = () => { setBulk(null); setJob(null); };
  const retry = () => { setJob((j) => ({ ...j, phase:"retry" })); setBulk({ step:"retry", role:(job && job.role) || P1 }); };
  const manageRoles = () => { setBulk(null); setSel([]); setPbulk(null); setPsel([]); setView("roles"); scrollTop(); };

  const phase = job && job.phase, frozen = job && job.frozen;
  // While a job runs and the drawer is closed, role changes on the account it runs on are paused (test mode has several accounts; review mode has one).
  // hold: a frozen paused state (the board tile of 1.2b).
  const paused = !!job && !job.legacy && (job.hold || (!isStatic && !frozen)) && (phase === "run" || phase === "retry") && !bulk && (!MVP_UT || job.acct === acct);
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
        const upd = (ps) => ps.map((x) => j.ids.includes(x.id) && !failed.includes(x.id) ? { ...x, role:j.role } : x);
        const prev = prevRoles(j.acct || live.current.acct, j.ids.filter((x) => !failed.includes(x)), j.role);
        if (MVP_UT) { bumpCounts(j.acct, j.ids.filter((x) => !failed.includes(x)), j.role); peopleFor(j.acct, upd); }
        else setPeople(upd);
        // Figma 1.0j (keepSel, the design system’s bulk action pattern): the selection and the bar stay after Change role.
        if (!live.current.keepSel) setSel([]);
        // Review mode, Figma MVP 6: every bulk change sends a notification, whatever the outcome, and the bell gets its dot.
        const kind = !failed.length ? "all" : failed.length >= j.total ? "none" : "some";
        const notify = !MVP_UT && !j.legacy;
        if (notify) { mvpNotif(true, mvpNotifRow(kind, j.role, j.total, failed.length, acctOf(j.acct || live.current.acct).name)); setBell(true); }
        // Everyone updated: the toast (MVP 1.3), whether or not the drawer is still open.
        if (!failed.length) { if (inDrawer) setBulk(null); if (MVP_UT) undoToast(j.role + " applied to " + j.total + " members", j.acct, j.role, prev); else if (j.legacy) toast(j.role + " applied to " + mvpMembers(j.total)); else undoToast(mvpToastApplied(j.role, j.total), j.acct || live.current.acct, j.role, prev); setJob(null); return; }
        // Some failed, drawer still open: who failed, in the drawer (MVP 2.1). Drawer closed: the warning toast and the notification (MVP 2.0).
        if (inDrawer || j.legacy) { setJob({ ...j, done:j.total, phase:"result", failed, prev }); setBulk({ step:"result", role:j.role }); if (!notify) mvpNotif(true); }
        else if (MVP_UT) {
          const a = acctOf(j.acct), note = j.role + " on " + a.name;
          setJob({ ...j, done:j.total, phase:"result", failed, note });
          mvpNotif(true, { title:note, preview:(j.total - failed.length) + " of " + j.total + " updated. " + failed.length + " need a look.", av:a.initials, net:a.network }); setShellKey((k) => k + 1);
          toastFail(j.role, j.total, failed.length);
        }
        // Review mode, drawer closed: Figma 2.0b (some didn't update, with Undo) or 2.4 (none did).
        else { const a = j.acct || live.current.acct; setJob({ ...j, done:j.total, phase:"result", failed, prev }); if (!notify) mvpNotif(true); toastFail(j.role, j.total, failed.length, Object.keys(prev).length ? () => undoBulk(a, j.role, prev) : undefined); }
      } else if (MVP_UT) {
        // Test mode: Try again works for everyone left.
        const prev = prevRoles(j.acct, j.failed, j.role);
        bumpCounts(j.acct, j.failed, j.role); peopleFor(j.acct, (ps) => ps.map((x) => j.failed.includes(x.id) ? { ...x, role:j.role } : x));
        if (live.current.bulk) setBulk(null); undoToast(j.role + " applied to " + mvpMembers(j.failed.length), j.acct, j.role, prev); setJob(null); mvpNotif(false);
      } else {
        // Review mode: it fails again by design. Drawer open: the same list (MVP 2.3). Drawer closed: the warning toast again.
        const b = live.current.bulk;
        setJob({ ...j, phase:"result", retries:j.retries + 1 });
        if (b && b.step === "retry") setBulk({ step:"result", role:j.role }); else { const a = j.acct || live.current.acct; toastFail(j.role, j.total, j.failed.length, j.prev && Object.keys(j.prev).length ? () => undoBulk(a, j.role, j.prev) : undefined); }
        if (!j.legacy) { mvpNotif(true, mvpNotifRow(j.failed.length >= j.total ? "none" : "some", j.role, j.total, j.failed.length, acctOf(j.acct || live.current.acct).name)); setBell(true); }
      }
    }, 150);
    return () => clearInterval(iv);
  }, [phase, frozen]);

  const roleDesc = (r) => (roleRows.find((x) => x.name === r) || {}).desc || BR_DESC[r] || "";
  // Reopening Edit shows what was last saved (14 Oct, session P230: Boost posts looked unticked again after saving).
  const startEdit = (name) => { const d0 = (roleRows.find((r) => r.name === name) || {}).desc || ""; const on = editSaved[name] || (name === P1 ? MVP_EDIT_SAVED : (rolePerms[name] || []).filter((x) => MVP_EDIT_LIST.includes(x))); setEdit({ name, origName:name, desc:d0, origDesc:d0, perms:on, orig:on }); setView("edit"); scrollTop(); };
  const saveEdit = () => { const n = (roleRows.find((r) => r.name === edit.origName) || {}).count || 0; if (n > 0) setSaveModal(true); else confirmSave(); };
  const confirmSave = () => {
    const e = edit, n = (roleRows.find((r) => r.name === e.origName) || {}).count || 0;
    setSaveModal(false); setRolePerms((m) => ({ ...m, [e.name]:e.perms })); setEditSaved((m) => ({ ...m, [e.name]:e.perms })); setRoleRows((rs) => rs.map((r) => r.name === e.origName ? { ...r, name:e.name, id:e.name } : r));
    setView("roles"); scrollTop();
    if (n > 0) { setRjob({ name:e.name, n }); later(() => { setRjob(null); toast(mvpToastUpdated(e.name, n)); }, MVP_DUR); } else toast(mvpToastUpdated(e.name, 0));
  };
  const startCreate = () => { const nm = MVP_UT ? "" : roleRows.some((r) => r.name === "Publisher Two") ? "" : "Publisher Two"; setCreate({ name:nm, from:null, perms:[], desc:"", auto:!!nm }); setView("create"); scrollTop(); };
  const nameTaken = (nm, own) => { const t = (nm || "").trim().toLowerCase(); return !!t && t !== (own || "").toLowerCase() && roleRows.some((r) => r.name.toLowerCase() === t); };
  const pickFrom = (r) => setCreate((c) => ({ ...c, from:r, perms:rolePerms[r] || [], same:false, sameAs:null, src:null, person:null }));
  // Row 6. Save permissions as a role (Members row menu): Create role prefilled with that person's set, Start from read only.
  const saveAsRole = (p) => { setBulk(null); setSel([]); setCreate({ name:"", from:null, perms:p.perms || [], desc:"", src:"person", person:p.id, lock:true, back:"members" }); setView("create"); scrollTop(); };
  // Second entry: Start from, A person's current permissions, then a member search. A person with a role copies that role.
  const pickPerson = (p) => setCreate((c) => ({ ...c, src:"person", from:null, person:p ? p.id : null, perms:p ? (p.role === MVP_CUSTOM ? p.perms : rolePerms[p.role]) || [] : [], same:false, sameAs:null, name:c.auto ? "" : c.name, auto:false }));
  const saveCreate = () => {
    const c = create, base = c.from ? (rolePerms[c.from] || []) : [], add = c.perms.filter((p) => !base.includes(p)), rem = base.filter((p) => !c.perms.includes(p));
    const desc = c.from ? c.from + " permissions" + (add.length ? ", plus " + add.map(mvpLow).join(", ") : "") + (rem.length ? ", without " + rem.map(mvpLow).join(", ") : "") : "Custom permissions";
    // Row 6 (Figma Exploration 1.1 and 1.2): from a person's custom set kept as it is, that person and everyone else on the account
    // with exactly the same set move to the new role when it's created (the back end syncs exact matches, engineering 9 Oct): no review
    // step and no Undo. Change any permission and nobody moves. From the Members row menu it lands back on the Members tab.
    const src = c.person ? people.find((p) => p.id === c.person) : null, kept = !MVP_UT && !!src && src.role === MVP_CUSTOM && mvpSameSet(src.perms, c.perms);
    const moved = kept ? people.filter((p) => p.role === MVP_CUSTOM && mvpSameSet(p.perms, c.perms)).map((p) => p.id) : [];
    const desc2 = src && !c.from ? mvpNearDesc(c.perms, rolePerms) : desc;
    setRolePerms((m) => ({ ...m, [c.name]:c.perms })); setRoleRows((rs) => rs.concat({ id:c.name, name:c.name, type:"Custom", desc:(c.desc || "").trim() || desc2, count:moved.length }));
    if (moved.length) setPeople((ps) => ps.map((p) => moved.includes(p.id) ? { ...p, role:c.name } : p));
    goView(c.back || "roles"); toast(moved.length > 1 ? mvpToastMatched(c.name, moved.length - 1) : mvpToastCreated(c.name));
  };
  const deleteRole = (name) => { setRoleRows((rs) => rs.filter((r) => r.name !== name)); toast(mvpToastDeleted(name)); };
  // Delete (only on for a role nobody has) asks once first (MVP 3.4). Cancel or close keeps the role.
  const askDelete = (name) => setDelModal(name);
  const confirmDelete = () => { const n = delModal; setDelModal(null); if (n) deleteRole(n); };

  // Person side (Figma row MVP person side). Apply goes straight to In progress in the drawer; when it's done the accounts show the
  // role and a toast with Undo confirms it (p.3). YouTube Somos is the account side's account, so Asha's row there changes too.
  const mvpAccts = (n) => n + (n === 1 ? " social account" : " social accounts");
  const personRole = (ids, roleOf) => { setPacc((as) => as.map((a) => ids.includes(a.id) ? { ...a, role:roleOf(a) } : a));
    if (ids.includes("a3")) setPeople((ps) => ps.map((p) => p.id === MVP_PERSON.id ? { ...p, role:roleOf({ id:"a3", role:p.role }) } : p)); };
  const personToast = (j, prev) => toast("Role changed to " + j.role + " on " + mvpAccts(j.ids.length), Object.keys(prev).length ? () => {
    personRole(Object.keys(prev), (a) => prev[a.id]); const k = Object.keys(prev).length; toast("Undone. " + mvpAccts(k) + (k === 1 ? " has its previous role back" : " have their previous roles back")); } : null);
  const finishPerson = (j) => { const prev = {}; (live.current.pacc || []).forEach((a) => { if (j.ids.includes(a.id) && a.role !== j.role) prev[a.id] = a.role; });
    personRole(j.ids, () => j.role); setPsel([]); setPjob(null); setPbulk(null); personToast(j, prev); };
  const startPersonApply = (ids, role) => { const j = { role, ids }; setPjob(j); setPbulk({ step:"applying", role }); later(() => finishPerson(j), MVP_DUR); };
  const A = { screen:scr, isStatic, view, acct:acctOf(acct), openAcct, access, outcome, people, roleOf, sel, setSel, toggle:(id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : s.concat(id)), loaded:scr === "1.0b" ? 100 : loaded,
    search, setSearch, perms, setPerms, stat, setStat, bulk, setBulk, job, paused, roleRows, rolePerms, rjob, edit, setEdit, create, setCreate, saveModal, setSaveModal,
    go, goView, toast, openBulk, startApply, startLegacy, closeApplying, closeRun, finish, retry, manageRoles, roleDesc, startEdit, saveEdit, confirmSave, startCreate, nameTaken, pickFrom, saveCreate, saveAsRole, pickPerson, deleteRole, askDelete, confirmDelete, delModal, closeDelete:() => setDelModal(null),
    selMode, setSelMode, keepSel, bell, pacc, psel, setPsel, togglePsel:(id) => setPsel((s) => s.includes(id) ? s.filter((x) => x !== id) : s.concat(id)), pbulk, setPbulk, pjob, startPersonApply,
    closePerson:() => { setPbulk(null); if (live.current.pbulk && live.current.pbulk.step === "applying") setPsel([]); },
    setPersonRole:(id, r) => { personRole([id], () => r); toast(MVP_PERSON.name + " is now " + r + " on " + acctOf(id).name); },
    openOrg:(kind, data) => setOrgModal({ kind, data }), setRole:(id, r) => { if (MVP_UT) bumpCounts(acct, [id], r); setPeople((ps) => ps.map((p) => p.id === id ? { ...p, role:r } : p)); } };

  const NS = SS_NS();
  if (!NS.SuiteShell || !ready) return null;
  const { SuiteShell, AlertToast, ToggleGroup, Button, Badge } = NS;
  const Page = { members:MVPMembers, accounts:MVPAccounts, roles:MVPRoles, create:MVPCreate, edit:MVPEdit, person:MVPPerson }[view];
  const inShell = view !== "flows" && view !== "tpl";
  // Toasts sit 108 from the top (84 on the person page); review mode drops them 40 lower on the Members tab and the person page,
  // under the tabs, as every Figma frame there has them (1.3, 1.0j, 2.0b, 2.4, p.3, Exploration 1.2). Test mode keeps its place.
  const orgCtx = { teams:SS_TEAMS, members:people.slice(0, 60), accounts:MVP_ACCOUNTS, toast, removeAccount:(a) => { toast(a.name + " removed"); go(MVP_UT ? "accounts" : "flows"); } };
  const AcctPanel = window.AccountPanel;
  // Review mode: the Figma rail (comp-main-nav) ends with Analytics, Notifications, Add member, Add social account and the photo
  // avatar (48, the same Unsplash fill as the social accounts). Test mode keeps the rail it had in the live study.
  const railGlyph = MVP_UT ? <span className="material-symbols-outlined" aria-hidden="true">account_circle</span> : <img className="mvp-rail-av" src={MVP_AVATAR} alt="" />;
  const railAvatar = <button key="account" type="button" className="hs-rail-item is-util" aria-label="Account" title="Account" aria-haspopup="dialog" aria-expanded={acctOpen} aria-controls="global-nav-account-panel" onClick={() => setAcctOpen((o) => !o)} style={{ border:0, background:"transparent", cursor:"pointer" }}>
    <span className="hs-rail-glyph">{railGlyph}</span><span className="hs-rail-label">Account</span></button>;
  const railFig = MVP_UT ? {} : { utilities:MVP_RAIL_UTIL, onSelect:() => toast("Only Social accounts and Asha Patel’s member page are part of this prototype") };
  const railStatic = MVP_UT ? undefined : <span key="account" className="hs-rail-item is-util" aria-label="Account"><span className="hs-rail-glyph">{railGlyph}</span></span>;
  const railProps = isStatic ? { ...(MVP_NOTIF_SCREENS[scr] ? { enableDialogs:true, defaultNotifOpen:true } : {}), ...railFig, avatarSlot:railStatic, onSelect:undefined } : { enableDialogs:true, avatarSlot:railAvatar, defaultNotifOpen:notifOpen, ...railFig };
  const sNotes = scr && mvpScreen(scr);
  return (
    <MVPC.Provider value={A}>
      <div data-flow-screen={scr || ""} data-mvp-bell={bell ? "on" : undefined} style={{ height:isStatic ? "100%" : "100vh", display:"flex", flexDirection:"column", background:"var(--bento-theme-color-bg-app)", position:"relative", overflow:"hidden" }}>
        {!isStatic && !MVP_UT && <div data-mvp-strip="" style={{ flex:"none", minHeight:48, display:"flex", alignItems:"center", flexWrap:"wrap", gap:"var(--bento-space-03)", padding:"0 16px", background:"var(--hs-surface)", borderBottom:"1px solid var(--bento-theme-color-border-subtle, #EBEBEB)" }}>
          <Button variant="ghost" size="sm" icon="arrow_back" onClick={() => go("flows")}>Flows</Button>
          <Button variant="ghost" size="sm" icon="dashboard" onClick={() => { location.href = MVP_BOARD_URL + (scr ? "#step=" + scr : ""); }}>Back to board</Button>
          <strong style={{ font:"var(--hs-type-body-md-b)" }}>Bulk roles MVP</strong>
          <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{scr ? (/^x\./.test(scr) ? "Cut on 8 Oct, screen " + scr : sNotes && sNotes.s.label ? sNotes.s.label + ", screen " + scr : "Screen " + scr) : row ? "Row " + row : "Updated for the 8 Oct lock session"}</span>
          {(row || scr) && <Button variant="secondary" size="sm" icon="replay" onClick={() => scr ? openScreen(scr) : startRow(row)}>Replay</Button>}
          <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"var(--bento-space-03)" }}>
            <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>When it runs</span>
            <ToggleGroup options={[{ id:"all", label:"Everyone updates" }, { id:"fail", label:"2 fail" }, { id:"none", label:"All fail" }]} value={outcome} onChange={setOutcome} />
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
                  <SuiteShell key={"shell" + (MVP_NOTIF_SCREENS[scr] ? "-n" + scr : "") + (MVP_UT ? "-" + shellKey : "")} product="settings" railProps={railProps} drawerProps={{ items:MVP_NAV, value:view === "person" ? "members" : "social-accounts", onSelect:(id) => { if (id === "social-accounts") goView("accounts"); else if (id === "members" && !MVP_UT) goView("person"); else toast(MVP_UT ? "That page isn’t part of this test" : "Only Social accounts and Asha Patel’s member page are part of this prototype"); }, org:SS_ORG, orgs:SS_ORGS, onOrgChange:() => {} }}>
                    <div key={view + (scr || "") + listKey} style={{ ...(MVP_FIG && MVP_FRAMED.includes(view) ? { height:"100%" } : { minHeight:"100%" }), background:"var(--bento-theme-color-bg-app)", display:"flex", flexDirection:"column" }}><Page /></div>
                  </SuiteShell>
                </div>
                {AcctPanel && !isStatic && <AcctPanel open={acctOpen} onClose={() => setAcctOpen(false)} />}
                {bulk && <MVPBulkDrawer key={bulk.step + (scr || "")} />}{pbulk && view === "person" && <MVPPersonDrawer key={"p" + pbulk.step + (scr || "")} />}{saveModal && <MVPSaveModal />}{delModal && <MVPDeleteModal />}
                {orgModal && <div className="hs-overlay" style={{ zIndex:1050 }}><SSOrgModal kind={orgModal.kind} data={orgModal.data} ctx={orgCtx} close={() => setOrgModal(null)} /></div>}
                {toasts.length > 0 && <div className="mvp-toasts" style={{ position:"absolute", top:(view === "person" ? 84 : 108) + (!MVP_UT && (view === "members" || view === "person") ? 40 : 0), right:40, zIndex:1100, display:"flex", flexDirection:"column", gap:8 }}>{toasts.map((t) => t.warn
                  // Figma 2.0b: Undo (tinted, first) and Show details; Figma 2.4: negative, Show details only (tinted). Test mode: Show details.
                  ? <AlertToast key={t.id} tone={t.warn.tone || "warning"} title={t.warn.title} data-mvp-toast={t.warn.tone || "warning"} actions={<React.Fragment>
                      {t.warn.undo && <Button variant="secondary" data-mvp-toast-btn="tint" onClick={() => { setToasts((x) => x.filter((y) => y.id !== t.id)); t.warn.undo(); }}>Undo</Button>}
                      <Button variant={t.warn.tone === "negative" ? "secondary" : "ghost"} size={MVP_UT ? "sm" : undefined} data-mvp-toast-btn={t.warn.tone === "negative" ? "tint" : undefined} style={t.warn.tone === "negative" || t.warn.undo ? undefined : { marginLeft:-12 }} onClick={openResult}>Show details</Button></React.Fragment>} onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.warn.body}</AlertToast>
                  : <AlertToast key={t.id} tone="positive" data-mvp-toast={t.undo ? "undo" : undefined} actions={t.undo ? (MVP_UT ? <Button variant="ghost" size="sm" style={{ marginLeft:-12 }} onClick={() => { setToasts((x) => x.filter((y) => y.id !== t.id)); t.undo(); }}>Undo</Button>
                    : <Button variant="secondary" data-mvp-toast-btn="tint" onClick={() => { setToasts((x) => x.filter((y) => y.id !== t.id)); t.undo(); }}>Undo</Button>) : undefined} onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.msg}</AlertToast>)}</div>}
              </React.Fragment>
            ) : view === "tpl" ? <div style={{ position:"absolute", inset:0 }}><SuiteSettingsApp key={tplKey} /></div> : <div style={{ position:"absolute", inset:0, overflow:"auto" }}><MVPFlows startRow={startRow} openScreen={openScreen} /></div>}
          </div>
          {!isStatic && !MVP_UT && notesOpen && sNotes && <MVPNotesSheet s={sNotes.s} row={sNotes.row} onClose={() => setNotesOpen(false)} shift={!!bulk} />}
        </div>
      </div>
    </MVPC.Provider>
  );
}

const MVP_NOTE_LABEL = { d:"Dev note", f:"From PM or the review", p:"Proposal", n:"Pinned notes" };
// Figma's numbered pinned notes (kind "n", [number, text] pairs): the red title, then each number in a red dot and its text.
function MVPPinned({ n, compact, big }) {
  const body = big ? "400 16px/24px var(--bento-theme-font-families-primary)" : compact ? "var(--hs-type-body-sm)" : "var(--hs-type-body-md)";
  return <div data-mvp-note="n" style={{ padding:big ? "16px 18px" : compact ? 12 : 16, borderRadius:8, background:"var(--bento-theme-color-bg-surface-recessed)", display:"flex", flexDirection:"column", gap:big ? 12 : 8 }}>
    <span style={{ font:big ? "600 14px/20px var(--bento-theme-font-families-primary)" : "var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-negative)" }}>{n[2] || MVP_NOTE_LABEL.n}</span>
    {n[1].map(([k, t]) => <span key={k} style={{ display:"flex", alignItems:"flex-start", gap:big ? 12 : 8 }}>
      <span aria-label={"Pin " + k} style={{ flex:"none", minWidth:big ? 22 : 20, height:big ? 22 : 20, marginTop:big ? 1 : 0, padding:"0 4px", boxSizing:"border-box", borderRadius:999, background:"var(--bento-theme-color-icon-negative)", color:"var(--bento-theme-color-text-inverse)", font:"700 12px/" + (big ? "22px" : "20px") + " var(--bento-theme-font-families-primary)", textAlign:"center" }}>{k}</span>
      <span style={{ font:body, color:"var(--bento-theme-color-text-base)" }}>{t}</span></span>)}</div>;
}
// Dev notes look like the Figma "Dev note" component: grey card, a small grey "Dev note" chip, then the text. Figma's
// Proposal notes are the same component with the chip reading Proposal.
function MVPNote({ n, compact }) {
  if (n[0] === "n") return <MVPPinned n={n} compact={compact} />;
  const kind = n[0], label = n[2] || MVP_NOTE_LABEL[kind], prop = kind === "p" && !!n[2], dev = kind === "d" || (kind === "p" && !n[2]);
  return <div data-mvp-note={kind} style={{ padding:compact ? 12 : 16, borderRadius:8, border:dev ? "0" : "1px solid " + (prop ? "var(--bento-theme-color-icon-warning)" : "var(--bento-theme-color-border-subtle, #EBEBEB)"), background:dev ? "var(--bento-theme-color-bg-surface-recessed)" : prop ? "var(--hs-bg-warning)" : "var(--hs-surface)", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:dev ? 8 : 4 }}>
    <span style={dev ? { font:"var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-base)", background:"var(--bento-theme-color-bg-surface-intense)", borderRadius:4, padding:"2px 8px" } : { font:"var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-subtle)" }}>{label}</span>
    <span style={{ font:compact ? "var(--hs-type-body-sm)" : "var(--hs-type-body-md)", color:"var(--bento-theme-color-text-base)" }}>{n[1]}</span></div>;
}
function MVPNotesSheet({ s, row, onClose, shift }) {
  const { IconButton } = SS_NS();
  return <aside data-mvp-notes="" style={{ position:"absolute", right:shift ? 400 : 0, top:0, width:320, maxHeight:"100%", overflow:"auto", zIndex:1200, padding:16, boxSizing:"border-box", background:"var(--hs-surface)", borderLeft:"1px solid var(--bento-theme-color-border-subtle, #EBEBEB)", boxShadow:"var(--bento-theme-elevation-shadow-dialog)", display:"flex", flexDirection:"column", gap:8 }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><h2 style={ssTitle(18, 24)}>{s.label ? s.label + " (" + s.id + ")" : "MVP " + s.id}</h2><IconButton icon="close" variant="ghost" size="sm" aria-label="Close notes" onClick={onClose} /></div>
    <span style={mvpStrong}>{s.caption}</span><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{row.title}</span>
    {s.notes.map((n, i) => <MVPNote key={i} n={n} compact />)}</aside>;
}

// The groups and bullets as the Figma card has them (no counts).
function MVPCardView({ wide }) {
  return <div data-mvp-card="" style={{ display:"grid", gridTemplateColumns:wide ? "repeat(3, minmax(0, 1fr))" : "1fr", gap:24 }}>
    {MVP_CARD.groups.map((g) => <div key={g.title} style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <strong style={{ font:"var(--hs-type-body-lg-b, var(--hs-type-body-md-b))", color:"var(--bento-theme-color-text-base)" }}>{g.title}</strong>
      <ul style={{ margin:0, paddingLeft:20, display:"flex", flexDirection:"column", gap:6 }}>{g.items.map((t) => <li key={t} style={{ font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-base)" }}>{t}</li>)}</ul></div>)}
  </div>;
}

function MVPFlows({ startRow, openScreen }) {
  const { Button, Badge, Divider } = SS_NS();
  const tone = { "In the MVP":"positive", "Open question":"warning" }, mvp = MVP_ROWS.filter((r) => !r.cut && !r.explore);
  return (
    <div data-bento-not-product="" style={{ maxWidth:1040, margin:"0 auto", padding:"40px 32px 64px", boxSizing:"border-box", fontFamily:"var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>
      <h1 style={ssTitle(32, 40)}>Bulk roles MVP</h1>
      <p style={{ ...ssBody, marginTop:8, maxWidth:720 }}>The MVP from the Figma “Bulk Roles MVP 10/8”, locked on 8 Oct: no review step, Apply goes straight to In progress in the drawer, and a notification says how it went. {mvp.length} rows and {mvp.reduce((k, r) => k + r.screens.length, 0)} screens on the Suite Settings shell, plus an exploration from the 9 Oct customer check-in (row 6) and the screens cut on 8 Oct. 50 members load at a time; Dar Khan and Mateo Rossi have Unlimited access, so the header checkbox ticks 48. Start a row below, or open the board to jump to any screen.</p>
      <div style={{ marginTop:16, display:"flex", gap:8 }}><Button variant="primary" size="sm" icon="dashboard" onClick={() => { location.href = MVP_BOARD_URL; }}>Open the flow board</Button></div>
      {MVP_ROWS.map((r) => (
        <section key={r.id} style={{ marginTop:32 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, padding:"8px 0" }}>
            <div style={{ flex:1 }}><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{r.label || "Row " + r.id}</span><div style={{ ...ssTitle(22, 28) }}>{r.title}</div>{r.summary && <span style={mvpSub}>{r.summary}</span>}</div>
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
Object.assign(window, { MVPApp, MVPScreen, MVPNote, MVPPinned, MVPCardView, MVP_BOARD_URL });

(function mvpMount() {
  const el0 = document.getElementById("root");
  if (!el0 || el0.getAttribute("data-mvp-app") === "off") return;
  const ready = () => window.BentoHootsuiteDesignSystem_a1ac47 && window.BentoHootsuiteDesignSystem_a1ac47.SuiteShell && window.MVPMembers && window.MVPBulkDrawer && window.SuiteSettingsApp;
  const start = () => { const el = document.getElementById("root"); if (!el || el.__mvpMounted) return; el.__mvpMounted = true; try { ReactDOM.createRoot(el).render(<MVPApp />); } catch (e) { el.__mvpMounted = false; console.error("Bulk roles MVP mount: " + e); } };
  const t0 = Date.now(); let warned = false;
  const iv = setInterval(() => { if (ready()) { clearInterval(iv); start(); } else if (!warned && Date.now() - t0 > 25000) { warned = true; console.error("Bulk roles MVP: bundle did not expose SuiteShell."); } }, 100);
})();
