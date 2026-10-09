
// Bulk roles prototype — shared UI built from kit parts.
const BRC = React.createContext(null);
const brSub = { font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-subtle)", margin:0 };
const brStrong = { font:"var(--hs-type-body-md-b)", color:"var(--bento-theme-color-text-base)" };
const brStatTone = { "Settled":"positive","Exploring":"info","Open question":"warning","Later":"neutral","Proposed":"info" };
const brNoun = (scope,n) => scope==="accounts" ? (n===1?"account":"accounts") : (n===1?"person":"people");
const brPlural = (n,one,many) => n===1 ? one : many;

function Mk({ n }) {
  const A = React.useContext(BRC);
  if (!A || !A.notes || (n>22 && n<31 && A.design!=="proposed")) return null;
  return <button type="button" data-br-marker={n} aria-label={"Note "+n} title={"Note "+n} onClick={(e)=>{ e.stopPropagation(); A.pickNote(n); }}
    style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,minWidth:20,borderRadius:"50%",padding:0,marginLeft:6,flex:"none",verticalAlign:"middle",cursor:"pointer",
      background:"var(--hs-bg-warning)",border:"1px solid var(--bento-theme-color-icon-warning)",color:"var(--bento-theme-color-text-base)",font:"700 12px/1 var(--bento-theme-font-families-primary)" }}>{n}</button>;
}

function BRDrawer({ title, onClose, footer, children, onNear }) {
  const { Drawer } = SS_NS();
  return (
    <div className="hs-overlay" style={{ justifyContent:"flex-end", alignItems:"stretch" }} data-br-overlay=""
      onMouseDown={(e)=>{ if (e.target===e.currentTarget && onClose) onClose(); }}
      onScrollCapture={(e)=>{ const t=e.target; if (onNear && t.classList && t.classList.contains("hs-drawer-body") && t.scrollTop+t.clientHeight > t.scrollHeight-240) onNear(); }}>
      <Drawer width={400} title={title} onClose={onClose} footer={footer} data-br-drawer="" style={{ boxShadow:"var(--bento-theme-elevation-shadow-dialog)" }}>{children}</Drawer>
    </div>
  );
}
const BRFoot = ({ children }) => <span style={{ marginLeft:"auto", display:"flex", gap:"var(--bento-space-02)" }}>{children}</span>;

function BRBack({ label, onClick }) {
  return <button type="button" onClick={onClick} style={{ display:"inline-flex",alignItems:"center",gap:8,background:"none",border:0,padding:"0 0 12px",cursor:"pointer",font:"var(--hs-type-body-md)",color:"var(--bento-theme-color-text-base)" }}>
    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20 }}>chevron_left</span>{label}</button>;
}

function BRModal({ title, onClose, actions, children }) {
  const { Modal } = SS_NS();
  return <div className="hs-overlay" data-br-overlay="" onMouseDown={(e)=>{ if (e.target===e.currentTarget) onClose(); }}><Modal title={title} onClose={onClose} actions={actions}>{children}</Modal></div>;
}

// Floating dark bar anchored to the bottom of the scrolling content.
function BRBulkBar({ label, children, onDismiss, mk }) {
  const { BulkActionBar } = SS_NS();
  return (
    <div style={{ position:"sticky", bottom:24, height:0, display:"flex", justifyContent:"center", overflow:"visible", zIndex:20, pointerEvents:"none" }}>
      <div style={{ transform:"translateY(-100%)", pointerEvents:"auto", display:"flex", alignItems:"center" }}>
        <BulkActionBar label={label} actions={children} onDismiss={onDismiss} />{mk}
      </div>
    </div>
  );
}
const BRBarBtn = ({ children, onClick, strong }) => <button type="button" className="hs-btn hs-btn--ghost" onClick={onClick} style={{ color:"var(--bento-component-snackbar-text)", fontWeight:700, height:32, padding:"0 8px" }}>{children}</button>;

function BRFootBar({ dirty, children }) {
  const { Divider } = SS_NS();
  return <div style={{ position:"sticky", bottom:0, marginTop:"auto", background:"var(--hs-surface)", zIndex:10 }}><Divider />
    <div style={{ display:"flex", alignItems:"center", gap:"var(--bento-space-02)", padding:"8px 24px", minHeight:56 }}>
      <span style={{ ...brSub, font:"var(--hs-type-body-sm)" }}>{dirty ? "You have unsaved changes" : ""}</span><BRFoot>{children}</BRFoot></div></div>;
}

// Plan for a bulk role change. items = people or accounts with .role.
function brPlan(items, roleOf, role, left) {
  const groups = {}; let same = 0;
  items.forEach((p)=>{ const r = roleOf(p); if (r===role) { same++; return; } (groups[r] = groups[r] || { role:r, ids:[], left:[] })[left.includes(p.id) ? "left" : "ids"].push(p); });
  const list = BR_ROLES.filter((r)=>groups[r]).sort((a,b)=>groups[b].ids.length+groups[b].left.length-groups[a].ids.length-groups[a].left.length).map((r)=>groups[r]);
  const changes = list.reduce((s,g)=>s+g.ids.length,0), leftN = list.reduce((s,g)=>s+g.left.length,0);
  return { groups:list, same, changes, leftN, target:items.length-leftN };
}
const brNames = (arr) => arr.length===1 ? arr[0].name : arr.length+" people";

function BRRoleRadios({ value, onChange, roles, footer }) {
  const { Radio, Tag } = SS_NS();
  return <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-04)" }}>
    {roles.map((r)=>(
      <div key={r} role="radio" aria-checked={value===r} tabIndex={0} onClick={()=>onChange(r)} onKeyDown={(e)=>{ if (e.key===" "||e.key==="Enter"){ e.preventDefault(); onChange(r); } }} style={{ display:"flex", gap:"var(--bento-space-02)", cursor:"pointer", alignItems:"flex-start" }}>
        <Radio checked={value===r} onChange={()=>onChange(r)} />
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <span style={{ display:"flex", justifyContent:"space-between", ...brStrong }}><span>{r}</span>{BR_CUSTOM.includes(r) ? <span style={{ ...brSub, font:"var(--hs-type-body-sm)" }}>Custom</span> : null}</span>
          {BR_DESC[r] && <span style={brSub}>{BR_DESC[r]}</span>}
        </div>
      </div>))}
  </div>;
}

function BRReview({ plan, role, scope, subject, chip, setChip, q, setQ, onSee, readOnly, mk }) {
  const { SearchInput, ChipAssist, ChipFilterList, Alert, Hyperlink, Divider } = SS_NS();
  const accts = scope==="accounts", p1 = role==="Publisher One";
  const noun = (n) => accts ? brPlural(n,"account","accounts") : brPlural(n,"person","people");
  const groups = plan.groups.filter((g)=>!q || (g.role+" "+(BR_DELTA[g.role]?BR_DELTA[g.role].g.join(" "):"")).toLowerCase().includes(q.toLowerCase()));
  const showG = chip!=="No change", showSame = chip!=="Changes" && plan.same>0;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-04)" }}>
      {!readOnly && <p style={{ ...brSub, color:"var(--bento-theme-color-text-base)" }}>{accts ? subject+" gets "+role+" on "+plan.target+" accounts." : role+" goes to "+plan.target+" members on YouTube Somos."} Nothing has changed yet.</p>}
      {!readOnly && p1 && <div style={{ display:"flex", alignItems:"flex-start" }}><div style={{ flex:1 }}><Alert tone="info">Approvals don’t apply on YouTube. The rest of the role does.</Alert></div>{mk&&mk[6]}</div>}
      {!readOnly && <React.Fragment>
        <SearchInput placeholder={accts ? "Search for social accounts" : "Search for members"} value={q} onChange={(e)=>setQ(e.target.value)} onClear={()=>setQ("")} />
        <ChipFilterList>{["All","Changes","No change"].map((c)=><ChipAssist key={c} icon={chip===c?"check":undefined} onClick={()=>setChip(c)} style={chip===c?{borderColor:"var(--bento-theme-color-text-base)",borderWidth:2}:undefined}>{c}</ChipAssist>)}</ChipFilterList></React.Fragment>}
      {showG && groups.map((g,gi)=>{
        const n = g.ids.length, d = BR_DELTA[g.role];
        return <React.Fragment key={g.role}><Divider />
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)" }}>
            <p style={{ ...brSub, color:"var(--bento-theme-color-text-base)" }}><strong>{n} {noun(n)}</strong> {brPlural(n,"moves","move")} from {g.role}{p1&&d ? ", "+brPlural(n,"gains","gain")+" "+d.gn+" permissions"+(d.ln ? ", "+brPlural(n,"loses","lose")+" "+d.ln : "") : ""}.{gi===0&&mk&&mk[5]}</p>
            {p1 && d && <BRDeltaRow label="Gains" items={d.g} total={d.gn} rest={d.more} />}
            {p1 && d && d.l.length>0 && <BRDeltaRow label="Loses" items={d.l} total={d.ln} />}
            {g.left.length>0 && <p style={{ ...brSub, font:"var(--hs-type-body-sm)" }}>{brNames(g.left)} {g.left.length===1?"is":"are"} left out and {brPlural(g.left.length,"stays","stay")} on {g.role}.</p>}
            {!readOnly && <span><Hyperlink href="#" onClick={(e)=>{ e.preventDefault(); onSee(g.role); }}>{g.left.length>0 ? "See all "+(n+g.left.length)+" on "+g.role : "See the "+(accts ? (n===1?"account":n+" accounts") : n+" people")}</Hyperlink></span>}
          </div></React.Fragment>;
      })}
      {showSame && <React.Fragment><Divider /><p style={brSub}>{plan.same} already {brPlural(plan.same,"has","have")} {role}. Nothing changes for {brPlural(plan.same,"it","them")}.</p></React.Fragment>}
    </div>
  );
}
function BRDeltaRow({ label, items, total, rest }) {
  const [open, setOpen] = React.useState(false);
  const more = total - items.length;
  return <div style={{ display:"grid", gridTemplateColumns:"56px 1fr", gap:"var(--bento-space-03)", alignItems:"start" }}>
    <span style={{ font:"var(--hs-type-body-sm-b)", color:"var(--bento-theme-color-text-base)" }}>{label}</span>
    <span style={{ font:"var(--hs-type-body-sm)", color:"var(--bento-theme-color-text-subtle)" }}>{items.join(", ")}{open && rest ? ", "+rest.join(", ") : ""}
      {more>0 && <button type="button" data-br-more="" onClick={()=>setOpen(!open)} style={{ display:"block", marginTop:4, padding:0, border:0, background:"none", cursor:"pointer", font:"inherit", color:"var(--bento-theme-color-text-base)", fontWeight:600, textDecoration:"underline" }}>{open ? "Show less" : more+" more"}</button>}</span></div>;
}

function BRPop({ trigger, children, align = "left", width, initialOpen }) {
  const [open, setOpen] = React.useState(!!initialOpen);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const { DropdownMenu } = SS_NS();
  return <span ref={ref} style={{ position:"relative", display:"inline-flex", verticalAlign:"middle" }}>{trigger(open, () => setOpen((o)=>!o))}
    {open && <DropdownMenu style={{ position:"absolute", top:"calc(100% + 4px)", [align]:0, zIndex:50, minWidth:width||220 }}>{children(() => setOpen(false))}</DropdownMenu>}</span>;
}

function BRPeople({ plan, group, role, scope, left, toggleLeft, q, setQ, chip, setChip, n, mk, putBack }) {
  const { SearchInput, ChipAssist, ChipFilterList, Avatar, IconButton, DropdownMenuItem } = SS_NS();
  const g = plan.groups.find((x)=>x.role===group) || { ids:[], left:[] };
  const all = g.ids.concat(g.left).sort((a,b)=>String(a.id).localeCompare(String(b.id),undefined,{numeric:true}));
  const rows = all.filter((p)=>(!q || (p.name+" "+(p.email||"")).toLowerCase().includes(q.toLowerCase())) && (chip==="All" || (chip==="Left out")===left.includes(p.id)));
  const moving = g.ids.length, lo = g.left;
  return <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-03)" }}>
    <p style={{ ...brSub, color:"var(--bento-theme-color-text-base)" }}>{moving} {brPlural(moving,scope==="accounts"?"account moves":"person moves",scope==="accounts"?"accounts move":"people move")} from {group} to {role}. {lo.length>0 ? brNames(lo)+" "+(lo.length===1?"is":"are")+" left out and "+brPlural(lo.length,"stays","stay")+" on "+group+"." : "Leave out anyone who should stay on "+group+"."}</p>
    <SearchInput placeholder="Search by name or email" value={q} onChange={(e)=>setQ(e.target.value)} onClear={()=>setQ("")} />
    <ChipFilterList>{["All","Moving","Left out"].map((c)=><ChipAssist key={c} icon={chip===c?"check":undefined} onClick={()=>setChip(c)} style={chip===c?{borderColor:"var(--bento-theme-color-text-base)",borderWidth:2}:undefined}>{c}</ChipAssist>)}</ChipFilterList>
    <div style={{ display:"flex", flexDirection:"column" }}>
      {rows.slice(0,n).map((p)=>{
        const out = left.includes(p.id);
        return <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"var(--bento-space-03)", padding:"10px 8px" }}>
          <Avatar initials={p.initials} size="md" />
          <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
            <span style={{ display:"flex", justifyContent:"space-between", ...brStrong }}><span>{p.name}</span>{out && <span style={{ font:"var(--hs-type-body-sm)", color:"var(--bento-theme-color-text-subtle)", fontWeight:400 }}>Left out</span>}</span>
            <span style={brSub}>{p.email || p.network}</span></div>
          <SSPopover align="right" width={160} trigger={(open,toggle)=><IconButton icon="more_vert" variant="ghost" size="sm" aria-label={"Actions for "+p.name} aria-expanded={open} onClick={toggle} />}>
            {(close)=><DropdownMenuItem onClick={()=>{ close(); toggleLeft(p.id); }}>{out ? (putBack || "Include again") : "Leave out"}</DropdownMenuItem>}</SSPopover>
        </div>;
      })}
    </div>
  </div>;
}

function BRPermForm({ perms, setPerms, name, setName, desc, setDesc, nameError, nameMk, startFrom, intro, top }) {
  const { Input, Textarea, Hint, Checkbox, Panel, Hyperlink, Divider } = SS_NS();
  const has = (n) => perms.includes(n), tog = (n) => setPerms(has(n) ? perms.filter((x)=>x!==n) : perms.concat(n));
  return (
    <div style={{ padding:"var(--bento-space-05)" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <Panel style={{ alignItems:"stretch", gap:"var(--bento-space-04)" }}>
          {top}
          <div><h2 style={ssTitle(22,28)}>Set up the role</h2>{intro}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}><span style={brStrong}>Role name</span>
            <div className={name?"br-clr br-clr--on":"br-clr"} style={{ position:"relative" }}><style>{".br-clr>:not(style),.br-clr input,.br-clr textarea{width:100%;box-sizing:border-box}.br-clr--on input,.br-clr--on textarea{padding-right:48px}"}</style><Input value={name} placeholder="Role name" error={!!nameError} aria-invalid={!!nameError} aria-describedby={nameError ? "br-name-err" : undefined} onChange={(e)=>setName(e.target.value)} />
              {name && <button type="button" className="hs-btn hs-btn--icon hs-btn--ghost" aria-label="Clear role name" onClick={()=>setName("")} style={{ position:"absolute", right:16, top:4, width:32, height:32, minWidth:32, padding:0, color:"var(--bento-theme-color-icon-base)" }}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20, fontVariationSettings:"'FILL' 1" }}>cancel</span></button>}</div>
            {nameError && <span style={{ display:"flex", alignItems:"flex-start" }}><Hint error id="br-name-err">{nameError}</Hint>{nameMk}</span>}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}>
            <label htmlFor="br-desc" style={brStrong}>Description <span style={{ ...brSub, font:"var(--hs-type-body-md)" }}>(optional)</span></label>
            <div className={desc?"br-clr br-clr--on":"br-clr"} style={{ position:"relative" }}><style>{".br-clr>:not(style),.br-clr input,.br-clr textarea{width:100%;box-sizing:border-box}.br-clr--on input,.br-clr--on textarea{padding-right:48px}"}</style><Textarea id="br-desc" value={desc||""} maxLength={200} placeholder="What is this role for?" onChange={(e)=>setDesc(e.target.value)} />
              {desc && <button type="button" className="hs-btn hs-btn--icon hs-btn--ghost" aria-label="Clear description" onClick={()=>setDesc("")} style={{ position:"absolute", right:16, top:8, width:32, height:32, minWidth:32, padding:0, color:"var(--bento-theme-color-icon-base)" }}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20, fontVariationSettings:"'FILL' 1" }}>cancel</span></button>}</div>
            <span style={{ ...brSub, font:"var(--hs-type-body-sm)" }} aria-live="polite">{(desc||"").length} / 200</span></div>
          {startFrom}
          {BR_GROUPS.map(([g,items])=>{ const on = items.filter(([n])=>has(n)).length, all = on===items.length;
            return <div key={g}><Divider /><div style={{ padding:"var(--bento-space-03) 0 0", ...brSub, font:"var(--hs-type-body-sm)" }}>{g}</div>
              <SSRow label="Select all" control={<React.Fragment><span style={brSub}>{on} of {items.length} turned on</span><Checkbox aria-label={"Select all permissions in "+g} checked={all} indeterminate={on>0&&!all} onChange={()=>setPerms(all ? perms.filter((x)=>!items.some(([n])=>n===x)) : Array.from(new Set(perms.concat(items.map(([n])=>n)))))} /></React.Fragment>} divider={false} />
              {items.map(([n,d])=><SSRow key={n} label={n} desc={d} divider={false} control={<span data-br-perm={n}><Checkbox aria-label={n} checked={has(n)} onChange={()=>tog(n)} /></span>} />)}</div>; })}
        </Panel>
      </div>
    </div>
  );
}
Object.assign(window,{BRPop,BRC,Mk,BRDrawer,BRFoot,BRBack,BRModal,BRBulkBar,BRBarBtn,BRFootBar,brPlan,BRRoleRadios,BRReview,BRPeople,BRPermForm,brSub,brStrong,brStatTone,brNames});
