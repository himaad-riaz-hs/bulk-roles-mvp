
// Bulk roles prototype — data. Names and numbers come from bulk-roles-spec.md and screen-copy.txt.
const BR_ROLES = ["Limited","Responder","Editor","Advanced","Care Agent","Publisher One"];
const BR_DESC = {
  "Limited":"View only. Posts, comments and replies need approval before they publish",
  "Responder":"Reply to public messages. Posts, comments and replies need approval",
  "Editor":"Publish posts, comments and replies, and approve posts",
  "Advanced":"Editor permissions plus promote posts and manage ad account and social account access",
  "Care Agent":"Reply to public and private messages, and like, hide and delete messages",
  "Publisher One":"Editor permissions, with approvals bypassed",
  "YouTube Publisher":"Publish and comment on YouTube",
  "Inbox Agent":"Reply to and manage conversations in Inbox 2.0",
  "Approver":"Approve posts and messages only",
  "Ads Manager":"Boost posts and manage ad accounts",
};
const BR_CUSTOM = ["Publisher One","Publisher Two","YouTube Publisher","Inbox Agent","Approver","Ads Manager"];
const BR_PICK_ROLES = BR_ROLES.concat(["Publisher Two","YouTube Publisher","Inbox Agent","Approver","Ads Manager"]);
const BR_ROLE_ROWS0 = [["Limited",86],["Responder",44],["Editor",318],["Advanced",39],["Care Agent",30],["Publisher One",48]];
const BR_DELTA = {
  "Editor":{g:["React","Comment and reply"],gn:2,l:[],ln:0},
  "Limited":{g:["Approve Messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0"],more:["Publish posts","Approve posts","Comment and reply","React","Reply to public messages in Inbox 2.0","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","View Private Stream","Manage followers"],gn:12,l:["Publish posts with approval","Comment and reply with approval"],ln:2},
  "Responder":{g:["Approve Messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0"],more:["Publish posts","Approve posts","React","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","View Private Stream","Manage followers"],gn:10,l:["Publish posts with approval","Comment and reply with approval"],ln:2},
  "Advanced":{g:["React","Comment and reply"],gn:2,l:["Boost posts","Manage ad accounts","Manage social account permissions","Manage social account profile"],ln:4},
  "Care Agent":{g:["Approve Messages","Manage followers","Publish posts"],more:["Approve posts","Comment and reply","React","Reply to public messages in Inbox 2.0"],gn:7,l:["Bulk resolve conversations in Inbox 2.0","Facebook private messages","Mask messages in Inbox 2.0"],ln:3},
};
const BR_NAMED = [["Asha Patel","Aug 19, 2026","Editor"],["Bryn Morales","Feb 3, 2026","Publisher One"],["Chaya Levi","Feb 3, 2026","Editor"],["Dar Khan","Mar 21, 2026","Advanced"],["Elif Demir","Apr 2, 2026","Limited"],["Gia Russo","Apr 1, 2026","Responder"],["Hana Kim","Mar 23, 2026","Editor"],["Ivo Novak","Mar 23, 2026","Editor"],["Mateo Rossi","Jun 12, 2026","Editor"],["Nadia Mensah","May 4, 2026","Limited"],["Omar Said","Jul 8, 2026","Editor"],["Priya Kaur","Jan 27, 2026","Care Agent"]];
const BR_EXTRA = ["Rafael Costa","Sara Lind","Tomas Berg","Uma Singh"];
const BR_FAIL = ["p6","p3"];
function brPerson(i, name, added, role){
  const slug = name.toLowerCase().replace(/ /g,".") + (i>=16 ? i : "");
  return { id:"p"+i, name, added, assigned:added, email:slug+"@somos.com", role, initials:ssInitials(name), status:"Active", accounts:((i*5)%9)+1 };
}
function brBuildPeople(){ return BR_PEOPLE_CACHE || (BR_PEOPLE_CACHE = brBuildPeopleRaw()); }
let BR_PEOPLE_CACHE = null;
function brBuildPeopleRaw(){
  const need = {"Editor":301-4,"Limited":80,"Responder":41,"Advanced":38,"Care Agent":28,"Publisher One":12};
  const out = [];
  BR_NAMED.forEach(([n,d,r],i)=>{ need[r]--; out.push(brPerson(i,n,d,r)); });
  BR_EXTRA.forEach((n,k)=>out.push(brPerson(12+k,n,ssDate(12+k),"Editor")));
  const pool = []; Object.keys(need).forEach(r=>{ for(let k=0;k<need[r];k++) pool.push(r); });
  const mix = new Array(pool.length); pool.forEach((r,idx)=>{ mix[(idx*7919)%pool.length]=r; });
  for(let i=16;i<500;i++){
    const name = SS_FIRST[i%SS_FIRST.length]+" "+SS_LAST[(i*5)%SS_LAST.length];
    out.push(brPerson(i,name,ssDate(i),mix[i-16]));
  }
  return out;
}
const BR_ASHA = () => [
  {id:"x0",name:"@somos.main",network:"instagram",added:"Mar 21, 2026",assigned:"Mar 21, 2026",role:"Editor",initials:"SM"},
  {id:"x1",name:"LinkedIn Somos",network:"linkedin",added:"Feb 3, 2026",assigned:"Feb 3, 2026",role:"Editor",initials:"LS"},
  {id:"x2",name:"Facebook Somos",network:"facebook",added:"Feb 3, 2026",assigned:"Feb 3, 2026",role:"Limited",initials:"FS"},
  {id:"x3",name:"YouTube Somos",network:"youtube",added:"Aug 19, 2026",assigned:"Aug 19, 2026",role:"Editor",initials:"YS"},
];
const BR_HOLD_NAMED = [["Bryn Morales",4],["Chaya Levi",6],["Dar Khan",2],["Elif Demir",9],["Gia Russo",3],["Hana Kim",5],["Mateo Rossi",2],["Maya Lin",1],["Omar Said",7],["Priya Kaur",3],["Rui Costa",4]];
function brHolders(count){
  const out = [];
  for(let i=0;i<Math.min(count,60);i++){
    const nm = i<BR_HOLD_NAMED.length ? BR_HOLD_NAMED[i] : [SS_FIRST[(i*3)%SS_FIRST.length]+" "+SS_LAST[(i*7)%SS_LAST.length],((i*4)%8)+1];
    out.push({id:"h"+i,name:nm[0],email:nm[0].toLowerCase().replace(/ /g,".")+(i>=BR_HOLD_NAMED.length?i:"")+"@somos.com",initials:ssInitials(nm[0]),accounts:nm[1]});
  }
  return out;
}
const BR_GROUPS = [
 ["Publishing",[["Publish posts","Publish posts, comments, and replies, and hide Facebook comments"],["Publish posts with approval","Require approval to publish posts. No approval is required for comments and replies"],["Approve posts","Approve team member posts, comments, and replies"],["Comment and reply","Comment, reply, and publish posts to the social account"],["Comment and reply with approval","Require approval to comment, reply, and publish posts"],["React","Like or favourite content, comments, and replies on the social account"],["Repost X posts","Repost X (formerly Twitter) posts"],["Manage RSS / Atom feeds","Add / Edit / Delete RSS and Atom feeds"]]],
 ["Inbox",[["Approve Messages","Approve"],["Bulk resolve conversations in Inbox 2.0","Resolve multiple conversations at once in Inbox 2.0"],["Manage conversations in Inbox 2.0","Add topics or tags, assign conversations, and set conversations as pending and resolved"],["Reply to private messages in Inbox 2.0","Respond to private messages received in Inbox 2.0"],["Reply to public messages in Inbox 2.0","Respond to public messages received in Inbox 2.0"],["Engage with your audience in Inbox 2.0","Like, hide, repost, and delete messages in Inbox 2.0"],["Take conversations in Inbox 2.0","Take conversations from other agents in Inbox 2.0"],["Mask messages in Inbox 2.0","Replace sensitive content with asterisks in Inbox 2.0"],["Facebook private messages","Send private messages on Facebook"]]],
 ["Ads",[["Boost posts","Promote posts on Facebook, Instagram, or LinkedIn"],["Manage ad accounts","View, add, and remove ad accounts for the social account"]]],
 ["Account",[["Basic Usage","View Streams"],["View Private Stream","View Private Streams (Twitter Direct Message, Facebook Inbox, etc...)"],["Manage followers","Manage Twitter and Facebook followers and fans"],["Manage social account permissions","Assign permissions to manage the social account"],["Manage social account profile","Edit and sync the social account name and photo"]]],
];
const BR_P1_PERMS = ["Publish posts","Approve posts","Comment and reply","React","Approve Messages","Manage conversations in Inbox 2.0","Reply to private messages in Inbox 2.0","Reply to public messages in Inbox 2.0","Engage with your audience in Inbox 2.0","Take conversations in Inbox 2.0","Basic Usage","View Private Stream","Manage followers"];
const BR_NOTES = [
 [1,"Two entry points","From a social account (Flow 1) and from a person (Flow 5).","Settled","CSM, 18 and 23 Sep"],
 [2,"Roles live at the social account level","Where admin work piles up.","Settled","customer session, 11 Sep"],
 [3,"Select all across the list","“Select all 500”, from the Bento bulk action pattern (in progress with Gian).","Exploring","Gian, bulk action pattern"],
 [4,"Review happens in the drawer","Step two of the same drawer, with a back link, not a new page.","Exploring","design review’s review, 2 Oct"],
 [5,"Group by current role","The review groups people by their current role and shows what each group gains and loses.","Exploring","Tested well with customer, 24 Sep"],
 [6,"Network exceptions are called out","The review says up front what the network can’t use (“Approvals don’t apply on YouTube”).","Exploring","Flow 1, screen 1.3"],
 [7,"Apply to N counts real changes","“Apply to N” counts only people whose role actually changes.","Settled","Flow 1, screen 1.3"],
 [8,"Leave someone out","Leave someone out from the group’s own page, before applying (Flow 2).","Exploring","Flow 2"],
 [9,"Results stay on the review step","Summary, only the people who failed, Try again for all. What worked stays. Failures never show in the main table; the backend returns who failed on which account.","Settled","customer, 24 Sep; retry all from design review, 2 Oct"],
 [10,"If a retry fails again","The same result stays, with the time of the last try (Flow 3).","Exploring","Flow 3"],
 [11,"Leaving before it finishes","Progress in the card (Version 1) or in a top banner (Version 2). Switch below.","Open question","Flow 4"],
 [12,"Role edits get a simple count first","Not the full review.","Settled","CSM, 24 Sep"],
 [13,"Changes run in the background","Edits and bulk changes run in the background, so some people keep the old version for a few minutes.","Settled","Eng, 23 Sep"],
 [14,"Member counts are links","On the roles list, each count opens who has the role (Flow 7).","Exploring","Flow 7"],
 [15,"Delete with holders","“Move everyone to” plus per row exceptions. Delete stays disabled until everyone is moved.","Exploring","engineering, 25 Sep"],
 [16,"“Start from” includes custom roles","Custom roles are standalone copies; later changes to the source don’t flow in.","Settled","Eng, 23 Sep"],
 [17,"Role cap","customer expects under 50 roles total, 4 or 5 per region.","Open question","customer call, 24 Sep"],
 [18,"A permission a network can’t use, and changes by hand","Option A keeps the role, marked Edited. Option B turns it custom. Switch below.","Open question","Flow 10"],
 [19,"One action across people and accounts","Not in v1: one action across many people AND many accounts.","Open question","Flow 5"],
 [20,"Infinite scroll","Lists keep infinite scroll. No pagination change.","Settled","PM, 25 Sep"],
 [21,"Team default roles are parked","Editing a custom role covers most of it.","Settled","24 Sep"],
 [22,"History and invite roles are later","Role history with export, and picking a role at invite (Flow 11).","Later","Flow 11"],
 [23,"Review changes, Layout A","Title “Review changes”, back row names the selection. One first line with the real count and “Nothing has changed yet.” One closed accordion row per current role, each with one plain line (“4 permissions removed, 2 added.”). No badges, icons, search or chips. Opening a row shows Removed and Added, then “See all N on Role”.","Proposed","Synthesis section 6, proposal 1; the 5 Oct read (too busy); round 10 spec"],
 [24,"Warning only when it manages the account","One warning alert, shown only when a group loses Manage social account permissions, Manage social account profile or Manage ad accounts. Here that is Advanced.","Proposed","Synthesis section 6, proposal 2; CSM, 10 Sep; round 10 spec"],
 [25,"Leave out is per person","No group-level leave out. “See all N on Role” opens that group’s people, where Leave out and Put back in sit in each row menu. Back on the review, the group title and button count update and the open row notes who is left out.","Proposed","CSM, 10 Sep (deselect before applying); engineering, 25 Sep; round 10 spec"],
 [26,"One number story","The first line and the button carry the real change count (488, then 487). “12 already have it” sits once, in the first line. No footer lines repeat it.","Proposed","Synthesis section 6, proposal 4; Shopify Polaris bulk actions; round 10 spec"],
 [27,"Results explain themselves","The title is the outcome. Each failed row shows the person, the account and a reason. One “Try again for N”; rows that can’t be retried show their next step.","Proposed","Synthesis section 6, proposal 5; design review, 25 Sep (retry all); IG Only Auth lesson, 17 Sep; Okta and Entra"],
 [28,"Person side: same pattern, groups are accounts","Same drawer as the member review. Groups are accounts, by the role she has on each today. Her first row opens by default. No warning, since nothing that manages an account is removed.","Proposed","Synthesis section 6, proposal 7; CSM, 16 Sep; round 10 spec"],
 [29,"Role edit says what changes","The confirm names the change (“Adds Boost posts. Removes nothing.”) and links to who has the role.","Proposed","Synthesis section 6, proposal 8; customer, 24 Sep; NN/g confirmation dialogs"],
 [30,"Network exceptions in one line","One sentence in the review’s first line: “Approvals don’t apply on YouTube.” No info alert, per-permission badges or tooltips.","Proposed","Synthesis section 6, proposal 9; CSM, 16 Sep; round 10 spec"],
 [31,"Warning rule","Proposal: The warning shows when a group loses a permission that manages the account: Manage social account permissions, Manage social account profile or Manage ad accounts. Product and engineering to confirm the list.","Proposed","Round 11, screen 1.3"],
 [32,"YouTube line needs a list","Proposal: The YouTube line needs engineering's list of which permissions work on each network. Every network has its own gaps, so the review shows what that list says for this account's network. Engineering to confirm the list.","Proposed","Round 11, screen 1.3"],
 [33,"What Publisher One allows","Proposal: Publisher One in the review opens this page in the same drawer, read only. Permission groups start open and can collapse, and it marks what a network can't use. The same page can open from a system role in the roles list, so admins can see what Editor includes. Product and engineering to size it.","Proposed","Round 11, screen 1.3a"],
 [34,"See all 301 while 300 move","Proposal: The link says See all 301 while 300 move, because the people page still lists Chaya Levi, marked Left out, so she can be put back from there.","Proposed","Round 11, screen 2.3"],
 [35,"Role description is optional","Proposal: Description is optional, on create and edit. It shows under the role name in the roles list and the picker, so the next admin knows why the role exists. Left empty, only the name shows.","Proposed","Round 11, screen 1.2"],
 [36,"Name checked as they type","Proposal: The name is checked as they type, since the browser can do that right away. Create role stays off and the field says why.","Proposed","Round 11, screen 9.1a"],
 [37,"Same permissions, checked on Create","Proposal: Matching permissions can only be checked after Create role, since the browser only knows the role they started from. So the message comes after the click, names the matching role, and stays at the top of the form until they change a permission.","Proposed","Round 11, screen 9.2a"],
 [38,"Copy review before handoff","Proposal: Content design reviews the copy on this board before handoff, starting with the review step, the role screens and the error messages.","Proposed","Round 11, board"],
].map(([n,title,text,status,src])=>({n,title,text,status,src}));
const BR_FLOWS = [
 ["Apply a role to many people",[
  ["1","Apply a role to many members, from a social account",9,"Exploring"],["2","Leave someone out before applying",4,"Exploring"],["3","If a retry fails again",2,"Exploring"],["4","If they leave before it finishes",6,"Open question"],["5","Apply a role to many accounts, from a person",4,"Settled"]]],
 ["Change or remove a role",[
  ["6","Edit a role, with a simple count first",5,"Settled"],["7","See who has a role, and move a few people",5,"Exploring"],["8","Delete a role, move everyone first",5,"Exploring"]]],
 ["Create a role",[["9","Create a role, with permissions in groups",6,"Settled"]]],
 ["Still open, and later",[["10","A permission a network can’t use, and changes by hand",3,"Open question"],["11","History and invite roles",2,"Later"]]],
];
Object.assign(window,{BR_CUSTOM,BR_PICK_ROLES,BR_ROLES,BR_DESC,BR_ROLE_ROWS0,BR_DELTA,BR_FAIL,brBuildPeople,BR_ASHA,brHolders,BR_GROUPS,BR_P1_PERMS,BR_NOTES,BR_FLOWS});
