// Bulk roles MVP, the bulk drawer (pick, applying in the drawer, who failed, trying again) and the save confirm.
// 8 Oct lock session: Apply goes straight to In progress in the drawer. The review step (counts only) is kept only for
// the "Cut on 8 Oct" row of the board (screen x.1); nothing in the MVP flow opens it.
const mvpMembers = (n) => n + (n === 1 ? " member" : " members");
function mvpPlan(items, role) {
  const groups = {}; let same = 0;
  items.forEach((p) => { if (p.role === role) { same++; return; } (groups[p.role] = groups[p.role] || { role:p.role, ids:[] }).ids.push(p); });
  const rank = (r) => { const i = MVP_REVIEW_ORDER.indexOf(r); return i < 0 ? 50 : i; };
  const list = Object.values(groups).sort((a, b) => rank(a.role) - rank(b.role));
  return { groups:list, same, changes:list.reduce((s, g) => s + g.ids.length, 0) };
}

function MVPFailList({ ids, people }) {
  const { Avatar } = SS_NS();
  return <div style={{ display:"flex", flexDirection:"column" }}>{ids.map((id) => { const p = people.find((x) => x.id === id); if (!p) return null;
    return <div key={id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0" }}><Avatar initials={p.initials} size="md" />
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}><span style={mvpStrong}>{p.name}</span><span style={mvpSub}>{p.email}</span></div><span style={mvpSub}>Couldn’t update</span></div>; })}</div>;
}

// Figma 1.2 / 2.2: a 40 spinner over centred text, in the middle of the drawer body.
function MVPLoading({ title, body }) {
  const { Spinner } = SS_NS();
  return (
    <div data-mvp-applying="" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, textAlign:"center" }}>
      {Spinner ? <Spinner size={40} /> : null}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <span style={{ font:"600 16px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>{title}</span>
        <span style={{ font:"400 14px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-subtle)" }}>{body}</span>
      </div>
    </div>);
}

function MVPBulkDrawer() {
  const A = React.useContext(MVPC), b = A.bulk, job = A.job;
  const { Button, Alert, SearchInput, Hyperlink, Divider } = SS_NS();
  const [rq, setRq] = React.useState("");
  const items = A.people.filter((p) => A.sel.includes(p.id));
  const plan = mvpPlan(items, b.role);
  const title = "Role for " + mvpMembers(items.length);
  const set = (patch) => A.setBulk({ ...b, ...patch });

  if (b.step === "pick") {
    const rl = A.roleRows.map((r) => r.name).filter((r) => r.toLowerCase().includes(rq.trim().toLowerCase()));  // the live roles list (Figma 1.1: 6 roles)
    return (
      <BRDrawer title={title} onClose={() => A.setBulk(null)} footer={
        <BRFoot><Button variant="secondary" onClick={() => A.setBulk(null)}>Cancel</Button><Button variant="primary" disabled={!items.length || !b.role} onClick={() => A.startApply(items)}>{(MVP_UT && b.role ? "Give " + b.role + " to " : "Apply to ") + mvpMembers(items.length)}</Button></BRFoot>}>
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)" }}>Pick the role to apply to the {items.length} selected.</p>
        {/* MVP 1.1 (Figma 10/8): Manage roles sits at the top under the intro, far from Apply. */}
        <p data-mvp-manage-roles="" style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:16 }}>Don’t see the role you need? <Hyperlink href="#" onClick={(e) => { e.preventDefault(); A.manageRoles(); }}>Manage roles</Hyperlink></p>
        <SearchInput placeholder="Search roles" aria-label="Search roles" value={rq} onChange={(e) => setRq(e.target.value)} onClear={() => setRq("")} />
        <div style={{ height:16 }} />
        {/* Only the list scrolls, so Manage roles and search stay in view with 20+ roles (1.1 note). */}
        <div data-mvp-role-list="" style={{ maxHeight:"calc(100vh - 380px)", minHeight:160, overflowY:"auto", margin:"0 -4px", padding:"0 4px" }}>
        {rl.length ? <BRRoleRadios value={b.role} onChange={(r) => set({ role:r })} roles={rl} /> : <p style={mvpSub}>No roles match “{rq}”.</p>}
        </div>
      </BRDrawer>);
  }

  if (b.step === "review") {
    const noun = (k) => k === 1 ? "person" : "people";
    return (
      <BRDrawer title="Review changes" onClose={() => A.setBulk(null)} footer={<BRFoot><Button variant="secondary" onClick={() => set({ step:"pick" })}>Back</Button>
        <Button variant="primary" disabled={plan.changes === 0} onClick={() => A.startLegacy(plan)}>{"Apply to " + mvpMembers(plan.changes)}</Button></BRFoot>}>
        <BRBack label={title} onClick={() => set({ step:"pick" })} />
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:16 }}>{plan.changes} {plan.changes === 1 ? "person moves" : "people move"} to {b.role}.{plan.same > 0 ? " " + plan.same + " already " + (plan.same === 1 ? "has" : "have") + " it." : ""} Nothing has changed yet.</p>
        <div data-mvp-counts="" style={{ display:"flex", flexDirection:"column" }}>
          {plan.groups.map((g) => <React.Fragment key={g.role}>
            <div style={{ display:"flex", flexDirection:"column", padding:"16px 0" }}><span style={mvpStrong}>{g.role}</span><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{g.ids.length} {noun(g.ids.length)}</span></div>
            <div style={{ margin:"0 -16px" }}><Divider /></div></React.Fragment>)}
        </div>
      </BRDrawer>);
  }

  // Row 6 (6.3): opened only from the roles list banner. Only exact matches are listed; Give ... runs the same job as MVP 1.2.
  if (b.step === "offer") {
    const o = A.offer; if (!o) return null;
    const list = A.people.filter((p) => o.ids.includes(p.id)), n = list.length, give = "Give " + o.role + " to " + mvpMembers(n);
    const { Avatar } = SS_NS();
    return (
      <BRDrawer title={give} onClose={() => A.setBulk(null)} footer={<BRFoot><Button variant="secondary" onClick={() => A.setBulk(null)}>Cancel</Button><Button variant="primary" disabled={!n} onClick={() => A.startOffer()}>{give}</Button></BRFoot>}>
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:16 }}>{"Their custom permissions on " + A.acct.name + " match " + o.role + " exactly, so what they can do doesn’t change."}</p>
        <Alert tone="info">{"Only people with exactly the same permissions are listed." + (o.near ? " " + o.near + (o.near === 1 ? " person" : " people") + " with similar permissions aren’t included." : "")}</Alert>
        <div data-mvp-offer-list="" style={{ display:"flex", flexDirection:"column", marginTop:8 }}>{list.map((p) => <div key={p.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0" }}><Avatar initials={p.initials} size="md" />
          <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}><span style={mvpStrong}>{p.name}</span><span style={{ ...mvpSub, overflow:"hidden", textOverflow:"ellipsis" }}>{p.email}</span></div><span style={{ ...mvpSub, whiteSpace:"nowrap" }}>{A.acct.name}</span></div>)}</div>
      </BRDrawer>);
  }

  if (!job) return null;
  // MVP 1.2: Applying, in the drawer. No bar, no percentage, no diff list. Closing it pauses the page behind it until it ends.
  if (b.step === "applying") return (
    <BRDrawer title={"Role for " + mvpMembers(job.total)} onClose={() => A.closeApplying()} footer={<BRFoot><Button variant="secondary" onClick={() => A.closeApplying()}>Close</Button></BRFoot>}>
      <MVPLoading title={"Applying " + job.role + " to " + mvpMembers(job.total) + "."} body="In progress. You’ll get a notification when it’s done, even if you close this." />
    </BRDrawer>);
  if (job.phase === "retry") return (
    <BRDrawer title={"Role for " + mvpMembers(job.total)} onClose={() => A.closeRun()} footer={<BRFoot><Button variant="secondary" onClick={() => A.closeRun()}>Close</Button></BRFoot>}>
      <MVPLoading title={"Applying " + job.role + " to " + mvpMembers(job.failed.length) + "."} body="In progress. You can leave this page." />
    </BRDrawer>);
  const failedN = job.failed.length, ok = job.total - failedN;
  return (
    <BRDrawer title={"Role for " + mvpMembers(job.total)} onClose={() => A.finish()} footer={<BRFoot>{MVP_UT
      // Round 2 (14 Oct, test mode): Try again is the primary action. Round 1: "Try again for 2" sat next to Done and P549 fixed them by hand.
      ? <React.Fragment><Button variant="secondary" onClick={() => A.finish()}>Done</Button><Button variant="primary" onClick={() => A.retry()}>Try again for {failedN}</Button></React.Fragment>
      : <React.Fragment><Button variant="secondary" onClick={() => A.retry()}>Try again for {failedN}</Button><Button variant="primary" onClick={() => A.finish()}>Done</Button></React.Fragment>}</BRFoot>}>
      <Alert tone="warning" title={ok + " of " + job.total + " updated. " + failedN + (job.retries ? " still" : "") + " need a look."}>{job.retries ? "Tried again at 2:16 PM. The ones that worked stay applied." : "The ones that worked stay applied."}</Alert>
      <div style={{ height:8 }} />
      <MVPFailList ids={job.failed} people={A.people} />
    </BRDrawer>);
}

function MVPSaveModal() {
  const A = React.useContext(MVPC), e = A.edit;
  const { Button } = SS_NS();
  const n = (A.roleRows.find((r) => r.name === e.origName) || { count:0 }).count;
  return <BRModal title={"Save changes to " + e.origName + "?"} onClose={() => A.setSaveModal(false)} actions={<React.Fragment><Button variant="secondary" onClick={() => A.setSaveModal(false)}>Cancel</Button><Button variant="primary" onClick={() => A.confirmSave()}>Save and update {n} people</Button></React.Fragment>}>
    <p style={ssBody}>This updates {n} people on 12 social accounts. It runs in the background, so some people keep the old version for a few minutes.</p></BRModal>;
}
// MVP 3.4: one confirm before a role nobody has is deleted (Figma 10/8). Cancel or close keeps it.
function MVPDeleteModal() {
  const A = React.useContext(MVPC), name = A.delModal;
  const { Button } = SS_NS();
  return <BRModal title={"Delete " + name + "?"} onClose={() => A.closeDelete()} actions={<React.Fragment><Button variant="secondary" onClick={() => A.closeDelete()}>Cancel</Button><Button variant="primary" onClick={() => A.confirmDelete()}>Delete role</Button></React.Fragment>}>
    <p style={ssBody}>Nobody has this role, so no one’s access changes.</p></BRModal>;
}
Object.assign(window, { mvpMembers, mvpPlan, MVPFailList, MVPBulkDrawer, MVPSaveModal, MVPDeleteModal });
