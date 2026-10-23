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

// rows = how many rows show before the list scrolls (Figma 2.5 shows 9 of the 48, with the rest of the drawer empty below).
function MVPFailList({ ids, people, old, rows }) {
  const { Avatar } = SS_NS();
  return <div data-mvp-fail-list="" style={{ display:"flex", flexDirection:"column", ...(rows && ids.length > rows ? { maxHeight:rows * 80, overflowY:"auto" } : null) }}>{ids.map((id) => { const p = people.find((x) => x.id === id); if (!p) return null;
    // Figma 2.1, 2.3, 2.5: rows 80 apart (16 above and below). Test mode keeps 12.
    // Figma: the avatar in a 56 container, so the name starts 16 after it (test mode keeps 12).
    return <div key={id} style={{ display:"flex", alignItems:"flex-start", gap:old ? 12 : 16, padding:old ? "12px 0" : "16px 0" }}><Avatar initials={p.initials} size="md" />
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}><span style={mvpStrong}>{p.name}</span><span style={mvpSub}>{p.email}</span></div>{old && <span style={mvpSub}>Couldn’t update</span>}</div>; })}</div>;
}

// Figma 1.2 / 2.2: a 40 spinner over centred text, in the middle of the drawer body. Figma centres it on the body frame, which runs
// behind the footer to the drawer's bottom edge, so review mode adds the footer's 56 above it to land on the same centre line.
// lower: Figma 2.2 (trying again) pads the drawer body 54 instead of 16, so its block sits 19 lower than 1.2's.
function MVPLoading({ title, body, lower }) {
  const { Spinner } = SS_NS();
  return (
    <div data-mvp-applying="" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, textAlign:"center", paddingTop:MVP_FIG ? (lower ? 94 : 56) : 0 }}>
      {Spinner ? <Spinner size={40} /> : null}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <span style={{ font:"600 16px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)" }}>{title}</span>
        <span style={{ font:"400 14px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-subtle)" }}>{body}</span>
      </div>
    </div>);
}

function MVPBulkDrawer() {
  const A = React.useContext(MVPC), b = A.bulk, job = A.job, old = mvpOld(A);
  const { Button, Alert, SearchInput, Hyperlink, Divider, IconButton } = SS_NS();
  const [rq, setRq] = React.useState("");
  const items = A.people.filter((p) => A.sel.includes(p.id));
  const plan = mvpPlan(items, b.role);
  // Figma: "Change role for 48 members" on every step of the drawer. Test mode and the cut screens keep "Role for 48 members".
  const titleFor = (k) => (old ? "Role for " : "Change role for ") + mvpMembers(k);
  const title = titleFor(items.length);
  const updating = (k, role) => "Updating " + mvpMembers(k) + " to " + role;
  const set = (patch) => A.setBulk({ ...b, ...patch });

  if (b.step === "pick") {
    const rl = A.roleRows.map((r) => r.name).filter((r) => r.toLowerCase().includes(rq.trim().toLowerCase()));  // the live roles list (Figma 1.1: 6 roles)
    return (
      <BRDrawer title={title} onClose={() => A.setBulk(null)} footer={
        <BRFoot><Button variant="secondary" onClick={() => A.setBulk(null)}>Cancel</Button><Button variant="primary" disabled={!items.length || !b.role} onClick={() => A.startApply(items)}>{old ? (MVP_UT && b.role ? "Give " + b.role + " to " : "Apply to ") + mvpMembers(items.length) : b.role ? "Change to " + b.role : "Change role"}</Button></BRFoot>}>
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)" }}>{old ? "Pick the role to apply to the " + items.length + " selected." : "This replaces each member’s current role or custom permissions."}</p>
        {/* MVP 1.1 (Figma 10/8): Manage roles sits at the top under the intro, far from Apply. */}
        <p data-mvp-manage-roles="" style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:16, marginTop:MVP_FIG ? 4 : 0 }}>Don’t see the role you need? <Hyperlink href="#" onClick={(e) => { e.preventDefault(); A.manageRoles(); }}>Manage roles</Hyperlink></p>
        <SearchInput placeholder="Search roles" aria-label="Search roles" value={rq} onChange={(e) => setRq(e.target.value)} onClear={() => setRq("")} />
        <div style={{ height:16 }} />
        {/* Only the list scrolls, so Manage roles and search stay in view with 20+ roles (1.1 note). */}
        <div data-mvp-role-list="" style={{ maxHeight:"calc(100vh - 380px)", minHeight:160, overflowY:"auto", margin:"0 -4px", padding:"0 4px" }}>
        {rl.length ? <MVPRoleRadios value={b.role} onChange={(r) => set({ role:r })} roles={rl} old={old} /> : <p style={mvpSub}>No roles match “{rq}”.</p>}
        </div>
      </BRDrawer>);
  }

  if (b.step === "review") {
    const noun = (k) => k === 1 ? "person" : "people";
    return (
      <BRDrawer title="Review changes" onClose={() => A.setBulk(null)} footer={<BRFoot><Button variant="secondary" onClick={() => set({ step:"pick" })}>Back</Button>
        <Button variant="primary" disabled={plan.changes === 0} onClick={() => A.startLegacy(plan)}>{"Apply to " + mvpMembers(plan.changes)}</Button></BRFoot>}>
        {/* Figma Cut 8 Oct (x.1): the back row under the drawer header (a 40 icon button 8 in, the label at 48), the lead 12 above
            the groups, each group an 80 list item with its line inside, the count at 16. The board's x.1 is the only way in. */}
        <div style={{ margin:"-16px -24px 16px", height:56, display:"flex", alignItems:"center", padding:"0 16px 0 8px", boxSizing:"border-box" }}>
          <IconButton icon="keyboard_arrow_left" variant="ghost" aria-label={"Back to " + title} onClick={() => set({ step:"pick" })} />
          <span style={{ font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-base)" }}>{title}</span></div>
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:12 }}>{plan.changes} {plan.changes === 1 ? "person moves" : "people move"} to {b.role}.{plan.same > 0 ? " " + plan.same + " already " + (plan.same === 1 ? "has" : "have") + " it." : ""} Nothing has changed yet.</p>
        <div data-mvp-counts="" style={{ display:"flex", flexDirection:"column" }}>
          {plan.groups.map((g) => <div key={g.role} style={{ display:"flex", flexDirection:"column", padding:"16px 0", height:80, boxSizing:"border-box", borderBottom:"1px solid var(--bento-theme-color-border-subtle)" }}><span style={mvpStrong}>{g.role}</span><span style={mvpSub}>{g.ids.length} {noun(g.ids.length)}</span></div>)}
        </div>
      </BRDrawer>);
  }

  if (!job) return null;
  // MVP 1.2: Applying, in the drawer. No bar, no percentage, no diff list. Closing it pauses the page behind it until it ends.
  if (b.step === "applying") return (
    <BRDrawer title={titleFor(job.total)} onClose={() => A.closeApplying()} footer={<BRFoot><Button variant="secondary" onClick={() => A.closeApplying()}>Close</Button></BRFoot>}>
      {old ? <MVPLoading title={"Applying " + job.role + " to " + mvpMembers(job.total) + "."} body="In progress. You’ll get a notification when it’s done, even if you close this." />
        : <MVPLoading title={updating(job.total, job.role)} body="You can close this. We’ll notify you when it’s done." />}
    </BRDrawer>);
  if (job.phase === "retry") return (
    <BRDrawer title={old ? titleFor(job.total) : titleFor(job.failed.length)} onClose={() => A.closeRun()} footer={<BRFoot><Button variant="secondary" onClick={() => A.closeRun()}>Close</Button></BRFoot>}>
      {old ? <MVPLoading title={"Applying " + job.role + " to " + mvpMembers(job.failed.length) + "."} body="In progress. You can leave this page." />
        : <MVPLoading lower title={updating(job.failed.length, job.role)} body="You can close this. We’ll notify you when it’s done." />}
    </BRDrawer>);
  const failedN = job.failed.length, ok = job.total - failedN;
  // Figma 2.5, None updated (review mode): the negative banner, everyone who didn't get the role, and Try again for all of them.
  // Members who already had the role are left out of the list (Figma lists 9 named people under "48", without Bryn Morales).
  if (!MVP_UT && !old && failedN >= job.total) {
    const list = job.failed.filter((id) => { const p = A.people.find((x) => x.id === id); return p && p.role !== job.role; });
    return (
      <BRDrawer title={titleFor(job.total)} onClose={() => A.finish()} footer={<BRFoot><Button variant="secondary" onClick={() => A.finish()}>Close</Button><Button variant="primary" onClick={() => A.retry()}>Try again</Button></BRFoot>}>
        <Alert tone="negative" title="Role change failed">{"We couldn’t update the " + mvpMembers(job.total) + " below. Their roles didn’t change."}</Alert>
        <div style={{ height:16 }} />{/* Figma drawer body gap 16 */}
        <MVPFailList ids={list} people={A.people} rows={9} />
      </BRDrawer>);
  }
  return (
    <BRDrawer title={titleFor(job.total)} onClose={() => A.finish()} footer={<BRFoot>{MVP_UT
      // Round 2 (14 Oct, test mode): Try again is the primary action. Round 1: "Try again for 2" sat next to Done and P549 fixed them by hand.
      ? <React.Fragment><Button variant="secondary" onClick={() => A.finish()}>Done</Button><Button variant="primary" onClick={() => A.retry()}>Try again for {failedN}</Button></React.Fragment>
      : old ? <React.Fragment><Button variant="secondary" onClick={() => A.retry()}>Try again for {failedN}</Button><Button variant="primary" onClick={() => A.finish()}>Done</Button></React.Fragment>
      // Figma 2.1 and 2.3: Close, and Try again for 2 members as the primary action.
      : <React.Fragment><Button variant="secondary" onClick={() => A.finish()}>Close</Button><Button variant="primary" onClick={() => A.retry()}>{"Try again for " + mvpMembers(failedN)}</Button></React.Fragment>}</BRFoot>}>
      {old ? <Alert tone="warning" title={ok + " of " + job.total + " updated. " + failedN + (job.retries ? " still" : "") + " need a look."}>{job.retries ? "Tried again at 2:16 PM. The ones that worked stay applied." : "The ones that worked stay applied."}</Alert>
        : <Alert tone="warning" title={mvpMembers(failedN) + " couldn’t be updated"}>{"The other " + ok + (ok === 1 ? " was" : " were") + " updated to " + job.role + "."}</Alert>}
      <div style={{ height:old ? 8 : 16 }} />{/* Figma 2.1, 2.3: drawer body gap 16 */}
      <MVPFailList ids={job.failed} people={A.people} old={old} />
    </BRDrawer>);
}

// Person side (Figma p.1, p.2): the same picker as the account side, titled with the accounts, then In progress in the drawer.
function MVPPersonDrawer() {
  const A = React.useContext(MVPC), b = A.pbulk;
  const { Button, SearchInput, Hyperlink } = SS_NS();
  const [rq, setRq] = React.useState("");
  const n = b.step === "applying" && A.pjob ? A.pjob.ids.length : A.psel.length, accts = n + (n === 1 ? " social account" : " social accounts");
  const title = "Change role on " + accts;
  if (b.step === "pick") {
    const rl = A.roleRows.map((r) => r.name).filter((r) => r.toLowerCase().includes(rq.trim().toLowerCase()));
    return (
      <BRDrawer title={title} onClose={() => A.setPbulk(null)} footer={<BRFoot><Button variant="secondary" onClick={() => A.setPbulk(null)}>Cancel</Button><Button variant="primary" disabled={!n || !b.role} onClick={() => A.startPersonApply(A.psel.slice(), b.role)}>{b.role ? "Change to " + b.role : "Change role"}</Button></BRFoot>}>
        <span data-mvp-person-drawer="" hidden />
        <p style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)" }}>{"This replaces " + MVP_PERSON.name + "’s current role or custom permissions on each social account."}</p>
        <p data-mvp-manage-roles="" style={{ ...mvpSub, color:"var(--bento-theme-color-text-base)", marginBottom:16, marginTop:MVP_FIG ? 4 : 0 }}>Don’t see the role you need? <Hyperlink href="#" onClick={(e) => { e.preventDefault(); A.manageRoles(); }}>Manage roles</Hyperlink></p>
        <SearchInput placeholder="Search roles" aria-label="Search roles" value={rq} onChange={(e) => setRq(e.target.value)} onClear={() => setRq("")} />
        <div style={{ height:16 }} />
        <div data-mvp-role-list="" style={{ maxHeight:"calc(100vh - 380px)", minHeight:160, overflowY:"auto", margin:"0 -4px", padding:"0 4px" }}>
          {rl.length ? <MVPRoleRadios value={b.role} onChange={(r) => A.setPbulk({ ...b, role:r })} roles={rl} /> : <p style={mvpSub}>No roles match “{rq}”.</p>}
        </div>
      </BRDrawer>);
  }
  return (
    <BRDrawer title={title} onClose={() => A.closePerson()} footer={<BRFoot><Button variant="secondary" onClick={() => A.closePerson()}>Close</Button></BRFoot>}>
      <span data-mvp-person-drawer="" hidden />
      <MVPLoading title={"Updating to " + b.role + " on " + accts} body="You can close this. We’ll notify you when it’s done." />
    </BRDrawer>);
}

function MVPSaveModal() {
  const A = React.useContext(MVPC), e = A.edit, old = mvpOld(A);
  const { Button } = SS_NS();
  const n = (A.roleRows.find((r) => r.name === e.origName) || { count:0 }).count;
  // data-mvp-modal: Figma places the two confirms differently (5.2 centred 12 above the frame centre, 3.4 12 below); MVP_FIG2_CSS.
  return <div data-mvp-modal="save" style={{ display:"contents" }}><BRModal title={"Save changes to " + e.origName + "?"} onClose={() => A.setSaveModal(false)} actions={<React.Fragment><Button variant="secondary" onClick={() => A.setSaveModal(false)}>Cancel</Button><Button variant="primary" onClick={() => A.confirmSave()}>{old ? "Save and update " + n + " people" : "Save changes"}</Button></React.Fragment>}>
    <p style={ssBody}>{old ? "This updates " + n + " people on 12 social accounts. It runs in the background, so some people keep the old version for a few minutes." : "This will update permissions for " + mvpMembers(n) + " on 12 social accounts. It may take a few minutes."}</p></BRModal></div>;
}
// MVP 3.4: one confirm before a role nobody has is deleted (Figma 10/8). Cancel or close keeps it.
function MVPDeleteModal() {
  const A = React.useContext(MVPC), name = A.delModal, old = mvpOld(A);
  const { Button } = SS_NS();
  return <div data-mvp-modal="delete" style={{ display:"contents" }}><BRModal title={"Delete " + name + "?"} onClose={() => A.closeDelete()} actions={<React.Fragment><Button variant="secondary" onClick={() => A.closeDelete()}>Cancel</Button><Button variant="primary" onClick={() => A.confirmDelete()}>Delete role</Button></React.Fragment>}>
    <p style={ssBody}>{old ? "Nobody has this role, so no one’s access changes." : "No members have this role, so deleting it won’t affect anyone. This can’t be undone."}</p></BRModal></div>;
}
Object.assign(window, { mvpMembers, mvpPlan, MVPFailList, MVPBulkDrawer, MVPPersonDrawer, MVPSaveModal, MVPDeleteModal });
