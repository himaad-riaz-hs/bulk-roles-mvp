// Bulk roles MVP, pages inside the Suite Settings shell. Built from Suite Settings parts (SS*), the full flow's
// shared UI (BRDrawer, BRBulkBar, BRBarBtn, BRPop, BRFootBar, BRRoleRadios from ../bulk-roles/br-ui.jsx) and bundle components.
const MVPC = React.createContext(null);
// Production Settings > Members, measured 8 Oct 2026 (read only): body rows 72.7 = cell padding 12 16 + 48 content +
// 1px border; header 56.7 (16/600, padding 16); panel padding 24, no border, 40 in from the content edge and below the
// entity header; search 402 x 48; filter chips 40 tall, 24 apart; permission trigger 40 tall, padding 8 16, disabled
// fill #F7F8F9 (grey-100). Table rows, header and in-table option triggers come from the kit (.hs-table, kit change
// approved by design 8 Oct); this file only keeps the page-level spacing below (content 40, search, chips, panel).
// Figma "Bulk Roles MVP 10/8" frame specs (8 Oct, design: align everything like Figma). Scoped to the MVP, kit untouched.
// The kit's menu check icon uses --bento-theme-color-icon-selected, which this kit copy doesn't define (the Bento guard flagged it
// when a role menu opened, 9 Oct). Defined here with the kit's selected accent, scoped to the prototype.
const MVP_CSS = "[data-mvp-stage]{--bento-theme-color-icon-selected:var(--bento-system-sys-accent-900)}.mvp-toasts>*{width:380px;box-sizing:border-box;background:var(--bento-theme-color-bg-positive,#e6f3e9) !important}.mvp-toasts>[data-mvp-toast=warning]{background:var(--bento-theme-color-bg-warning,var(--hs-ref-accent-fff6e8)) !important}.mvp-tip .hs-tooltip{white-space:normal !important;width:282px;max-width:282px !important;box-sizing:border-box}.mvp-tip .hs-tooltip{padding:12px 16px;font-size:16px !important;line-height:24px !important;text-align:left !important}.mvp-tip--top .hs-tooltip{left:50% !important;right:auto;top:auto;bottom:calc(100% + 8px);transform:translateX(-50%) !important;margin:0}.mvp-roles-table .hs-table tbody tr:not(:hover):not(:focus-within) td:last-child .hs-btn--icon:not([aria-expanded=true]){opacity:0}.mvp-acct-table .hs-btn--icon{background:transparent !important;box-shadow:none !important}.mvp-nowrap{white-space:nowrap}[data-mvp-stage] :has(>.hs-bulk-bar){align-items:flex-end !important}[data-mvp-stage] .hs-drawer-footer{height:64px;padding:12px 24px;justify-content:flex-end}[data-mvp-stage] .hs-drawer-footer>div{gap:8px}[data-mvp-stage] .hs-drawer-body{padding:16px 24px}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-role-list]){display:flex;flex-direction:column;overflow:hidden}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-role-list])>*{flex:none}[data-mvp-stage] [data-mvp-role-list]{flex:1 1 auto !important;min-height:0 !important;max-height:none !important}[data-mvp-stage] .hs-drawer-body:has(>[data-mvp-applying]){display:flex;flex-direction:column}[data-mvp-stage] .hs-org-trigger{display:none !important}[data-mvp-stage] :has(>.mvp-form-page){background:var(--bento-system-sys-neutral-alt-200,#f4f5f6) !important}.mvp-form-page input.hs-input,.mvp-form-page .hs-select{height:48px;box-sizing:border-box}[data-mvp-role-list] [role=radio]{padding:12px 0}.mvp-acct *{font-weight:400 !important}[data-mvp-stage] .hs-rail{width:64px;padding:0 0 12px}[data-mvp-stage] .hs-rail-brand{height:68px;width:56px;align-items:center;justify-content:center;box-sizing:border-box}[data-mvp-stage] .hs-rail-group{gap:8px}[data-mvp-stage] .hs-rail-item{height:48px;min-width:48px;justify-content:center}[data-mvp-stage] .hs-rail-label{display:none}[data-mvp-stage] .hs-navdrawer-orgwrap{display:none}[data-mvp-stage] .hs-navdrawer-orgwrap+.hs-navdrawer-body,[data-mvp-stage] .hs-navdrawer-body{padding-top:0}[data-mvp-stage] .hs-header--entity{height:132px;min-height:132px}[data-mvp-stage] .hs-header--entity:not(:has(.hs-header-meta)){height:88px;min-height:88px}[data-mvp-stage] .hs-header--entity .hs-header-title{font-size:26px;line-height:32px}[data-mvp-stage] .hs-header-entity{gap:12px}[data-mvp-stage] .hs-header-entity-text{gap:2px}[data-mvp-stage] .hs-header--entity .hs-header-meta{line-height:24px}[data-mvp-stage] .hs-header-entity .hs-avatar{width:40px !important;height:40px !important;min-width:40px;font-size:14px !important}[data-mvp-stage] .hs-header-entity .hs-avatar{flex:none}[data-mvp-stage] .hs-header-entity>span:has(.hs-avatar){width:40px;height:40px;flex:none;transform:none !important;margin:0 !important}[data-mvp-stage] .hs-header-entity>span>span:has(.hs-avatar){width:40px;height:40px}[data-mvp-stage] .hs-header+div:has(>.hs-tabs){height:56px !important;padding:8px 24px !important;box-sizing:border-box;background:var(--hs-surface)}[data-mvp-stage] :has(>.mvp-content){background:var(--bento-system-sys-neutral-alt-200,#f4f5f6) !important}[data-mvp-stage] .mvp-content{background:var(--bento-system-sys-neutral-alt-200,#f4f5f6)}.mvp-content .hs-panel{box-shadow:none;gap:24px}.mvp-content .hs-panel>div>h2:first-child{font-size:22px !important;line-height:32px !important}.mvp-content .hs-table thead th{height:56px}.mvp-content .hs-table tbody td{padding-top:0;padding-bottom:0;height:56px;box-sizing:border-box}.mvp-content .hs-input.mvp-search48{height:40px;max-width:310px}"
  + ".mvp-members tbody tr:has(.hs-check.is-on){background:var(--bento-component-table-selected-fill)}"
  + ".mvp-members .hs-option-trigger[aria-disabled=true],.mvp-members .hs-option-trigger[aria-disabled=true]:hover{white-space:nowrap;background:var(--bento-component-option-trigger-fill-disabled);color:var(--bento-component-option-trigger-text-disabled);cursor:not-allowed}"
  + ".mvp-tip .hs-tooltip{left:-8px;transform:none;white-space:nowrap;max-width:none}.mvp-tip--on .hs-tooltip{opacity:1}"
  + ".mvp-tip--left .hs-tooltip{left:auto;right:calc(100% + 16px);top:50%;bottom:auto;transform:translateY(-50%);margin:0}"
  + ".mvp-filter-opt{display:flex;align-items:center;gap:var(--bento-space-03);width:100%}.mvp-filter-opt>span:nth-child(2){flex:1;text-align:left}";
// Test mode only (13 Oct, session P4): Chrome's "sharing your screen" bar covered the bulk action bar at the bottom, and the
// UserTesting task panel (bottom right) covered Create role and Save role. Lift the bar clear and put the footer buttons on the left.
// 14 Oct (session P332): on a Mac, Chrome's sharing bar sits bottom centre and covered the footer buttons too, so the footer keeps
// 88px of space under its buttons in test mode.
const MVP_UT_CSS = ".br-bulkwrap{bottom:140px !important}.br-footbar>div:last-child>span:last-child{margin-left:0 !important;order:-1}.br-footbar>div:last-child{padding-bottom:88px !important}";
// Figma "Bulk Roles MVP 10/9/26" plus plugin update 29 (copy pass, 23 Oct). Review mode follows it. Two places keep the copy
// they had before: test mode (?ut=1, the live UserTesting study, so its tasks read the same mid-study) and the "Cut 8 Oct"
// record screens (x.1, x.2), which Figma keeps as they were. MVP_FIG = the Figma frame chrome (tab counts, photo avatars,
// the fixed page frame below); it shows everywhere except test mode.
const MVP_FIG = !MVP_UT;
const mvpOld = (A) => MVP_UT || /^x\./.test((A && A.screen) || "");
const MVP_AVATAR = "img/avatar.jpg";   // the photo the Figma frames use on every social account (an Unsplash image fill in the file)
// Review mode rail (Figma comp-main-nav, every frame): the bottom group is Analytics, Notifications, Add member (group_add),
// Add social account (control_point_duplicate) and the account avatar (the same photo). Test mode keeps the kit's three.
const MVP_RAIL_UTIL = [{ id:"analytics", label:"Analytics", icon:"bar_chart" }, { id:"notifications", label:"Notifications", icon:"notifications_none" },
  { id:"add-member", label:"Add member", icon:"group_add" }, { id:"add-account", label:"Add social account", icon:"control_point_duplicate" }, { id:"account", label:"Account", icon:"account_circle" }];
// Review mode only: the Figma notification panel (2.0) is 400 wide, no scrim, no mark all, one row with a warning icon, the
// unread dot on the left and no product line. The kit panel (src/notif-panel.jsx) stays as it is; this only restyles it here.
const MVP_FIG_CSS = "[data-mvp-stage] .nfp-scrim{background:transparent}[data-mvp-stage] .nfp-panel{width:400px;left:64px}[data-mvp-stage] .nfp-row{gap:24px}[data-mvp-stage] .nfp-av{width:24px;overflow:hidden}[data-mvp-stage] .nfp-markall{display:none}"
  + "[data-mvp-stage] .nfp-row{position:relative}[data-mvp-stage] .nfp-crumb{display:none}[data-mvp-stage] .nfp-av>*{display:none !important}"
  + "[data-mvp-stage] .nfp-av::before{content:'warning';font-family:'Material Symbols Outlined';font-size:24px;line-height:24px;width:24px;height:24px;margin-top:2px;display:inline-block;text-align:center;color:var(--bento-theme-color-icon-warning,#7a5300);font-variation-settings:'FILL' 1}"
  + "[data-mvp-stage] .nfp-side .nfp-dot{position:absolute;left:3px;top:17px;background:var(--bento-theme-color-icon-info,#1F60C9)}"
  // Figma 2.0 type: 20 title, 13 View all, 14 tabs and range, the whole preview on two lines at 16 (the kit cuts it to one line at 14).
  + "[data-mvp-stage] .nfp-head{padding:12px 12px 4px 16px}[data-mvp-stage] .nfp-head h2{font-size:20px;line-height:32px}[data-mvp-stage] .nfp-viewall{font-size:13px;font-weight:400}"
  + "[data-mvp-stage] .nfp-tabs{padding:0;gap:16px}[data-mvp-stage] .nfp-ctrl{padding:0 12px 6px 16px}[data-mvp-stage] .nfp-ctrl .nfp-range{min-width:0;padding:0 8px}[data-mvp-stage] .nfp-tab{font-size:14px}[data-mvp-stage] .nfp-tab[aria-selected=false]{font-weight:400}[data-mvp-stage] .nfp-range{font-size:14px;font-weight:400}"
  + "[data-mvp-stage] .nfp-row{padding:16px 16px 16px 24px}[data-mvp-stage] .nfp-preview{white-space:normal;font-size:16px;line-height:24px;color:var(--bento-theme-color-text-subtle)}[data-mvp-stage] .nfp-time{font-size:16px;white-space:nowrap}";
// Figma rows added 23 Oct (builder 2): 2.0b and 2.4 toast fills and their tinted buttons, the dot on the bell (MVP 6.0), the
// notification icon per outcome (6.1 to 6.3), 1.0f (record: the whole Unlimited row greyed), the person page (104 header, the panel
// to the bottom of the frame) and the role tooltip on 1.2b (Figma draws it 62 to the right of the trigger).
const MVP_FIG2_CSS = ".mvp-toasts>[data-mvp-toast=warning]{background:var(--bento-system-sys-warning-100,#ffe7c0) !important}.mvp-toasts>[data-mvp-toast=negative]{background:var(--bento-theme-color-bg-negative,#fbe6e6) !important}"
  + ".mvp-toasts [data-mvp-toast-btn=tint]{border-color:transparent !important;color:var(--bento-theme-color-text-base) !important;box-shadow:none !important}.mvp-toasts>[data-mvp-toast=warning] [data-mvp-toast-btn=tint]{background:var(--bento-system-sys-warning-300,#ffd581) !important}.mvp-toasts>[data-mvp-toast=negative] [data-mvp-toast-btn=tint]{background:var(--bento-system-sys-negative-100,#f1b3b1) !important}"
  + "[data-mvp-bell=on] .hs-rail-item[title=Notifications] .hs-rail-glyph{position:relative}[data-mvp-bell=on] .hs-rail-item[title=Notifications] .hs-rail-glyph::after{content:'';position:absolute;right:calc(50% - 22px);bottom:calc(50% - 23px);width:10px;height:10px;border-radius:50%;background:var(--bento-theme-color-icon-negative,#C00);box-shadow:0 0 0 2px var(--hs-surface)}"
  + "[data-mvp-stage] .nfp-row[aria-label*='Role change complete on'] .nfp-av::before{content:'check_circle';color:var(--bento-theme-color-icon-positive,#1C7A3A)}[data-mvp-stage] .nfp-row[aria-label*='Role change failed on'] .nfp-av::before{content:'error';color:var(--bento-theme-color-icon-negative,#C00)}"
  + ".mvp-members--rowoff tbody tr:has([data-mvp-row-off]) td{opacity:.4}"
  + "[data-mvp-person] .hs-header--entity{height:104px;min-height:104px}[data-mvp-person] .mvp-content{min-height:100%}[data-mvp-person] .mvp-content>.hs-panel{flex:1 1 auto}"
  + ".mvp-tip--r62 .hs-tooltip{left:62px !important}.mvp-tip--c .hs-tooltip{text-align:center !important}"
  // Figma 1.3, 1.0j, p.3: Undo is a tinted 40 tall button; p.1, p.2: the drawer title stays on one line.
  + ".mvp-toasts>[data-mvp-toast=undo] [data-mvp-toast-btn=tint]{background:var(--bento-system-sys-positive-100,#b0d9b9) !important}"
  + "[data-mvp-stage] .hs-drawer:has([data-mvp-person-drawer]) .hs-drawer-header strong{white-space:nowrap}"
  // Figma page banners (1.2b, 5.3): 80 tall, padding 16, title 16/600 on a 24 line (the kit AlertBanner is 12 and 700/20).
  + "[data-mvp-stage] .hs-alert[style*='padding: 12px 24px']{padding:16px 24px !important}[data-mvp-stage] .hs-alert[style*='padding: 12px 24px'] .hs-alert-title{line-height:24px !important;font-weight:600 !important}";
// Pixel pass (builder 4, 23 Oct), review mode only, measured from the Figma JSON (absoluteBoundingBox) against the DOM:
// rail items on a 56 pitch from y 72, the bottom group ending 8 above the frame edge, the 48 photo avatar; drawer content 16 in
// (the kit has 17); the header and the tab bar each end on a 1px inner line (Figma inner shadow); header actions 16 apart; the
// tab bar 64 tall with the 40 tabs 12 down and the active line on the tab's last row plus one below (Figma draws it 183 to 184).
const MVP_PX_CSS = "[data-mvp-stage] .hs-rail{padding:0}[data-mvp-stage] .hs-rail-group:not(.is-utility){margin-top:4px}[data-mvp-stage] .mvp-rail-av{width:48px;height:48px;border-radius:50%;display:block;object-fit:cover}"
  + "[data-mvp-stage] .hs-navdrawer-head,[data-mvp-stage] .hs-navdrawer-body{padding-left:16px}"
  + "[data-mvp-stage] .hs-header{box-shadow:inset 0 -1px 0 0 var(--bento-theme-color-border-subtle)}[data-mvp-stage] .hs-header>.hs-header-slot:last-child{gap:16px}"
  + "[data-mvp-stage] .hs-header+div:has(>.hs-tabs){height:64px !important;padding:12px 24px !important}"
  + "[data-mvp-stage] .hs-tab.is-active{box-shadow:inset 0 -1px 0 0 var(--bento-palette-ref-palette-dark-grey-500),0 1px 0 0 var(--bento-palette-ref-palette-dark-grey-500)}"
  // Tables: the Figma column widths exactly at the Figma frame width and up (fixed layout; auto layout widens a column whose header
  // and caret need more; narrower windows keep auto layout so the columns still fit the panel), rows
  // exactly 56 apart with no half pixel at the end (separate borders), avatar and name 8 apart (Figma container-avatar +
  // gap 8; the parts use 12), the sort caret 20 and base ink (Figma arrow_drop_down 20, vector #1C1C1C; the kit draws 16, subtle).
  + "@media (min-width:1512px){[data-mvp-stage] .hs-table{table-layout:fixed}}[data-mvp-stage] .hs-table{border-collapse:separate;border-spacing:0}[data-mvp-stage] .hs-table td span:has(>.hs-avatar),[data-mvp-stage] .hs-table td span:has(>span>.hs-avatar){gap:var(--bento-theme-spacing-02) !important}"
  + "[data-mvp-stage] .hs-th .material-symbols-outlined{font-size:20px;width:20px;color:var(--hs-fg)}"
  // Checkboxes in table cells sit 16 down in the 56 row (Figma comp-checkbox at +16); inline they ride the text baseline 3 higher.
  + "[data-mvp-stage] .hs-table :is(td,th)>:is(.hs-check,.hs-tooltip-wrap){display:flex;width:max-content}"
  // A header with no avatar (Roles, Create a role, Edit role): back button and title 8 apart (Figma "title" gap 8; identity is 12).
  + "[data-mvp-stage] .hs-header-entity:not(:has(.hs-avatar)){gap:var(--bento-theme-spacing-02)}"
  // All social accounts (3.0, the only fill page): the panel to the bottom and its title at 26 (the org list panels are 22).
  + ".mvp-content--fill>.hs-panel{flex:1 1 auto}.mvp-content.mvp-content--fill .hs-panel>div>h2:first-child{font-size:26px !important}"
  // Status badges sit 16 down in the row (Figma nested-table-cell/status: content padding 16, top aligned), not centred.
  + "[data-mvp-stage] .hs-table td:has(>span>.hs-badge:only-child){vertical-align:top;padding-top:16px}"
  // Filter chips (Figma comp-chip-filter-options): 16 before the label, the 16 chevron in a 24 box 8 after it, 8 at the end. The
  // kit's .cf picks 12 and 16 because its chevron span is the first element child.
  + "[data-mvp-stage] .cf:has(.chev){padding:0 12px 0 16px}[data-mvp-stage] .cf .chev{margin-left:4px}"
  // Page banners (1.2b, 5.3, x.2) and drawer alerts (2.1, 2.3, 2.5): the 20 status icon centred in a 24 box (Figma
  // nested-alert-icon-status), the text 16 after it.
  + "[data-mvp-stage] .hs-alert>.material-symbols-outlined:first-child{width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex:none}"
  // Drawers and modals: Figma titles are 22/32 600 (the kit draws 26).
  + "[data-mvp-stage] .hs-drawer-header strong{font-size:22px !important}"
  // Modals (Figma comp-modal, 3.4 and 5.2): the save confirm centred 12 above the frame centre, the delete confirm 12 below (as
  // Figma places them), title on a 32 line, close 8 from the top right corner, footer padding 16 so the buttons end 16 from the edge.
  // Bulk bar (Figma comp-bulk-action-bar): the actions sit in a 4 padded action bar, each a 40 tall button with 12 each side (8
  // before a 16 key icon); Select all 498 / Select only the 48 loaded belong to the selection info, 8 after the count and 28 before
  // Change role.
  + "[data-mvp-stage] .hs-bulk-bar-actions{padding:0 4px}[data-mvp-stage] .hs-bulk-bar-actions>.hs-btn{height:40px !important;padding:0 12px !important}[data-mvp-stage] .hs-bulk-bar-actions>.hs-btn:has(>.material-symbols-outlined){padding-left:8px !important}"
  + "[data-mvp-stage] .hs-bulk-bar-actions>.hs-btn>.material-symbols-outlined{font-size:16px !important}[data-mvp-stage] .hs-bulk-bar-actions>:is([data-mvp-select-all],[data-mvp-select-loaded]){margin:0 20px 0 -20px}"
  + "@supports (anchor-name:--a){[data-mvp-stage] .mvp-tip .hs-tooltip.mvp-tip-fig{position:fixed;left:anchor(center) !important;right:auto !important;top:auto !important;bottom:calc(anchor(top) + 4px) !important;transform:translateX(-50%) !important;margin:0 !important;text-align:center !important;z-index:1200}}"
  // Body cells centre on the full 56 row as Figma does (the 1px bottom border otherwise lifts everything half a pixel).
  + "[data-mvp-stage] .mvp-content .hs-table tbody td{padding-top:1px}"
  // Roles row menu (Figma 3.2, 3.3, 5.0): 24 below the trigger's top, right edge 24 past it (1224 to 1424 for the button at 1368);
  // the Delete tooltip 4 above the item (Figma), not 8.
  + "[data-mvp-stage] .mvp-roles-table td:last-child .hs-menu{top:24px !important;right:-24px !important}[data-mvp-stage] .mvp-roles-table .mvp-tip--top .hs-tooltip{bottom:calc(100% + 4px) !important}"
  // Figma 1.2b: the paused tooltips (72 tall) 78 above their control's top, the checkbox one starting 12 left of it.
  + "[data-mvp-stage] .mvp-tip--paused .hs-tooltip{top:-78px !important;bottom:auto !important}[data-mvp-stage] .mvp-tip--paused:has(>.hs-check) .hs-tooltip{left:-12px}"
  // Filtered chip and its menu (Figma 1.0c, 1.0e, see MVPFilterChip): grey fill, a 2px ring when filtered or open, count as 16 text,
  // clear glyph.
  + "[data-mvp-stage] .cf.selected{background:var(--bento-component-chip-fill);color:var(--bento-component-chip-text);box-shadow:inset 0 0 0 2px var(--bento-theme-color-border-base)}[data-mvp-stage] .cf.open{box-shadow:inset 0 0 0 2px var(--bento-theme-color-border-base)}"
  + "[data-mvp-stage] .cf .ct{background:none !important;color:inherit !important;padding:0;font-size:16px;line-height:24px}[data-mvp-stage] .cf:has(.x){padding:0 8px 0 16px}"
  + "[data-mvp-filter] .hs-menu{left:-53px !important;top:calc(100% + 8px) !important;min-width:240px !important;width:240px}[data-mvp-filter] .hs-menu-item{height:48px;min-height:48px;font-weight:600}[data-mvp-filter] .mvp-filter-opt{gap:var(--bento-theme-spacing-04)}"
  // Notification panel (Figma "Notification center, product UI as today", 2.0 and MVP 6.1 to 6.3): 400 wide from x 63 over the
  // rail's edge; a 69 header (20/25 title 24 down, View all 13/16, 20 icons 14 apart); tabs and range on a 26 row (14/17.6, tabs 20
  // apart, the active line on its last 2 rows, the range caret a 10x6 triangle) then a 1px divider and 12; each item 12 16 padding
  // with a 40 artwork column, title and time on the first row and the preview under both.
  + "[data-mvp-stage] .nfp-panel{left:63px}[data-mvp-stage] .nfp-head{height:69px;box-sizing:border-box;padding:24px 16px 20px;gap:14px;align-items:flex-start}[data-mvp-stage] .nfp-head h2{line-height:25px}"
  + "[data-mvp-stage] .nfp-head .nfp-viewall{height:16px;line-height:16px;padding:0;margin-top:4px}[data-mvp-stage] .nfp-head .nfp-iconbtn{width:20px !important;height:20px !important;min-width:20px;padding:0;margin-top:2px}"
  + "[data-mvp-stage] .nfp-ctrl{height:27px;box-sizing:border-box;padding:0 16px !important;align-items:flex-start;border-bottom:1px solid var(--bento-theme-color-border-subtle)}[data-mvp-stage] .nfp-tabs{gap:20px}[data-mvp-stage] .nfp-tab{padding:0;height:26px;line-height:17.6px;display:flex;align-items:flex-start}[data-mvp-stage] .nfp-tab[aria-selected=true]::after{bottom:0}"
  + "[data-mvp-stage] .nfp-ctrl .nfp-range{height:18px;line-height:17.6px;padding:0;min-width:0;gap:6px}[data-mvp-stage] .nfp-range .material-symbols-outlined{width:10px;height:6px;font-size:0;position:relative;overflow:visible}[data-mvp-stage] .nfp-range .material-symbols-outlined::after{content:'arrow_drop_down';font-size:24px;line-height:24px;position:absolute;left:-7px;top:-10px}"
  + "[data-mvp-stage] .nfp-list{padding-top:12px}[data-mvp-stage] .nfp-row{display:grid !important;grid-template-columns:40px 1fr auto;column-gap:16px;row-gap:0;padding:12px 16px !important;align-items:start}"
  + "[data-mvp-stage] .nfp-av{width:40px !important;padding:0 8px;box-sizing:border-box;grid-row:1/span 2}[data-mvp-stage] .nfp-av::before{margin-top:0 !important}[data-mvp-stage] .nfp-main{display:contents}[data-mvp-stage] .nfp-rowtitle{grid-column:2;grid-row:1}[data-mvp-stage] .nfp-preview{grid-column:2/span 2;grid-row:2}[data-mvp-stage] .nfp-side{grid-column:3;grid-row:1}[data-mvp-stage] .nfp-side .nfp-dot{left:4px !important;top:12px !important}"
  // Toasts (Figma comp-alert-toast): the 20 status icon in a 24 box, 16 before the text, the 20 close glyph 16 from the corner, no
  // gap between title and text, the actions 8 under the text.
  + "[data-mvp-stage] .mvp-toasts>*{gap:16px !important}[data-mvp-stage] .mvp-toasts>*>.material-symbols-outlined{font-size:20px !important;width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex:none}"
  + "[data-mvp-stage] .mvp-toasts>*>.material-symbols-outlined[role=button]{width:20px;height:20px}[data-mvp-stage] .mvp-toasts>*>div{gap:0 !important}[data-mvp-stage] .mvp-toasts>*>div>div:has(>button){margin-top:8px !important}"
  // Menu separators sit flush between items (Figma 6.1a "separator", 1px, no margin).
  + "[data-mvp-stage] .hs-menu-sep{margin:0}"
  // Search fields (Figma comp-input-search): the 20 icon 16 in, the text 8 after it (the kit puts them at 12 and 40).
  + "[data-mvp-stage] span:has(>input.hs-input)>.material-symbols-outlined:first-child{left:16px !important}[data-mvp-stage] span>.material-symbols-outlined:first-child+input.hs-input{padding-left:43px !important}"
  // Status icons in banners, alerts and toasts are filled in Figma, one step darker (positive and info 600, negative 600, warning 900).
  + "[data-mvp-stage] :is(.hs-alert,.mvp-toasts>*)>.material-symbols-outlined:first-child{font-variation-settings:'FILL' 1}"
  + "[data-mvp-stage] :is(.hs-alert,.mvp-toasts>*)>.material-symbols-outlined:first-child[style*=icon-positive]{color:var(--bento-system-sys-positive-600) !important}[data-mvp-stage] :is(.hs-alert,.mvp-toasts>*)>.material-symbols-outlined:first-child[style*=icon-info]{color:var(--bento-system-sys-info-600) !important}"
  + "[data-mvp-stage] :is(.hs-alert,.mvp-toasts>*)>.material-symbols-outlined:first-child[style*=icon-negative]{color:var(--bento-system-sys-negative-600) !important}[data-mvp-stage] :is(.hs-alert,.mvp-toasts>*)>.material-symbols-outlined:first-child[style*=icon-warning]{color:var(--bento-system-sys-warning-900) !important}"
  // Form fields: the focus ring sits right on the border (Figma 6.1), not 2 out; the read only Start from on 6.1 is drawn as the
  // disabled comp-select (grey border and text, the chevron 16 from the right).
  + ".mvp-form-page input.hs-input:focus{outline-offset:0}.mvp-form-page input[data-mvp-start-from]{color:var(--bento-theme-color-text-disabled);border-color:var(--bento-component-input-border-disabled)}"
  + ".mvp-start-chev{position:absolute;right:16px;top:12px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:20px !important;color:var(--bento-theme-color-text-disabled);pointer-events:none}"
  + "[data-mvp-modal=save] .hs-modal{margin-bottom:24px}[data-mvp-modal=delete] .hs-modal{margin-top:24px}[data-mvp-stage] .hs-modal-title{line-height:32px}[data-mvp-stage] .hs-modal-close{top:8px !important;right:8px !important}[data-mvp-stage] .hs-modal-footer{padding:16px}"
  // Create and edit forms (Figma comp-textarea, comp-compact-alert): the textarea text 16 in and 12 down inside its 1px border, no
  // resize grip; the error hint one 24 line under the field, a filled 24 icon 8 from the text, red 600 (border red 700).
  + ".mvp-form-page textarea.hs-textarea{padding:11px 16px;resize:none}.mvp-clr--on textarea.hs-textarea{padding-right:47px}"
  // The open Start from select has no focus ring in Figma (keyboard focus still shows it); its text sits 1px further left.
  + ".mvp-form-page .hs-select{padding-left:15px}.mvp-form-page .hs-select.focused:not(:focus-visible){outline:none}"
  + ".mvp-form-page .hs-field-hint--error{min-height:0;gap:var(--bento-theme-spacing-02);color:var(--bento-system-sys-negative-600)}.mvp-form-page .hs-field-hint--error .material-symbols-outlined{font-size:24px;font-variation-settings:'FILL' 1}"
  + ".mvp-form-page .hs-input--error{border-color:var(--bento-system-sys-negative-700)}"
  // Figma 4.1a (error) and 6.1 (focused) draw the name field as the 40 tall comp-input with no clear icon.
  + ".mvp-form-page .mvp-name40 input.hs-input{height:40px}";
const MVPStyle = () => <style>{MVP_CSS + (MVP_UT ? MVP_UT_CSS : MVP_FIG_CSS + MVP_FIG2_CSS + MVP_PX_CSS)}</style>;
// The page as the Figma frames draw it (review mode): the header (and tabs) stay put, only the middle scrolls, and the footer or
// the bulk bar sit outside the scrolling part. band = the 40px grey strip under the members panel (every Figma members frame
// ends the panel 40 above the frame's bottom edge). Test mode keeps the page as it was: everything scrolls together.
// end = open scrolled to the end (Figma 1.0l): live it scrolls there once; a board tile can't keep a scroll position, so it pins
// the content to the bottom instead.
function MVPFrame({ head, foot, overlay, band, end, children }) {
  const A = React.useContext(MVPC), sc = React.useRef(null);
  React.useLayoutEffect(() => { if (end && sc.current && !(A && A.isStatic)) sc.current.scrollTop = sc.current.scrollHeight; }, [end]);
  if (!MVP_FIG) return <React.Fragment>{head}{children}{overlay}{foot}</React.Fragment>;
  const pin = end && A && A.isStatic ? { overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"flex-end" } : null;
  return (
    <div data-mvp-frame="" style={{ height:"100%", display:"flex", flexDirection:"column", position:"relative", background:"var(--bento-system-sys-neutral-alt-200,#f4f5f6)" }}>
      {head}
      <div data-mvp-scroll="" ref={sc} style={{ flex:"1 1 auto", minHeight:0, overflow:"auto", marginBottom:band ? 40 : 0, ...pin }}>{pin ? <div style={{ flex:"none" }}>{children}</div> : children}</div>
      {overlay && <div style={{ position:"absolute", left:0, right:0, bottom:24, height:0, zIndex:20 }}>{overlay}</div>}
      {foot}
    </div>
  );
}
// The bottom bar of the create and edit pages (BRFootBar from ../bulk-roles/br-ui.jsx, with the Figma copy: "Unsaved changes").
function MVPFootBar({ dirty, old, children }) {
  const { Divider } = SS_NS();
  return <div className="br-footbar" style={{ position:"sticky", bottom:0, marginTop:"auto", background:"var(--hs-surface)", zIndex:10, flex:"none" }}><Divider />
    <div style={{ display:"flex", alignItems:"center", gap:"var(--bento-space-02)", padding:MVP_FIG ? "0 24px 1px" : "8px 24px", minHeight:MVP_FIG ? 63 : 56, boxSizing:"border-box" }}>
      <span style={{ ...brSub, font:"var(--hs-type-body-sm)" }}>{dirty ? (old ? "You have unsaved changes" : "Unsaved changes") : ""}</span>
      {MVP_FIG ? <span style={{ marginLeft:"auto", display:"flex", gap:"var(--bento-space-04)" }}>{children}</span> : <BRFoot>{children}</BRFoot>}</div></div>;
}
// Role radios (BRRoleRadios from ../bulk-roles/br-ui.jsx). Figma 1.1 has no "Custom" tag on the custom roles; old keeps it.
function MVPRoleRadios({ value, onChange, roles, old }) {
  const { Radio } = SS_NS();
  return <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-04)" }}>
    {roles.map((r) => (
      <div key={r} role="radio" aria-checked={value === r} tabIndex={0} onClick={() => onChange(r)} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onChange(r); } }} style={{ display:"flex", gap:MVP_FIG ? "var(--bento-space-04)" : "var(--bento-space-02)", cursor:"pointer", alignItems:"flex-start" }}>
        <Radio checked={value === r} onChange={() => onChange(r)} />
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <span style={{ display:"flex", justifyContent:"space-between", ...brStrong }}><span>{r}</span>{old && BR_CUSTOM.includes(r) ? <span style={{ ...brSub, font:"var(--hs-type-body-sm)" }}>Custom</span> : null}</span>
          {BR_DESC[r] && <span style={brSub}>{BR_DESC[r]}</span>}
        </div>
      </div>))}
  </div>;
}
// A social account cell with the Figma photo (SSAccountCell from ../suite-settings/parts.jsx draws initials).
function MVPAccountCell({ a }) {
  const { NetworkAvatar } = SS_NS();
  return <span style={{ display:"flex", alignItems:"center", gap:"var(--bento-space-03)" }}><NetworkAvatar network={a.network} initials={a.initials} src={MVP_FIG ? MVP_AVATAR : undefined} />{a.name}</span>;
}
// Figma 10/8 sortable headers carry a caret (arrow_drop_down), not the kit's unfold_more.
function MVPSort({ label, k, sort, setSort }) {
  const dir = sort && sort.k === k ? sort.dir : undefined;
  return (
    <button type="button" className="hs-th hs-th--sortable" aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}
      onClick={() => setSort({ k, dir: dir === "asc" ? "desc" : "asc" })}>
      <span>{label}</span>
      <span className="material-symbols-outlined" aria-hidden="true">{dir === "asc" ? "arrow_drop_up" : "arrow_drop_down"}</span>
    </button>
  );
}
const mvpSub = { font:"var(--hs-type-body-md)", color:"var(--bento-theme-color-text-subtle)", margin:0 };
const mvpStrong = { font:"var(--hs-type-body-md-b)", color:"var(--bento-theme-color-text-base)" };

// Grows the loaded rows by `step` when the sentinel nears the bottom of the scrolling content. `start` presets it.
function useMVPInfinite(total, step, resetKey, start) {
  const [count, setCount] = React.useState(start || step);
  const sentinel = React.useRef(null);
  const first = React.useRef(true), busy = React.useRef(false), timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  React.useEffect(() => { if (first.current) { first.current = false; return; } clearTimeout(timer.current); busy.current = false; setCount(step); }, [resetKey]);
  React.useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= total) return undefined;
    const root = el.closest("[data-mvp-scroll]") || el.closest(".hs-appcontent");   // review mode scrolls inside MVPFrame
    if (!root) return undefined;
    // like production: reaching the end shows the spinner, the next page arrives a moment later
    const check = () => { if (busy.current) return; const s = el.getBoundingClientRect(), r = root.getBoundingClientRect(); if (s.top < r.bottom + 120) { busy.current = true; timer.current = setTimeout(() => { busy.current = false; setCount((c) => Math.min(total, c + step)); }, 900); } };
    root.addEventListener("scroll", check, { passive:true });
    return () => root.removeEventListener("scroll", check);
  }, [count, total]);
  const { Spinner } = SS_NS();
  const footer = count < total ? <div ref={sentinel} data-mvp-sentinel="" style={{ display:"flex", justifyContent:"center", padding:"var(--bento-space-04)" }}>{Spinner ? <Spinner /> : null}</div> : null;
  return [Math.min(count, total), footer, setCount];
}

// Permissions filter with the custom roles listed after the system ones, each labelled Custom (MVP 1.0e).
function MVPFilterChip({ label, options, value, onChange, custom, initialOpen }) {
  const { ChipFilter, DropdownMenuItem, DropdownMenuSeparator } = SS_NS();
  const sel = value || [];
  // Review mode (Figma 1.0e): a filtered chip shows its count as text and the clear glyph (the kit's active chip); the menu is 240
  // wide, 8 under the chip, 53 left of it, with 48 tall rows, the checkbox and the name 16 apart.
  return (
    <span data-mvp-filter={MVP_FIG ? "" : undefined} style={{ display:"contents" }}>
    <BRPop align="left" width={MVP_FIG ? 240 : 280} initialOpen={initialOpen} trigger={(open, toggle) => <ChipFilter label={label} open={open} selected={sel.length > 0} active={MVP_FIG && sel.length > 0} count={sel.length || undefined} onClick={toggle} />}>
      {(close) => <React.Fragment>
        {options.map((o) => <DropdownMenuItem key={o} role="menuitemcheckbox" aria-checked={sel.includes(o)} onClick={() => onChange(sel.includes(o) ? sel.filter((x) => x !== o) : sel.concat(o))}>
          <span className="mvp-filter-opt"><span className={"hs-check" + (sel.includes(o) ? " is-on" : "")} aria-hidden="true" /><span style={{ display:"flex", flexDirection:"column" }}><span>{o}</span>{custom && custom.includes(o) && <span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>Custom</span>}</span></span></DropdownMenuItem>)}
        {sel.length > 0 && !MVP_FIG && <DropdownMenuSeparator />}
      </React.Fragment>}
    </BRPop></span>
  );
}

// Content column for the org pages: 40 in from the content edge, like production (SSContent uses 24).
// Under the tab bar Figma starts the panel 32 down (main: padding 32 40 40), not 40 (review mode; the person page has no test mode).
const MVP_40 = "calc(var(--bento-theme-spacing-05) + var(--bento-theme-spacing-04))";
const mvpTabsPad = (bottom) => "var(--bento-theme-spacing-06) " + MVP_40 + " " + (bottom == null ? MVP_40 : bottom);
// fill: the panel runs to the bottom of the page (Figma 3.0 draws it 976 tall, to 24 above the frame's bottom edge).
function MVPContent({ children, pad, fill }) {
  return <div className={"mvp-content" + (fill ? " mvp-content--fill" : "")} style={{ padding:pad != null ? pad : "calc(var(--bento-theme-spacing-05) + var(--bento-theme-spacing-04))", boxSizing:"border-box", display:"flex", flexDirection:"column", gap:"var(--bento-theme-spacing-05)", ...(fill ? { flex:"1 1 auto" } : null) }}>{children}</div>;
}
// Toolbar as production: search 402 x 48, filter chips 24 apart (SSToolbar uses 310 x 40 and 16).
// chipGap: Figma spaces the filter chips 16 apart on the members and person pages, 24 on All social accounts.
function MVPToolbar({ placeholder, search, setSearch, children, chipGap }) {
  const { SearchInput } = SS_NS();
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"var(--bento-theme-spacing-04)", flexWrap:"wrap" }}>
      <div style={{ width:402, maxWidth:"100%" }}><SearchInput className="mvp-search48" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} /></div>
      <div style={{ marginLeft:"auto", display:"flex", gap:chipGap || "var(--bento-theme-spacing-05)" }}>{children}</div>
    </div>
  );
}

// A row that can't be selected (the design system’s bulk action pattern, 8 Oct): the checkbox is "soft disabled", meaning
// aria-disabled and still focusable, so the tooltip with the reason shows on hover and on keyboard focus. The reason is
// also in the row (the role reads Unlimited). When the viewer can't edit at all (MVP 1.0d) the checkboxes are hidden.
// The same pattern pauses the page while a bulk job runs behind a closed drawer (tip = "Roles are updating...").
// fig (review mode, Figma 1.0a): the tooltip centred over the checkbox, 4 above it, text centred, drawn over the nav drawer as Figma
// does. It is anchored with CSS anchor positioning so the scrolling table can't clip it; without that support it keeps the old place.
function MVPSoftCheck({ id, label, tip, on, side, cls, fig }) {
  const tid = "mvp-tip-" + id, an = fig ? "--mvp-a-" + id : null;
  return <span className={"hs-tooltip-wrap mvp-tip" + (on ? " mvp-tip--on" : "") + (cls ? " " + cls : "")} data-mvp-soft-disabled="" style={an ? { anchorName:an } : undefined}>
    <span className="hs-check is-disabled" role="checkbox" aria-checked="false" aria-disabled="true" tabIndex={0} aria-label={label} aria-describedby={tid} style={{ cursor:"not-allowed" }} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") e.preventDefault(); }} />
    <span id={tid} className={"hs-tooltip hs-tooltip--" + (side || "top") + (an ? " mvp-tip-fig" : "")} role="tooltip" style={an ? { positionAnchor:an } : undefined}>{tip}</span></span>;
}

// Role cell: the Bento option trigger (comp-option-trigger in the Figma MVP frames: 40 tall, padding 8 16, 16/600,
// transparent fill, caret), or a greyed one for Unlimited admins.
function MVPRoleCell({ p, onChange }) {
  const A = React.useContext(MVPC);
  const { OptionTrigger, DropdownMenuItem } = SS_NS();
  if (p.role === MVP_UNL) return <OptionTrigger disabled aria-label={p.name + ": Unlimited access from the organization"}>Unlimited</OptionTrigger>;
  // Paused while a bulk job runs: soft disabled like the checkboxes (aria-disabled, focusable), the reason shows on hover and focus.
  // Figma 1.2b copy in review mode; test mode keeps the copy it had in the live study. 1.2b shows Asha Patel's tooltip open.
  if (A.paused) { const tid = "mvp-tip-role-" + p.id, on = A.screen === "1.2b" && p.id === "p0";
    return <span className={"hs-tooltip-wrap mvp-tip" + (on ? " mvp-tip--on mvp-tip--r62 mvp-tip--c" : "") + (mvpOld(A) ? "" : " mvp-tip--paused")} data-mvp-soft-disabled="">
      <OptionTrigger aria-haspopup="menu" aria-disabled="true" aria-describedby={tid} aria-label={p.name + ": " + p.role} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") e.preventDefault(); }}>{p.role}</OptionTrigger>
      <span id={tid} className="hs-tooltip hs-tooltip--top" role="tooltip">{mvpOld(A) ? "Roles are updating. You can change this when it’s done." : "You can’t change this while roles are updating."}</span></span>; }
  // Test mode: the live roles list, so a role made in the session shows here too.
  const options = MVP_UT ? A.roleRows.map((r) => r.name) : BR_ROLES.concat(BR_CUSTOM.filter((r) => r !== MVP_P1));
  return (
    <SSPopover trigger={(open, toggle) => <OptionTrigger open={open} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{p.role}</OptionTrigger>}>
      {(close) => options.map((o) => <DropdownMenuItem key={o} selected={o === p.role} onClick={() => { close(); onChange(o); }}>{o}</DropdownMenuItem>)}
    </SSPopover>
  );
}

// The 3 teams the Figma tab count shows (review mode). Test mode keeps the one team it had.
const MVP_TEAMS3 = [{ id:"t0", name:"Content Team", members:"8", role:"Editor" }, { id:"t1", name:"Social Care", members:"12", role:"Care Agent" }, { id:"t2", name:"Paid Social", members:"4", role:"Advanced" }];
function MVPMembers() {
  const A = React.useContext(MVPC);
  const { Button, IconButton, Table, NetworkAvatar, AlertBanner, DropdownMenuItem, Checkbox, Tooltip } = SS_NS();
  const [tab, setTab] = React.useState("members");
  const [sort, setSort] = React.useState(null);
  const old = mvpOld(A);
  const search = A.search, perms = A.perms, stat = A.stat;
  const base = A.people.map((p) => ({ ...p, role:A.roleOf(p) }));
  const rows = ssSorted(base.filter((p) => ssMatch(search, p.name, p.email) && (!perms.length || perms.includes(p.role)) && (!stat.length || stat.includes(p.status))), sort);
  const [count, more] = useMVPInfinite(rows.length, MVP_LOADED, search + perms + stat + (sort && sort.k + sort.dir), A.loaded);
  const from = A.isStatic && A.screen === "1.0b" ? 40 : 0;   // a static tile can't keep a scroll position, so 1.0b starts at row 41
  // Figma 1.0l: scrolled to the end of the list, which Figma draws as the 12 named members, with 96 kept free under the last row.
  const endShot = A.screen === "1.0l";
  const shown = endShot ? rows.slice(0, MVP_NAMED_N) : rows.slice(from, count);
  const canPick = rows.slice(0, count).filter(mvpCanChange).map((p) => p.id);
  const sel = A.sel, n = sel.length;
  const all = n > 0 && canPick.every((id) => sel.includes(id)), some = n > 0 && !all;
  // Round 2 (14 Oct, test mode): once the header checkbox has every loaded row, the bar offers everyone who matches, loaded or not
  // (the design system's "select all" bar). Round 1: only 1 of 7 changed all 498 knowingly; most stopped at the 48 loaded rows.
  // Review mode: the same bar from Figma 1.0h (Select all 498) and 1.0k (All 498 selected, with a way back to the loaded ones).
  const sa = MVP_UT || A.selMode === "all";
  const allPick = sa ? rows.filter(mvpCanChange).map((p) => p.id) : canPick;
  const offerAll = sa && all && allPick.length > n, everyone = sa && n > canPick.length && allPick.every((id) => sel.includes(id));
  const wayBack = !MVP_UT && A.selMode === "all" && everyone;
  const job = A.job, running = job && (job.phase === "run" || job.phase === "retry"), paused = A.paused;
  const tipOn = A.screen === "1.0a" ? "p3" : null;
  // Figma 1.2b copy in review mode (Bryn Morales's tooltip open on 1.2b); test mode keeps the copy it had in the live study.
  const tipPause = old ? "Roles are updating. You can select members when it’s done." : "You can’t select members while roles are updating.";
  const tipPauseOn = A.screen === "1.2b" ? "p1" : null;
  // Figma 1.0f (record of today's code): an Unlimited row is disabled as a whole, no tooltip. 1.0g (proposal): a helper line under
  // the name says why, and only the checkbox is off, with no hover needed.
  const rowOff = A.screen === "1.0f", helper = A.screen === "1.0g";
  const tipOrg = old ? "Access comes from the organization. It can’t be changed here." : "Managed at the organization level, so you can’t change it here";
  const showChecks = A.access === "full";
  const box = (p) => {
    if (!mvpCanChange(p) && rowOff) return <span className="hs-check is-disabled" role="checkbox" aria-checked="false" aria-disabled="true" aria-label={"Select " + p.name} data-mvp-row-off="" />;
    if (!mvpCanChange(p) && helper) return <span className="hs-check is-disabled" role="checkbox" aria-checked="false" aria-disabled="true" tabIndex={0} aria-label={"Select " + p.name} aria-describedby={"mvp-helper-" + p.id} style={{ cursor:"not-allowed" }} />;
    if (!mvpCanChange(p)) {
      return <MVPSoftCheck id={p.id} label={"Select " + p.name} on={tipOn === p.id} tip={tipOrg} fig={!old} />;
    }
    if (paused) return <MVPSoftCheck id={p.id} label={"Select " + p.name} tip={tipPause} on={tipPauseOn === p.id} cls={(tipPauseOn === p.id ? "mvp-tip--c" : "") + (old ? "" : " mvp-tip--paused")} />;
    return <Checkbox checked={sel.includes(p.id)} aria-label={"Select " + p.name} onChange={() => A.toggle(p.id)} />;
  };
  const roleLabel = old ? "Permissions" : "Role";
  // Figma 6.0: the row menu of a member with custom permissions, open on Bryn Morales.
  const rowMenu = (m) => <BRPop align="right" width={264} initialOpen={A.screen === "6.0" && m.id === "p1"} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="secondary" size="sm" aria-label={"More actions for " + m.name} aria-expanded={open} onClick={toggle} />}>
    {(close) => <DropdownMenuItem onClick={() => { close(); A.saveAsRole(m); }}>Create role from these permissions</DropdownMenuItem>}</BRPop>;
  // Column widths: Figma 1.0 (Member 280, Email address 250, Role 200, Assigned on 150), also x.1 in its old order; Figma x.2 (Cut
  // 8 Oct) draws 240, 130, 220, 290. Test mode keeps the widths it had.
  const cw = !MVP_UT && A.screen === "x.2" ? { name:240, assigned:130, email:220, role:290 } : { name:280, assigned:150, email:250, role:200 };
  if (MVP_FIG && A.access !== "full") cw.name += 56;   // Figma 1.0d: no checkbox column, Member takes its 56 (336)
  const col = {
    name:{ key:"name", width:cw.name, header:<MVPSort label="Member" k="name" sort={sort} setSort={setSort} />, render:(m) => helper && !mvpCanChange(m)
      ? <span style={{ display:"flex", alignItems:"center", gap:"var(--bento-space-03)", minHeight:86 }}>{React.createElement(SS_NS().Avatar, { initials:m.initials, size:"md" })}<span style={{ display:"flex", flexDirection:"column", gap:2 }}><span>{m.name}</span><span id={"mvp-helper-" + m.id} style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>Role set by the organization</span></span></span>
      : <SSPersonCell name={m.name} initials={m.initials} /> },
    assigned:{ key:"assigned", width:cw.assigned, header:<MVPSort label="Assigned on" k="assigned" sort={sort} setSort={setSort} /> },
    email:{ key:"email", width:cw.email, header:<MVPSort label="Email address" k="email" sort={sort} setSort={setSort} /> },
    role:{ key:"role", width:cw.role, header:<MVPSort label={roleLabel} k="role" sort={sort} setSort={setSort} />, render:(m) => <MVPRoleCell p={m} onChange={(r) => { A.setRole(m.id, r); A.toast(m.name + " is now " + r + " on " + A.acct.name); }} /> },
    actions:{ key:"actions", header:"Actions", align:MVP_FIG ? undefined : "right", width:96, render:(m) => !MVP_UT && m.role === MVP_CUSTOM ? rowMenu(m) : null },
  };
  // Figma: Member, Email address, Role, Assigned on. Test mode and the cut screens keep the order they had.
  const order = old ? ["name", "assigned", "email", "role", "actions"] : ["name", "email", "role", "assigned", "actions"];
  const columns = (showChecks ? [{ key:"check", width:56, header:paused ? <MVPSoftCheck id="all" label="Select all loaded members" tip={tipPause} side="bottom" /> : <Checkbox checked={all} indeterminate={some} aria-label="Select all loaded members" onChange={() => A.setSel(all ? [] : canPick)} />, render:box }] : []).concat(order.map((k) => col[k]));
  const tabLabel = (t, k) => MVP_FIG ? <span style={{ display:"inline-flex", gap:8 }}><span>{t}</span><span>{k}</span></span> : t;
  const head = <React.Fragment>
    <SSEntityHeader title={A.acct.name} onBack={() => A.goView("accounts")} meta={MVP_NET[A.acct.network]} status={<SSStatus status="connected" />}
      avatar={<span style={{ transform:"scale(1.4)", transformOrigin:"center", margin:"0 8px" }}><NetworkAvatar network={A.acct.network} initials={A.acct.initials} src={MVP_FIG ? MVP_AVATAR : undefined} /></span>}
      actions={<React.Fragment><Button variant="secondary" onClick={() => A.openOrg("assign-teams", { target:A.acct.name })}>Assign to teams</Button><Button variant="primary" onClick={() => A.openOrg("assign-members", { target:A.acct.name })}>Assign to members</Button>
        <BRPop align="right" width={240} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="ghost" aria-label="More actions" aria-expanded={open} onClick={toggle} />}>{(close) => <React.Fragment><DropdownMenuItem onClick={() => { close(); A.toast(A.acct.name + " is connected"); }}>Check connection</DropdownMenuItem><DropdownMenuItem onClick={() => { close(); A.toast("Removing a social account isn’t part of this prototype"); }}>Remove social account</DropdownMenuItem></React.Fragment>}</BRPop></React.Fragment>} />
    <SSTabsBar tabs={[{ id:"teams", label:tabLabel("Teams", MVP_FIG ? MVP_TEAMS3.length : 1) }, { id:"members", label:tabLabel("Members", MVP_TOTAL) }]} value={tab} onChange={setTab} />
    {/* The top banner was cut on 8 Oct (lock session). It only shows on the board's "Cut on 8 Oct" screen x.2. */}
    {running && job.legacy && !A.bulk && <AlertBanner tone="info" title={"Applying " + job.role + " to " + (job.phase === "retry" ? job.failed.length : job.total) + " members"}>In progress. It keeps going if you leave this page.</AlertBanner>}
    {/* Closed the drawer while it runs: role changes on this account are paused until the job ends (search and filters still work). */}
    {paused && (old ? <AlertBanner tone="info" title={"Applying " + job.role + " to " + mvpMembers(job.phase === "retry" ? job.failed.length : job.total)}>Role changes on this account are paused until it’s done. You’ll get a notification when it’s finished.</AlertBanner>
      : <AlertBanner tone="info" title={"Updating " + mvpMembers(job.phase === "retry" ? job.failed.length : job.total) + " to " + job.role}>We’re updating roles in the background, so you can’t make additional role changes right now. We’ll notify you when it’s done.</AlertBanner>)}
  </React.Fragment>;
  const teams = MVP_FIG ? MVP_TEAMS3 : [{ id:"t", name:"Content Team", members:"8", role:"Editor" }];
  // Figma 1.0i: "48 of 500 selected". Figma row MVP 1b (1.0a, 1.0b, 1.0f, 1.0g): no key icon on Change role.
  const barLabel = !MVP_UT && A.selMode === "of" ? n + " of " + MVP_TOTAL + " selected" : (everyone ? "All " : "") + n + " selected";
  const barBtn = { color:"var(--bento-component-snackbar-text)", fontWeight:700, height:32, padding:"0 8px" };
  const bar = n > 0 && showChecks && tab === "members" && !paused && <BRBulkBar label={barLabel} onDismiss={() => A.setSel([])}>
    {offerAll && <button type="button" className="hs-btn hs-btn--ghost" data-mvp-select-all="" onClick={() => A.setSel(allPick)} style={{ ...barBtn, textDecoration:MVP_UT ? "underline" : "none" }}>{"Select all " + allPick.length}</button>}
    {wayBack && <button type="button" className="hs-btn hs-btn--ghost" data-mvp-select-loaded="" onClick={() => A.setSel(canPick)} style={barBtn}>{"Select only the " + canPick.length + " loaded"}</button>}
    <button type="button" className="hs-btn hs-btn--ghost" onClick={() => A.openBulk()} style={{ ...barBtn, display:"inline-flex", alignItems:"center", gap:8 }}>
      {!(rowOff || helper || A.screen === "1.0a" || A.screen === "1.0b") && <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20 }}>key</span>}{old ? "Apply role" : "Change role"}</button></BRBulkBar>;
  return (
    <MVPFrame head={head} band={!endShot} end={endShot} overlay={MVP_FIG ? bar : null} foot={MVP_FIG ? null : bar}>
      <MVPContent pad={MVP_FIG ? mvpTabsPad(endShot ? 0 : null) : endShot ? "calc(var(--bento-theme-spacing-05) + var(--bento-theme-spacing-04)) calc(var(--bento-theme-spacing-05) + var(--bento-theme-spacing-04)) 0" : undefined}>
        {tab === "teams" ? <SSListPanel title={teams.length === 1 ? "1 team" : teams.length + " teams"} explainer="Teams that carry this social account." link="Learn more about teams"><div style={{ width:"100%" }}><Table rows={teams} columns={[{ key:"name", header:"Team" }, { key:"members", header:"Members" }, { key:"role", header:"Default role" }]} /></div></SSListPanel> :
        <SSListPanel title="500 members" explainer={old ? "Manage members and permissions for this social account." : "Manage members and their roles for this social account."} link={old ? "Learn more about social account permissions" : "Learn more about social account roles"}>
          <MVPToolbar placeholder={old ? "Search for members" : "Search members"} search={search} setSearch={A.setSearch} chipGap={MVP_FIG ? "var(--bento-theme-spacing-04)" : undefined}>
            <MVPFilterChip label={roleLabel} options={MVP_UT ? A.roleRows.map((r) => r.name) : old ? MVP_FILTER_ROLES : MVP_FILTER_ROLES.concat(MVP_CUSTOM)} custom={MVP_UT ? A.roleRows.filter((r) => r.type === "Custom").map((r) => r.name) : old ? BR_CUSTOM : null} value={perms} onChange={A.setPerms} initialOpen={A.screen === "1.0e"} />
            <SSFilterChip label="Status" options={["Active", "Pending"]} value={stat} onChange={A.setStat} /></MVPToolbar>
          <div style={{ width:"100%" }} className={"mvp-members" + (rowOff ? " mvp-members--rowoff" : "")} data-mvp-table="">
            <MVPStyle />
            <Table rows={shown} emptyReason={rows.length ? undefined : "no-results"} columns={columns} />
            {endShot ? <div data-mvp-bar-room="" style={{ height:72 }} /> : more}
          </div>
        </SSListPanel>}
      </MVPContent>
    </MVPFrame>
  );
}

// Person side (Figma row MVP person side, kept as the second way in on 9 and 12 Oct): Asha Patel's member page, Social accounts tab,
// with checkboxes and the bulk bar. Same parts as the account side (MVPMembers): header, tabs, list panel, toolbar, table, bar.
function MVPPerson() {
  const A = React.useContext(MVPC), m = MVP_PERSON;
  const { Button, IconButton, Table, Checkbox, OptionTrigger, DropdownMenuItem, Avatar } = SS_NS();
  const [tab, setTab] = React.useState("social"), [search, setSearch0] = React.useState(""), [nets, setNets0] = React.useState([]), [stat, setStat0] = React.useState([]), [sort, setSort] = React.useState(null);
  // A new search or filter clears the selection, as on the account side.
  const setSearch = (v) => { setSearch0(v); A.setPsel([]); }, setNets = (v) => { setNets0(v); A.setPsel([]); }, setStat = (v) => { setStat0(v); A.setPsel([]); };
  const netLabel = (x) => MVP_NET[x] || x;
  const rows = ssSorted(A.pacc.filter((a) => ssMatch(search, a.name) && (!nets.length || nets.includes(netLabel(a.network))) && (!stat.length || stat.includes("Connected"))), sort);
  const sel = A.psel, n = sel.length, ids = rows.map((a) => a.id), all = n > 0 && ids.every((id) => sel.includes(id)), some = n > 0 && !all;
  const options = BR_ROLES.concat(BR_CUSTOM.filter((r) => r !== MVP_P1 && A.roleRows.some((x) => x.name === r)));
  const roleCell = (a) => <SSPopover trigger={(open, toggle) => <OptionTrigger open={open} aria-haspopup="menu" aria-expanded={open} aria-label={m.name + " on " + a.name + ": " + a.role} onClick={toggle}>{a.role}</OptionTrigger>}>
    {(close) => options.map((o) => <DropdownMenuItem key={o} selected={o === a.role} onClick={() => { close(); A.setPersonRole(a.id, o); }}>{o}</DropdownMenuItem>)}</SSPopover>;
  const columns = [
    { key:"check", width:56, header:<Checkbox checked={all} indeterminate={some} aria-label="Select all social accounts" onChange={() => A.setPsel(all ? [] : ids)} />, render:(a) => <Checkbox checked={sel.includes(a.id)} aria-label={"Select " + a.name} onChange={() => A.togglePsel(a.id)} /> },
    { key:"name", width:300, header:<MVPSort label="Social account" k="name" sort={sort} setSort={setSort} />, render:(a) => <MVPAccountCell a={a} /> },
    { key:"role", width:220, header:"Role", render:roleCell },
    { key:"status", width:160, header:"Status", render:(a) => <SSStatus status={a.status} /> },
    { key:"last", width:200, header:"Last connected on" },
    { key:"actions", header:"Actions", width:96, render:() => null },
  ];
  const tabLabel = (t, k) => k == null ? t : <span style={{ display:"inline-flex", gap:8 }}><span>{t}</span><span>{k}</span></span>;
  const head = <React.Fragment>
    <SSEntityHeader title={m.name} onBack={() => A.goView("members")} meta={m.access + " · " + m.email} avatar={<Avatar src={MVP_AVATAR} initials="AP" size="md" />}
      actions={<React.Fragment><Button variant="secondary" onClick={() => A.openOrg("assign-teams", { target:m.name })}>Add to teams</Button><Button variant="primary" onClick={() => A.openOrg("assign-accounts", { target:m.name })}>Assign social accounts</Button>
        <BRPop align="right" width={240} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="ghost" aria-label="More actions" aria-expanded={open} onClick={toggle} />}>{(close) => <DropdownMenuItem onClick={() => { close(); A.toast(m.name + " stays in Somos Organization in this prototype"); }}>Remove from organization</DropdownMenuItem>}</BRPop></React.Fragment>} />
    <SSTabsBar tabs={[{ id:"teams", label:tabLabel("Teams", m.teams) }, { id:"social", label:tabLabel("Social accounts", A.pacc.length) }, { id:"org", label:tabLabel("Organization") }]} value={tab} onChange={setTab} />
  </React.Fragment>;
  // Figma p.0 to p.2: "2 selected" and Change role, no key icon.
  const bar = n > 0 && tab === "social" && <BRBulkBar label={n + " selected"} onDismiss={() => A.setPsel([])}>
    <button type="button" className="hs-btn hs-btn--ghost" onClick={() => A.setPbulk({ step:"pick", role:MVP_P1 })} style={{ color:"var(--bento-component-snackbar-text)", fontWeight:700, height:32, padding:"0 8px" }}>Change role</button></BRBulkBar>;
  return (
    <div data-mvp-person="" style={{ height:"100%" }}>
      <MVPStyle />
      {/* Figma p.0 to p.3: the panel runs to 40 above the frame's bottom edge, so no band under the scrolling part here. */}
      <MVPFrame head={head} overlay={bar}>
        <MVPContent pad={mvpTabsPad()}>
          {tab === "social" ? <SSListPanel title={A.pacc.length + " social accounts"} explainer={"Social accounts that " + m.name + " is assigned to and their roles."} link="Learn more about social account roles">
            <MVPToolbar placeholder="Search social accounts" search={search} setSearch={setSearch} chipGap="var(--bento-theme-spacing-04)">
              <SSFilterChip label="Social network" options={[...new Set(A.pacc.map((a) => netLabel(a.network)))]} value={nets} onChange={setNets} />
              <SSFilterChip label="Status" options={["Connected", "Disconnected"]} value={stat} onChange={setStat} /></MVPToolbar>
            <div style={{ width:"100%" }} className="mvp-members" data-mvp-person-table=""><Table rows={rows} emptyReason={rows.length ? undefined : "no-results"} columns={columns} /></div>
          </SSListPanel>
          : <SSListPanel title={tab === "teams" ? m.teams + " teams" : "Organization"} explainer={tab === "teams" ? "Teams " + m.name + " belongs to." : "What " + m.name + " can manage across the organization."} link={tab === "teams" ? "Learn more about teams" : "Learn more about permissions"}>
            <p style={mvpSub}>This tab isn’t part of this prototype.</p></SSListPanel>}
        </MVPContent>
      </MVPFrame>
    </div>
  );
}

// MVP 3.0: All social accounts with Manage roles next to Add social account (16 Sep board).
function MVPAccounts() {
  const A = React.useContext(MVPC);
  const { Button, Table } = SS_NS();
  const [search, setSearch] = React.useState(""), [nets, setNets] = React.useState([]), [stat, setStat] = React.useState([]), [sort, setSort] = React.useState(null);
  const NETS = SS_NS().NETWORKS || {}, label = (x) => (NETS[x] && NETS[x].label) || x;
  const rows = ssSorted(MVP_ACCOUNTS.filter((a) => ssMatch(search, a.name) && (!nets.length || nets.includes(label(a.network))) && (!stat.length || stat.includes("Connected"))), sort);
  const open = (a) => { if (MVP_UT) A.openAcct(a); else if (a.id === "a3") A.goView("members"); else A.toast("This prototype opens YouTube Somos"); };
  return (
    <React.Fragment>
      <SSEntityHeader title="All social accounts" actions={<React.Fragment>
        <Button variant="ghost" onClick={() => A.goView("roles")}>Manage roles</Button>
        <Button variant="primary" onClick={() => A.toast("Adding a social account isn’t part of this prototype")}>Add social account</Button></React.Fragment>} />
      <MVPContent pad={24} fill={MVP_FIG}>
        <SSListPanel title={MVP_ACCOUNTS.length + " social accounts in Somos Organization"} link="Learn how to connect social accounts">
          <MVPToolbar placeholder={MVP_UT ? "Search for social accounts" : "Search social accounts"} search={search} setSearch={setSearch}>
            <SSFilterChip label={MVP_UT ? "Social Network" : "Social network"} options={[...new Set(MVP_ACCOUNTS.map((a) => label(a.network)))]} value={nets} onChange={setNets} />
            <SSFilterChip label="Status" options={["Connected", "Disconnected"]} value={stat} onChange={setStat} /></MVPToolbar>
          <div style={{ width:"100%" }}>
            <MVPStyle /><div className="mvp-acct-table" style={{ width:"100%" }}><Table rows={rows} emptyReason={rows.length ? undefined : "no-results"} columns={[
              { key:"name", width:MVP_FIG ? 538 : undefined, header:"Social account", render:(a) => <a href="#" className="mvp-acct" onClick={(e) => { e.preventDefault(); open(a); }} style={{ color:"inherit", textDecoration:"none" }}><MVPAccountCell a={a} /></a> },
              { key:"added", width:MVP_FIG ? 200 : undefined, header:<MVPSort label="Added on" k="added" sort={sort} setSort={setSort} /> },
              { key:"status", width:MVP_FIG ? 240 : undefined, header:<MVPSort label="Status" k="status" sort={sort} setSort={setSort} />, render:(a) => <SSStatus status={a.status} /> },
              { key:"actions", header:"Actions", align:MVP_FIG ? undefined : "right", width:MVP_FIG ? 86 : 96, render:(a) => <SSRowActions items={[{ label:"View details", icon:"visibility", onClick:() => open(a) }, { label:"Remove", icon:"delete", onClick:() => A.toast("Removing a social account isn’t part of this prototype") }]} /> },
            ]} /></div>
          </div>
        </SSListPanel>
      </MVPContent>
    </React.Fragment>
  );
}

// Roles list: member counts as plain text (F12), Delete off while anyone has the role (F14), and on, with one confirm,
// when nobody has it (MVP 3.3 to 3.5).
function MVPRoles() {
  const A = React.useContext(MVPC);
  const { Button, IconButton, DropdownMenuItem, Table, Badge, AlertBanner } = SS_NS();
  const [sort, setSort] = React.useState(null);
  const rows = ssSorted(A.roleRows, sort), rj = A.rjob;
  const menuFor = A.screen === "3.2" || A.screen === "5.0" ? MVP_P1 : A.screen === "3.3" ? MVP_P2 : null;
  const old = mvpOld(A);
  return (
    <React.Fragment>
      <SSEntityHeader title="Roles" onBack={() => A.goView("accounts")} actions={<Button variant="primary" onClick={() => A.startCreate()}>Create role</Button>} />
      {rj && <AlertBanner tone="info" title={"Updating " + rj.name + " for " + rj.n + " people"}>{old ? "Some people keep the old version of the role until this finishes. You can leave this page." : "Some members may keep their current permissions until the update finishes. We’ll notify you when it’s done."}</AlertBanner>}
      <MVPContent>
        <SSListPanel title={rows.length + " roles for social accounts in Somos"} link={old ? "Learn more about social account permissions" : "Learn more about social account roles"}>
          <div className="mvp-roles-table" style={{ width:"100%" }}><MVPStyle /><Table rows={rows} columns={[
            { key:"name", width:200, header:<MVPSort label="Role" k="name" sort={sort} setSort={setSort} />, render:(r) => r.description ? <span style={{ display:"flex", flexDirection:"column" }}><span>{r.name}</span><span style={{ ...mvpSub, font:"var(--hs-type-body-sm)" }}>{r.description}</span></span> : r.name },
            { key:"type", width:130, header:<MVPSort label="Type" k="type" sort={sort} setSort={setSort} /> },
            { key:"desc", width:456, header:<MVPSort label={old ? "Permissions" : "Description"} k="desc" sort={sort} setSort={setSort} />, render:(r) => <span style={{ display:"block", ...(MVP_FIG ? { width:0, minWidth:"100%" } : { maxWidth:424 }), overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.desc}</span> },   // review mode: the column can shrink below 456 in a narrower window, so the table still fits the panel
            { key:"count", width:150, header:<MVPSort label="Members" k="count" sort={sort} setSort={setSort} />, render:(r) => { const upd = rj && rj.name === r.name;
              return <span className="mvp-nowrap" style={{ display:"inline-flex", alignItems:"center", gap:8 }}><span>{old ? (r.count + " people") : String(r.count)}</span>{upd && <Badge tone="neutral">Updating</Badge>}</span>; } },
            { key:"actions", header:"Actions", align:MVP_FIG ? undefined : "right", width:96, render:(r) => r.type === "Custom" && !(rj && rj.name === r.name) ? <BRPop align="right" width={200} initialOpen={r.name === menuFor} trigger={(open, toggle) => <IconButton icon="more_horiz" variant="secondary" size="sm" aria-label={"More actions for " + r.name} aria-expanded={open} onClick={toggle} />}>
              {(close) => <React.Fragment><DropdownMenuItem onClick={() => { close(); A.startEdit(r.name); }}>Edit</DropdownMenuItem>
                {r.count > 0 ? <span className={"mvp-tip mvp-tip--top" + (A.screen === "3.2" ? " mvp-tip--on" : "")} style={{ display:"block" }}><SSNS_Tooltip label={old ? "You can delete it once no one has this role." : "You can’t delete this role while members have it. Change their roles first."}><DropdownMenuItem disabled aria-disabled="true">Delete</DropdownMenuItem></SSNS_Tooltip></span>
                  : <DropdownMenuItem onClick={() => { close(); A.askDelete(r.name); }}>Delete</DropdownMenuItem>}</React.Fragment>}</BRPop> : null },
          ]} /></div>
        </SSListPanel>
      </MVPContent>
    </React.Fragment>
  );
}
// The bundle Tooltip, as a block so it can wrap a full width menu item.
function SSNS_Tooltip({ label, children }) {
  const { Tooltip } = SS_NS();
  return <span style={{ display:"block" }} className="mvp-tip-block"><style>{".mvp-tip-block>.hs-tooltip-wrap{display:flex}.mvp-tip-block>.hs-tooltip-wrap>*:first-child{flex:1}"}</style><Tooltip label={label} side="left">{children}</Tooltip></span>;
}

// BRPop (../bulk-roles/br-ui.jsx) with the menu offset as a prop: Figma's Start from menu opens 12 over the bottom of the field.
// Inside MVPFrame (review mode) the menu is drawn on the frame, not in the scrolling part, so it can sit over the footer as in
// Figma 4.0 and 6.1a; it follows the field when the page scrolls and scrolls itself when it is taller than the space left.
function MVPPop({ trigger, children, align = "left", width, initialOpen, offset = 4 }) {
  const [open, setOpen] = React.useState(!!initialOpen);
  const [pos, setPos] = React.useState(null);
  const ref = React.useRef(null), menu = React.useRef(null);
  React.useLayoutEffect(() => {
    if (!open) { setPos(null); return undefined; }
    const el = ref.current, frame = el && el.closest("[data-mvp-frame]"), sc = el && el.closest("[data-mvp-scroll]");
    if (!frame || !sc) return undefined;
    // Re-placed every frame while open (fonts loading, the page scrolling or growing all move the field), set only on a change.
    let last = "", raf = 0;
    const place = () => { const f = frame.getBoundingClientRect(), r = el.getBoundingClientRect(), k = (f.width / (frame.offsetWidth || f.width)) || 1;
      const top = Math.round((r.bottom - f.top) / k + offset), p = { frame, top, left:Math.round((r.left - f.left) / k), width:Math.round(r.width / k), max:Math.max(120, frame.offsetHeight - top - 8) };
      const key = [p.top, p.left, p.width, p.max].join(","); if (key !== last) { last = key; setPos(p); } raf = requestAnimationFrame(place); };
    place();
    return () => cancelAnimationFrame(raf);
  }, [open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const inside = (t) => (ref.current && ref.current.contains(t)) || (menu.current && menu.current.contains(t));
    const off = (e) => { if (!inside(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const { DropdownMenu } = SS_NS();
  const body = () => children(() => setOpen(false));
  return <span ref={ref} style={{ position:"relative", display:"inline-flex", verticalAlign:"middle" }}>{trigger(open, () => setOpen((o) => !o))}
    {open && (pos ? ReactDOM.createPortal(<div ref={menu} style={{ position:"absolute", top:pos.top, left:pos.left, width:Math.max(width || 220, pos.width), zIndex:50 }}><DropdownMenu style={{ maxHeight:pos.max, overflowY:"auto", boxSizing:"border-box" }}>{body()}</DropdownMenu></div>, pos.frame)
      : !MVP_FIG || !(ref.current && ref.current.closest("[data-mvp-frame]")) ? <DropdownMenu style={{ position:"absolute", top:"calc(100% + " + offset + "px)", [align]:0, zIndex:50, minWidth:width || 220 }}>{body()}</DropdownMenu> : null)}</span>;
}
// A permission row as Figma draws it: SSRow (../suite-settings/parts.jsx) without the 2px between the name and the description (80 tall).
// Figma list item (review mode only): 16 padding all round, the checkbox top aligned with the label (container-control padding
// 16 16 16 8 inside the item's 16), so 24 from the right edge.
function MVPPermRow({ label, desc, control }) {
  return <div style={{ display:"flex", alignItems:"flex-start", gap:"var(--bento-space-04)", padding:"var(--bento-space-04)" }}>
    <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}><span style={{ font:"var(--hs-type-body-md-b)", color:"var(--bento-theme-color-text-base)" }}>{label}</span>{desc && <span style={ssSubtle}>{desc}</span>}</div>
    {control && <div style={{ display:"flex", alignItems:"flex-start", gap:"var(--bento-space-03)", flexShrink:0, marginRight:"var(--bento-space-02)" }}>{control}</div>}</div>;
}
// One list of permissions, no product sections or Select all (PM, F16). Same field anatomy as the full flow's form.
// descClear: Figma draws the clear icon in the description on Edit (5.1) only, not on Create (4.0, 4.1, 6.1a); test mode keeps it.
// name40: the 40 tall name field with no clear icon of Figma 4.1a (error) and 6.1 (focused), on those screens only.
function MVPPermForm({ list, perms, setPerms, name, setName, desc, setDesc, nameError, startFrom, intro, top, title, permsHead, descClear = true, name40 }) {
  const { Input, Textarea, Hint, Checkbox, Panel } = SS_NS();
  const has = (x) => perms.includes(x), tog = (x) => setPerms(has(x) ? perms.filter((y) => y !== x) : perms.concat(x));
  const clr = ".mvp-clr>:not(style),.mvp-clr input,.mvp-clr textarea{width:100%;box-sizing:border-box}.mvp-clr--on input,.mvp-clr--on textarea{padding-right:48px}" + (MVP_FIG ? ".mvp-clr textarea{display:block}" : "");
  const clearBtn = (label, onClick, top) => <button type="button" className="hs-btn hs-btn--icon hs-btn--ghost" aria-label={label} onClick={onClick} style={{ position:"absolute", right:MVP_FIG ? 12 : 16, top, width:32, height:32, minWidth:32, padding:0, color:"var(--bento-theme-color-icon-base)" }}><span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:20, fontVariationSettings:"'FILL' 1" }}>cancel</span></button>;
  return (
    <div className="mvp-form-page" style={{ padding:40, background:"var(--bento-system-sys-neutral-alt-200,#f4f5f6)", minHeight:"100%", boxSizing:"border-box" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <Panel style={{ alignItems:"stretch", gap:24 }}>
          <style>{clr}</style>
          {top}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}><h2 style={{ font:"600 18px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)", margin:0 }}>{title || "Set up the role"}</h2>{intro}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}><span style={mvpStrong}>Role name</span>
            <div className={(name && !name40 ? "mvp-clr mvp-clr--on" : "mvp-clr") + (name40 ? " mvp-name40" : "")} style={{ position:"relative" }}><Input id="mvp-role-name" value={name} placeholder="Role name" error={!!nameError} aria-invalid={!!nameError} aria-describedby={nameError ? "mvp-name-err" : undefined} onChange={(e) => setName(e.target.value)} />
              {name && !name40 && clearBtn("Clear role name", () => setName(""), MVP_FIG ? 8 : 4)}</div>
            {nameError && <Hint error id="mvp-name-err">{nameError}</Hint>}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"var(--bento-space-02)", maxWidth:456 }}>
            <label htmlFor="mvp-desc" style={mvpStrong}>Description <span style={{ ...mvpSub, font:"var(--hs-type-body-md)" }}>(optional)</span></label>
            <div className={desc && descClear ? "mvp-clr mvp-clr--on" : "mvp-clr"} style={{ position:"relative" }}><Textarea id="mvp-desc" value={desc || ""} maxLength={500} placeholder={MVP_FIG ? undefined : "What is this role for?"} onChange={(e) => setDesc(e.target.value)} />
              {desc && descClear && clearBtn("Clear description", () => setDesc(""), 8)}</div>
            <span style={{ ...mvpSub, font:MVP_FIG ? "var(--hs-type-body-md)" : "var(--hs-type-body-sm)" }} aria-live="polite">{(desc || "").length} / 500</span></div>
          {startFrom}
          {permsHead}
          <div data-mvp-perms="" style={{ display:"flex", flexDirection:"column" }}>
            {list.map((x) => MVP_FIG ? <MVPPermRow key={x} label={x} desc={mvpPermDesc(x)} control={<span data-mvp-perm={x} style={{ display:"flex" }}><Checkbox aria-label={x} checked={has(x)} onChange={() => tog(x)} /></span>} />
              : <SSRow key={x} label={x} desc={mvpPermDesc(x)} divider={false} control={<span data-mvp-perm={x}><Checkbox aria-label={x} checked={has(x)} onChange={() => tog(x)} /></span>} />)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// Row 6, second entry: search the members of this social account and pick one. People with custom permissions come first,
// and with an empty search they're the only ones suggested.
function MVPPersonPick() {
  const A = React.useContext(MVPC), c = A.create;
  const { SearchInput, DropdownMenu, DropdownMenuItem } = SS_NS();
  const picked = c.person ? A.people.find((p) => p.id === c.person) : null;
  const [q, setQ] = React.useState(picked ? picked.name : ""), [open, setOpen] = React.useState(A.screen === "6.1a");
  const ref = React.useRef(null);
  React.useEffect(() => { if (!open) return undefined; const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc); return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); }; }, [open]);
  const t = q.trim().toLowerCase(), isC = (p) => p.role === MVP_CUSTOM;
  const hits = A.people.filter((p) => mvpCanChange(p) && (t ? p.name.toLowerCase().includes(t) || p.email.includes(t) : isC(p))).sort((a, b) => isC(b) - isC(a)).slice(0, 6);
  const pick = (p) => { setQ(p.name); setOpen(false); A.pickPerson(p); };
  return (
    <span ref={ref} style={{ position:"relative", display:"block" }}>
      <SearchInput placeholder="Search for a member" aria-label="Search for a member" value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); if (picked) A.pickPerson(null); }} onClear={() => { setQ(""); A.pickPerson(null); }} />
      {open && (hits.length > 0 || t) && <DropdownMenu data-mvp-person-results="" style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50, maxHeight:352, overflowY:"auto" }}>
        {hits.length ? hits.map((p) => <DropdownMenuItem key={p.id} selected={p.id === c.person} style={{ height:"auto", minHeight:56, paddingBlock:"var(--bento-space-02)" }} onClick={() => pick(p)}>
          <span style={{ display:"flex", flexDirection:"column", gap:2, whiteSpace:"normal", width:"100%" }}><span style={{ display:"flex", justifyContent:"space-between", gap:8 }}><b>{p.name}</b><span style={mvpSub}>{p.role}</span></span><span style={mvpSub}>{p.email}</span></span></DropdownMenuItem>)
          : <p style={{ ...mvpSub, padding:"12px 16px" }}>No members match “{q.trim()}”.</p>}
      </DropdownMenu>}
    </span>
  );
}

function MVPCreate() {
  const A = React.useContext(MVPC), c = A.create, old = mvpOld(A);
  const { Button, Hyperlink, Select, DropdownMenuItem, DropdownMenuSeparator, Alert, Input } = SS_NS();
  const taken = A.nameTaken(c.name), base = c.from ? (A.rolePerms[c.from] || []) : null;
  const sameAsBase = !!base && base.length === c.perms.length && base.every((x) => c.perms.includes(x));
  const custom = A.roleRows.filter((r) => r.type === "Custom").map((r) => r.name);
  const ordered = custom.concat(A.roleRows.map((r) => r.name).filter((r) => !custom.includes(r)));
  // Row 6, from a person: the same permissions check compares with roles only (their own role first, then the Start from order),
  // never with the person's own set.
  const src = c.person ? A.people.find((p) => p.id === c.person) : null, fromPerson = c.src === "person";
  const match = base ? (sameAsBase ? c.from : null) : src ? [src.role].concat(ordered).find((r) => mvpSameSet(A.rolePerms[r], c.perms)) || null : null;
  const set = (patch) => A.setCreate({ ...c, ...patch });
  const back = () => A.goView(c.back || "roles");
  // Prefilled from a person (6.1, or a pick in 6.1a): the name is still empty, so it gets focus.
  // Figma 6.1 draws the name field focused (Inbox Lead typed), so that screen focuses it too.
  React.useEffect(() => { if (!c.person || A.isStatic) return; const el = document.getElementById("mvp-role-name"); if (el && (!el.value || (!old && A.screen === "6.1"))) el.focus(); }, [c.person]);
  const today = src && <span data-mvp-from-person="" style={{ ...mvpSub, marginTop:old ? 0 : 24 }}>{"These are the permissions " + src.name + " has on " + A.acct.name + " today."}</span>;
  const keepLine = old ? "Copies their permissions. If you keep them as they are, " + (src ? src.name : "they") + " get" + (src ? "s" : "") + " this role."
    : "Copies their permissions. Keep them as they are and " + (src ? src.name.split(" ")[0] : "that person") + ", plus everyone with the same set, moves to this role.";
  // Inline in Figma mode, so the link wraps with its sentence as Figma's text does (.hs-link is inline-flex).
  const link = (t) => <Hyperlink href="#" onClick={(x) => x.preventDefault()} style={old ? undefined : { display:"inline" }}>{t}</Hyperlink>;
  const roleLine = old ? "Copies its permissions. The two roles stay separate." : <React.Fragment>We’ll copy this role’s permissions into your new one. Changes to either role won’t affect the other. {link("Learn more about social account roles")}</React.Fragment>;
  const col = { display:"flex", flexDirection:"column", gap:old ? "var(--bento-space-02)" : 0, maxWidth:456 };
  const field = (x) => old ? x : <div style={{ marginTop:8, display:"flex", flexDirection:"column" }}>{x}</div>;
  // Figma menu items: 12 above and below, no gap between the name and the description (72 tall, 96 with two lines).
  const itemStyle = { height:"auto", minHeight:56, paddingBlock:old ? "var(--bento-space-02)" : "var(--bento-space-03)" };
  const startFrom = c.lock && src ? <div style={col}>
      <span style={mvpStrong}>Start from</span><span style={mvpSub}>{keepLine}</span>
      {field(old ? <Input readOnly aria-readonly="true" aria-label="Start from" data-mvp-start-from="" value={src.name + "’s custom permissions"} style={{ background:"var(--bento-component-input-fill-disabled)", cursor:"default" }} />
        : <span style={{ position:"relative", display:"block" }}><Input readOnly aria-readonly="true" aria-label="Start from" data-mvp-start-from="" value={src.name + "’s custom permissions"} style={{ background:"var(--bento-component-input-fill-disabled)", cursor:"default" }} /><span className="material-symbols-outlined mvp-start-chev" aria-hidden="true">keyboard_arrow_down</span></span>)}
      {today}</div>
    : <div style={col}>
      <span style={mvpStrong}>{fromPerson ? "Start from" : "Start from an existing role"}</span>
      <span style={mvpSub}>{fromPerson ? keepLine : roleLine}</span>
      {field(<MVPPop width={456} offset={old ? 4 : -12} initialOpen={A.screen === "4.0" || A.screen === "6.1a"} trigger={(open, toggle) => <Select value={(fromPerson ? "A person’s current permissions" : c.from) || undefined} placeholder="Select a role" open={open} onClick={toggle} />}>
        {(close) => <React.Fragment>{ordered.map((r) => <DropdownMenuItem key={r} selected={r === c.from} style={itemStyle} onClick={() => { close(); A.pickFrom(r); }}>
          <span style={{ display:"flex", flexDirection:"column", gap:old ? 2 : 0, whiteSpace:"normal" }}><span style={{ display:"flex", justifyContent:"space-between" }}>{old ? <b>{r}</b> : <span style={mvpStrong}>{r}</span>}{custom.includes(r) && <span style={mvpSub}>Custom</span>}</span><span style={mvpSub}>{A.roleDesc(r)}</span></span></DropdownMenuItem>)}
          {/* Row 6, second entry. Test mode (?ut=1) keeps the menu as it was. */}
          {!MVP_UT && <React.Fragment><DropdownMenuSeparator /><DropdownMenuItem selected={fromPerson} data-mvp-person-opt="" style={itemStyle} onClick={() => { close(); A.pickPerson(null); }}>
            <span style={{ display:"flex", flexDirection:"column", gap:old ? 2 : 0, whiteSpace:"normal" }}>{old ? <b>A person’s current permissions</b> : <span style={mvpStrong}>A person’s current permissions</span>}<span style={mvpSub}>Copies what someone can do on one of their social accounts</span></span></DropdownMenuItem></React.Fragment>}</React.Fragment>}</MVPPop>)}
      {fromPerson && (old ? <MVPPersonPick /> : <div style={{ marginTop:8 }}><MVPPersonPick /></div>)}
      {today}</div>;
  // Figma: the heading sits over the list when starting from a role (4.0 to 4.1b, 6.1a), not when prefilled from a person (6.1).
  const permsHead = !old && !fromPerson && <div style={{ display:"flex", flexDirection:"column", gap:8 }}><h3 style={{ font:"600 18px/24px var(--bento-theme-font-families-primary)", color:"var(--bento-theme-color-text-base)", margin:0 }}>Add custom permissions</h3>
    <p style={ssBody}>Choose additional permissions for your new role. {link("Learn more about custom social account permissions")}</p></div>;
  const sameAs = c.sameAs || c.from;
  return (
    <MVPFrame head={<SSEntityHeader title={old ? "Create role" : "Create a role"} onBack={back} />}
      foot={<MVPFootBar dirty old={old}><Button variant="secondary" onClick={back}>Cancel</Button><Button variant="primary" disabled={!c.name.trim() || taken || (fromPerson && !c.person)} onClick={() => { if (match) set({ same:true, sameAs:match }); else A.saveCreate(); }}>Create role</Button></MVPFootBar>}>
      <MVPPermForm title={old ? null : "Role details"} permsHead={permsHead} descClear={old} name40={!old && (A.screen === "4.1a" || A.screen === "6.1")} list={MVP_PERMS.map((p) => p[0])} perms={c.perms} setPerms={(p) => set({ perms:p, same:false })} name={c.name} setName={(x) => set({ name:x, auto:false })} desc={c.desc} setDesc={(d) => set({ desc:d })}
        nameError={taken ? c.name.trim() + " already exists. Use a different name." : null}
        top={c.same && (old ? <Alert tone="negative" title={"These permissions match " + sameAs}>Change at least one permission, or use {sameAs} instead.</Alert>
          : <Alert tone="negative" title="A role with these permissions already exists">{"Adjust the custom permissions for your new role, or use the existing " + sameAs + " role instead."}</Alert>)}
        intro={old ? <p style={{ ...ssBody, marginTop:"var(--bento-space-02)" }}>{c.lock ? "Give it a name and check the permissions." : "Give it a name, pick a role to start from, and adjust the permissions."} Everyone with this role gets the same set. {link("Learn more about custom social account permissions")}</p>
          : <p style={ssBody}>A role is a set of permissions. Everyone with this role gets the same permissions.</p>}
        startFrom={startFrom} />
    </MVPFrame>
  );
}

function MVPEdit() {
  const A = React.useContext(MVPC), e = A.edit, old = mvpOld(A);
  const { Button, Hyperlink } = SS_NS();
  const dirty = JSON.stringify(e.perms.slice().sort()) !== JSON.stringify(e.orig.slice().sort()) || e.name !== e.origName || (e.desc || "") !== (e.origDesc || "");
  const taken = A.nameTaken(e.name, e.origName);
  return (
    <MVPFrame head={<SSEntityHeader title="Edit role" onBack={() => A.goView("roles")} />}
      foot={<MVPFootBar dirty={dirty} old={old}><Button variant="secondary" onClick={() => A.goView("roles")}>Cancel</Button><Button variant="primary" disabled={!dirty || taken || !e.name.trim()} onClick={() => A.saveEdit()}>{old ? "Save role" : "Save changes"}</Button></MVPFootBar>}>
      <MVPPermForm title={old ? null : "Role details"} list={MVP_EDIT_LIST} perms={e.perms} setPerms={(p) => A.setEdit({ ...e, perms:p })} name={e.name} setName={(x) => A.setEdit({ ...e, name:x })} desc={e.desc} setDesc={(d) => A.setEdit({ ...e, desc:d })}
        nameError={!e.name.trim() ? "Enter a role name." : taken ? e.name.trim() + " already exists. Use a different name." : null}
        intro={old ? <p style={{ ...ssBody, marginTop:"var(--bento-space-02)" }}>Change the name or the permissions. Everyone with this role gets the update. <Hyperlink href="#" onClick={(x) => x.preventDefault()}>Learn more about custom social account permissions</Hyperlink></p>
          : <p style={ssBody}>A role is a set of permissions. Everyone with this role gets the same permissions.</p>} />
    </MVPFrame>
  );
}
Object.assign(window, { MVP_FIG, mvpOld, MVP_AVATAR, MVPFrame, MVPFootBar, MVPRoleRadios, MVPAccountCell, MVP_TEAMS3, MVPSort, MVPContent, MVPToolbar, MVPSoftCheck, MVPC, MVPStyle, mvpSub, mvpStrong, useMVPInfinite, MVPFilterChip, MVPRoleCell, MVPMembers, MVPPerson, MVPAccounts, MVPRoles, MVP_FIG2_CSS, SSNS_Tooltip, MVPPermForm, MVPPersonPick, MVPCreate, MVPEdit });
