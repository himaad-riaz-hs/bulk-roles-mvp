
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
const BR_NOTES = []; // not used by this prototype
const BR_FLOWS = []; // not used by this prototype
Object.assign(window,{BR_CUSTOM,BR_PICK_ROLES,BR_ROLES,BR_DESC,BR_ROLE_ROWS0,BR_DELTA,BR_FAIL,brBuildPeople,BR_ASHA,brHolders,BR_GROUPS,BR_P1_PERMS,BR_NOTES,BR_FLOWS});
