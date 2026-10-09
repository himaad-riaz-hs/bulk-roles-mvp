// Suite Settings — sample data. Placeholder org "Somos Organization", people at
// @somos.com, placeholder signed-in user. No real people.
const SS_NS = () => window.BentoHootsuiteDesignSystem_a1ac47 || {};
const SS_ORG = "Somos Organization";
const SS_ORGS = ["Somos Organization", "Somos Labs", "Somos Retail"];
const SS_ME = { name: "Sam Rivera", first: "Sam", email: "sam.rivera@somos.com", initials: "SR" };

const SS_ROLES = [
  { id: "limited", name: "Limited", type: "System", perms: "View only. Posts, comments and replies need approval before they publish.", people: 231 },
  { id: "responder", name: "Responder", type: "System", perms: "Reply to public messages. Posts, comments and replies need approval.", people: 218 },
  { id: "editor", name: "Editor", type: "System", perms: "Publish posts, comments and replies, and approve posts", people: 367 },
  { id: "advanced", name: "Advanced", type: "System", perms: "Editor permissions plus promote posts and manage ad accounts", people: 225 },
  { id: "care", name: "Care Agent", type: "System", perms: "Reply to public and private messages, and like, hide and delete comments", people: 238 },
  { id: "publisher-one", name: "Publisher One", type: "Custom", perms: "Editor permissions, with approvals bypassed", people: 498 },
];
const SS_ROLE_NAMES = SS_ROLES.map((r) => r.name);
const SS_TEAM_ROLES = ["Team Admin", "Team Member"];

const SS_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ssDate = (i) => SS_MONTHS[(i * 7) % 12] + " " + (((i * 11) % 27) + 1) + ", 2026";
const ssInitials = (n) => n.replace(/^@/, "").split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const SS_ACCOUNT_SEED = [
  ["@somos.main", "instagram", "Aug 19, 2026"], ["LinkedIn Somos", "linkedin", "Feb 3, 2026"],
  ["Facebook Somos", "facebook", "Feb 3, 2026"], ["YouTube Somos", "youtube", "Mar 21, 2026", "disconnected"],
  ["@somos_travel", "x", "Jul 22, 2026"], ["Somos Music Page", "facebook", "Jan 6, 2026"],
  ["Somos Kids", "linkedin", "Apr 22, 2026"], ["@somos_canada", "x", "Feb 20, 2026"],
  ["@somos.canada", "instagram", "Aug 2, 2026"], ["@somos.events", "instagram", "Sep 21, 2026"],
  ["Somos Deutschland Pins", "pinterest", "Mar 15, 2026"], ["Somos Travel Pins", "pinterest", "Jan 27, 2026"],
  ["Somos México", "linkedin", "May 25, 2026"], ["Somos France TV", "youtube", "Aug 11, 2026"],
  ["@somos.nordics", "instagram", "Jun 25, 2026"], ["@somos_careers", "threads", "Jan 16, 2026"],
];
const SS_NETS = ["instagram", "facebook", "linkedin", "x", "threads", "tiktok", "youtube", "pinterest", "bluesky"];
const SS_REGIONS = ["spain", "chile", "peru", "japan", "korea", "italy", "brasil", "india", "kenya", "nigeria", "egypt", "poland"];
const SS_KINDS = ["news", "shop", "care", "live", "team", "studio", "club", "daily"];
function ssBuildAccounts() {
  const out = SS_ACCOUNT_SEED.map(([name, network, added, status], i) => ({ id: "a" + i, name, network, added, status: status || "connected", initials: ssInitials(name) }));
  for (let i = out.length; i < 100; i++) {
    const name = "@somos_" + SS_REGIONS[i % SS_REGIONS.length] + "." + SS_KINDS[(i * 3) % SS_KINDS.length];
    out.push({ id: "a" + i, name, network: SS_NETS[i % SS_NETS.length], added: ssDate(i), status: i % 23 === 0 ? "disconnected" : "connected", initials: ssInitials(name) });
  }
  return out;
}

const SS_MEMBER_SEED = [
  ["Asha Patel", "Aug 19, 2026", "Admin", 6], ["Bryn Morales", "Feb 3, 2026", "Member", 9], ["Chaya Levi", "Feb 3, 2026", "Member", 10],
  ["Dar Khan", "Mar 21, 2026", "Member", 5], ["Elif Demir", "Apr 2, 2026", "Member", 6], ["Gia Russo", "Apr 1, 2026", "Member", 6],
  ["Hana Kim", "Mar 23, 2026", "Member", 4], ["Ivo Novak", "Mar 23, 2026", "Member", 3, true], ["Bea Kaur", "Sep 19, 2026", "Member", 3],
  ["Hana Kaur", "Feb 2, 2026", "Member", 6], ["Nadia Marsh", "Jul 19, 2026", "Member", 5], ["Mateo Rao", "Sep 22, 2026", "Member", 5],
];
const SS_FIRST = ["Ana", "Ben", "Cleo", "Dev", "Eva", "Finn", "Gus", "Ines", "Jae", "Kai", "Lena", "Milo", "Noor", "Omar", "Pia", "Rui", "Sana", "Theo", "Uma", "Vic", "Wen", "Yara", "Zed"];
const SS_LAST = ["Abara", "Berg", "Costa", "Diaz", "Eze", "Fox", "Grant", "Hale", "Ito", "Jovic", "Lund", "Mori", "Nash", "Ortiz", "Park", "Quinn", "Reyes", "Silva", "Tan", "Vance", "Weber", "Young"];
function ssBuildMembers() {
  const out = SS_MEMBER_SEED.map(([name, added, perm, accounts, pending], i) => ({ id: "m" + i, name, added, perm, accounts, pending: !!pending, initials: ssInitials(name), email: name.toLowerCase().replace(" ", ".") + "@somos.com" }));
  for (let i = out.length; i < 500; i++) {
    const name = SS_FIRST[i % SS_FIRST.length] + " " + SS_LAST[(i * 5) % SS_LAST.length];
    out.push({ id: "m" + i, name, added: ssDate(i), perm: "Member", accounts: (i % 9) + 1, pending: i % 41 === 0, initials: ssInitials(name), email: name.toLowerCase().replace(" ", ".") + i + "@somos.com" });
  }
  return out;
}

const SS_TEAMS = [{ id: "t0", name: "Content Team", members: 8, accounts: 3, role: "Editor" }];

const SS_NOTIFS = [
  { product: "Perch", groups: [
    { name: "Scheduled posts", items: ["Scheduled post fails to publish", "Scheduled post publishes successfully"] },
    { name: "Approvals", items: ["Post requires approval", "Post is approved", "Post is rejected", "Post is rejected during pre-screening", "Approval request expires"] },
    { name: "Mentions and comments", items: ["Mentions or replies to you", "Comments on your drafts or posts", "Comments on threads you participate in"] },
  ] },
  { product: "Nest", groups: [
    { name: "Conversations", items: ["A conversation is assigned to you", "A conversation is assigned to your team", "A customer replies to a resolved conversation"] },
  ] },
  { product: "Lumen", groups: [{ name: "Alerts", items: ["A spike alert fires", "A scheduled report is ready"] }] },
];

const SS_INVOICES = [
  ["Sep 1, 2026", "US$4,788.00"], ["Aug 14, 2026", "US$192.00"], ["Sep 1, 2025", "US$4,788.00"], ["Jun 2, 2025", "US$96.00"],
  ["Sep 1, 2024", "US$4,788.00"], ["Mar 9, 2024", "US$288.00"], ["Sep 1, 2023", "US$4,188.00"], ["Sep 1, 2022", "US$4,188.00"], ["Sep 1, 2021", "US$3,588.00"],
];

Object.assign(window, { SS_NS, SS_ORG, SS_ORGS, SS_ME, SS_ROLES, SS_ROLE_NAMES, SS_TEAM_ROLES, ssBuildAccounts, ssBuildMembers, SS_TEAMS, SS_NOTIFS, SS_INVOICES, ssInitials });
