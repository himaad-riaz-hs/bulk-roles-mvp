// Suite Settings — shared page parts. Every element is a bundle export or an
// .hs-* class; these functions only compose them.
// Heading type comes from the type tokens (26/32 title-section, 22 title-sub). 22 keeps its 28px line height, as before.
const ssTitle = (size, lh) => ({ font: size === 26 ? "var(--hs-type-title-section)" : "var(--hs-type-title-sub)", lineHeight: lh + "px", color: "var(--bento-theme-color-text-base)", margin: 0 });
const ssBody = { font: "var(--hs-type-body-md)", color: "var(--bento-theme-color-text-base)", margin: 0 };
const ssSubtle = { font: "var(--hs-type-body-md)", color: "var(--bento-theme-color-text-subtle)", margin: 0 };

function SSPageHeader({ title, actions }) {
  const { Header } = SS_NS();
  return <Header variant="page" title={title} actions={actions} data-ss-page-header="" />;
}
function SSEntityHeader(props) {
  const { Header } = SS_NS();
  return <Header variant="entity" data-ss-entity-header="" {...props} />;
}

// Content column, padding 24. `narrow` = the 800-wide account/org card column.
function SSContent({ narrow, intro, children }) {
  return (
    <div style={{ padding: "var(--bento-space-05)", boxSizing: "border-box" }}>
      <div style={narrow ? { maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--bento-space-05)" } : { display: "flex", flexDirection: "column", gap: "var(--bento-space-05)" }}>
        {intro && <p style={{ ...ssBody, marginTop: "var(--bento-space-02)" }}>{intro}</p>}
        {children}
      </div>
    </div>
  );
}

// Full-width list panel: 26/600 title, 16 explainer.
function SSListPanel({ title, explainer, link, onLink, children }) {
  const { Panel, Hyperlink } = SS_NS();
  return (
    <Panel style={{ alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-02)" }}>
        <h2 style={ssTitle(26, 32)}>{title}</h2>
        {(explainer || link) && <p style={ssBody}>{explainer}{explainer && link ? " " : ""}{link && <Hyperlink href="#" onClick={(e) => { e.preventDefault(); onLink && onLink(); }}>{link}</Hyperlink>}</p>}
      </div>
      {children}
    </Panel>
  );
}

// 800-wide setting card: 22/600 title, grey description, rows.
function SSCard({ title, desc, explainer, children }) {
  const { Panel } = SS_NS();
  return (
    <Panel style={{ alignItems: "stretch", gap: 0 }}>
      <h2 style={ssTitle(22, 28)}>{title}</h2>
      {desc && <p style={{ ...ssSubtle, font: "var(--hs-type-body-sm)", marginTop: "var(--bento-space-02)" }}>{desc}</p>}
      {explainer && <p style={{ ...ssBody, marginTop: "var(--bento-space-02)" }}>{explainer}</p>}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "var(--bento-space-03)" }}>{children}</div>
    </Panel>
  );
}
function SSRow({ label, desc, control, leading, divider = true }) {
  const { Divider } = SS_NS();
  return (
    <React.Fragment>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-04)", padding: "var(--bento-space-04) 0" }}>
        {leading}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ font: "var(--hs-type-body-md-b)", color: "var(--bento-theme-color-text-base)" }}>{label}</span>
          {desc && <span style={ssSubtle}>{desc}</span>}
        </div>
        {control && <div style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-03)", flexShrink: 0 }}>{control}</div>}
      </div>
      {divider && <Divider />}
    </React.Fragment>
  );
}

// Anchored popover: trigger + .hs-menu, closes on outside click / Escape.
function SSPopover({ trigger, children, align = "left", width }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const { DropdownMenu } = SS_NS();
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }}>
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <DropdownMenu style={{ position: "absolute", top: "calc(100% + 4px)", [align]: 0, zIndex: 50, minWidth: width || 220 }}>
          {children(() => setOpen(false))}
        </DropdownMenu>
      )}
    </span>
  );
}

function SSFilterChip({ label, options, value, onChange }) {
  const { ChipFilter, DropdownMenuItem, DropdownMenuSeparator } = SS_NS();
  const sel = value || [];
  return (
    <SSPopover align="right" trigger={(open, toggle) => (
      <ChipFilter label={label} open={open} selected={sel.length > 0} count={sel.length || undefined} onClick={toggle} />
    )}>
      {(close) => (
        <React.Fragment>
          {options.map((o) => (
            <DropdownMenuItem key={o} selected={sel.includes(o)} onClick={() => onChange(sel.includes(o) ? sel.filter((x) => x !== o) : sel.concat(o))}>{o}</DropdownMenuItem>
          ))}
          {sel.length > 0 && <DropdownMenuSeparator />}
          {sel.length > 0 && <DropdownMenuItem icon="close" onClick={() => { onChange([]); close(); }}>Clear filter</DropdownMenuItem>}
        </React.Fragment>
      )}
    </SSPopover>
  );
}

function SSRoleTrigger({ value, options, onChange }) {
  const { Button, DropdownMenuItem } = SS_NS();
  return (
    <SSPopover trigger={(open, toggle) => (
      <Button variant="ghost" size="sm" trailingIcon="keyboard_arrow_down" aria-expanded={open} onClick={toggle}>{value}</Button>
    )}>
      {(close) => options.map((o) => <DropdownMenuItem key={o} selected={o === value} onClick={() => { close(); onChange(o); }}>{o}</DropdownMenuItem>)}
    </SSPopover>
  );
}

function SSRowActions({ items, label = "More actions" }) {
  const { IconButton, DropdownMenuItem } = SS_NS();
  return (
    <SSPopover align="right" trigger={(open, toggle) => <IconButton icon="more_horiz" variant="secondary" size="sm" aria-label={label} aria-expanded={open} onClick={toggle} />}>
      {(close) => items.map((it) => <DropdownMenuItem key={it.label} icon={it.icon} onClick={() => { close(); it.onClick && it.onClick(); }}>{it.label}</DropdownMenuItem>)}
    </SSPopover>
  );
}

// Sortable header label, same markup TableHeadCell renders inside its <th>.
function SSSort({ label, k, sort, setSort }) {
  const dir = sort && sort.k === k ? sort.dir : undefined;
  return (
    <button type="button" className="hs-th hs-th--sortable" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}
      onClick={() => setSort({ k, dir: dir === "asc" ? "desc" : "asc" })}>
      <span>{label}</span>
      <span className="material-symbols-outlined" aria-hidden="true">{dir === "asc" ? "arrow_upward" : dir === "desc" ? "arrow_downward" : "unfold_more"}</span>
    </button>
  );
}
function ssSorted(rows, sort) {
  if (!sort) return rows;
  const m = sort.dir === "asc" ? 1 : -1;
  const val = (r) => { const v = r[sort.k]; const d = typeof v === "string" && /\d{4}$/.test(v) ? Date.parse(v) : NaN; return isNaN(d) ? v : d; };
  return rows.slice().sort((a, b) => (val(a) > val(b) ? m : val(a) < val(b) ? -m : 0));
}

// Infinite scroll (production list pages have no pagination row — confirmed by eng).
// Renders `count` rows and grows by `step` when the sentinel nears the scroll container's bottom.
function useSSInfinite(total, step = 25, resetKey) {
  const [count, setCount] = React.useState(step);
  const sentinel = React.useRef(null);
  React.useEffect(() => { setCount(step); }, [resetKey]);
  React.useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= total) return undefined;
    const root = el.closest(".hs-appcontent") || document.scrollingElement;
    const check = () => {
      const s = el.getBoundingClientRect(), r = root === document.scrollingElement ? { bottom: innerHeight } : root.getBoundingClientRect();
      if (s.top < r.bottom + 240) setCount((c) => Math.min(total, c + step));
    };
    const target = root === document.scrollingElement ? window : root;
    target.addEventListener("scroll", check, { passive: true });
    check();
    return () => target.removeEventListener("scroll", check);
  }, [count, total]);
  const { Spinner } = SS_NS();
  const footer = count < total
    ? <div ref={sentinel} data-ss-sentinel="" style={{ display: "flex", justifyContent: "center", padding: "var(--bento-space-04)" }}>{Spinner ? <Spinner /> : null}</div>
    : null;
  return [Math.min(count, total), footer];
}

function SSToolbar({ placeholder, search, setSearch, children }) {
  const { SearchInput } = SS_NS();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-04)", flexWrap: "wrap" }}>
      <div style={{ width: 310, maxWidth: "100%" }}>
        <SearchInput placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: "var(--bento-space-04)" }}>{children}</div>
    </div>
  );
}

function SSPersonCell({ name, initials, pending }) {
  const { Avatar } = SS_NS();
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-03)" }}>
      <span style={{ position: "relative", display: "flex" }}>
        <Avatar initials={initials} size="md" />
        {pending && <span className="material-symbols-outlined" title="Invite pending" style={{ position: "absolute", right: -4, bottom: -4, fontSize: 16, color: "var(--bento-theme-color-icon-warning)", fontVariationSettings: '"FILL" 1' }}>error</span>}
      </span>
      {name}
    </span>
  );
}
function SSAccountCell({ a }) {
  const { NetworkAvatar } = SS_NS();
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "var(--bento-space-03)" }}>
      <NetworkAvatar network={a.network} initials={a.initials} />
      {a.name}
    </span>
  );
}
function SSStatus({ status }) {
  const { Badge } = SS_NS();
  return <span style={{ display: "flex" }}>{status === "disconnected" ? <Badge tone="warning" icon="warning">Disconnected</Badge> : <Badge tone="positive">Connected</Badge>}</span>;
}

// Modal layer: kit overlay + Modal, focus trapped by DialogLayer when available.
function SSModal({ title, onClose, actions, children, size }) {
  const { Modal } = SS_NS();
  return (
    <div className="hs-overlay" style={{ position: "fixed" }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal title={title} onClose={onClose} actions={actions} size={size}>{children}</Modal>
    </div>
  );
}

Object.assign(window, { ssTitle, ssBody, ssSubtle, SSPageHeader, SSEntityHeader, SSContent, SSListPanel, SSCard, SSRow, SSPopover, SSFilterChip, SSRoleTrigger, SSRowActions, SSSort, ssSorted, useSSInfinite, SSToolbar, SSPersonCell, SSAccountCell, SSStatus, SSModal });
