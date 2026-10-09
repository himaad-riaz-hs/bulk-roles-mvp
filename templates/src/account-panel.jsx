
// account-panel.jsx — global-nav Account menu (opens from the rail avatar).
//
// RE-MEASURED 2026-10-06 (production, read only): no longer a full-height panel. A popover anchored at the
// bottom left, just right of the rail above the avatar: 441 wide, ~594 tall, #FDFDFD, radius 8, standard
// elevation. Top to bottom: name (26/600) · "Employee plan" chip · "Take the Social OS tour" row with a "New"
// chip · four 80px rows (Settings, MCP connectors, Apps, Help) · Sign out. No section headings; the old
// SETTINGS and HELP & RESOURCES lists are gone. Geometry and type in account-panel.css.
//
// DELIBERATE DIVERGENCE (kept): ours declares role="dialog" / aria-modal on the popover; production does not.
// On open, focus goes to the first row, not the container. Esc and a click outside close it.

const ACP_ROWS = [
  { icon: "settings", title: "Settings", desc: "Manage account and organization settings" },
  { icon: "hub",      title: "MCP connectors", desc: "Connect your AI tools to Hootsuite" },
  { icon: "widgets",  title: "Apps", desc: "Discover and install apps for Hootsuite" },
  { icon: "help",     title: "Help", desc: "Find answers, get support, or take the tour" },
];

function AccountPanel({ open, onClose, name }) {
  const firstRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    if (firstRef.current) firstRef.current.focus({ preventScroll: true });
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <React.Fragment>
      <div className="acp-scrim" onClick={onClose}></div>
      <div className="acp-panel" id="global-nav-account-panel" role="dialog" aria-modal="true" aria-label="Account, subscription, and preferences">
        <div className="acp-head">
          <h2>{name || "Ryan Williams"}</h2>
          <span className="acp-plan"><span className="material-symbols-outlined" aria-hidden="true">person</span>Employee plan</span>
        </div>
        <button className="acp-promo" type="button" ref={firstRef}>
          <span className="material-symbols-outlined" aria-hidden="true">preview</span>
          <span className="t">Take the Social OS tour</span>
          <span className="acp-new">New</span>
        </button>
        <div className="acp-body">
          {ACP_ROWS.map(r => (
            <button key={r.title} className="acp-row" type="button">
              <span className="material-symbols-outlined" aria-hidden="true">{r.icon}</span>
              <span className="tx"><span className="ti">{r.title}</span><span className="de">{r.desc}</span></span>
            </button>
          ))}
        </div>
        <div className="acp-foot">
          <button className="acp-signout" type="button"><span className="material-symbols-outlined" aria-hidden="true">logout</span>Sign out</button>
        </div>
      </div>
    </React.Fragment>
  );
}

if (typeof window !== "undefined") { window.AccountPanel = AccountPanel; }
