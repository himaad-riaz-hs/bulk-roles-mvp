// Suite Settings — Overview, Organization settings, SSO, and Publishing pages.
function SSOverview({ ctx }) {
  const { Card } = SS_NS();
  const tiles = [[ctx.members.length, "Members", "members"], [ctx.teams.length, "Teams", "teams"], [ctx.accounts.length, "Social accounts", "social-accounts"], [ctx.roles.length, "Roles", "roles"]];
  const activity = [["Publisher One created", "Today"], ["Asha Patel added to Content Team", "Yesterday"], ["YouTube Somos disconnected", "Mar 21"]];
  return (
    <React.Fragment>
      <SSPageHeader title="Overview" />
      <SSContent narrow intro="A snapshot of your organization.">
        <SSCard title={ctx.org} explainer="Organization ID org_somos_4821. Use this when you contact support.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "var(--bento-space-03)", paddingTop: "var(--bento-space-03)" }}>
            {tiles.map(([n, label, page]) => (
              <Card key={label} quiet role="link" tabIndex={0} onClick={() => ctx.go({ page })} onKeyDown={(e) => { if (e.key === "Enter") ctx.go({ page }); }} style={{ cursor: "pointer", gap: 4, padding: "var(--bento-space-04)" }}>
                <span style={ssTitle(26, 32)}>{n}</span>
                <span style={{ font: "var(--hs-type-body-sm)", color: "var(--bento-theme-color-text-subtle)" }}>{label}</span>
              </Card>
            ))}
          </div>
        </SSCard>
        <SSCard title="Recent activity">
          {activity.map(([t, when], i) => <SSRow key={t} label={t} divider={i < activity.length - 1} control={<span style={{ font: "var(--hs-type-body-sm)", color: "var(--bento-theme-color-text-subtle)" }}>{when}</span>} />)}
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSOrgSettings({ ctx }) {
  const { Button, Switch } = SS_NS();
  const [region, setRegion] = React.useState("Canada (Central)");
  const [lang, setLang] = React.useState("English");
  const [perm, setPerm] = React.useState("Editor");
  const [invite, setInvite] = React.useState(true);
  const [approve, setApprove] = React.useState(false);
  return (
    <React.Fragment>
      <SSPageHeader title="Settings" />
      <SSContent narrow intro="Organization wide settings for Somos, applied to everyone in this organization.">
        <SSCard title="Organization profile">
          <SSRow label="Organization name" desc="Shown across Hootsuite and on invitations to new members." control={<React.Fragment><span style={ssBody}>{ctx.org}</span><Button variant="outlined" size="sm" onClick={() => ctx.openModal("rename-org")}>Edit</Button></React.Fragment>} />
          <SSRow label="Region and data residency" desc="Where your organization’s data is stored. Changing this can take up to 48 hours." control={<SSRoleTrigger value={region} options={["Canada (Central)", "United States (East)", "European Union (Frankfurt)", "Australia (Sydney)"]} onChange={(v) => { setRegion(v); ctx.toast("Data residency change to " + v + " requested"); }} />} />
          <SSRow label="Default language" desc="The starting language for new members. Each member can change their own." divider={false} control={<SSRoleTrigger value={lang} options={["English", "Español", "Français", "Deutsch", "Português"]} onChange={(v) => { setLang(v); ctx.toast("Default language changed to " + v); }} />} />
        </SSCard>
        <SSCard title="Membership defaults">
          <SSRow label="Default permissions" desc="The social account role applied when someone joins the organization, until an admin changes it." control={<SSRoleTrigger value={perm} options={SS_ROLE_NAMES} onChange={(v) => { setPerm(v); ctx.toast("Default permissions changed to " + v); }} />} />
          <SSRow label="Allow team admins to invite members" desc="Team admins can send invitations without going through an organization admin." control={<Switch checked={invite} onChange={(v) => { setInvite(v); ctx.toast(v ? "Team admins can invite members" : "Only organization admins can invite members"); }} />} />
          <SSRow label="Require billing owner approval to add seats" desc="Invitations that need a new seat wait for the billing owner to approve." divider={false} control={<Switch checked={approve} onChange={(v) => { setApprove(v); ctx.toast(v ? "Billing owner approval required" : "Billing owner approval no longer required"); }} />} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSSso({ ctx }) {
  const { Button, Switch, Badge } = SS_NS();
  const [req, setReq] = React.useState(true);
  const [synced, setSynced] = React.useState("Sep 20, 2026");
  return (
    <React.Fragment>
      <SSPageHeader title="SSO settings" />
      <SSContent narrow intro="Members sign in through your identity provider.">
        <SSCard title="Single sign-on" explainer="Members sign in through your identity provider. Managed with your provider.">
          <SSRow label="Status" desc="SSO is required for every member of Somos." control={<Badge tone="positive">Connected</Badge>} />
          <SSRow label="Identity provider" desc={"Okta, SAML 2.0. Metadata last synced " + synced + "."} control={<Button variant="outlined" size="sm" onClick={() => { setSynced("Oct 5, 2026"); ctx.toast("Metadata synced from Okta"); }}>Sync metadata</Button>} />
          <SSRow label="Require SSO for all members" desc="Members without SSO access will be locked out." divider={false} control={<Switch checked={req} onChange={(v) => { setReq(v); ctx.toast(v ? "SSO is now required" : "SSO is now optional"); }} />} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSTags({ ctx }) {
  const { Input, Button, Tag } = SS_NS();
  const [tags, setTags] = React.useState(["Launch", "Evergreen", "Support", "Promo"]);
  const [name, setName] = React.useState("");
  const add = () => { const n = name.trim(); if (!n || tags.includes(n)) return; setTags(tags.concat(n)); setName(""); ctx.toast("Tag “" + n + "” created"); };
  return (
    <React.Fragment>
      <SSPageHeader title="Tags" />
      <SSContent narrow intro="Tags help you organize and report on posts.">
        <SSCard title={tags.length + (tags.length === 1 ? " tag in " : " tags in ") + ctx.org} explainer="Tags are shared with everyone in the organization.">
          <div style={{ display: "flex", gap: "var(--bento-space-03)", paddingTop: "var(--bento-space-03)" }}>
            <div style={{ width: 376, maxWidth: "100%" }}><Input placeholder="New tag name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} /></div>
            <Button variant="secondary" disabled={!name.trim()} onClick={add}>Create tag</Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--bento-space-02)", paddingTop: "var(--bento-space-04)" }}>
            {tags.map((t) => <Tag key={t} color={4} onDismiss={() => { setTags(tags.filter((x) => x !== t)); ctx.toast("Tag “" + t + "” deleted"); }}>{t}</Tag>)}
          </div>
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSCampaigns() {
  const { Table, Badge } = SS_NS();
  const rows = [
    { id: 1, name: "Fall launch", dates: "Sep 15 to Oct 15, 2026", posts: 24, status: "Active" },
    { id: 2, name: "Back to school", dates: "Aug 10 to Sep 10, 2026", posts: 41, status: "Ended" },
    { id: 3, name: "Holiday 2026", dates: "Nov 20 to Dec 31, 2026", posts: 3, status: "Draft" },
  ];
  return (
    <React.Fragment>
      <SSPageHeader title="Campaigns" />
      <SSContent narrow intro="Group posts under a campaign to track them together.">
        <SSCard title="3 campaigns" explainer="Group posts under a campaign to track them together.">
          <div style={{ paddingTop: "var(--bento-space-03)" }}><Table rows={rows} columns={[
            { key: "name", header: "Campaign" }, { key: "dates", header: "Dates" }, { key: "posts", header: "Posts" },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "positive" : "neutral"}>{r.status}</Badge> },
          ]} /></div>
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSLinkSettings({ ctx }) {
  const { Button, Switch } = SS_NS();
  const [short, setShort] = React.useState("ow.ly");
  const [track, setTrack] = React.useState(true);
  return (
    <React.Fragment>
      <SSPageHeader title="Link settings" />
      <SSContent narrow intro="Shorteners and tracking for links in your posts.">
        <SSCard title="Link settings">
          <SSRow label="Link shortener" desc={"Shorten links in posts with " + short + "."} control={<SSRoleTrigger value={short} options={["ow.ly", "bit.ly", "None"]} onChange={(v) => { setShort(v); ctx.toast("Link shortener changed to " + v); }} />} />
          <SSRow label="Link tracking" desc="Add UTM parameters to every link automatically." control={<Switch checked={track} onChange={(v) => { setTrack(v); ctx.toast(v ? "Link tracking on" : "Link tracking off"); }} />} />
          <SSRow label="Vanity URLs" desc="Use your own domain for shortened links." divider={false} control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("add-domain")}>Add domain</Button>} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSSuspended({ ctx }) {
  const { Table, Button } = SS_NS();
  const [rows, setRows] = React.useState([
    { id: 1, post: "Weekend flash sale, 40% off", account: "Facebook Somos", by: "Vigil policy: pricing claims" },
    { id: 2, post: "Meet our new CFO", account: "LinkedIn Somos", by: "Asha Patel" },
  ]);
  return (
    <React.Fragment>
      <SSPageHeader title="Suspended posts" />
      <SSContent narrow intro="Posts held back from publishing across the organization.">
        <SSCard title={rows.length + (rows.length === 1 ? " suspended post" : " suspended posts")} explainer="Posts held back from publishing until an admin releases them.">
          <div style={{ paddingTop: "var(--bento-space-03)" }}><Table rows={rows} emptyReason={rows.length ? undefined : "no-data"} columns={[
            { key: "post", header: "Post" }, { key: "account", header: "Social account" }, { key: "by", header: "Suspended by" },
            { key: "actions", header: "Actions", align: "right", render: (r) => <Button variant="outlined" size="sm" onClick={() => { setRows(rows.filter((x) => x.id !== r.id)); ctx.toast("“" + r.post + "” released"); }}>Release</Button> },
          ]} /></div>
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

Object.assign(window, { SSOverview, SSOrgSettings, SSSso, SSTags, SSCampaigns, SSLinkSettings, SSSuspended });
