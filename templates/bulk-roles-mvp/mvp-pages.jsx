// Bulk roles MVP, pages inside the Suite Settings shell. Built from Suite Settings parts (SS*), the full flow's
// shared UI (BRDrawer, BRBulkBar, BRBarBtn, BRPop, BRFootBar, BRRoleRadios from ../bulk-roles/br-ui.jsx) and bundle components.
const MVPC = React.createContext(null);
// Production Settings > Members, measured 8 Oct 2026 (read only): body rows 72.7 = cell padding 12 16 + 48 content +
// 1px border; header 56.7 (16/600, padding 16); panel padding 24, no border, 40 in from the content edge and below the
// entity header; search 402 x 48; filter chips 40 tall, 24 apart; permission trigger 40 tall, padding 8 16, disabled
// fill #F7F8F9 (grey-100). Table rows, header and in-table option triggers come from the kit (.hs-table, kit change
// approved by design 8 Oct); this file only keeps the page-level spacing below (content 40, search, chips, panel).
// Figma "Bulk Roles MVP 10/8" frame specs (8 Oct, design: align everything like Figma). Scoped to the MVP, kit untouched.
const MVP_CSS = "[data-mvp-stage] :has(>.hs-bulk-bar){align-items:flex-end !important}[data-mvp-stage] .hs-drawer-footer{height:64px;padding:12px 24px;justify-content:flex-end}[data-mvp-stage] .hs-drawer-footer>div{gap:8px}[data-mvp-stage] .hs-drawer-body{padding:16px 24px}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-role-list]){display:flex;flex-direction:column;overflow:hidden}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-role-list])>*{flex:none}[data-mvp-stage] [data-mvp-role-list]{flex:1 1 auto !important;min-height:0 !important;max-height:none !important}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-applying]){display:flex;flex-direction:column}[data-mvp-stage] .hs-org-trigger{display:none !important}[data-mvp-stage] :has(>.mvp-form-page){background:var(--bento-system-sys-neutral-alt-200,#f4f5f6) !important}.mvp-form-page input.hs-input,.mvp-form-page .hs-select{height:48px;box-sizing:border-box}[data-mvp-role-list] [role=radio]{padding:12px 0}.mvp-acct *{font-weight:400 !important}[data-mvp-stage] .hs-rail{width:64px;padding:0 0 12px}[data-mvp-stage] .hs-rail-brand{height:68px;width:56px;align-items:center;justify-content:center;box-sizing:border-box}[data-mvp-stage] .hs-rail-group{gap:8px}[data-mvp-stage] .hs-rail-item{height:48px;min-width:48px;justify-content:center}[data-mvp-stage] .hs-rail-label{display:none}[data-mvp-stage] .hs-navdrawer-orgwrap{display:none}[data-mvp-stage] .hs-navdrawer-orgwrap+.hs-navdrawer-body,[data-mvp-stage] .hs-navdrawer-body{padding-top:0}[data-mvp-stage] .hs-header--entity{height:132px;min-height:132px}[data-mvp-stage] .hs-header--entity:not(:has(.hs-header-meta)){height:88px;min-height:88px}[data-mvp-stage] .hs-header--entity .hs-header-title{font-size:26px;line-height:32px}[data-mvp-stage] .hs-header-entity{gap:12px}[data-mvp-stage] .hs-header-entity-text{gap:2px}[data-mvp-stage] .hs-header--entity .hs-header-meta{line-height:24px}[data-mvp-stage] .hs-header-entity .hs-avatar{width:40px !important;height:40px !important;min-width:40px;font-size:14px !important}[data-mvp-stage] .hs-header-entity .hs-avatar{flex:none}[data-mvp-stage] .hs-header-entity>span:has(.hs-avatar){width:40px;height:40px;flex:none;transform:none !important;margin:0 !important}[data-mvp-stage] .hs-header-entity>span>span:has(.hs-avatar){width:40px;height:40px}[data-mvp-stage] .hs-header+div:has(>.hs-tabs){height:56px !important;padding:8px 24px !important;box-sizing:border-box;background:var(--hs-surface)}[data-mvp-stage] :has(>.mvp-content){background:var(--bento-system-sys-neutral-alt-200,#f4f5f6) !important}[data-mvp-stage] .mvp-content{background:var(--bento-system-sys-neutral-alt-200,#f4f5f6)}.mvp-content .hs-panel{box-shadow:none;gap:24px}.mvp-content .hs-panel>div>h2:first-child{font-size:22px !important;line-height:32px !important}.mvp-content .hs-table thead th{height:56px}.mvp-content .hs-table tbody td{padding-top:0;padding-bottom:0;height:56px;box-sizing:border-box}.mvp-content .hs-input.mvp-search48{height:40px;max-width:310px}"
  + ".mvp-members tbody tr:has(.hs-check.is-on){background:var(--bento-component-table-selected-fill)}"
  + ".mvp-tip .hs-tooltip{left:-8px;transform:none;white-space:nowrap;max-width:none}.mvp-tip--on .hs-tooltip{opacity:1}"
  + ".mvp-tip--left .hs-tooltip{left:auto;right:calc(100% + 16px);top:50%;bottom:auto;transform:translateY(-50%);margin:0}"
  + ".mvp-filter-opt{display:flex;align-items:center;gap:var(--bento-space-03);width:100%}.mvp-filter-opt>span:nth-child(2){flex:1;text-align:left}";
const MVPStyle = () => <style>{MVP_CSS}</style>;
// Figma 10/8 sortable headers carry a caret (arrow_drop_down), not the kit's unfold_more.
function MVPSort({ label, k, sort, setSort }) {
  const dir = sort && sort.k === k ? sort.dir : undefined;
  return (
    <button type="button" className="hs-th hs-th--sortable" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}
      onClick={() => setSort({ k, dir: dir === "asc" ? "desc" : "asc" })}>
      <span>{label}</span>
      <span className="material-symbols-outlined" aria-hidden="true">{dir === "asc" ? "arrow_drop_up" : "arrow_drop_down"}</span>
    </button>
  );
}
const mvpSub = { font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-subtle)", margin:0 };
const mvpStrong = { font:"var(--hs-type-body-md-b)", color:"var(--bento-theme-color-text-base)" };

// Grows the loaded rows by `step` when the sentinel nears the bottom of the scrolling content. `start` presets it.
function useMVPInfinite(total, step, resetKey, start) {
  const [count, setCount] = React.useState(start || step);
  const sentinel = React.useRef(null);
  const first = React.useRef(true), busy = React.useRef(false), timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => { if (first.current) { first.current = false; return; } clearTimeout(timer.current); busy.current = false; setCount(step); }, [resetKey]);
  React.useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= total) return undefined;
    const root = el.closest(".hs-appcontent");
    if (!root) return undefined;
    // like production: reaching the end shows the spinner, the next page arrives a moment later
    const check = () => { if (busy.current) return; const s = el.getBoundingClientRect(), r = root.getBoundingClientRect(); if (s.top < r.bottom + 120) { busy.current = true; timer.current = setTimeout(() => { busy.current = false; setCount((c) => Math.min(total, c + step)); }, 900); } };
    root.addEventListener("scroll", check, { passive:true });
    return () => root.removeEventListener("scroll", check);
  }, [count, total]);
  const { Spinner } = SS_NS();
  const footer = count < total ? <div ref={sentinel} data-mvp-sentinel="" style={{ display:"flex", justifyContent:"center", padding:"var(--bento-space-04)" }}>{Spinner ? <Spinner /> : null}</div> : null;
  return [Math.min(count, total), footer, setCount];
}

// Permissions filter with the custom roles listed after the system ones, each labelled Custom (MVP 1.0e).
function MVPFilterChip({ label, options, value, onChange, custom, initialOpen }) {
  const { ChipFilter, DropdownMenuItem, DropdownMenuSeparator } = SS_NS();
  const sel = value || [];
  return (
    <BRPop align="left" width={280} initialOpen={initialOpen} trigger={(open, toggle) => <ChipFilter label={label} open={open} selected={sel.length > 0} count={sel.length || undefined} onClick={toggle} />}>
      {(close) => <React.Fragment>
        {options.map((o) => <DropdownMenuItem key={o} role="menuitemcheckbox" aria-checked={sel.includes(o)} onClick={() => onChange(sel.includes(o) ? sel.filter((x) => x !== o) : sel.concat(o))}>
          <span className="mvp-filter-opt"><span className={"hs-check" + (sel.includes(o) ? " is-on" : "")} aria-hidden="true" /><span>{o}</span>{custom && custom.includes(o) && <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>Custom</span>}</span></DropdownMenuItem>)}
        {sel.length > 0 && <DropdownMenuSeparator />}
        {sel.length > 0 && <DropdownMenuItem icon="close" onClick={() => { onChange([]); close(); }}>Clear filter</DropdownMenuItem>}
      </React.Fragment>}
    </BRPop>
  );
}

// Content column for the org pages: 40 in from the content edge, like production (SSContent uses 24).
function MVPContent({ children, pad }) {
  return <div className="mvp-content" style={{ padding:pad != null ? pad : "calc(var(--bento-theme-spacing-05) + var(--bento-theme-spacing-04))", boxSizing:"border-box", display:"flex", flexDirection:"column", gap:"var(--bento-theme-spacing-05)" }}>{children}</div>;
}
// Toolbar as production: search 402 x 48, filter chips 24 apart (SSToolbar uses 310 x 40 and 16).
function MVPToolbar({ placeholder, search, setSearch, children }) {
  const { SearchInput } = SS_NS();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"var(--bento-theme-spacing-04)", flexWrap:"wrap" }}>
      <div style={{ width:402, maxWidth:"100%" }}><SearchInput className="mvp-search48" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} /></div>
      <div style={{ marginLeft:"auto", display:"flex", gap:"var(--bento-theme-spacing-05)" }}>{children}</div>
    </div>
  );
}

// A row that can't be selected (design system's bulk action pattern, 8 Oct): the checkbox is "soft disabled", meaning
// aria-disabled and still focusable, so the tooltip with the reason shows on hover and on keyboard focus. The reason is
// also in the row (the role reads Unlimited). When the viewer can't edit at all (MVP 1.0d) the checkboxes are hidden.
function MVPSoftCheck({ id, label, tip, on }) {
  const tid = "mvp-tip-" + id;
  return <span className={"hs-tooltip-wrap mvp-tip" + (on ? " mvp-tip--on" : "")} data-mvp-soft-disabled="">
    <span className="hs-check is-disabled" role="checkbox" aria-checked="false" aria-disabled="true" tabIndex={0} aria-label={label} aria-describedby={tid} style={{ cursor:"not-allowed" }} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") e.preventDefault(); }} />
    <span id={tid} className="hs-tooltip hs-tooltip--top" role="tooltip">{tip}</span></span>;
}

// Role cell: the Bento option trigger (comp-option-trigger in the Figma MVP frames: 40 tall, padding 8 16, 16/600,
// transparent fill, caret), or a greyed one for Unlimited admins.
function MVPRoleCell({ p, onChange }) {
  const { OptionTrigger, DropdownMenuItem } = SS_NS();
  if (p.role === MVP_UNL) return <OptionTrigger disabled aria-label={p.name + ": Unlimited access from the organization"}>Unlimited</OptionTrigger>;
  const options = BR_ROLES.concat(BR_CUSTOM.filter((r) => r !== MVP_P1));
  return (
    <SSPopover trigger={(open, toggle) => <OptionTrigger open={open} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{p.role}</OptionTrigger>}>
      {(close) => options.map((o) => <DropdownMenuItem key={o} selected={o === p.role} onClick={() => { close(); onChange(o); }}>{o}</DropdownMenuItem>)}
    </SSPopover>
  );
}

function MVPMembers() {
  const A = React.useContext(MVPC);
  const { Button, IconButton, Table, NetworkAvatar, AlertBanner, DropdownMenuItem, Checkbox, Tooltip } = SS_NS();
  const [tab, setTab] = React.useState("members");
  const [sort, setSort] = React.useState(null);
  const search = A.search, perms = A.perms, stat = A.stat;
  const base = A.people.map((p) => ({ ...p, role:A.roleOf(p) }));
  const rows = ssSorted(base.filter((p) => ssMatch(search, p.name, p.email) && (!perms.length || perms.includes(p.role)) && (!stat.length || stat.includes(p.status))), sort);
  const [count, more] = useMVPInfinite(rows.length, MVP_LOADED, search + perms + stat + (sort && sort.k + sort.dir), A.loaded);
  const from = A.isStatic && A.screen === "1.0b" ? 40 : 0;   // a static tile can't keep a scroll position, so 1.0b starts at row 41
  const shown = rows.slice(from, count);
  const canPick = rows.slice(0, count).filter(mvpCanChange).map((p) => p.id);
  const sel = A.sel, n = sel.length;
  const all = n > 0 && canPick.every((id) => sel.includes(id)), some = n > 0 && !all;
  const job = A.job, running = job && (job.phase === "run" || job.phase === "retry");
  const tipOn = A.screen === "1.0a" ? "p3" : null;
  const showChecks = A.access === "full";
  const box = (p) => {
    if (!mvpCanChange(p)) {
      return <MVPSoftCheck id={p.id} label={"Select " + p.name} on={tipOn === p.id} tip="Access comes from the organization. It can’t be changed here." />;
    }
    return <Checkbox checked={sel.includes(p.id)} aria-label={"Select " + p.name} onChange={() => A.toggle(p.id)} />;
  };
  const columns = (showChecks ? [{ key:"check", width:56, header:<Checkbox checked={all} indeterminate={some} aria-label="Select all loaded members" onChange={() => A.setSel(all ? [] : canPick)} />, render:box }] : []).concat([
    { key:"name", width:280, header:<MVPSort label="Member" k="name" sort={sort} setSort={setSort} />, render:(m) => <SSPersonCell name={m.name} initials={m.initials} /> },
    { key:"assigned", width:150, header:<MVPSort label="Assigned on" k="assigned" sort={sort} setSort={setSort} /> },
    { key:"email", width:250, header:<MVPSort label="Email address" k="email" sort={sort} setSort={setSort} /> },
    { key:"role", width:200, header:<MVPSort label="Permissions" k="role" sort={sort} setSort={setSort} />, render:(m) => <MVPRoleCell p={m} onChange={(r) => { A.setRole(m.id, r); A.toast(m.name + " is now " + r + " on YouTube Somos"); }} /> },
    { key:"actions", header:"Actions", align:"right", width:96, render:() => null },
  ]);
  return (
    <React.Fragment>
      <SSEntityHeader title="YouTube Somos" onBack={() => A.goView("accounts")} meta="YouTube" status={<SSStatus status="connected" />}
        avatar={<span style={{ transform:"scale(1.4)", transformOrigin:"center", margin:"0 8px" }}><NetworkAvatar network="youtube" initials="YS" /></span>}
        actions={<React.Fragment><Button variant="secondary" onClick={() => A.openOrg("assign-teams", { target:"YouTube Somos" })}>Assign to teams</Button><Button variant="primary" onClick={() => A.openOrg("assign-members", { target:"YouTube Somos" })}>Assign to members</Button>
          <BRPop align="right" width={240} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="ghost" aria-label="More actions" aria-expanded={open} onClick={toggle} />}>{(close) => <React.Fragment><DropdownMenuItem onClick={() => { close(); A.toast("YouTube Somos is connected"); }}>Check connection</DropdownMenuItem><DropdownMenuItem onClick={() => { close(); A.toast("Removing a social account isn’t part of this prototype"); }}>Remove social account</DropdownMenuItem></React.Fragment>}</BRPop></React.Fragment>} />
      <SSTabsBar tabs={[{ id:"teams", label:"Teams" }, { id:"members", label:"Members" }]} value={tab} onChange={setTab} />
      {/* The top banner was cut on 8 Oct (lock session). It only shows on the board's "Cut on 8 Oct" screen x.2. */}
      {running && job.legacy && !A.bulk && <AlertBanner tone="info" title={"Applying " + job.role + " to " + (job.phase === "retry" ? job.failed.length : job.total) + " members"}>In progress. It keeps going if you leave this page.</AlertBanner>}
      <MVPContent>
        {tab === "teams" ? <SSListPanel title="1 team" explainer="Teams that carry this social account." link="Learn more about teams"><div style={{ width:"100%" }}><Table rows={[{ id:"t", name:"Content Team", members:"8", role:"Editor" }]} columns={[{ key:"name", header:"Team" }, { key:"members", header:"Members" }, { key:"role", header:"Default role" }]} /></div></SSListPanel> :
        <SSListPanel title="500 members" explainer="Manage members and permissions for this social account." link="Learn more about social account permissions">
          <MVPToolbar placeholder="Search for members" search={search} setSearch={A.setSearch}>
            <MVPFilterChip label="Permissions" options={MVP_FILTER_ROLES} custom={BR_CUSTOM} value={perms} onChange={A.setPerms} initialOpen={A.screen === "1.0e"} />
            <SSFilterChip label="Status" options={["Active", "Pending"]} value={stat} onChange={A.setStat} /></MVPToolbar>
          <div style={{ width:"100%" }} className="mvp-members" data-mvp-table="">
            <MVPStyle />
            <Table rows={shown} emptyReason={rows.length ? undefined : "no-results"} columns={columns} />
            {more}
          </div>
        </SSListPanel>}
      </MVPContent>
      {n > 0 && showChecks && tab === "members" && <BRBulkBar label={n + " selected"} onDismiss={() => A.setSel([])}>
        <button type="button" className="hs-btn hs-btn--ghost" onClick={() => A.openBulk()} style={{ color:"var(--bento-component-snackbar-text)", fontWeight:700, height:32, padding:"0 8px", display:"inline-flex", alignItems:"center", gap:8 }}>
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20 }}>key</span>Apply role</button></BRBulkBar>}
    </React.Fragment>
  );
}

// MVP 3.0: All social accounts with Manage roles next to Add social account (16 Sep board).
function MVPAccounts() {
  const A = React.useContext(MVPC);
  const { Button, Table } = SS_NS();
  const [search, setSearch] = React.useState(""), [nets, setNets] = React.useState([]), [stat, setStat] = React.useState([]), [sort, setSort] = React.useState(null);
  const NETS = SS_NS().NETWORKS || {}, label = (x) => (NETS[x] && NETS[x].label) || x;
  const rows = ssSorted(MVP_ACCOUNTS.filter((a) => ssMatch(search, a.name) && (!nets.length || nets.includes(label(a.network))) && (!stat.length || stat.includes("Connected"))), sort);
  const open = (a) => { if (a.id === "a3") A.goView("members"); else A.toast("This prototype opens YouTube Somos"); };
  return (
    <React.Fragment>
      <SSEntityHeader title="All social accounts" actions={<React.Fragment>
        <Button variant="ghost" onClick={() => A.goView("roles")}>Manage roles</Button>
        <Button variant="primary" onClick={() => A.toast("Adding a social account isn’t part of this prototype")}>Add social account</Button></React.Fragment>} />
      <MVPContent pad={24}>
        <SSListPanel title={MVP_ACCOUNTS.length + " social accounts in Somos Organization"} link="Learn how to connect social accounts">
          <MVPToolbar placeholder="Search for social accounts" search={search} setSearch={setSearch}>
            <SSFilterChip label="Social Network" options={[...new Set(MVP_ACCOUNTS.map((a) => label(a.network)))]} value={nets} onChange={setNets} />
            <SSFilterChip label="Status" options={["Connected", "Disconnected"]} value={stat} onChange={setStat} /></MVPToolbar>
          <div style={{ width:"100%" }}>
            <MVPStyle /><Table rows={rows} emptyReason={rows.length ? undefined : "no-results"} columns={[
              { key:"name", header:"Social account", render:(a) => <a href="#" className="mvp-acct" onClick={(e) => { e.preventDefault(); open(a); }} style={{ color:"inherit", textDecoration:"none" }}><SSAccountCell a={a} /></a> },
              { key:"added", header:<MVPSort label="Added on" k="added" sort={sort} setSort={setSort} /> },
              { key:"status", header:<MVPSort label="Status" k="status" sort={sort} setSort={setSort} />, render:(a) => <SSStatus status={a.status} /> },
              { key:"actions", header:"Actions", align:"right", width:96, render:(a) => <SSRowActions items={[{ label:"View details", icon:"visibility", onClick:() => open(a) }, { label:"Remove", icon:"delete", onClick:() => A.toast("Removing a social account isn’t part of this prototype") }]} /> },
            ]} />
          </div>
        </SSListPanel>
      </MVPContent>
    </React.Fragment>
  );
}

// Roles list: member counts as plain text (F12), Delete off while anyone has the role (F14), and on, with one confirm,
// when nobody has it (MVP 3.3 to 3.5).
function MVPRoles() {
  const A = React.useContext(MVPC);
  const { Button, IconButton, DropdownMenuItem, Table, Badge, AlertBanner } = SS_NS();
  const [sort, setSort] = React.useState(null);
  const rows = ssSorted(A.roleRows, sort), rj = A.rjob;
  const menuFor = A.screen === "3.2" || A.screen === "5.0" ? MVP_P1 : A.screen === "3.3" ? MVP_P2 : null;
  return (
    <React.Fragment>
      <SSEntityHeader title="Roles" onBack={() => A.goView("accounts")} actions={<Button variant="primary" onClick={() => A.startCreate()}>Create role</Button>} />
      {rj && <AlertBanner tone="info" title={"Updating " + rj.name + " for " + rj.n + " people"}>Some people keep the old version of the role until this finishes. You can leave this page.</AlertBanner>}
      <MVPContent>
        <SSListPanel title={rows.length + " roles for social accounts in Somos"} link="Learn more about social account permissions">
          <div style={{ width:"100%" }}><MVPStyle /><Table rows={rows} columns={[
            { key:"name", width:200, header:<MVPSort label="Role" k="name" sort={sort} setSort={setSort} />, render:(r) => r.description ? <span style={{ display:"flex", flexDirection:"column" }}><span>{r.name}</span><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{r.description}</span></span> : r.name },
            { key:"type", width:130, header:<MVPSort label="Type" k="type" sort={sort} setSort={setSort} /> },
            { key:"desc", width:456, header:<MVPSort label="Permissions" k="desc" sort={sort} setSort={setSort} />, render:(r) => <span style={{ display:"block", maxWidth:424, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.desc}</span> },
            { key:"count", width:150, header:<MVPSort label="Members" k="count" sort={sort} setSort={setSort} />, render:(r) => { const upd = rj && rj.name === r.name;
              return <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}><span>{r.count} people</span>{upd && <Badge tone="neutral">Updating</Badge>}</span>; } },
            { key:"actions", header:"Actions", align:"right", width:96, render:(r) => r.type === "Custom" && !(rj && rj.name === r.name) ? <BRPop align="right" width={200} initialOpen={r.name === menuFor} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="secondary" size="sm" aria-label={"More actions for " + r.name} aria-expanded={open} onClick={toggle} />}>
              {(close) => <React.Fragment><DropdownMenuItem onClick={() => { close(); A.startEdit(r.name); }}>Edit</DropdownMenuItem>
                {r.count > 0 ? <span className={"mvp-tip mvp-tip--left" + (A.screen === "3.2" ? " mvp-tip--on" : "")} style={{ display:"block" }}><SSNS_Tooltip label="You can delete it once no one has this role."><DropdownMenuItem disabled aria-disabled="true">Delete</DropdownMenuItem></SSNS_Tooltip></span>
                  : <DropdownMenuItem onClick={() => { close(); A.askDelete(r.name); }}>Delete</DropdownMenuItem>}</React.Fragment>}</BRPop> : null },
          ]} /></div>
        </SSListPanel>
      </MVPContent>
    </React.Fragment>
  );
}
// The bundle Tooltip, as a block so it can wrap a full width menu item.
function SSNS_Tooltip({ label, children }) {
  const { Tooltip } = SS_NS();
  return <span style={{ display:"block" }} className="mvp-tip-block"><style>{".mvp-tip-block>.hs-tooltip-wrap{display:flex}.mvp-tip-block>.hs-tooltip-wrap>*:first-child{flex:1}"}</style><Tooltip label={label} side="left">{children}</Tooltip></span>;
}

// One list of permissions, no product sections or Select all (PM, F16). Same field anatomy as the full flow's form.
function MVPPermForm({ list, perms, setPerms, name, setName, desc, setDesc, nameError, startFrom, intro, top }) {
  const { Input, Textarea, Hint, Checkbox, Panel } = SS_NS();
  const has = (x) => perms.includes(x), tog = (x) => setPerms(has(x) ? perms.filter((y) => y !== x) : perms.concat(x));
  const clr = ".mvp-clr>:not(style),.mvp-clr input,.mvp-clr textarea{width:100%;box-sizing:border-box}.mvp-clr--on input,.mvp-clr--on textarea{padding-right:48px}";
  const clearBtn = (label, onClick, top) => <button type="button" className="hs-btn hs-btn--icon hs-btn--ghost" aria-label={label} onClick={onClick} style={{ position:"absolute", right:16, top, width:32, height:32, minWidth:32, padding:0, color:"var(--bento-theme-color-icon-base)" }}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20, fontVariationSettings:"'FILL' 1" }}>cancel</span></button>;
  return (
    <div className="mvp-form-page" style={{ padding:40, background:"var(--bento-system-sys-neutral-alt-200,#f4f5f6)", minHeight:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <Panel style={{ alignItems:"stretch", gap:24 }}>
          <style>{clr}</style>
          {top}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}><h2 style={{ font:"600 18px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)", margin:0 }}>Set up the role</h2>{intro}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}><span style={mvpStrong}>Role name</span>
            <div className={name ? "mvp-clr mvp-clr--on" : "mvp-clr"} style={{ position:"relative" }}><Input value={name} placeholder="Role name" error={!!nameError} aria-invalid={!!nameError} aria-describedby={nameError ? "mvp-name-err" : undefined} onChange={(e) => setName(e.target.value)} />
              {name && clearBtn("Clear role name", () => setName(""), 4)}</div>
            {nameError && <Hint error id="mvp-name-err">{nameError}</Hint>}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}>
            <label htmlFor="mvp-desc" style={mvpStrong}>Description <span style={{ ...mvpSub, font:"var(--hs-type-body-md)" }}>(optional)</span></label>
            <div className={desc ? "mvp-clr mvp-clr--on" : "mvp-clr"} style={{ position:"relative" }}><Textarea id="mvp-desc" value={desc || ""} maxLength={500} placeholder="What is this role for?" onChange={(e) => setDesc(e.target.value)} />
              {desc && clearBtn("Clear description", () => setDesc(""), 8)}</div>
            <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }} aria-live="polite">{(desc || "").length} / 500</span></div>
          {startFrom}
          <div data-mvp-perms="" style={{ display:"flex", flexDirection:"column" }}>
            {list.map((x) => <SSRow key={x} label={x} desc={mvpPermDesc(x)} divider={false} control={<span data-mvp-perm={x}><Checkbox aria-label={x} checked={has(x)} onChange={() => tog(x)} /></span>} />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MVPCreate() {
  const A = React.useContext(MVPC), c = A.create;
  const { Button, Hyperlink, Select, DropdownMenuItem, Alert } = SS_NS();
  const taken = A.nameTaken(c.name), base = c.from ? (A.rolePerms[c.from] || []) : null;
  const sameAsBase = !!base && base.length === c.perms.length && base.every((x) => c.perms.includes(x));
  const custom = A.roleRows.filter((r) => r.type === "Custom").map((r) => r.name);
  const ordered = custom.concat(A.roleRows.map((r) => r.name).filter((r) => !custom.includes(r)));
  const set = (patch) => A.setCreate({ ...c, ...patch });
  return (
    <React.Fragment>
      <SSEntityHeader title="Create role" onBack={() => A.goView("roles")} />
      <MVPPermForm list={MVP_PERMS.map((p) => p[0])} perms={c.perms} setPerms={(p) => set({ perms:p, same:false })} name={c.name} setName={(x) => set({ name:x })} desc={c.desc} setDesc={(d) => set({ desc:d })}
        nameError={taken ? c.name.trim() + " already exists. Use a different name." : null}
        top={c.same && <Alert tone="negative" title={"These permissions match " + c.from}>Change at least one permission, or use {c.from} instead.</Alert>}
        intro={<p style={{ ...ssBody, marginTop:"var(--bento-space-02)" }}>Give it a name, pick a role to start from, and adjust the permissions. Everyone with this role gets the same set. <Hyperlink href="#" onClick={(x) => x.preventDefault()}>Learn more about custom social account permissions</Hyperlink></p>}
        startFrom={<div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}>
          <span style={mvpStrong}>Start from an existing role</span>
          <span style={mvpSub}>Copies its permissions. The two roles stay separate.</span>
          <BRPop width={456} initialOpen={A.screen === "4.0"} trigger={(open, toggle) => <Select value={c.from || undefined} placeholder="Select a role" open={open} onClick={toggle} />}>
            {(close) => ordered.map((r) => <DropdownMenuItem key={r} selected={r === c.from} style={{ height:"auto", minHeight:56, paddingBlock:"var(--bento-space-02)" }} onClick={() => { close(); A.pickFrom(r); }}>
              <span style={{ display:"flex", flexDirection:"column", gap:2, whiteSpace:"normal" }}><span style={{ display:"flex", justifyContent:"space-between" }}><b>{r}</b>{custom.includes(r) && <span style={mvpSub}>Custom</span>}</span><span style={mvpSub}>{A.roleDesc(r)}</span></span></DropdownMenuItem>)}</BRPop></div>} />
      <BRFootBar dirty><Button variant="secondary" onClick={() => A.goView("roles")}>Cancel</Button><Button variant="primary" disabled={!c.name.trim() || taken} onClick={() => { if (sameAsBase) set({ same:true }); else A.saveCreate(); }}>Create role</Button></BRFootBar>
    </React.Fragment>
  );
}

function MVPEdit() {
  const A = React.useContext(MVPC), e = A.edit;
  const { Button, Hyperlink } = SS_NS();
  const dirty = JSON.stringify(e.perms.slice().sort()) !== JSON.stringify(e.orig.slice().sort()) || e.name !== e.origName || (e.desc || "") !== (e.origDesc || "");
  const taken = A.nameTaken(e.name, e.origName);
  return (
    <React.Fragment>
      <SSEntityHeader title="Edit role" onBack={() => A.goView("roles")} />
      <MVPPermForm list={MVP_EDIT_LIST} perms={e.perms} setPerms={(p) => A.setEdit({ ...e, perms:p })} name={e.name} setName={(x) => A.setEdit({ ...e, name:x })} desc={e.desc} setDesc={(d) => A.setEdit({ ...e, desc:d })}
        nameError={taken ? e.name.trim() + " already exists. Use a different name." : null}
        intro={<p style={{ ...ssBody, marginTop:"var(--bento-space-02)" }}>Change the name or the permissions. Everyone with this role gets the update. <Hyperlink href="#" onClick={(x) => x.preventDefault()}>Learn more about custom social account permissions</Hyperlink></p>} />
      <BRFootBar dirty={dirty}><Button variant="secondary" onClick={() => A.goView("roles")}>Cancel</Button><Button variant="primary" disabled={!dirty || taken} onClick={() => A.saveEdit()}>Save role</Button></BRFootBar>
    </React.Fragment>
  );
}
Object.assign(window, { MVPSort, MVPContent, MVPToolbar, MVPSoftCheck, MVPC, MVPStyle, mvpSub, mvpStrong, useMVPInfinite, MVPFilterChip, MVPRoleCell, MVPMembers, MVPAccounts, MVPRoles, SSNS_Tooltip, MVPPermForm, MVPCreate, MVPEdit });
