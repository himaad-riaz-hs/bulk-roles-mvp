// Bulk roles MVP, data. Source of truth: Suite Settings Figma, section "Bulk Roles MVP 10/8" (1236:298593),
// locked on 8 Oct (no review step, no banner, 48 / 46 of 48). Reuses BR_* data from ../bulk-roles/br-data.jsx.
const MVP_P1 = "Publisher One";
const MVP_UNL = "Unlimited";
const MVP_LOADED = 50, MVP_TOTAL = 500;
// The 12 people the Figma frames show, in order. Dar Khan and Mateo Rossi have Unlimited access from the organization.
const MVP_NAMED = [["Asha Patel","Aug 19, 2026","Editor"],["Bryn Morales","Feb 3, 2026","Publisher One"],["Chaya Levi","Feb 3, 2026","Editor"],["Dar Khan","Mar 21, 2026","Unlimited"],["Elif Demir","Apr 2, 2026","Limited"],["Gia Russo","Apr 1, 2026","Responder"],["Hana Kim","Mar 23, 2026","Editor"],["Ivo Novak","Mar 23, 2026","Editor"],["Mateo Rossi","Jun 12, 2026","Unlimited"],["Nadia Mensah","May 4, 2026","Limited"],["Omar Said","Jul 8, 2026","Editor"],["Priya Kaur","Jan 27, 2026","Care Agent"]];
// Rows 13 to 50 complete the first load so the 48 who can change are: Editor 26, Limited 8, Advanced 4, Responder 4,
// Care Agent 3, and 3 already on Publisher One (45 move).
const MVP_NAMED_N = MVP_NAMED.length;
const MVP_REST = [["Editor",21],["Limited",6],["Advanced",4],["Responder",3],["Care Agent",2],["Publisher One",2]];
const MVP_LATER = ["Editor","Editor","Limited","Editor","Responder","Advanced","Editor","Care Agent","Editor","Limited"];
const MVP_FAIL = ["p6","p10"]; // Hana Kim, Omar Said
const MVP_REVIEW_ORDER = ["Advanced","Care Agent","Limited","Responder","Editor","Publisher One"];
const MVP_FILTER_ROLES = BR_ROLE_ROWS0.map(([name]) => name); // same 6 roles as the picker and roles list (Figma 10/8)
const MVP_ACCOUNTS = [
  { id:"a0", name:"@somos.main", network:"instagram", initials:"SM", added:"Aug 19, 2026", status:"connected" },
  { id:"a1", name:"LinkedIn Somos", network:"linkedin", initials:"LS", added:"Feb 3, 2026", status:"connected" },
  { id:"a2", name:"Facebook Somos", network:"facebook", initials:"FS", added:"Feb 3, 2026", status:"connected" },
  { id:"a3", name:"YouTube Somos", network:"youtube", initials:"YS", added:"Mar 21, 2026", status:"connected" },
  // the other 8 from Figma 10/8 MVP 3.0 (12 social accounts in Somos Organization)
  { id:"a4", name:"@somos.kids", network:"instagram", initials:"SK", added:"Jan 12, 2026", status:"connected" },
  { id:"a5", name:"Somos Careers", network:"linkedin", initials:"SC", added:"Apr 8, 2026", status:"connected" },
  { id:"a6", name:"Somos Cafe", network:"facebook", initials:"SC", added:"May 27, 2026", status:"connected" },
  { id:"a7", name:"Somos Kids TV", network:"youtube", initials:"SK", added:"Jun 30, 2026", status:"connected" },
  { id:"a8", name:"@somos.cafe", network:"instagram", initials:"SC", added:"Jul 14, 2026", status:"connected" },
  { id:"a9", name:"Somos Español", network:"facebook", initials:"SE", added:"Sep 2, 2026", status:"connected" },
  { id:"a10", name:"@somos.es", network:"instagram", initials:"SE", added:"Nov 18, 2025", status:"connected" },
  { id:"a11", name:"Somos Kids", network:"tiktok", initials:"SK", added:"Dec 9, 2025", status:"connected" },
];
// Person side (Figma row "MVP person side"): Asha Patel's 4 social accounts, her role on each and when each last connected.
// YouTube Somos is the same account as the account side, so a change there shows on its Members tab too.
const MVP_PERSON = { id:"p0", name:"Asha Patel", email:"asha.patel@somos.com", access:"View only", teams:2 };
const MVP_PERSON_ACCTS0 = () => [["a0","Editor","Mar 21, 2026"],["a1","Editor","Feb 3, 2026"],["a2","Limited","Feb 3, 2026"],["a3","Editor","Aug 19, 2026"]].map(([id, role, last]) => ({ ...MVP_ACCOUNTS.find((a) => a.id === id), role, last }));
// Settings nav exactly as the Figma 10/8 (global-settings-nav-items), not the kit's longer production list.
const MVP_NAV = [
  { id:"profile", icon:"person", label:"Profile", section:"Account" },
  { id:"preferences", icon:"tune", label:"Preferences" },
  { id:"sign-in-security", icon:"lock", label:"Sign in and security" },
  { id:"notifications", icon:"notifications", label:"Notifications" },
  { id:"plan-billing", icon:"credit_card", label:"Plan and billing" },
  { id:"overview", icon:"settings", label:"Overview", section:"Organization" },
  { id:"teams", icon:"group", label:"Teams" },
  { id:"members", icon:"person_add", label:"Members" },
  { id:"social-accounts", icon:"share", label:"Social accounts" },
  { id:"sso", icon:"key", label:"SSO settings" },
  { id:"suspended-posts", icon:"block", label:"Suspend content", section:"Publishing" },
  { id:"tags", icon:"sell", label:"Tags" },
  { id:"campaigns", icon:"campaign", label:"Campaigns" },
  { id:"link-settings", icon:"link", label:"Link settings" },
];
// Create a role: one list, no product sections (PM, F16). Same order as the full flow's groups, flattened.
const MVP_PERMS = BR_GROUPS.reduce((all, g) => all.concat(g[1]), []);
const mvpPermDesc = (n) => (MVP_PERMS.find((p) => p[0] === n) || [n, ""])[1];
// Edit a role: the list the Figma edit frame shows (MVP 5.1).
const MVP_EDIT_LIST = ["Approve Messages","Basic Usage","Bulk resolve conversations in Inbox 2.0","Facebook private messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0","Reply to public messages in Inbox 2.0","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","Boost posts"];
const MVP_EDIT_ON = MVP_EDIT_LIST.filter((n) => n !== "Facebook private messages" && n !== "Boost posts");
const MVP_EDIT_SAVED = MVP_EDIT_ON.filter((n) => n !== "Bulk resolve conversations in Inbox 2.0");

function mvpPerson(i, name, added, role) {
  const slug = name.toLowerCase().replace(/ /g, ".") + (i >= 16 ? i : "");
  return { id:"p" + i, name, assigned:added, email:slug + "@somos.com", role, initials:ssInitials(name), status:"Active" };
}
let MVP_PEOPLE_CACHE = null;
function mvpPeople() {
  if (MVP_PEOPLE_CACHE) return MVP_PEOPLE_CACHE.map((p) => ({ ...p }));
  // Test mode (14 Oct, session P230): Hana Kim and Omar Said start as Limited, so changing "everyone you can" to Editor
  // always includes them and T3's failure shows. Review mode keeps them as Editor, as in Figma.
  const out = MVP_NAMED.map(([n, d, r], i) => mvpPerson(i, n, d, MVP_UT && (n === "Hana Kim" || n === "Omar Said") ? "Limited" : r));
  const pool = []; MVP_REST.forEach(([r, k]) => { for (let j = 0; j < k; j++) pool.push(r); });
  const mix = new Array(pool.length); pool.forEach((r, j) => { mix[(j * 7) % pool.length] = r; });
  const extra = ["Rafael Costa","Sara Lind","Tomas Berg","Uma Singh"];
  for (let i = 12; i < MVP_TOTAL; i++) {
    const name = i < 16 ? extra[i - 12] : SS_FIRST[i % SS_FIRST.length] + " " + SS_LAST[(i * 5) % SS_LAST.length];
    out.push(mvpPerson(i, name, ssDate(i), i < MVP_LOADED ? mix[i - 12] : MVP_LATER[i % MVP_LATER.length]));
  }
  // Row 37's generated name (Omar Eze) read too close to Omar Said, who fails on row 2.
  out[36] = mvpPerson(36, "Leah Grant", out[36].assigned, out[36].role);
  MVP_PEOPLE_CACHE = out;
  return out.map((p) => ({ ...p }));
}
const mvpCanChange = (p) => p.role !== MVP_UNL;
// Order the rows flip in while it runs: the Figma 1.3 frame shows Asha, Chaya, Ivo and Omar done first.
function mvpOrder(ids) {
  const first = ["p0","p2","p7","p10"], late = ["p4","p5","p6","p9","p11"];
  const rank = (id) => first.includes(id) ? first.indexOf(id) : late.includes(id) ? 1000 + late.indexOf(id) : 10 + +id.slice(1);
  const o = {}; ids.slice().sort((a, b) => rank(a) - rank(b)).forEach((id, k) => { o[id] = k; }); return o;
}
const MVP_ROLE_ROWS0 = () => BR_ROLE_ROWS0.map(([name, count]) => ({ id:name, name, type:name === MVP_P1 ? "Custom" : "System", desc:BR_DESC[name], count }));
// Publisher Two, as 4.2 creates it: 0 people, so Delete is on (3.3 to 3.5).
const MVP_P2 = "Publisher Two", MVP_P2_DESC = "Publisher One permissions, plus boost posts";
const MVP_P2_ROW = () => ({ id:MVP_P2, name:MVP_P2, type:"Custom", desc:MVP_P2_DESC, count:0 });
// Row 6 (exploration, 9 Oct customer check-in): unnamed custom permission sets on people. Starting the row gives Bryn Morales
// and 8 others on YouTube Somos one shared set (Chaya Levi and Nadia Mensah among the 12 Figma rows), and 4 more a set one
// permission away (Gia Russo, Hana Kim, Ivo Novak, Omar Said), as Figma Exploration 1.0 and 1.2. Creating a role from Bryn's set
// as it is moves Bryn and the 8 to it on its own (the back end syncs exact matches, engineering 9 Oct); the 4 stay Custom.
const MVP_CUSTOM = "Custom", MVP_NEW = "Inbox Lead";
const MVP_SET_A = BR_P1_PERMS.concat("Facebook private messages"), MVP_SET_B = MVP_SET_A.concat("Boost posts");
const MVP_SET_A_IDS = ["p1","p2","p9","p14","p18","p22","p26","p30","p34"];
const MVP_SET_B_IDS = ["p5","p6","p7","p10"];
const mvpWithCustom = (ps) => ps.map((p) => MVP_SET_A_IDS.includes(p.id) ? { ...p, role:MVP_CUSTOM, perms:MVP_SET_A } : MVP_SET_B_IDS.includes(p.id) ? { ...p, role:MVP_CUSTOM, perms:MVP_SET_B } : p);
const mvpSameSet = (a, b) => !!a && !!b && a.length === b.length && a.every((x) => b.includes(x));
// Figma Exploration 1.2 toast: the role, and how many others with exactly the same set moved to it.
const mvpToastMatched = (name, n) => name + " created. " + n + (n === 1 ? " other with the same permissions now has it." : " others with the same permissions now have it.");

// The notification the notification service sends when the job finishes (8 Oct lock session). Counts only, as the designer’s
// Full Flows 2.0. Injected into the production Notifications panel's rows.
// Usability test mode (?ut=1, 9 Oct): only the product shows, it starts on All social accounts, every account opens with
// its own members, no role is preselected, and @somos.kids always fails for Hana Kim and Omar Said (Try again works).
const MVP_UT = /[?&#]ut=1(?![0-9])/.test(location.search + location.hash);
const MVP_UT_FAIL_ACCT = "a4";
const MVP_NET = { instagram:"Instagram", linkedin:"LinkedIn", facebook:"Facebook", youtube:"YouTube", tiktok:"TikTok" };
// Review mode follows Figma 2.0 (23 Oct); test mode keeps the notification it had in the live study.
const MVP_NOTIF = MVP_UT ? { id:"mvp-bulk", unread:true, title:"Publisher One on YouTube Somos", preview:"46 of 48 updated. 2 need a look.", product:"Settings", cat:"Social accounts", time:"Just now", av:"YS", net:"youtube" }
  : { id:"mvp-bulk", unread:true, title:"Role change incomplete on YouTube Somos", preview:"46 of 48 members updated to Publisher One. 2 need review.", product:"Settings", cat:"Social accounts", time:"Just now", av:"YS" };
// Review mode, Figma row MVP 6: one notification per outcome, counts only ("all" updated, "some" didn't, "none" did). The
// None updated line follows update 29 (no "Try again."). n = how many didn't update.
const mvpNotifRow = (kind, role, total, n, acctName) => {
  const r = role || MVP_P1, t = total || 48, f = n == null ? MVP_FAIL.length : n, a = acctName || "YouTube Somos", mem = (k) => k + (k === 1 ? " member" : " members");
  if (kind === "all") return { ...MVP_NOTIF, title:"Role change complete on " + a, preview:mem(t) + " updated to " + r + "." };
  if (kind === "none") return { ...MVP_NOTIF, title:"Role change failed on " + a, preview:"We couldn’t update " + mem(t) + " to " + r + "." };
  return { ...MVP_NOTIF, title:"Role change incomplete on " + a, preview:(t - f) + " of " + mem(t) + " updated to " + r + ". " + f + (f === 1 ? " needs" : " need") + " review." };
};
// o (test mode): the finished job's own title and counts instead of the Figma example. Review mode: o = a row from mvpNotifRow.
// Review mode (Figma 2.0): the bulk notification is the only one in the panel; the kit's sample rows come back when it goes.
let MVP_NFP_REST = null;
function mvpNotif(on, o) {
  if (typeof NFP_ROWS === "undefined") return;
  if (!MVP_UT) {
    if (on) { if (!MVP_NFP_REST) MVP_NFP_REST = NFP_ROWS.filter((n) => n.id !== MVP_NOTIF.id); NFP_ROWS.splice(0, NFP_ROWS.length, o || MVP_NOTIF); }
    else if (MVP_NFP_REST) { NFP_ROWS.splice(0, NFP_ROWS.length, ...MVP_NFP_REST); MVP_NFP_REST = null; }
    return;
  }
  const i = NFP_ROWS.findIndex((n) => n.id === MVP_NOTIF.id);
  if (o && i >= 0) NFP_ROWS.splice(i, 1);
  if (on && (o || i < 0)) NFP_ROWS.unshift(o ? { ...MVP_NOTIF, ...o } : MVP_NOTIF);
  if (!on && i >= 0) NFP_ROWS.splice(i, 1);
}

// Board and prototype copy, from Figma "Bulk Roles MVP 10/9/26" (section 1390:77851, 23 Oct) plus update 29. Row titles are the
// "Row title" texts (Figma shows a description only on the Exploration row); group = the "Group header" the row sits under.
// Notes are the "Dev note, <frame>" texts: kind "d" (Dev note) or "p" (the ones Figma labels Proposal), then the numbered
// "Pinned notes, <frame>" list as kind "n" ([number, text] pairs).
// Connectors: edge "main" = the main path (solid red on the board), "branch" = a branch (dashed grey).
const MVP_ROWS = [
  { id:"1", group:"Apply a role in bulk", title:"Apply a role to the loaded members", status:["In the MVP"], screens:[
    { id:"1.0", caption:"Header checkbox ticks the 48 who can change", tap:"Change role", notes:[["d","The header checkbox selects the loaded members who can be changed, 48 here. There is no Select all for all 500. Unlimited members can’t be selected: their access comes from the org, so a bulk change would always fail for them."],["n",[[1,"Unlimited member: checkbox disabled and never selected. Access comes from the org, so a bulk change would fail. Use aria-disabled so the hover tooltip (Hover on a greyed checkbox) still works."],[2,"Header checkbox selects the loaded rows only (48 here) and skips disabled ones. No Select all 500, no selecting across pages."],[3,"Count of selected rows, plain text. A new search or filter clears the selection and closes the bar."]]]] },
    { id:"1.1", caption:"Pick the role", tap:"Change to Publisher One", notes:[["d","The picker lists the same roles as the roles list, by name only: roles the organization created aren’t marked Custom. Search narrows the list, and only the list scrolls. Manage roles sits at the top under the intro, so it’s always in view, even with 20+ roles. It opens the roles list when the role they need isn’t there; the selection doesn’t carry over. Change to Publisher One goes straight to In progress; there’s no review step (8 Oct lock session). Nothing is preselected: until a role is picked, the button reads Change role and is disabled."],["n",[[4,"Label carries the selected count. Goes straight to In progress; no review step."],[5,"At the top, under the intro; only the list scrolls, so it stays in view with 20+ roles. Opens the roles list when the role isn’t there yet; the selection doesn’t carry over. Far from Apply, so a mis-tap can’t drop the selection."]]]] },
    { id:"1.2", caption:"Applying, in the drawer", tap:"Close", fork:"Some don’t update", notes:[["d","Apply goes straight here, with no review step (8 Oct lock session). The drawer says Updating 48 members to Publisher One, In progress, with no bar or percentage. If they close it, the job keeps going and the page pauses role changes until it’s done, with a banner that says so (jobs take seconds)."],["n",[[6,"Static In progress: no bar, no percentage, no polling. Closing the drawer doesn’t stop the job; the notification service reports when it’s done."]]]] },
    { id:"1.2b", caption:"In progress, drawer closed: role changes paused", tap:"When it’s done", notes:[["d","Closing the drawer doesn’t stop the job. While it runs, role changes on this account are paused: the Permissions dropdowns, the checkboxes and any row action that changes a member’s access are disabled, and hovering says why. Search and filters still work. An info banner says what’s running and that a notification comes when it’s done. If they reload or come back while it runs, the page opens in this state. Banner and locks clear on the job’s done event, the same one the notification uses, so no polling."],["n",[[7,"While a bulk update runs on this account, role changes pause: the Permissions dropdowns and checkboxes are disabled with a tooltip; search and filters still work. Banner and locks clear on the job’s done event, no polling."]]]] },
    { id:"1.3", caption:"Everyone updated, toast", notes:[["d","When everyone updates, a toast confirms it. Undo puts back everyone’s previous role, the only way back from a bulk change (design system, design system 12 Oct). Undo needs the back end to keep everyone’s previous role (PM and engineering to confirm)."]] },
    // Figma 1.0 variants on row MVP 1 (round 2 and the design system’s bulk action pattern, 14 to 20 Oct). Each sets how the bulk bar
    // behaves from that screen on (selMode in mvp-app.jsx): Select all 498 with a way back, or 48 of 500, or the selection stays.
    { id:"1.0h", caption:"Select all option: Select all 498 in the bar (round 2)", notes:[["p","Tested in round 2 (14 to 15 Oct): after the header checkbox, the bar offers Select all 498; click it and the bar says All 498 selected, and rows that load later arrive ticked. 5 of the 6 people who ticked the header used it, and 3 changed all 498 (round 1: 1 of 7). It changes the loaded rows scope agreed with the customer on 9 Oct, so it is a triad call."]] },
    { id:"1.0i", caption:"Select all fallback: 48 of 500 selected", notes:[["p","If Select all doesn’t make the MVP (content design, 16 Oct): the bar says “48 of 500 selected”, so it’s clear the header checkbox only took the loaded members. Nothing else changes."]] },
    { id:"1.0j", caption:"After Change role: the 48 stay selected and the bar stays (bulk pattern)", notes:[["p","the design system’s bulk action pattern (19 Oct): after an action that only changes attributes, like a role, the selected members stay selected and the bar stays until the person closes it (X) or unticks them. The success toast shows on top. Proposal, replaces clearing the selection in Everyone updated. Pattern: the Bento pattern file (Pattern: Bulk actions)."],["d","Bulk-action bar, from the design system’s pattern (the Bento pattern file (Pattern: Bulk actions)): 24px (hs/sys/spacing/6) from the bottom, centred in the content area (it moves with the nav drawer), 24px side margins, and 24px kept free under the last row so the bar never covers it. Focus stays on the checkbox when the bar appears. Announce “48 members selected. Press Alt + F10 to go to bulk actions bar.” in a polite live region. Alt + F10 jumps to the bar, Esc goes back without clearing, arrows move between actions. role=region “Bulk actions” with role=toolbar “Actions for selected members”, placed after the table in the DOM. Closing returns focus to the last checkbox toggled. Disabled checkboxes and dropdowns (Unlimited rows, role changes paused) use aria-disabled with their tooltip, not native disabled."]] },
    { id:"1.0k", caption:"Select all chosen: All 498 selected, with a way back (bulk pattern)", notes:[["p","After Select all, the bar says All 498 selected and the button turns into the way back. The pattern uses “Select this page only”; our table loads as you scroll, so this shows “Select only the 48 loaded”. Copy TBD with content design and design system."]] },
    { id:"1.0l", caption:"Scrolled to the end: last row clear of the bar (design system, 20 Oct)", notes:[["d","Reserve 96px below the last row (bar 48, plus 24 above and 24 below, hs/sys/spacing/6) so the bar never covers it. Same gap above the bar as below it. (design system, 20 Oct)"]] }] },
  // Person side (Figma row "MVP person side", 9 and 12 Oct: kept as the second way in). One member, Asha Patel, across her social accounts.
  { id:"ps", label:"MVP person side", title:"Apply a role on many accounts, from a person", status:["In the MVP"], screens:[
    { id:"p.0", label:"Person side 1.0", caption:"Asha Patel’s social accounts, 2 ticked", tap:"Change role", notes:[["d","In the MVP as the second way in, kept on 12 Oct since it’s not much more work. Today’s member page, Social accounts tab, with checkboxes and the bulk bar added. If the member’s access comes from the org, rows stay locked as on the account side, and a search or filter clears the selection."]] },
    { id:"p.1", label:"Person side 1.1", caption:"Pick the role for 2 accounts", tap:"Change to Publisher One", notes:[["d","Same picker as the account side: the same roles by name only, search, and Manage roles at the top. The title names the member and how many accounts. Apply goes straight to In progress, with no review step."]] },
    { id:"p.2", label:"Person side 1.2", caption:"Applying to 2 accounts, in the drawer", tap:"When it’s done", notes:[["d","Same as the account side: In progress with no bar or percentage, and a notification with counts when it’s done, even if they close this or leave. If an account doesn’t update, Show details and Try again work the same way."]] },
    { id:"p.3", label:"Person side 1.3", caption:"Updated on 2 accounts, toast", notes:[["d","Both accounts now show Publisher One and a toast confirms it, as on the account side. A role is the same set of permissions on every network, so it reads the same on each account. Undo puts both accounts back on the roles they had, as on the account side (design system, design system 12 Oct). Undo needs the back end to keep everyone’s previous role (PM and engineering to confirm)."]] }] },
  { id:"1b", title:"States of the members table", status:["In the MVP"], states:true, screens:[
    { id:"1.0a", caption:"Hover on a greyed checkbox", notes:[["d","The checkbox for an Unlimited member is disabled. Hovering it shows why: access comes from the organization and can’t be changed here."]] },
    { id:"1.0b", caption:"More members load after the header checkbox", notes:[["d","Members that load after the header checkbox was ticked stay unselected. The header checkbox shows partly selected and the count stays 48."]] },
    { id:"1.0c", caption:"A filter clears the selection", notes:[["d","Any new search or filter clears the selection and closes the bulk bar, so a changed list always starts from a fresh selection."]] },
    { id:"1.0d", caption:"Admin who can’t edit custom permissions", notes:[["d","An admin who can’t update custom social account permissions gets no checkboxes and no bulk bar. The page is read only for them."]] },
    { id:"1.0e", caption:"The Permissions filter lists custom roles", notes:[["d","The Role filter lists system roles and custom roles together, the same list as the role picker. Only lists that show the social account role include custom roles in their filter. Custom stays at the end for people with no role, the same label as today (content design, 21 Oct). Every option shows its name only, with no sub-labels: roles the organization created aren’t marked Custom, and “custom role” isn’t used in aria labels or any other string."],["n",[[8,"Custom roles listed with the system roles, same list as the role picker, by name only, no sub-labels. Custom, last, means custom permissions. Changing the filter clears the selection."]]]] },
    { id:"1.0f", label:"MVP 1.0f (record)", caption:"Unlimited rows today in code: the whole row is disabled", record:true, notes:[["d","What the DS table does today (engineering, 14 Oct): @ds/comp-table hardcodes disabledBehavior \"all\", so an Unlimited row greys out completely and keyboard focus skips it. The checkbox is drawn inside the table, so it can’t take the tooltip from 1.0a either."]] },
    { id:"1.0g", caption:"Unlimited rows, proposal: a helper line, only the checkbox off", notes:[["p","design system, 15 Oct: no hover needed. A helper line under the name says why the row can’t be selected. Only the checkbox is off (React Aria disabledBehavior \"selection\"): the row keeps its normal look and keyboard focus still reaches it. Needs the DS table to expose disabledBehavior (design checking feasibility with the Bento team). Copy TBD with content design; the design system’s draft: “Not selectable: permission can’t be changed.”"],["d","Build the two Member cells with the Bento slot cell (the design system’s example); spacing already matches: 88 tall, padding 16, name and helper line stacked."]] }] },
  { id:"2", title:"If some don’t update", status:["In the MVP","Open question"], screens:[
    { id:"2.0", caption:"Left the page: a notification says how it went", from:"From MVP 1.2, they closed the drawer", notes:[["d","When the job finishes, a dashboard notification reports the result with counts only: how many updated and how many didn’t. It goes out every time, whatever the outcome. All three versions are in the States of the notification row. If the admin is still on the page, they see the toast too."],["n",[[9,"From the notification service when the job ends: counts only, as in the Dev note (names still open). No link back to the account in the MVP."]]]] },
    { id:"2.0b", caption:"Drawer closed: a toast says some didn’t update", from:"From MVP 1.2b, the job ends with some failures", tap:"Show details", notes:[["d","Reached from the paused state when the job ends with some failures. A warning toast says how many didn’t update, with two actions: Undo (primary) puts back the previous role for the ones that changed, and Show details (secondary). Nothing opens on its own. Show details opens the drawer with who failed and Try again, which retries only the ones that failed. The toast stays until it’s dismissed. A retry that ends while the drawer is closed uses the same toast. Undo needs the back end to keep everyone’s previous role (PM and engineering to confirm)."],["n",[[10,"Drawer closed and some failed: a warning toast with Undo and Show details. Nothing opens on its own. Show details opens the drawer with who failed and Try again. Stays until dismissed."]]]] },
    { id:"2.1", caption:"Show details: who failed, in the drawer", from:"From MVP 1.2, the drawer is still open", tap:"Try again for 2 members", notes:[["d","Opens from Show details in the toast, or shows in place when the drawer was still open as it finished. Nothing opens on its own. It lists who didn’t update, with one Try again for all of them. Failures keep their old role."],["n",[[11,"Opens from Show details in the toast, or shows in place if the drawer was still open when it finished; never on its own. One Try again retries everyone who failed; failures keep their old role. Failure reasons depend on the back end (open)."]]]] },
    { id:"2.2", caption:"Trying again, In progress", tap:"Some fail again", edge:"branch", notes:[["d","Try again runs the same way: In progress, no progress bar, and they can leave the page. If they close the drawer, the page pauses role changes again and the result comes as a toast."]] },
    { id:"2.3", caption:"Fails again", notes:[["d","If it fails again, the same list shows with the same copy as the first failure (no time stamp)."]] },
    { id:"2.4", caption:"None updated: a toast says so", tap:"Show details", notes:[["d","When nobody could be updated, a negative toast says so, with Show details. Roles stay as they were. In the drawer and the dashboard notification the line reads “We couldn’t update 48 members” instead of a count of who did, and Try again covers all 48."],["n",[[12,"Nobody updated: a negative toast with Show details. Roles stay as they were; the drawer and the notification say We couldn’t update 48 members, and Try again covers all 48."]]]] },
    { id:"2.5", caption:"None updated: Show details, in the drawer", notes:[["d","Show details when nobody was updated: the banner says “Role change failed” and “We couldn’t update the 48 members below. Their roles didn’t change.”, the list holds everyone who was selected, with no Couldn’t update label on the rows (they all failed), and Try again covers all 48. Same drawer as the partial case, only the copy and the count change."]] }] },
  // Figma row "MVP 6, States of the notification" (ids n.0 to n.3, since 6.x is the exploration row here). Counts only.
  { id:"n", label:"MVP 6", title:"States of the notification", status:["In the MVP"], screens:[
    { id:"n.0", label:"MVP 6.0", caption:"Done: a badge on the bell", tap:"Open the bell", notes:[["d","The notification goes out every time a bulk change finishes, whatever the outcome, so they hear back even after leaving the page. The bell gets its dot wherever they are, and opening it shows one of the three versions on the right."]] },
    { id:"n.1", label:"MVP 6.1", caption:"All updated: the notification", notes:[["d","Everyone got the role, so it just says “48 members updated to Publisher One.” Counts only, and no link back to the account in the MVP."]] },
    { id:"n.2", label:"MVP 6.2", caption:"Some didn’t update: the notification", notes:[["d","Counts only: how many updated and how many need a look. If they’re still on the page, Show details in the toast lists who didn’t update."]] },
    { id:"n.3", label:"MVP 6.3", caption:"None updated: the notification", notes:[["d","Nobody got the role and their roles didn’t change, so the line reads “We couldn’t update 48 members to Publisher One.” instead of a count. It doesn’t say Try again: the notification has no link back in the MVP, so there’s nothing to retry from there. The title starts with Role change failed, like the toast and the drawer."]] }] },
  { id:"3", group:"Manage roles", title:"Roles list and delete", status:["In the MVP"], screens:[
    { id:"3.0", caption:"All social accounts, Manage roles", tap:"Manage roles", notes:[["d","Roles are reached from Settings, Social accounts: Manage roles sits in the All social accounts header."],["n",[[13,"Entry point to the roles list, in the All social accounts header next to Add social account."]]]] },
    { id:"3.1", caption:"Roles list", tap:"Row menu, role in use", notes:[["d","The roles list shows each role’s member count as plain text, not a link. A count can span many members and many social accounts."]] },
    { id:"3.2", caption:"Delete is off while anyone has the role", notes:[["d","Delete is disabled while anyone still has the role, and the tooltip says when it becomes available. Deleting by moving everyone to another role first is out of the MVP."],["n",[[14,"Disabled while anyone has the role; the tooltip says when it becomes available. No reassigning before delete in the MVP."]]]] },
    { id:"3.3", caption:"Delete is on when nobody has the role", tap:"Delete", branchIn:{ from:"3.1", label:"Row menu, role nobody has" }, notes:[["d","Delete is enabled only when nobody has the role. Here it’s Publisher Two right after it’s created, with 0 in the Members column. Delete opens a confirm first, so nothing is deleted yet."],["n",[[15,"Enabled only when nobody has the role (0 in Members). Opens a confirm first; nothing is deleted yet."]]]] },
    { id:"3.4", caption:"Confirm before deleting", tap:"Delete role", notes:[["d","One confirm before the role is deleted. It names the role and says no one’s access changes, since nobody has it. Delete role deletes it; Cancel or close keeps it."],["n",[[16,"One confirm that names the role and says no one’s access changes. Cancel or close keeps the role."]]]] },
    { id:"3.5", caption:"Deleted, toast", notes:[["d","The role is gone from the roles list and from the role picker, and a toast confirms it. The list is back to 6 roles."]] }] },
  { id:"4", title:"Create a role", status:["In the MVP"], screens:[
    { id:"4.0", caption:"Start from an existing role", tap:"Start from Publisher One", notes:[["d","Start from an existing role copies its permissions into the new role. Changes to either role don’t affect the other. “Learn more about social account roles” goes to https://help.hootsuite.com/s/article/social-account-inbox-permissions."]] },
    { id:"4.1", caption:"Permissions in one list", tap:"Name already used", edge:"branch", notes:[["d","Permissions are one flat list, no product sections. The description is optional, up to 500 characters, and starts empty with no placeholder."],["n",[[17,"One flat list: no product sections, no Select all per section. Same list when editing a role."]]]] },
    { id:"4.1a", caption:"Name already used", tap:"Same permissions as another role", edge:"branch", notes:[["d","A name that is already used shows an error right away and Create role stays off. Role names are unique in the organization."]] },
    { id:"4.1b", caption:"Same permissions as Publisher One", tap:"Create role", notes:[["d","If the new role ends up with the same permissions as an existing role, an alert says so after Create role. That check runs on the back end."]] },
    { id:"4.2", caption:"Created, toast", notes:[["d","The new role appears in the roles list with nobody on it yet, and a toast confirms it."]] }] },
  { id:"5", title:"Edit a role", status:["In the MVP"], screens:[
    { id:"5.0", caption:"Edit from the row menu", tap:"Edit", notes:[["d","Edit opens from the row menu. Delete is disabled here too while anyone has the role. The ⋯ button’s tooltip says More actions."]] },
    { id:"5.1", caption:"Edit Publisher One", tap:"Save changes", notes:[["d","Editing a role changes it for everyone who has it. Same form and copy as create, without Start from: the title is Edit role and the button Save changes. The name can’t be empty: if it’s cleared, the field says “Enter a role name.” and Save changes turns off."]] },
    { id:"5.2", caption:"Save, with who it reaches", tap:"Save changes", notes:[["d","The confirmation says who the change reaches, 48 members on 12 social accounts, and that it may take a few minutes."]] },
    { id:"5.3", caption:"Updating in the background", tap:"Everyone has the new version", notes:[["d","The update runs in the background. Some members may keep their current permissions until it finishes, and the admin can leave the page. When it finishes, a dashboard notification goes out as well as the Updated toast, like a bulk change. engineering is confirming the edit job can send one; if it can’t, drop “We’ll notify you when it’s done.” from the banner."]] },
    { id:"5.4", caption:"Updated, toast", notes:[["d","Once everyone has the new version, a toast confirms it."]] }] },
  // Exploration from the 9 Oct customer check-in. Not part of the locked MVP; test mode (?ut=1) never shows it. Figma row
  // "Exploration" (1390:82851): Exploration 1.0, 1.1, 1.2 and 1.1a; the review of the matches (old 6.2 to 6.5) is gone, since the
  // back end moves everyone with exactly the same set to the new role on its own (engineering, 9 Oct).
  { id:"6", label:"Exploration", group:"Not in the locked MVP, for review", title:"Create a role from existing permissions (exploration, 9 Oct check-in)", summary:"Proposed on the 9 Oct call, after the 8 Oct lock. In the launch if the estimate fits, otherwise the fast follow.", status:["Exploration","Open question"], explore:true, screens:[
    { id:"6.0", label:"Exploration 1.0", caption:"Members with custom permissions", tap:"Create role from these permissions", notes:[["d","Bryn Morales and 8 others on YouTube Somos share one custom permission set, and 4 more are one permission away. Their Permissions cell reads Custom, and Custom in the Role filter lists everyone like them. On a Custom member, the row menu adds Create role from these permissions; the rest of the menu stays as it is."]] },
    { id:"6.1", label:"Exploration 1.1", caption:"Create role, prefilled from Bryn Morales", tap:"Create role", notes:[["d","The same Create role page, filled with Bryn’s permissions. Start from is read only, and the name starts empty with focus on it; here it’s typed in. Keep the permissions as they are and Bryn, plus everyone with exactly the same set, moves to the role when it’s created. Change any and nobody moves, so no one’s access changes by surprise. Any custom set can become a role, since permissions aren’t tied to a network type; engineering to confirm."]] },
    { id:"6.2", label:"Exploration 1.2", caption:"Created: matching people switch to it", notes:[["d","Back on the Members tab with a toast. Bryn and the 8 others with exactly the same permissions now show Inbox Lead. What they can do doesn’t change, so there’s no review step and no Undo. The 4 who are one permission away stay Custom. Engineering to confirm the switch covers every account, and whether it runs in the background like role edits."]] },
    { id:"6.1a", label:"Exploration 1.1a", caption:"From Manage roles: start from a person", from:"Second entry: Create role from Manage roles", notes:[["d","Extra idea, not asked for on the call. From Manage roles, Start from gets one more option, A person’s current permissions. Picking it asks for the person and the social account, since permissions are per account, then fills the page as in the step before. Someone already on a role copies that role, so the same-permissions check names it."]] }] },
  { id:"cut", group:"Cut on 8 Oct, kept for the record", label:"Cut", title:"Cut on 8 Oct (lock session)", status:["Cut on 8 Oct"], cut:true, screens:[
    { id:"x.1", label:"Cut 8 Oct", caption:"Review, counts only", tap:"Apply to 45 members", edge:"branch", notes:[["d","The review shows one line per current role with how many people move from it, counts only, no permission diff. 45 move, 3 already have it. Nothing changes until Apply."]] },
    { id:"x.2", label:"Cut 8 Oct", caption:"Applying, In progress in the top banner", notes:[["d","Apply closes the drawer. The top banner says In progress, with no percentage and no live count, so the page doesn’t poll the back end. Rows keep their current role until the job finishes, and it keeps going if the admin leaves the page."]] }] },
];
const MVP_SCREEN_IDS = MVP_ROWS.reduce((a, r) => a.concat(r.screens.map((s) => s.id)), []);
const mvpScreen = (id) => { for (const r of MVP_ROWS) { const s = r.screens.find((x) => x.id === id); if (s) return { row:r, s }; } return null; };
// "In and out of the MVP", word for word from the Figma card of that name (1390:84883, on the page next to the section, 23 Oct).
const MVP_CARD = { title:"In and out of the MVP", groups:[
  { title:"In the MVP (8 Oct lock session)", tone:"positive", items:[
    "One entry point for bulk apply: a social account’s Members tab",
    "The header checkbox selects the loaded members only; Unlimited admins are greyed out with a reason; admins who can’t edit custom permissions see no checkboxes",
    "Search or a filter clears the selection",
    "Pick a role in the drawer, Apply goes straight to In progress: no review step",
    "In progress in the drawer, no bar or percentage; the notification service says when it’s done",
    "If some fail and they’re still on the page: who failed, one Try again",
    "Custom social account roles: create (start from an existing role, one flat permissions list) and edit (updates everyone with the role)",
    "Roles list from Manage roles in the All social accounts header, plus a Manage roles link in the role picker",
    "Member counts as plain text; Delete only when nobody has the role",
    "Custom roles in the existing social account role filters"] },
  { title:"Not in the MVP", tone:"neutral", items:[
    "Select all 500 or across pages, and “all except one”",
    "The review step: permission diff, counts per role, lockout warning, leave out",
    "Live progress bar, and the banner after leaving the drawer",
    "Who has a role on which account, moving people between roles, reassigning before delete",
    "The person side entry point, and applying across many accounts at once",
    "CSV import and export, custom team roles, a custom role as the org default",
    "Product sections in permissions, network specific warnings, role history"] },
  { title:"Still open", tone:"warning", items:[
    "An info tooltip on permissions some networks don’t support (product, design)",
    "Failure reasons (PM and engineering checking the back end)",
    "Retry after leaving: a link from the notification isn’t committed",
    "Notification content: counts only, or with names",
    "Wording of the delete confirm",
    "Undo on bulk toasts (design system, 12 Oct): in the designs; the back end has to keep previous roles (PM, engineering)"] }] };
Object.assign(window, { MVP_NAMED_N, MVP_UT, MVP_UT_FAIL_ACCT, MVP_NET, MVP_NAV, MVP_P1, MVP_UNL, MVP_LOADED, MVP_TOTAL, MVP_FAIL, MVP_REVIEW_ORDER, MVP_FILTER_ROLES, MVP_ACCOUNTS, MVP_PERMS, mvpPermDesc, MVP_EDIT_LIST, MVP_EDIT_ON, MVP_EDIT_SAVED, mvpPeople, mvpCanChange, mvpOrder, MVP_ROLE_ROWS0, MVP_P2, MVP_P2_DESC, MVP_P2_ROW, MVP_CUSTOM, MVP_NEW, MVP_SET_A, MVP_SET_B, MVP_SET_A_IDS, MVP_SET_B_IDS, mvpWithCustom, mvpSameSet, mvpToastMatched, MVP_NOTIF, mvpNotifRow, mvpNotif, MVP_PERSON, MVP_PERSON_ACCTS0, MVP_ROWS, MVP_SCREEN_IDS, mvpScreen, MVP_CARD });
