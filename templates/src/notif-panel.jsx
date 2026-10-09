// notif-panel.jsx — global-nav Notifications, built to the FULLY MEASURED
// production spec (2026-09-06). Geometry, type and row anatomy in
// notif-panel.css; read that header before changing anything here.
//
// Trigger, verbatim, confirmed live (aria-expanded flips false → true on open):
//   <button aria-label="Notifications" aria-haspopup="dialog"
//           aria-expanded="false" aria-controls="global-nav-notifications-panel">
// Panel: role="dialog" · aria-modal="true" · 536px · full-viewport height ·
// absolute · #FDFDFD · NO shadow · NO radius. A flush full-height panel, not a
// floating card, not a dropdown, not a popover, and not the page we first built
// (archived at src/_archive-notifications-fullpage.jsx).
//
// A11Y, UNCONFIRMED — DELIBERATELY NOT ACTED ON AS A DIVERGENCE: production's
// aria-label is null; whether it carries aria-labelledby pointing at the heading
// was not checked. We use aria-labelledby against the heading, which is correct
// under either reading, so nothing is claimed about production until design
// verifies the attribute.
//
// STATEFUL-CONTROL NAMING (house rule, four production instances): the range
// control's accessible name is "Date range" while its visible text is the
// current value — same pattern as "Switch agent — currently Perch" and
// "More actions, Volume: Tags".
//
// DATA REALISM: production's live rows are Hootsuite's internal E2E test data
// (async-publish test strings, bracketed date prefixes, emoji, bare domains,
// account names). None of it is reproduced. The rows below match the SHAPE: a
// bolded title sentence, a messy preview that may carry emoji or a URL, a
// COMPACT RELATIVE timestamp ("1d", not "1 day ago"), and a
// `Product · Category` breadcrumb with a middle dot, using the user-facing
// product name. Every production row carried a breadcrumb.
//
// Rows (re-measured 2026-10-06): 40px avatar left (profile/app avatar, network badge
// where the item belongs to a network), title 16/600 up to 2 lines, preview, then the
// Product · Category line; time on the right with an 8px unread dot under it.

const NFP_ROWS = [
  { id: 1, unread: true,  title: "Maria Rossi requested approval on a post for @somos", preview: "[Sep 08] “Plan your next impulse purchase on the go ☀️” → somos.example/app", product: "Perch", cat: "Approvals", time: "1d", av: "MR", net: "instagram" },
  { id: 2, unread: true,  title: "A scheduled post failed to publish", preview: "async-publish-test-4471 rejected: page token expired for somos.bank", product: "Perch", cat: "Publishing", time: "1d", av: "SB", net: "facebook" },
  { id: 3, unread: true,  title: "Daniel Okafor mentioned you in an internal comment", preview: "“can you take the EMEA thread before it goes out tues” 🙏", product: "Nest", cat: "Internal comments", time: "2d", av: "DO" },
  { id: 4, unread: false, title: "Mentions of #GiveAHoot are up 240%", preview: "Spike detected against the trailing 7-day average — 1,204 new mentions", product: "Lumen", cat: "Social activity", time: "3d", av: "GH", net: "x" },
  { id: 5, unread: false, title: "A post was held for policy review", preview: "restricted-claims rule matched in profile “Standard staff” — review required", product: "Vigil", cat: "Compliance", time: "4d", av: "ST", net: "linkedin" },
];

function NfpAvatar({ n }) {
  const B = window.BentoHootsuiteDesignSystem_a1ac47 || {};
  if (n.net && B.NetworkAvatar) return <B.NetworkAvatar network={n.net} initials={n.av} />;
  if (B.Avatar) return <B.Avatar initials={n.av} size="md" />;
  return <span className="nfp-avfb" aria-hidden="true">{n.av}</span>;
}
function NfpRow({ n, onOpen }) {
  const [read, setRead] = React.useState(false);
  const unread = n.unread && !read;
  return (
    // STAND-IN (production not clicked: it marks the item read): any row marks itself read, closes the panel and opens the row's product like the rail does.
    <button className="nfp-row" type="button" aria-label={(unread ? "Unread. " : "") + n.title} onClick={() => { setRead(true); if (onOpen) onOpen(n.product.toLowerCase()); }}>
      <span className="nfp-av"><NfpAvatar n={n} /></span>
      <span className="nfp-main">
        <span className="nfp-rowtitle">{n.title}</span>
        <span className="nfp-preview">{n.preview}</span>
        <span className="nfp-crumb">{n.product} · {n.cat}</span>
      </span>
      <span className="nfp-side">
        <span className="nfp-time">{n.time}</span>
        {unread && <span className="nfp-dot" aria-hidden="true"></span>}
      </span>
    </button>
  );
}

function NotifPanel({ open, onClose, onOpenProduct }) {
  const [tab, setTab] = React.useState("all");
  const panelRef = React.useRef(null);
  const headRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    if (headRef.current) headRef.current.focus({ preventScroll: true });
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const rows = tab === "unread" ? NFP_ROWS.filter(n => n.unread) : NFP_ROWS;

  return (
    <React.Fragment>
      <div className="nfp-scrim" onClick={onClose}></div>
      <div
        className="nfp-panel"
        id="global-nav-notifications-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-nav-notifications-title"
        ref={panelRef}
      >
        <div className="nfp-head">
          <h2 id="global-nav-notifications-title" tabIndex={-1} ref={headRef}>Notifications</h2>
          <button className="nfp-viewall" type="button">View all</button>
          <button className="hs-btn hs-btn--icon hs-btn--ghost nfp-iconbtn" type="button" aria-label="Notification settings" title="Notification settings"><span className="material-symbols-outlined">settings</span></button>
          <button className="hs-btn hs-btn--icon hs-btn--ghost nfp-iconbtn" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </div>

        {/* Selection here is COLOUR, not weight — both tabs are weight 600.
            The opposite of the drawer nav. Do not apply the nav rule. */}
        <div className="nfp-ctrl">
        <div className="nfp-tabs" role="tablist" aria-label="Notification filters">
          <button className="nfp-tab" type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>All</button>
          <button className="nfp-tab" type="button" role="tab" aria-selected={tab === "unread"} onClick={() => setTab("unread")}>Unread</button>
        </div>

        <div className="nfp-filters">
          <button className="hs-btn hs-btn--icon hs-btn--ghost nfp-markall" type="button" aria-label="Mark all as read" title="Mark all as read"><span className="material-symbols-outlined" aria-hidden="true">mark_chat_read</span></button>
          <button className="nfp-range" type="button" aria-label="Date range" aria-haspopup="listbox" aria-expanded="false">Last 30 days<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
        </div>
        </div>

        <div className="nfp-list">
          {rows.length === 0
            ? <div className="nfp-empty">You’re all caught up — nothing unread in the last 30 days.</div>
            : rows.map(n => <NfpRow key={n.id} n={n} onOpen={(id) => { onClose(); if (onOpenProduct) onOpenProduct(id); }} />)}
        </div>
      </div>
    </React.Fragment>
  );
}

if (typeof window !== "undefined") { window.NotifPanel = NotifPanel; }
