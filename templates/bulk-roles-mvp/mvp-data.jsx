// Bulk roles MVP, data. Source of truth: Suite Settings Figma, section "Bulk Roles MVP 10/8",
// locked on 8 Oct (no review step, no banner, 48 / 46 of 48). Reuses BR_* data from ../bulk-roles/br-data.jsx.
const MVP_P1 = "Publisher One";
const MVP_UNL = "Unlimited";
const MVP_LOADED = 50, MVP_TOTAL = 500;
// The 12 people the Figma frames show, in order. Dar Khan and Mateo Rossi have Unlimited access from the organization.
const MVP_NAMED = [["Asha Patel","Aug 19, 2026","Editor"],["Bryn Morales","Feb 3, 2026","Publisher One"],["Chaya Levi","Feb 3, 2026","Editor"],["Dar Khan","Mar 21, 2026","Unlimited"],["Elif Demir","Apr 2, 2026","Limited"],["Gia Russo","Apr 1, 2026","Responder"],["Hana Kim","Mar 23, 2026","Editor"],["Ivo Novak","Mar 23, 2026","Editor"],["Mateo Rossi","Jun 12, 2026","Unlimited"],["Nadia Mensah","May 4, 2026","Limited"],["Omar Said","Jul 8, 2026","Editor"],["Priya Kaur","Jan 27, 2026","Care Agent"]];
// Rows 13 to 50 complete the first load so the 48 who can change are: Editor 26, Limited 8, Advanced 4, Responder 4,
// Care Agent 3, and 3 already on Publisher One (45 move).
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
  const out = MVP_NAMED.map(([n, d, r], i) => mvpPerson(i, n, d, r));
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

// The notification the notification service sends when the job finishes (8 Oct lock session). Counts only, as the
// Full Flows 2.0. Injected into the production Notifications panel's rows.
// Usability test mode (?ut=1, 9 Oct): only the product shows, it starts on All social accounts, every account opens with
// its own members, no role is preselected, and @somos.kids always fails for Hana Kim and Omar Said (Try again works).
const MVP_UT = /[?&#]ut=1(?![0-9])/.test(location.search + location.hash);
const MVP_UT_FAIL_ACCT = "a4";
const MVP_NET = { instagram:"Instagram", linkedin:"LinkedIn", facebook:"Facebook", youtube:"YouTube", tiktok:"TikTok" };
const MVP_NOTIF = { id:"mvp-bulk", unread:true, title:"Publisher One on YouTube Somos", preview:"46 of 48 updated. 2 need a look.", product:"Settings", cat:"Social accounts", time:"Just now", av:"YS", net:"youtube" };
// o (test mode): the finished job's own title and counts instead of the Figma example.
function mvpNotif(on, o) {
  if (typeof NFP_ROWS === "undefined") return;
  const i = NFP_ROWS.findIndex((n) => n.id === MVP_NOTIF.id);
  if (o && i >= 0) NFP_ROWS.splice(i, 1);
  if (on && (o || i < 0)) NFP_ROWS.unshift(o ? { ...MVP_NOTIF, ...o } : MVP_NOTIF);
  if (!on && i >= 0) NFP_ROWS.splice(i, 1);
}

// Board and prototype copy, from the Full Flows (8 Oct). Notes are his Dev note texts (kind "d").
// Connectors: edge "main" = the main path (solid red on the board), "branch" = a branch (dashed grey).
const MVP_ROWS = [
  { id:"1", title:"Apply a role to the loaded members", summary:"From a social account’s Members tab, the only entry point in the MVP. Apply goes straight to In progress, with no review step.", status:["In the MVP"], screens:[
    { id:"1.0", caption:"Header checkbox ticks the 48 who can change", tap:"Apply role", notes:[["d","The header checkbox selects the loaded members who can be changed, 48 here. There is no Select all for all 500. Unlimited members can’t be selected: their access comes from the org, so a bulk change would always fail for them."]] },
    { id:"1.1", caption:"Pick the role", tap:"Apply to 48 members", notes:[["d","The picker lists the same roles as the roles list, with custom roles marked Custom. Search narrows the list, and only the list scrolls. Manage roles sits at the top under the intro, so it’s always in view, even with 20+ roles. It opens the roles list when the role they need isn’t there; the selection doesn’t carry over. Apply to 48 members goes straight to In progress; there’s no review step (8 Oct lock session)."]] },
    { id:"1.2", caption:"Applying, in the drawer", tap:"Everyone updated", fork:"Some don’t update", notes:[["d","Apply goes straight here, with no review step (8 Oct lock session). The drawer says Applying Publisher One to 48 members, In progress, with no bar or percentage. If they close it there’s no banner: the notification service tells them when it’s done (jobs take seconds)."]] },
    { id:"1.3", caption:"Everyone updated, toast", notes:[["d","When everyone updates, a toast confirms it."]] }] },
  { id:"1b", title:"States of the members table", summary:"Hover, more members loading, filters, and admins who can’t edit.", status:["In the MVP"], states:true, screens:[
    { id:"1.0a", caption:"Hover on a greyed checkbox", notes:[["d","The checkbox for an Unlimited member is disabled. Hovering it shows why: access comes from the organization and can’t be changed here."]] },
    { id:"1.0b", caption:"More members load after the header checkbox", notes:[["d","Members that load after the header checkbox was ticked stay unselected. The header checkbox shows partly selected and the count stays 48."]] },
    { id:"1.0c", caption:"A filter clears the selection", notes:[["d","Any new search or filter clears the selection and closes the bulk bar, so a changed list always starts from a fresh selection."]] },
    { id:"1.0d", caption:"Admin who can’t edit custom permissions", notes:[["d","An admin who can’t update custom social account permissions gets no checkboxes and no bulk bar. The page is read only for them."]] },
    { id:"1.0e", caption:"The Permissions filter lists custom roles", notes:[["d","The Permissions filter lists system roles and custom roles together, the same list as the role picker. Only lists that show the social account role include custom roles in their filter."]] }] },
  { id:"2", title:"If some don’t update", summary:"Branches from MVP 1.2 when 2 fail. What worked stays applied.", status:["In the MVP","Open question"], screens:[
    { id:"2.0", caption:"Left the page: a notification says how it went", from:"From MVP 1.2, they closed the drawer", notes:[["d","If the admin left the page, a dashboard notification reports the result with counts only: how many updated and how many didn’t."]] },
    { id:"2.1", caption:"Still on the page: who failed, in the drawer", from:"From MVP 1.2, the drawer is still open", tap:"Try again for 2", notes:[["d","If they are still on the page when it finishes, the drawer lists who didn’t update, with one Try again for all of them. Failures keep their old role."]] },
    { id:"2.2", caption:"Trying again, In progress", tap:"Some fail again", edge:"branch", notes:[["d","Try again runs the same way: In progress, no progress bar, and they can leave the page."]] },
    { id:"2.3", caption:"Fails again", notes:[["d","If it fails again, the same list shows with the time of the last try."]] }] },
  { id:"3", title:"Roles list and delete", summary:"Counts are plain text. Delete is off while anyone has the role. When nobody has it, Delete asks once to confirm, then removes it.", status:["In the MVP"], screens:[
    { id:"3.0", caption:"All social accounts, Manage roles", tap:"Manage roles", notes:[["d","Roles are reached from Settings, Social accounts: Manage roles sits in the All social accounts header."]] },
    { id:"3.1", caption:"Roles list", tap:"Row menu, role in use", notes:[["d","The roles list shows each role’s member count as plain text, not a link. A count can span many members and many social accounts."]] },
    { id:"3.2", caption:"Delete is off while anyone has the role", notes:[["d","Delete is disabled while anyone still has the role, and the tooltip says when it becomes available. Deleting by moving everyone to another role first is out of the MVP."]] },
    { id:"3.3", caption:"Delete is on when nobody has the role", tap:"Delete", branchIn:{ from:"3.1", label:"Row menu, role nobody has" }, notes:[["d","Delete is enabled only when nobody has the role. Here it’s Publisher Two right after it’s created in 4.2, at 0 people. Delete opens a confirm first, so nothing is deleted yet."]] },
    { id:"3.4", caption:"Confirm before deleting", tap:"Delete role", notes:[["d","One confirm before the role is deleted. It names the role and says no one’s access changes, since nobody has it. Delete role deletes it; Cancel or close keeps it."]] },
    { id:"3.5", caption:"Deleted, toast", notes:[["d","The role is gone from the roles list and from the role picker, and a toast confirms it. The list is back to 6 roles."]] }] },
  { id:"4", title:"Create a role", summary:"Permissions in one list, no product sections.", status:["In the MVP"], screens:[
    { id:"4.0", caption:"Start from an existing role", tap:"Start from Publisher One", notes:[["d","Start from an existing role copies its permissions into the new role. The two roles stay separate afterwards."]] },
    { id:"4.1", caption:"Permissions in one list", tap:"Name already used", edge:"branch", notes:[["d","Permissions are one flat list, no product sections. The description is optional, up to 500 characters."]] },
    { id:"4.1a", caption:"Name already used", tap:"Same permissions as another role", edge:"branch", notes:[["d","A name that is already used shows an error right away and Create role stays off. Role names are unique in the organization."]] },
    { id:"4.1b", caption:"Same permissions as Publisher One", tap:"Create role", notes:[["d","If the new role ends up with the same permissions as an existing role, an alert says so after Create role. That check runs on the back end."]] },
    { id:"4.2", caption:"Created, toast", notes:[["d","The new role appears in the roles list with nobody on it yet, and a toast confirms it."]] }] },
  { id:"5", title:"Edit a role", summary:"Editing a role updates everyone who has it.", status:["In the MVP"], screens:[
    { id:"5.0", caption:"Edit from the row menu", tap:"Edit", notes:[["d","Edit opens from the row menu. Delete is disabled here too while anyone has the role."]] },
    { id:"5.1", caption:"Edit Publisher One", tap:"Save role", notes:[["d","Editing a role changes it for everyone who has it. Same form as create, without Start from."]] },
    { id:"5.2", caption:"Save, with who it reaches", tap:"Save and update 48 people", notes:[["d","Save says who the change reaches: 48 people on 12 social accounts."]] },
    { id:"5.3", caption:"Updating in the background", tap:"Everyone has the new version", notes:[["d","The update runs in the background. People can briefly keep the old version of the role until it finishes, and the admin can leave the page."]] },
    { id:"5.4", caption:"Updated, toast", notes:[["d","Once everyone has the new version, a toast confirms it."]] }] },
  { id:"cut", label:"Cut", title:"Cut on 8 Oct (lock session)", summary:"Taken out of the MVP at the lock session. Kept here for the record; not part of the flow.", status:["Cut on 8 Oct"], cut:true, screens:[
    { id:"x.1", label:"Cut 8 Oct", caption:"Review, counts only", tap:"Apply to 45 members", edge:"branch", notes:[["d","The review shows one line per current role with how many people move from it, counts only, no permission diff. 45 move, 3 already have it. Nothing changes until Apply."]] },
    { id:"x.2", label:"Cut 8 Oct", caption:"Applying, In progress in the top banner", notes:[["d","Apply closes the drawer. The top banner says In progress, with no percentage and no live count, so the page doesn’t poll the back end. Rows keep their current role until the job finishes, and it keeps going if the admin leaves the page."]] }] },
];
const MVP_SCREEN_IDS = MVP_ROWS.reduce((a, r) => a.concat(r.screens.map((s) => s.id)), []);
const mvpScreen = (id) => { for (const r of MVP_ROWS) { const s = r.screens.find((x) => x.id === id); if (s) return { row:r, s }; } return null; };
// "In and out of the MVP", the 8 Oct lock session (same lists as the card in Full Flows).
const MVP_CARD = { title:"In and out of the MVP", subtitle:"8 Oct lock session", groups:[
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
    "An info tooltip on permissions some networks don’t support (design)",
    "Failure reasons (PM and engineering checking the back end)",
    "Retry after leaving: a link from the notification isn’t committed",
    "Notification content: counts only, or with names"] }] };
Object.assign(window, { MVP_UT, MVP_UT_FAIL_ACCT, MVP_NET, MVP_NAV, MVP_P1, MVP_UNL, MVP_LOADED, MVP_TOTAL, MVP_FAIL, MVP_REVIEW_ORDER, MVP_FILTER_ROLES, MVP_ACCOUNTS, MVP_PERMS, mvpPermDesc, MVP_EDIT_LIST, MVP_EDIT_ON, MVP_EDIT_SAVED, mvpPeople, mvpCanChange, mvpOrder, MVP_ROLE_ROWS0, MVP_P2, MVP_P2_DESC, MVP_P2_ROW, MVP_NOTIF, mvpNotif, MVP_ROWS, MVP_SCREEN_IDS, mvpScreen, MVP_CARD });
