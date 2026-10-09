// Suite Settings — Account pages and Plan and billing (with their modals).
function SSField({ label, children, hint, error }) {
  const { Field } = SS_NS();
  return <Field label={label} hint={hint} error={error}>{children}</Field>;
}

function SSProfile({ ctx }) {
  const { Button, Avatar, Hyperlink } = SS_NS();
  const me = ctx.me;
  return (
    <React.Fragment>
      <SSPageHeader title="Profile" />
      <SSContent narrow intro="How people see you across Hootsuite.">
        <SSCard title="Personal details">
          <SSRow leading={me.photo ? <Avatar initials={me.initials} size="md" /> : <Avatar icon="person" size="md" />} label="Photo" desc="JPG or PNG, up to 5 MB"
            control={me.photo
              ? <React.Fragment><Button variant="outlined" size="sm" icon="edit" onClick={() => ctx.toast("Photo updated")}>Edit photo</Button><Button variant="outlined" size="sm" icon="delete" onClick={() => { ctx.setMe({ ...me, photo: false }); ctx.toast("Photo deleted"); }}>Delete</Button></React.Fragment>
              : <Button variant="outlined" size="sm" icon="photo_camera" onClick={() => { ctx.setMe({ ...me, photo: true }); ctx.toast("Photo uploaded"); }}>Upload photo</Button>} />
          <SSRow label="Name" desc={me.name} control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("edit-name")}>Edit name</Button>} />
          <SSRow label="Email" desc={me.email} divider={false} control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("edit-email")}>Edit email</Button>} />
        </SSCard>
        <SSCard title="Delete account">
          <SSRow label="Delete your account" divider={false}
            desc={<React.Fragment>You can’t delete your account while you own an organization.<br /><Hyperlink href="#" onClick={(e) => e.preventDefault()}>Learn how to transfer ownership</Hyperlink>.</React.Fragment>}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("delete-account")}>Delete account</Button>} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSPreferences({ ctx }) {
  const [lang, setLang] = React.useState("English");
  const [tz, setTz] = React.useState("(UTC−08:00) Vancouver");
  return (
    <React.Fragment>
      <SSPageHeader title="Preferences" />
      <SSContent narrow intro="Your language and time zone. These settings only apply to you.">
        <SSCard title="Language and time zone">
          <SSRow label="Language" desc="The language you see in Hootsuite and in emails from us." control={<SSRoleTrigger value={lang} options={["English", "Español", "Français", "Deutsch", "Português", "日本語"]} onChange={(v) => { setLang(v); ctx.toast("Language changed to " + v); }} />} />
          <SSRow label="Time zone" desc="The time zone used for scheduling, publishing, and reporting." divider={false} control={<SSRoleTrigger value={tz} options={["(UTC−08:00) Vancouver", "(UTC−05:00) Toronto", "(UTC+00:00) London", "(UTC+01:00) Madrid", "(UTC+09:00) Tokyo"]} onChange={(v) => { setTz(v); ctx.toast("Time zone changed"); }} />} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSSecurity({ ctx }) {
  const { Button } = SS_NS();
  return (
    <React.Fragment>
      <SSPageHeader title="Sign-in and security" actions={<SSOrgPicker ctx={ctx} />} />
      <SSContent narrow intro="How you sign in to Hootsuite. Some of these settings are managed by your organization.">
        <SSCard title="Sign-in methods">
          <SSRow label="Password" desc={ctx.hasPassword ? "Sign in with your email and password." : "You sign in with SSO. Create a password to sign in without it."}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("password")}>{ctx.hasPassword ? "Update password" : "Create password"}</Button>} />
          <SSRow label="2-step verification" desc="Get a code from your authenticator app at every sign-in." divider={false}
            control={<React.Fragment><span style={{ font: "var(--hs-type-body-sm)", color: "var(--bento-theme-color-text-subtle)" }}>{ctx.twoStep ? "On" : "Off"}</span>
              <Button variant="outlined" size="sm" onClick={() => (ctx.twoStep ? (ctx.setTwoStep(false), ctx.toast("2-step verification turned off")) : ctx.openModal("two-step"))}>{ctx.twoStep ? "Turn off" : "Turn on"}</Button></React.Fragment>} />
        </SSCard>
        <SSCard title="Privacy">
          <SSRow label="Hootsuite privacy policy" desc="How Hootsuite collects, uses, processes, discloses, retains, and protects personal information." divider={false}
            control={<Button variant="outlined" size="sm" icon="open_in_new" onClick={() => window.open("https://www.hootsuite.com/legal/privacy", "_blank")}>View policy</Button>} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}

function SSNotifications({ ctx }) {
  const { Checkbox, Panel, Divider } = SS_NS();
  const [open, setOpen] = React.useState({ Perch: true });
  const [on, setOn] = React.useState({});
  const col = { width: 140, display: "flex", justifyContent: "center", flexShrink: 0 };
  const na = <span style={{ font: "var(--hs-type-body-sm)", color: "var(--bento-theme-color-text-subtle)" }}>Not available</span>;
  return (
    <React.Fragment>
      <SSPageHeader title="Notifications" />
      <SSContent narrow intro="Manage which notifications you receive by email and in product. These settings only apply to you.">
        <div style={{ display: "flex", padding: "0 var(--bento-space-05)", font: "var(--hs-type-body-md-b)", color: "var(--bento-theme-color-text-base)" }}>
          <span style={{ flex: 1, paddingLeft: "var(--bento-space-04)" }}>Notification</span><span style={col}>Email</span><span style={col}>In product</span>
        </div>
        {SS_NOTIFS.map((p) => (
          <Panel key={p.product} style={{ alignItems: "stretch", gap: 0, padding: "var(--bento-space-02) var(--bento-space-05)" }}>
            <button type="button" className="hs-navdrawer-item" aria-expanded={!!open[p.product]} onClick={() => setOpen((o) => ({ ...o, [p.product]: !o[p.product] }))} style={{ fontWeight: 600 }}>
              <span className="material-symbols-outlined" aria-hidden="true">{open[p.product] ? "keyboard_arrow_up" : "keyboard_arrow_down"}</span>{p.product}
            </button>
            {open[p.product] && p.groups.map((g) => (
              <React.Fragment key={g.name}>
                <div style={{ font: "var(--hs-type-body-sm-b)", color: "var(--bento-theme-color-text-subtle)", padding: "var(--bento-space-04) var(--bento-space-04) var(--bento-space-02)" }}>{g.name}</div>
                {g.items.map((it) => {
                  const k = p.product + it, inProduct = p.product !== "Perch";
                  return (
                    <React.Fragment key={it}>
                      <Divider />
                      <div style={{ display: "flex", alignItems: "center", minHeight: 56, paddingLeft: "var(--bento-space-04)" }}>
                        <span style={{ ...ssBody, flex: 1 }}>{it}</span>
                        <span style={col}><Checkbox checked={on[k + "e"] !== false} onChange={(v) => setOn((o) => ({ ...o, [k + "e"]: v }))} /></span>
                        <span style={col}>{inProduct ? <Checkbox checked={on[k + "p"] !== false} onChange={(v) => setOn((o) => ({ ...o, [k + "p"]: v }))} /> : na}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </Panel>
        ))}
      </SSContent>
    </React.Fragment>
  );
}

function SSBilling({ ctx }) {
  const { Button, Hyperlink } = SS_NS();
  const b = ctx.billing;
  const [all, setAll] = React.useState(false);
  const inv = all ? SS_INVOICES : SS_INVOICES.slice(0, 3);
  return (
    <React.Fragment>
      <SSPageHeader title="Plan and billing" actions={<SSOrgPicker ctx={ctx} />} />
      <SSContent narrow intro="For Somos. Asha Patel is the billing owner, so charges and invoices go to Asha.">
        <SSCard title="Your plan" desc="All prices are in USD and subject to taxes unless stated otherwise.">
          <SSRow label={b.plan + " · " + (b.cycle === "annual" ? "US$4,788/year" : "US$499/month")} desc={b.cycle === "annual" ? "Billed annually, which saves 20 percent against the monthly price." : "Billed monthly. Switch to annual billing to save 20 percent."}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("change-plan")}>Change plan</Button>} />
          <SSRow label="Renews on September 1, 2026" desc={"You will be charged " + (b.cycle === "annual" ? "US$4,788" : "US$499") + ". We email a reminder 7 days before."} divider={false}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("change-cycle")}>Change billing cycle</Button>} />
        </SSCard>
        <SSCard title="Seats" desc="A seat is one person who can sign in to Somos. An invite holds a seat until it is accepted or revoked.">
          <SSRow label={"45 of " + b.seats + " seats used, " + (b.seats - 45) + " available"} desc="42 members and 3 pending invites."
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("seats")}>Get more seats</Button>} />
          <SSRow label="Each extra seat is US$96/year" desc="Added seats are charged pro rata for the rest of this billing period." divider={false} />
        </SSCard>
        <SSCard title="Payment method" desc="Charged on the renewal date each billing period.">
          <SSRow label={"Visa ending " + b.card} desc={"Expires " + b.expiry + "."} divider={false}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("change-card")}>Change card</Button>} />
        </SSCard>
        <SSCard title="Invoices and billing details" desc="Invoices go to the billing owner. Download any invoice as a PDF.">
          {inv.map(([d, amt], i) => (
            <SSRow key={d + i} label={d} desc={amt + " · Paid"} control={<Button variant="ghost" size="sm" icon="download" onClick={() => ctx.toast("Invoice for " + d + " downloaded")}>Download</Button>} />
          ))}
          <div style={{ padding: "var(--bento-space-04) 0" }}>
            <Hyperlink href="#" onClick={(e) => { e.preventDefault(); setAll((x) => !x); }}>{all ? "Show fewer invoices" : "Show all " + SS_INVOICES.length + " invoices"}</Hyperlink>
          </div>
          {ssDivider()}
          <SSRow label="Billing details" desc="Somos Organization · 1200 Granville Street, Vancouver BC · Tax ID CA123456789" divider={false}
            control={<Button variant="outlined" size="sm" onClick={() => ctx.openModal("billing-details")}>Edit</Button>} />
        </SSCard>
      </SSContent>
    </React.Fragment>
  );
}
const ssDivider = () => { const { Divider } = SS_NS(); return <Divider />; };

/* ── Account / billing modals ── */
function SSAccountModal({ kind, ctx, close }) {
  const NS = SS_NS();
  const { Button, Input, PasswordInput, Radio, InputPayment } = NS;
  const [v, setV] = React.useState({});
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e && e.target ? e.target.value : e }));
  const cancel = <Button variant="secondary" onClick={close}>Cancel</Button>;
  const b = ctx.billing;
  if (kind === "edit-name") {
    const name = v.name ?? ctx.me.name;
    return <SSModal title="Edit name" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!name.trim()} onClick={() => { ctx.setMe({ ...ctx.me, name }); ctx.toast("Name updated"); close(); }}>Save</Button></React.Fragment>}>
      <SSField label="Name"><Input value={name} onChange={set("name")} /></SSField></SSModal>;
  }
  if (kind === "edit-email") {
    const email = v.email ?? ctx.me.email, ok = /.+@.+\..+/.test(email);
    return <SSModal title="Edit email" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!ok} onClick={() => { ctx.setMe({ ...ctx.me, email }); ctx.toast("We sent a confirmation link to " + email); close(); }}>Send confirmation</Button></React.Fragment>}>
      <SSField label="Email" hint="We send a link to the new address to confirm it." error={!ok}><Input value={email} error={!ok} onChange={set("email")} /></SSField></SSModal>;
  }
  if (kind === "delete-account")
    return <SSModal title="You can’t delete your account yet" onClose={close} actions={<Button variant="primary" onClick={close}>Got it</Button>}>
      <p style={ssBody}>You own Somos Organization. Transfer ownership to another admin first, then you can delete your account.</p></SSModal>;
  if (kind === "password") {
    const upd = ctx.hasPassword, n = v.n || "", c = v.c || "", mismatch = c.length > 0 && n !== c;
    const ok = (!upd || (v.cur || "").length > 0) && n.length >= 8 && n === c;
    return <SSModal title={upd ? "Update password" : "Create password"} onClose={close}
      actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!ok} onClick={() => { ctx.setHasPassword(true); ctx.toast(upd ? "Password updated" : "Password created"); close(); }}>{upd ? "Update password" : "Create password"}</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        {upd && <SSField label="Current password"><PasswordInput value={v.cur || ""} onChange={set("cur")} /></SSField>}
        <SSField label="New password" hint="At least 8 characters."><PasswordInput value={n} onChange={set("n")} /></SSField>
        <SSField label="Confirm new password" error={mismatch} hint={mismatch ? "Passwords don’t match." : undefined}><PasswordInput value={c} error={mismatch} onChange={set("c")} /></SSField>
      </div></SSModal>;
  }
  if (kind === "two-step") {
    const code = v.code || "", ok = /^\d{6}$/.test(code);
    return <SSModal title="Turn on 2-step verification" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!ok} onClick={() => { ctx.setTwoStep(true); ctx.toast("2-step verification turned on"); close(); }}>Turn on</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        <p style={ssBody}>Scan this QR code with your authenticator app, then enter the 6-digit code it shows.</p>
        <div aria-label="QR code" role="img" style={{ alignSelf: "center", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--bento-radius-md, 8px)", boxShadow: "inset 0 0 0 1px var(--bento-theme-color-border-subtle)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 120 }}>qr_code_2</span>
        </div>
        <SSField label="6-digit code"><Input value={code} inputMode="numeric" maxLength={6} onChange={set("code")} /></SSField>
      </div></SSModal>;
  }
  if (kind === "change-plan") {
    const plan = v.plan || b.plan;
    const plans = [["Standard", "US$1,188/year · 1 user"], ["Advanced", "US$4,788/year · up to 50 seats"], ["Enterprise", "Custom pricing · talk to sales"]];
    return <SSModal title="Change plan" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={plan === b.plan} onClick={() => { ctx.setBilling({ ...b, plan }); ctx.toast("Plan changed to " + plan); close(); }}>Change plan</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-03)" }}>
        {plans.map(([p, d]) => <Radio key={p} checked={plan === p} onChange={() => setV({ plan: p })} label={<span style={{ display: "flex", flexDirection: "column" }}><b>{p}</b><span style={ssSubtle}>{d}</span></span>} />)}
      </div></SSModal>;
  }
  if (kind === "change-cycle") {
    const cy = v.cy || b.cycle;
    return <SSModal title="Change billing cycle" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={cy === b.cycle} onClick={() => { ctx.setBilling({ ...b, cycle: cy }); ctx.toast("Billing cycle changed to " + (cy === "annual" ? "annual" : "monthly")); close(); }}>Change billing cycle</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-03)" }}>
        <Radio checked={cy === "annual"} onChange={() => setV({ cy: "annual" })} label="Annual · US$4,788/year (save 20 percent)" />
        <Radio checked={cy === "monthly"} onChange={() => setV({ cy: "monthly" })} label="Monthly · US$499/month" />
        <p style={ssSubtle}>The change starts at your next renewal on September 1, 2026.</p>
      </div></SSModal>;
  }
  if (kind === "seats") {
    const add = Math.max(1, parseInt(v.add || "5", 10) || 1);
    return <SSModal title="Get more seats" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" onClick={() => { ctx.setBilling({ ...b, seats: b.seats + add }); ctx.toast(add + " seats added"); close(); }}>Add {add} seats</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        <SSField label="Seats to add" hint={"US$" + add * 96 + "/year, charged pro rata for the rest of this billing period."}><Input type="number" min={1} value={v.add ?? "5"} onChange={set("add")} /></SSField>
      </div></SSModal>;
  }
  if (kind === "change-card") {
    const num = v.num || "", ok = num.replace(/\D/g, "").length >= 15 && /^\d\d \/ \d\d$/.test(v.exp || "") && /^\d{3,4}$/.test(v.cvc || "");
    return <SSModal title="Change card" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" disabled={!ok} onClick={() => { ctx.setBilling({ ...b, card: num.replace(/\D/g, "").slice(-4), expiry: v.exp }); ctx.toast("Card updated"); close(); }}>Save card</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        <SSField label="Card number">{InputPayment ? <InputPayment value={num} onChange={(x) => setV((o) => ({ ...o, num: x }))} /> : <Input value={num} onChange={set("num")} />}</SSField>
        <div style={{ display: "flex", gap: "var(--bento-space-04)" }}>
          <div style={{ flex: 1 }}><SSField label="Expiry" hint="MM / YY"><Input value={v.exp || ""} placeholder="MM / YY" onChange={set("exp")} /></SSField></div>
          <div style={{ flex: 1 }}><SSField label="CVC"><Input value={v.cvc || ""} inputMode="numeric" maxLength={4} onChange={set("cvc")} /></SSField></div>
        </div>
      </div></SSModal>;
  }
  if (kind === "billing-details")
    return <SSModal title="Billing details" onClose={close} actions={<React.Fragment>{cancel}<Button variant="primary" onClick={() => { ctx.toast("Billing details saved"); close(); }}>Save</Button></React.Fragment>}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
        <SSField label="Company name"><Input defaultValue="Somos Organization" /></SSField>
        <SSField label="Address"><Input defaultValue="1200 Granville Street, Vancouver BC" /></SSField>
        <SSField label="Tax ID"><Input defaultValue="CA123456789" /></SSField>
      </div></SSModal>;
  return null;
}

Object.assign(window, { SSField, SSProfile, SSPreferences, SSSecurity, SSNotifications, SSBilling, SSAccountModal, ssDivider });
