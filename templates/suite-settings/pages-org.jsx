// Suite Settings — Organization: social accounts, members, teams, roles.
function SSOrgPicker({ ctx }) {
  const { OrgPicker, DropdownMenuItem } = SS_NS();
  return (
    <SSPopover align="right" trigger={(open, toggle) => <OrgPicker org={ctx.org.replace(" Organization", "")} logoText={ctx.org[0]} open={open} onClick={toggle} />}>
      {(close) => SS_ORGS.map((o) => <DropdownMenuItem key={o} selected={o === ctx.org} onClick={() => { close(); ctx.setOrg(o); }}>{o}</DropdownMenuItem>)}
    </SSPopover>
  );
}
function SSTabsBar({ tabs, value, onChange }) {
  const { Tabs } = SS_NS();
  return (
    <div style={{ padding: "0 var(--bento-space-05)", background: "var(--hs-surface)", borderBottom: "1px solid var(--bento-theme-color-border-subtle)" }}>
      <Tabs tabs={tabs} value={value} onChange={onChange} />
    </div>
  );
}
const ssMatch = (q, ...f) => !q || f.some((x) => String(x).toLowerCase().includes(q.toLowerCase()));

/* ── Limited permissions state (production) ── */
function SSLimited({ ctx }) {
  const { EmptyState, Button, Panel } = SS_NS();
  return (
    <SSContent>
      <Panel style={{ alignItems: "center" }}>
        <EmptyState icon="shield" title="Limited permissions" description="You don't have permission to view social accounts"
          actions={<Button variant="primary" onClick={() => ctx.go({ page: "overview" })}>Go to Overview page</Button>} />
      </Panel>
    </SSContent>
  );
}

/* ── 01 All social accounts ── */
function SSSocialAccounts({ ctx }) {
  const { Button, Table } = SS_NS();
  const [how, setHow] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [nets, setNets] = React.useState([]);
  const [stat, setStat] = React.useState([]);
  const [sort, setSort] = React.useState(null);
  const NETS = SS_NS().NETWORKS || {};
  const label = (n) => (NETS[n] && NETS[n].label) || n;
  const rows = ssSorted(ctx.accounts.filter((a) => ssMatch(search, a.name) && (!nets.length || nets.includes(label(a.network))) && (!stat.length || stat.includes(a.status === "connected" ? "Connected" : "Disconnected"))), sort);
  const [count, more] = useSSInfinite(rows.length, 25, search + nets + stat + (sort && sort.k + sort.dir));
  const header = (
    <React.Fragment>
      <SSPageHeader title="Social accounts" />
      <SSEntityHeader title="All social accounts" onBack={() => ctx.go({ page: "overview" })}
        actions={<React.Fragment>
          <SSOrgPicker ctx={ctx} />
          <Button variant="ghost" onClick={() => ctx.go({ page: "roles" })}>Manage roles</Button>
          <Button variant="primary" onClick={ctx.openConnect}>Add social account</Button>
        </React.Fragment>} />
    </React.Fragment>
  );
  if (ctx.limited) return <React.Fragment>{header}<SSLimited ctx={ctx} /></React.Fragment>;
  return (
    <React.Fragment>
      {header}
      <SSContent>
        <SSListPanel title={ctx.accounts.length + " social accounts in " + ctx.org} link="Learn how to connect social accounts" onLink={() => setHow(true)}>
          <SSToolbar placeholder="Search for social accounts" search={search} setSearch={setSearch}>
            <SSFilterChip label="Social Network" options={[...new Set(ctx.accounts.map((a) => label(a.network)))]} value={nets} onChange={setNets} />
            <SSFilterChip label="Status" options={["Connected", "Disconnected"]} value={stat} onChange={setStat} />
          </SSToolbar>
          <div style={{ width: "100%" }} data-ss-table="">
            <Table rows={rows.slice(0, count)} emptyReason={rows.length ? undefined : "no-results"} columns={[
              { key: "name", header: <SSSort label="Social account" k="name" sort={sort} setSort={setSort} />, render: (a) => <a href="#" onClick={(e) => { e.preventDefault(); ctx.go({ page: "account", id: a.id, tab: "teams" }); }} style={{ color: "inherit", textDecoration: "none" }}><SSAccountCell a={a} /></a> },
              { key: "added", header: <SSSort label="Added on" k="added" sort={sort} setSort={setSort} /> },
              { key: "status", header: <SSSort label="Status" k="status" sort={sort} setSort={setSort} />, render: (a) => <SSStatus status={a.status} /> },
              { key: "actions", header: "Actions", align: "right", width: 96, render: (a) => <SSRowActions items={[
                { label: "View details", icon: "visibility", onClick: () => ctx.go({ page: "account", id: a.id, tab: "teams" }) },
                a.status === "disconnected" ? { label: "Reconnect", icon: "sync", onClick: () => ctx.openConnect(a.network) } : null,
                { label: "Remove", icon: "delete", onClick: () => ctx.confirmRemove(a) },
              ].filter(Boolean)} /> },
            ]} />
            {more}
          </div>
        </SSListPanel>
      </SSContent>
      {how && <SSModal title="How to connect social accounts" onClose={() => setHow(false)} actions={<Button variant="primary" onClick={() => setHow(false)}>Got it</Button>}>Choose Add social account, pick a network, sign in with the account you want to publish from, then choose which profiles to connect. A status of Disconnected means a sign-in has expired and the account needs reconnecting.</SSModal>}
    </React.Fragment>
  );
}

/* ── 02 Social account page ── */
function SSSocialAccount({ ctx, id, tab }) {
  const { Button, IconButton, Table, NetworkAvatar } = SS_NS();
  const a = ctx.accounts.find((x) => x.id === id) || ctx.accounts[3];
  const [search, setSearch] = React.useState("");
  const [perms, setPerms] = React.useState([]);
  const [stat, setStat] = React.useState([]);
  const [sort, setSort] = React.useState(null);
  const [sel, setSel] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const NETS = SS_NS().NETWORKS || {};
  const base = ctx.members.map((m, i) => ({ ...m, assigned: m.added, role: roles[m.id] || ["Editor", "Publisher One", "Editor", "Advanced", "Limited", "Responder"][i % 6] }));
  const rows = ssSorted(base.filter((m) => ssMatch(search, m.name, m.email) && (!perms.length || perms.includes(m.role)) && (!stat.length || stat.includes(m.pending ? "Pending" : "Active"))), sort);
  const [count, more] = useSSInfinite(rows.length, 25, search + perms + stat + (sort && sort.k + sort.dir));
  const teams = SS_TEAMS;
  return (
    <React.Fragment>
      <SSPageHeader title="Social accounts" />
      <SSEntityHeader title={a.name} onBack={() => ctx.go({ page: "social-accounts" })}
        avatar={<span style={{ transform: "scale(1.4)", transformOrigin: "center", margin: "0 8px" }}><NetworkAvatar network={a.network} initials={a.initials} /></span>}
        meta={(NETS[a.network] && NETS[a.network].label) || a.network} status={<SSStatus status={a.status} />}
        actions={<React.Fragment>
          <Button variant="secondary" onClick={() => ctx.openModal("assign-teams", { target: a.name })}>Assign to teams</Button>
          <Button variant="primary" onClick={() => ctx.openModal("assign-members", { target: a.name })}>Assign to members</Button>
          <SSRowActions items={[a.status === "disconnected" ? { label: "Reconnect", icon: "sync", onClick: () => ctx.openConnect(a.network) } : null, { label: "Remove social account", icon: "delete", onClick: () => ctx.confirmRemove(a) }].filter(Boolean)} />
        </React.Fragment>} />
      <SSTabsBar tabs={[{ id: "teams", label: "Teams" }, { id: "members", label: "Members" }]} value={tab || "teams"} onChange={(t) => ctx.go({ page: "account", id: a.id, tab: t })} />
      <SSContent>
        {(tab || "teams") === "teams" ? (
          <SSListPanel title={teams.length + " team"} explainer="Teams that carry this social account." link="Learn more about teams">
            <div style={{ width: "100%" }}><Table rows={teams} columns={[
              { key: "name", header: "Team", render: (t) => <SSTeamCell t={t} ctx={ctx} /> },
              { key: "members", header: "Members" }, { key: "role", header: "Default role" },
              { key: "actions", header: "Actions", align: "right", width: 96, render: () => <SSRowActions items={[{ label: "Remove from team", icon: "group_remove", onClick: () => ctx.toast("Removed " + a.name + " from Content Team") }]} /> },
            ]} /></div>
          </SSListPanel>
        ) : (
          <SSListPanel title={ctx.members.length + " members"} explainer="Manage members and permissions for this social account." link="Learn more about social account permissions">
            <SSToolbar placeholder="Search for members" search={search} setSearch={setSearch}>
              <SSFilterChip label="Permissions" options={SS_ROLE_NAMES} value={perms} onChange={setPerms} />
              <SSFilterChip label="Status" options={["Active", "Pending"]} value={stat} onChange={setStat} />
            </SSToolbar>
            <div style={{ width: "100%" }}>
              <Table selectable rows={rows.slice(0, count)} selected={sel}
                onToggle={(k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : s.concat(k)))}
                onToggleAll={(on) => setSel(on ? rows.slice(0, count).map((r) => r.id) : [])}
                bulkActions={<Button variant="secondary" size="sm" onClick={() => { ctx.toast("Removed " + sel.length + " members from " + a.name); setSel([]); }}>Remove</Button>}
                columns={[
                  { key: "name", header: <SSSort label="Member" k="name" sort={sort} setSort={setSort} />, render: (m) => <SSPersonCell {...m} /> },
                  { key: "assigned", header: <SSSort label="Assigned on" k="assigned" sort={sort} setSort={setSort} /> },
                  { key: "email", header: <SSSort label="Email address" k="email" sort={sort} setSort={setSort} /> },
                  { key: "role", header: <SSSort label="Permissions" k="role" sort={sort} setSort={setSort} />, render: (m) => <SSRoleTrigger value={m.role} options={SS_ROLE_NAMES} onChange={(r) => { setRoles((x) => ({ ...x, [m.id]: r })); ctx.toast(m.name + " is now " + r + " on " + a.name); }} /> },
                  { key: "actions", header: "Actions", align: "right", width: 96, render: (m) => <SSRowActions items={[{ label: "View member", icon: "person", onClick: () => ctx.go({ page: "member", id: m.id, tab: "social" }) }, { label: "Remove from social account", icon: "person_remove", onClick: () => ctx.toast("Removed " + m.name + " from " + a.name) }]} /> },
                ]} />
              {more}
            </div>
          </SSListPanel>
        )}
      </SSContent>
    </React.Fragment>
  );
}
function SSTeamCell({ t, ctx }) {
  const { Avatar } = SS_NS();
  return <a href="#" onClick={(e) => { e.preventDefault(); ctx.go({ page: "team", id: t.id, tab: "members" }); }} style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-03)", color: "inherit", textDecoration: "none" }}><Avatar icon="groups" size="md" />{t.name}</a>;
}

/* ── 03 Members list ── */
function SSMembers({ ctx }) {
  const { Button, Table } = SS_NS();
  const [search, setSearch] = React.useState("");
  const [perms, setPerms] = React.useState([]);
  const [stat, setStat] = React.useState([]);
  const [sort, setSort] = React.useState(null);
  const rows = ssSorted(ctx.members.filter((m) => ssMatch(search, m.name, m.email) && (!perms.length || perms.includes(m.perm)) && (!stat.length || stat.includes(m.pending ? "Pending" : "Active"))), sort);
  const [count, more] = useSSInfinite(rows.length, 25, search + perms + stat + (sort && sort.k + sort.dir));
  return (
    <React.Fragment>
      <SSPageHeader title="Members" />
      <SSEntityHeader title="All members" onBack={() => ctx.go({ page: "overview" })}
        actions={<React.Fragment><SSOrgPicker ctx={ctx} /><Button variant="primary" onClick={() => ctx.openModal("invite")}>Invite members</Button></React.Fragment>} />
      <SSContent>
        <SSListPanel title={ctx.members.length + " members in " + ctx.org} explainer="Everyone in the organization, with their organization permission." link="Learn more about permissions">
          <SSToolbar placeholder="Search for members" search={search} setSearch={setSearch}>
            <SSFilterChip label="Permissions" options={["Admin", "Member"]} value={perms} onChange={setPerms} />
            <SSFilterChip label="Status" options={["Active", "Pending"]} value={stat} onChange={setStat} />
          </SSToolbar>
          <div style={{ width: "100%" }}>
            <Table rows={rows.slice(0, count)} emptyReason={rows.length ? undefined : "no-results"} columns={[
              { key: "name", header: <SSSort label="Member" k="name" sort={sort} setSort={setSort} />, render: (m) => <a href="#" onClick={(e) => { e.preventDefault(); ctx.go({ page: "member", id: m.id, tab: "social" }); }} style={{ color: "inherit", textDecoration: "none" }}><SSPersonCell {...m} /></a> },
              { key: "added", header: <SSSort label="Added on" k="added" sort={sort} setSort={setSort} /> },
              { key: "email", header: <SSSort label="Email address" k="email" sort={sort} setSort={setSort} /> },
              { key: "perm", header: <SSSort label="Organization permission" k="perm" sort={sort} setSort={setSort} /> },
              { key: "accounts", header: <SSSort label="Social accounts" k="accounts" sort={sort} setSort={setSort} /> },
              { key: "actions", header: "Actions", align: "right", width: 96, render: (m) => <SSRowActions items={[{ label: "View member", icon: "person", onClick: () => ctx.go({ page: "member", id: m.id, tab: "social" }) }, m.pending ? { label: "Resend invite", icon: "send", onClick: () => ctx.toast("Invite sent again to " + m.email) } : null, { label: "Remove from organization", icon: "person_remove", onClick: () => ctx.removeMember(m) }].filter(Boolean)} /> },
            ]} />
            {more}
          </div>
        </SSListPanel>
      </SSContent>
    </React.Fragment>
  );
}

/* ── 04 Member page ── */
function SSMember({ ctx, id, tab }) {
  const { Button, Table, Avatar } = SS_NS();
  const m = ctx.members.find((x) => x.id === id) || ctx.members[1];
  const [sel, setSel] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [perms, setPerms] = React.useState([]);
  const [stat, setStat] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const [orgPerm, setOrgPerm] = React.useState(m.perm);
  const t = tab || "social";
  const accts = ctx.accounts.slice(0, m.accounts).map((a, i) => ({ ...a, assigned: a.added, role: roles[a.id] || ["Editor", "Publisher One", "Publisher One", "Publisher One", "Publisher One", "Care Agent", "Responder", "Editor", "Limited", "Editor"][i % 10] }))
    .filter((a) => ssMatch(search, a.name) && (!perms.length || perms.includes(a.role)) && (!stat.length || stat.includes(a.status === "connected" ? "Connected" : "Disconnected")));
  return (
    <React.Fragment>
      <SSPageHeader title="Members" />
      <SSEntityHeader title={m.name} onBack={() => ctx.go({ page: "members" })} meta={m.email}
        avatar={<Avatar initials={m.initials} size="56" />}
        actions={<React.Fragment>
          <Button variant="secondary" onClick={() => ctx.openModal("assign-teams", { target: m.name })}>Add to teams</Button>
          <Button variant="primary" onClick={() => ctx.openModal("assign-accounts", { target: m.name })}>Assign social accounts</Button>
          <SSRowActions items={[{ label: "Remove from organization", icon: "person_remove", onClick: () => { ctx.removeMember(m); ctx.go({ page: "members" }); } }]} />
        </React.Fragment>} />
      <SSTabsBar tabs={[{ id: "teams", label: "Teams" }, { id: "social", label: "Social accounts" }, { id: "org", label: "Organization permissions" }]} value={t} onChange={(x) => ctx.go({ page: "member", id: m.id, tab: x })} />
      <SSContent>
        {t === "teams" && (
          <SSListPanel title="1 team" explainer={"Teams " + m.name + " belongs to."} link="Learn more about teams">
            <div style={{ width: "100%" }}><Table rows={SS_TEAMS} columns={[
              { key: "name", header: "Team", render: (x) => <SSTeamCell t={x} ctx={ctx} /> },
              { key: "teamRole", header: "Team role", render: () => "Team Member" },
              { key: "actions", header: "Actions", align: "right", width: 96, render: () => <SSRowActions items={[{ label: "Remove from team", icon: "group_remove", onClick: () => ctx.toast("Removed " + m.name + " from Content Team") }]} /> },
            ]} /></div>
          </SSListPanel>
        )}
        {t === "social" && (
          <SSListPanel title={m.accounts + " social accounts"} explainer={"Social accounts that " + m.name + " is assigned to and their permissions."} link="Learn more about social account permissions">
            <SSToolbar placeholder="Search for social accounts" search={search} setSearch={setSearch}>
              <SSFilterChip label="Permissions" options={SS_ROLE_NAMES} value={perms} onChange={setPerms} />
              <SSFilterChip label="Status" options={["Connected", "Disconnected"]} value={stat} onChange={setStat} />
            </SSToolbar>
            <div style={{ width: "100%" }}><Table selectable rows={accts} selected={sel}
              onToggle={(k) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : s.concat(k)))}
              onToggleAll={(on) => setSel(on ? accts.map((r) => r.id) : [])}
              bulkActions={<Button variant="secondary" size="sm" onClick={() => { ctx.toast("Unassigned " + sel.length + " social accounts from " + m.name); setSel([]); }}>Unassign</Button>}
              columns={[
                { key: "name", header: "Social account", render: (a) => <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--bento-space-04)" }}><SSAccountCell a={a} />{a.status === "disconnected" && <SSStatus status={a.status} />}</span> },
                { key: "assigned", header: "Assigned on" },
                { key: "role", header: "Permissions", render: (a) => (
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                    <SSRoleTrigger value={a.role} options={SS_ROLE_NAMES} onChange={(r) => { setRoles((x) => ({ ...x, [a.id]: r })); ctx.toast(m.name + " is now " + r + " on " + a.name); }} />
                    {a.network === "youtube" && /Publisher|Responder|Limited/.test(a.role) && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "var(--hs-type-body-sm)", color: "var(--bento-theme-color-text-subtle)" }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>Approvals don't apply on YouTube. The rest of the role does.</span>}
                  </span>) },
                { key: "actions", header: "Actions", align: "right", width: 96, render: (a) => <SSRowActions items={[{ label: "View social account", icon: "visibility", onClick: () => ctx.go({ page: "account", id: a.id, tab: "members" }) }, { label: "Unassign", icon: "link_off", onClick: () => ctx.toast("Unassigned " + a.name + " from " + m.name) }]} /> },
              ]} /></div>
          </SSListPanel>
        )}
        {t === "org" && (
          <SSListPanel title="Organization permission" explainer="What this member can manage across the organization." link="Learn more about permissions">
            <div style={{ width: "100%" }}>
              <SSRow label="Organization permission" desc="Admins manage members, teams, social accounts, billing and SSO. Members use the social accounts they are assigned to." divider={false}
                control={<SSRoleTrigger value={orgPerm} options={["Admin", "Member"]} onChange={(r) => { setOrgPerm(r); ctx.toast(m.name + " is now an organization " + r.toLowerCase()); }} />} />
            </div>
          </SSListPanel>
        )}
      </SSContent>
    </React.Fragment>
  );
}

/* ── 05 Teams list / 06 Team page / 07 Default permissions ── */
function SSTeams({ ctx }) {
  const { Button, Table } = SS_NS();
  return (
    <React.Fragment>
      <SSPageHeader title="Teams" />
      <SSEntityHeader title="All teams" onBack={() => ctx.go({ page: "overview" })}
        actions={<React.Fragment><SSOrgPicker ctx={ctx} /><Button variant="primary" onClick={() => ctx.openModal("create-team")}>Create team</Button></React.Fragment>} />
      <SSContent>
        <SSListPanel title={ctx.teams.length + (ctx.teams.length === 1 ? " team in " : " teams in ") + ctx.org} explainer="Teams group members and social accounts." link="Learn more about teams">
          <div style={{ width: "100%" }}><Table rows={ctx.teams} columns={[
            { key: "name", header: "Team", render: (t) => <SSTeamCell t={t} ctx={ctx} /> },
            { key: "members", header: "Members" }, { key: "accounts", header: "Social accounts" }, { key: "role", header: "Default role" },
            { key: "actions", header: "Actions", align: "right", width: 96, render: (t) => <SSRowActions items={[{ label: "View team", icon: "groups", onClick: () => ctx.go({ page: "team", id: t.id, tab: "members" }) }, { label: "Delete team", icon: "delete", onClick: () => ctx.deleteTeam(t) }]} /> },
          ]} /></div>
        </SSListPanel>
      </SSContent>
    </React.Fragment>
  );
}
function SSTeam({ ctx, id, tab }) {
  const { Button, Table, Avatar } = SS_NS();
  const team = ctx.teams.find((x) => x.id === id) || ctx.teams[0] || SS_TEAMS[0];
  const t = tab || "members";
  const [search, setSearch] = React.useState("");
  const [perms, setPerms] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const mem = ctx.members.slice(0, team.members).map((m, i) => ({ ...m, role: roles[m.id] || (i === 0 ? "Team Admin" : "Team Member") })).filter((m) => ssMatch(search, m.name, m.email) && (!perms.length || perms.includes(m.role)));
  return (
    <React.Fragment>
      <SSPageHeader title="Teams" />
      <SSEntityHeader title={team.name} onBack={() => ctx.go({ page: "teams" })} meta={team.members + " members · " + team.accounts + " social accounts"}
        avatar={<Avatar icon="groups" size="56" />}
        actions={<React.Fragment>
          <Button variant="secondary" onClick={() => ctx.openModal("assign-accounts", { target: team.name })}>Assign social accounts</Button>
          <Button variant="primary" onClick={() => ctx.openModal("assign-members", { target: team.name })}>Add members</Button>
          <SSRowActions items={[{ label: "Delete team", icon: "delete", onClick: () => { ctx.deleteTeam(team); ctx.go({ page: "teams" }); } }]} />
        </React.Fragment>} />
      <SSTabsBar tabs={[{ id: "members", label: "Members" }, { id: "social", label: "Social accounts" }, { id: "settings", label: "Settings" }]} value={t} onChange={(x) => ctx.go({ page: "team", id: team.id, tab: x })} />
      <SSContent>
        {t === "members" && (
          <SSListPanel title={team.members + " members"} explainer="Manage team members and permissions." link="Learn more about team permissions">
            <SSToolbar placeholder="Search for members" search={search} setSearch={setSearch}>
              <SSFilterChip label="Permissions" options={SS_TEAM_ROLES} value={perms} onChange={setPerms} />
            </SSToolbar>
            <div style={{ width: "100%" }}><Table rows={mem} columns={[
              { key: "name", header: "Member", render: (m) => <SSPersonCell {...m} /> },
              { key: "added", header: "Added on" }, { key: "email", header: "Email address" },
              { key: "role", header: "Permissions", render: (m) => <SSRoleTrigger value={m.role} options={SS_TEAM_ROLES} onChange={(r) => { setRoles((x) => ({ ...x, [m.id]: r })); ctx.toast(m.name + " is now " + r); }} /> },
              { key: "actions", header: "Actions", align: "right", width: 96, render: (m) => <SSRowActions items={[{ label: "Remove from team", icon: "group_remove", onClick: () => ctx.toast("Removed " + m.name + " from " + team.name) }]} /> },
            ]} /></div>
          </SSListPanel>
        )}
        {t === "social" && (
          <SSListPanel title={team.accounts + " social accounts"} explainer="Every member of the team gets the team's default role on these social accounts." link="Learn more about team permissions">
            <div style={{ width: "100%" }}><Table rows={ctx.accounts.slice(0, team.accounts)} columns={[
              { key: "name", header: "Social account", render: (a) => <SSAccountCell a={a} /> },
              { key: "added", header: "Assigned on" }, { key: "status", header: "Status", render: (a) => <SSStatus status={a.status} /> },
              { key: "actions", header: "Actions", align: "right", width: 96, render: (a) => <SSRowActions items={[{ label: "Unassign from team", icon: "link_off", onClick: () => ctx.toast("Unassigned " + a.name + " from " + team.name) }]} /> },
            ]} /></div>
          </SSListPanel>
        )}
        {t === "settings" && (
          <SSListPanel title="Team settings">
            <div style={{ width: "100%" }}>
              <SSRow label="Team name" desc={team.name} control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("rename-team", { team })}>Edit</Button>} />
              <SSRow label="Default permissions" desc={team.role + ". Everyone added to this team gets this role on the team's social accounts."} divider={false}
                control={<Button variant="outlined" size="sm" onClick={() => ctx.go({ page: "team-defaults", id: team.id })}>Change</Button>} />
            </div>
          </SSListPanel>
        )}
      </SSContent>
    </React.Fragment>
  );
}
function SSTeamDefaults({ ctx, id }) {
  const { Button, Footer, Panel } = SS_NS();
  const team = ctx.teams.find((x) => x.id === id) || ctx.teams[0] || SS_TEAMS[0];
  const [role, setRole] = React.useState(team.role);
  const dirty = role !== team.role;
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <SSPageHeader title="Teams" />
      <SSEntityHeader title="Default permissions" meta={team.name} onBack={() => ctx.go({ page: "team", id: team.id, tab: "settings" })} />
      <div style={{ flex: 1 }}>
        <SSContent narrow>
          <Panel style={{ alignItems: "flex-start" }}>
            <p style={ssBody}>Everyone added to this team gets this role on every social account the team carries. Change the role and everyone in the team follows. You can still change one person or one account after.</p>
            <SSRoleTrigger value={role} options={SS_ROLE_NAMES} onChange={setRole} />
          </Panel>
        </SSContent>
      </div>
      <div style={{ position: "sticky", bottom: 0 }}>
        <Footer>
          <Button variant="secondary" onClick={() => ctx.go({ page: "team", id: team.id, tab: "settings" })}>Cancel</Button>
          <Button variant="primary" disabled={!dirty} onClick={() => { ctx.updateTeam(team.id, { role }); ctx.toast("Default permissions for " + team.name + " changed to " + role); ctx.go({ page: "team", id: team.id, tab: "settings" }); }}>Save changes</Button>
        </Footer>
      </div>
    </div>
  );
}

/* ── Roles (Manage roles) ── */
function SSRolesPage({ ctx }) {
  const { Button, Table, Hyperlink } = SS_NS();
  return (
    <React.Fragment>
      <SSPageHeader title="Social accounts" />
      <SSEntityHeader title="Roles" onBack={() => ctx.go({ page: "social-accounts" })}
        actions={<React.Fragment><SSOrgPicker ctx={ctx} /><Button variant="primary" onClick={() => ctx.openModal("create-role")}>Create role</Button></React.Fragment>} />
      <SSContent>
        <SSListPanel title={ctx.roles.length + " roles for social accounts in Somos"} link="Learn more about social account permissions">
          <div style={{ width: "100%" }}><Table rows={ctx.roles} columns={[
            { key: "name", header: "Role" }, { key: "type", header: "Type" },
            { key: "perms", header: "Permissions", render: (r) => <span style={{ display: "block", maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.perms}</span> },
            { key: "people", header: "Members", render: (r) => <Hyperlink href="#" onClick={(e) => { e.preventDefault(); ctx.go({ page: "members" }); }}>{r.people} people</Hyperlink> },
            { key: "actions", header: "Actions", align: "right", width: 96, render: (r) => <SSRowActions items={[{ label: "Duplicate role", icon: "content_copy", onClick: () => ctx.toast(r.name + " duplicated") }].concat(r.type === "Custom" ? [{ label: "Delete role", icon: "delete", onClick: () => ctx.toast(r.name + " deleted") }] : [])} /> },
          ]} /></div>
        </SSListPanel>
      </SSContent>
    </React.Fragment>
  );
}

Object.assign(window, { SSOrgPicker, SSTabsBar, SSLimited, SSSocialAccounts, SSSocialAccount, SSTeamCell, SSMembers, SSMember, SSTeams, SSTeam, SSTeamDefaults, SSRolesPage });
