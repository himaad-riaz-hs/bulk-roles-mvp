// Suite Settings — app: routing, shared state, org modals, connection flow, toasts.
const SS_PAGE_TO_DRAWER = { account: "social-accounts", roles: "social-accounts", member: "members", team: "teams", "team-defaults": "teams" };
const SS_PAGES = {
  profile: SSProfile, preferences: SSPreferences, "sign-in-security": SSSecurity, notifications: SSNotifications,
  overview: SSOverview, teams: SSTeams, members: SSMembers, "social-accounts": SSSocialAccounts, "org-settings": SSOrgSettings,
  "plan-billing": SSBilling, sso: SSSso, tags: SSTags, campaigns: SSCampaigns, "link-settings": SSLinkSettings, "suspended-posts": SSSuspended,
  account: SSSocialAccount, member: SSMember, team: SSTeam, "team-defaults": SSTeamDefaults, roles: SSRolesPage,
};
const ssProps = () => window.__SS_PROPS || {};

function SSOrgModal({ kind, data, ctx, close }) {
  const { Button, Input, Checkbox } = SS_NS();
  const [v, setV] = React.useState({});
  const [picked, setPicked] = React.useState([]);
  const [q, setQ] = React.useState("");
  const togg = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.concat(id)));
  const cancel = <Button variant="secondary" onClick={close}>Cancel</Button>;
  const list = (items, label) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-03)", maxHeight: 320, overflow: "auto" }}>
      {items.map((it) => <Checkbox key={it.id} checked={picked.includes(it.id)} onChange={() => togg(it.id)} label={label(it)} />)}
    </div>
  );
  const target = data && data.target;
  if (kind === "assign-teams")
    return <SSModal title={"Assign " + target + " to teams"} onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!picked.length} onClick={() => { ctx.toast(target + " assigned to " + picked.length + (picked.length === 1 ? " team" : " teams")); close(); }}>Assign</Button></React.Fragment>}>
      {list(ctx.teams, (t) => t.name)}</SSModal>;
  if (kind === "assign-members" || kind === "assign-accounts") {
    const isM = kind === "assign-members";
    const src = (isM ? ctx.members : ctx.accounts).filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
    const role = v.role || "Editor";
    const { SearchInput } = SS_NS();
    return <SSModal title={isM ? "Assign members to " + target : "Assign social accounts to " + target} size="lg" onClose={close}
      actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!picked.length} onClick={() => { ctx.toast(picked.length + (isM ? " members" : " social accounts") + " assigned to " + target + " as " + role); close(); }}>Assign</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        <SearchInput placeholder={isM ? "Search for members" : "Search for social accounts"} value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} />
        {list(src, (x) => x.name)}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-03)" }}><span style={ssBody}>Permissions</span><SSRoleTrigger value={role} options={SS_ROLE_NAMES} onChange={(r) => setV({ role: r })} /></div>
      </div></SSModal>;
  }
  if (kind === "invite") {
    const emails = (v.emails || "").split(/[\s,]+/).filter(Boolean), ok = emails.length > 0 && emails.every((e) => /.+@.+\..+/.test(e));
    return <SSModal title="Invite members" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!ok} onClick={() => { ctx.invite(emails); close(); }}>Send invites</Button></React.Fragment>}>
      <SSField label="Email addresses" hint="Separate addresses with a comma. Each invite holds a seat until it is accepted."><Input placeholder="name@somos.com" value={v.emails || ""} onChange={(e) => setV({ emails: e.target.value })} /></SSField></SSModal>;
  }
  if (kind === "create-team" || kind === "rename-team" || kind === "create-role" || kind === "rename-org" || kind === "add-domain") {
    const cfg = {
      "create-team": ["Create team", "Team name", "", "Create team"],
      "rename-team": ["Rename team", "Team name", data && data.team && data.team.name, "Save"],
      "create-role": ["Create role", "Role name", "", "Create role"],
      "rename-org": ["Edit organization name", "Organization name", ctx.org, "Save"],
      "add-domain": ["Add domain", "Domain", "", "Add domain"],
    }[kind];
    const val = v.n ?? cfg[2] ?? "";
    const done = () => {
      const n = val.trim();
      if (kind === "create-team") ctx.createTeam(n);
      if (kind === "rename-team") { ctx.updateTeam(data.team.id, { name: n }); ctx.toast("Team renamed to " + n); }
      if (kind === "create-role") ctx.createRole(n);
      if (kind === "rename-org") { ctx.setOrg(n); ctx.toast("Organization name updated"); }
      if (kind === "add-domain") ctx.toast(n + " added. Add the DNS record we emailed you to verify it.");
      close();
    };
    return <SSModal title={cfg[0]} onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!val.trim()} onClick={done}>{cfg[3]}</Button></React.Fragment>}>
      <SSField label={cfg[1]}><Input autoFocus value={val} placeholder={kind === "add-domain" ? "links.somos.com" : undefined} onChange={(e) => setV({ n: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter" && val.trim()) done(); }} /></SSField></SSModal>;
  }
  if (kind === "remove-account")
    return <SSModal title={"Remove " + data.account.name + "?"} onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" onClick={() => { ctx.removeAccount(data.account); close(); }}>Remove</Button></React.Fragment>}>
      <p style={ssBody}>Scheduled posts for this social account won't publish, and everyone assigned to it loses access. You can connect it again later.</p></SSModal>;
  return null;
}

/* Connection flow — the kit's own ConnectSocialAccountModal → NetworkAuthStep → ConnectionOutcomeModal (+ TakeOwnershipConfirm). */
function SSConnectFlow({ flow, setFlow, ctx }) {
  const NS = SS_NS();
  const { ConnectSocialAccountModal, NetworkAuthStep, ConnectionOutcomeModal, TakeOwnershipConfirm } = NS;
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  if (!flow) return null;
  const close = () => {
    clearTimeout(timer.current);
    const got = (flow.results || []).filter((r) => r.status === "connected");
    if (flow.step === "done" && got.length) ctx.addAccounts(flow.network, got);
    setFlow(null);
  };
  const slug = ctx.org.toLowerCase().split(" ")[0];
  const results = () => [
    { handle: "@" + slug + ".shop", initials: "SS", status: "connected" },
    { handle: "@" + slug + ".studio", initials: "SS", status: "connected" },
    { handle: "@" + slug + ".club", initials: "SC", status: "owned" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }} data-ss-connect-flow="">
      {flow.step === "entry" && <ConnectSocialAccountModal organizations={SS_ORGS} org={ctx.org} onOrgChange={ctx.setOrg} onSelectNetwork={(k) => setFlow({ step: "auth", network: k })} onClose={close} />}
      {flow.step === "auth" && <NetworkAuthStep network={flow.network} orgName={ctx.org} step="auth" onBack={() => setFlow({ step: "entry" })} onClose={close}
        onContinue={() => { setFlow({ ...flow, step: "waiting" }); timer.current = setTimeout(() => setFlow((f) => f && { ...f, step: "done", results: results() }), 1600); }} />}
      {(flow.step === "waiting" || flow.step === "done") && <ConnectionOutcomeModal network={flow.network} orgName={ctx.org} results={flow.results} state={flow.step === "waiting" ? "waiting" : "done"}
        onClose={close} onConnectAnother={() => { const got = (flow.results || []).filter((r) => r.status === "connected"); if (got.length) ctx.addAccounts(flow.network, got); setFlow({ step: "entry" }); }}
        onTakeOwnership={(r) => setFlow({ ...flow, confirm: r })} />}
      {flow.confirm && <TakeOwnershipConfirm network={flow.network} account={flow.confirm} onCancel={() => setFlow({ ...flow, confirm: null })}
        onConfirm={(acct) => setFlow({ ...flow, confirm: null, results: flow.results.map((r) => (r.handle === acct.handle ? { ...r, status: "connected", movedIn: true } : r)) })} />}
    </div>
  );
}

function SuiteSettingsApp() {
  const NS = SS_NS();
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { const h = () => force(); window.addEventListener("ss-props", h); return () => window.removeEventListener("ss-props", h); }, []);
  const P = ssProps();
  const [route, setRoute] = React.useState(() => ({ page: P.startPage || "social-accounts", tab: P.startPage === "account" ? "members" : undefined, id: P.startPage === "account" ? "a3" : undefined }));
  React.useEffect(() => { if (P.startPage) setRoute({ page: P.startPage, id: P.startPage === "account" ? "a3" : P.startPage === "member" ? "m1" : undefined, tab: P.startPage === "account" ? "members" : undefined }); }, [P.startPage]);
  const [org, setOrg] = React.useState(SS_ORG);
  const [accounts, setAccounts] = React.useState(ssBuildAccounts);
  const [members, setMembers] = React.useState(ssBuildMembers);
  const [teams, setTeams] = React.useState(SS_TEAMS);
  const [roles, setRoles] = React.useState(SS_ROLES);
  const [me, setMe] = React.useState({ ...SS_ME, photo: false });
  const [twoStep, setTwoStep] = React.useState(true);
  const [pw, setPw] = React.useState(null);
  const [billing, setBilling] = React.useState({ plan: "Advanced", cycle: "annual", seats: 50, card: "8880", expiry: "04 / 28" });
  const [modal, setModal] = React.useState(null);
  const [flow, setFlow] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [alertDismissed, setAlertDismissed] = React.useState(false);
  const scroller = React.useRef(null);

  const toast = (msg) => { const id = Date.now() + Math.random(); setToasts((t) => t.concat({ id, msg })); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000); };
  const go = (r) => { setRoute(r); setModal(null); const c = document.querySelector(".hs-appcontent"); if (c) c.scrollTop = 0; };
  const ctx = {
    go, toast, org, setOrg: (o) => { setOrg(o); }, me, setMe, accounts, members, teams, roles, billing, setBilling,
    twoStep, setTwoStep, hasPassword: pw ?? (P.hasPassword !== false), setHasPassword: setPw,
    limited: P.access === "limited",
    openModal: (kind, data) => setModal({ kind, data }),
    openConnect: (network) => setFlow(typeof network === "string" ? { step: "auth", network } : { step: "entry" }),
    confirmRemove: (a) => setModal({ kind: "remove-account", data: { account: a } }),
    removeAccount: (a) => { setAccounts((x) => x.filter((y) => y.id !== a.id)); toast(a.name + " removed"); if (route.page === "account") go({ page: "social-accounts" }); },
    removeMember: (m) => { setMembers((x) => x.filter((y) => y.id !== m.id)); toast(m.name + " removed from " + org); },
    invite: (emails) => { setMembers((x) => emails.map((e, i) => ({ id: "inv" + Date.now() + i, name: e.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email: e, added: "Oct 5, 2026", perm: "Member", accounts: 0, pending: true, initials: ssInitials(e.split("@")[0]) })).concat(x)); toast(emails.length + (emails.length === 1 ? " invite sent" : " invites sent")); },
    createTeam: (n) => { const t = { id: "t" + Date.now(), name: n, members: 0, accounts: 0, role: "Editor" }; setTeams((x) => x.concat(t)); toast("Team “" + n + "” created"); },
    updateTeam: (id, patch) => setTeams((x) => x.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    deleteTeam: (t) => { setTeams((x) => x.filter((y) => y.id !== t.id)); toast("Team “" + t.name + "” deleted"); },
    createRole: (n) => { setRoles((x) => x.concat({ id: "r" + Date.now(), name: n, type: "Custom", perms: "Custom permissions", people: 0 })); toast("Role “" + n + "” created"); },
    addAccounts: (network, got) => { setAccounts((x) => got.map((r, i) => ({ id: "new" + Date.now() + i, name: r.handle, network, added: "Oct 5, 2026", status: "connected", initials: r.initials })).concat(x)); toast(got.length + (got.length === 1 ? " social account connected" : " social accounts connected")); },
  };

  if (!NS.SuiteShell) return null;
  const { SuiteShell, AlertBanner, AlertToast, Hyperlink } = NS;
  const Page = SS_PAGES[route.page] || SSSocialAccounts;
  const drawerValue = SS_PAGE_TO_DRAWER[route.page] || route.page;
  const showAlert = P.reconnectAlert && !alertDismissed;
  const headerBottom = () => { const h = document.querySelector("[data-ss-page-header]"); return h ? Math.round(h.getBoundingClientRect().bottom) + 16 : 81; };
  const banner = showAlert ? (
    <AlertBanner tone="warning" title="Reconnection Required" onDismiss={() => setAlertDismissed(true)}>
      YouTube Somos needs to be reconnected. <Hyperlink href="#" onClick={(e) => { e.preventDefault(); setFlow({ step: "auth", network: "youtube" }); }}>Reconnect</Hyperlink>
    </AlertBanner>
  ) : null;

  return (
    <React.Fragment>
      <SuiteShell product="settings" banner={banner}
        drawerProps={{ value: drawerValue, onSelect: (id) => go({ page: id }), org, orgs: SS_ORGS.map((o, i) => (i === 0 ? org : o)), onOrgChange: setOrg }}>
        <div ref={scroller} key={route.page + (route.id || "")} style={{ minHeight: "100%", background: "var(--bento-theme-color-bg-app)", display: "flex", flexDirection: "column" }} data-ss-page={route.page}>
          <Page ctx={ctx} id={route.id} tab={route.tab} />
        </div>
      </SuiteShell>
      {modal && (["edit-name", "edit-email", "delete-account", "password", "two-step", "change-plan", "change-cycle", "seats", "change-card", "billing-details"].includes(modal.kind)
        ? <SSAccountModal kind={modal.kind} ctx={ctx} close={() => setModal(null)} />
        : <SSOrgModal kind={modal.kind} data={modal.data} ctx={ctx} close={() => setModal(null)} />)}
      <SSConnectFlow flow={flow} setFlow={setFlow} ctx={ctx} />
      {toasts.length > 0 && (
        <div className="hs-toast-region" style={{ top: headerBottom() }} data-ss-toasts="">
          {toasts.map((t) => <AlertToast key={t.id} tone="positive" onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.msg}</AlertToast>)}
        </div>
      )}
    </React.Fragment>
  );
}

(function ssMount() {
  const ready = () => window.BentoHootsuiteDesignSystem_a1ac47 && window.BentoHootsuiteDesignSystem_a1ac47.SuiteShell;
  const start = () => {
    const el = document.getElementById("root");
    if (!el || el.__ssMounted) return;
    el.__ssMounted = true;
    ReactDOM.createRoot(el).render(<SuiteSettingsApp />);
  };
  if (ready()) start();
  else { const t0 = Date.now(); const iv = setInterval(() => { if (ready()) { clearInterval(iv); start(); } else if (Date.now() - t0 > 20000) { clearInterval(iv); console.error("Suite Settings: _ds_bundle.js did not expose SuiteShell. Never falling back to a hand-rolled shell."); } }, 50); }
})();
