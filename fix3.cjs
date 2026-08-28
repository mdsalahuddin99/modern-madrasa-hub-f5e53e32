const fs = require('fs');

let s1 = fs.readFileSync('scripts/seed-madrasas.ts', 'utf8');
s1 = s1.replace(/subscriptionActive: true,/g, '');
fs.writeFileSync('scripts/seed-madrasas.ts', s1);

let s2 = fs.readFileSync('scripts/seed-plans.ts', 'utf8');
s2 = s2.replace(/name: plan\.name,/g, 'name: plan.name, slug: plan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),');
fs.writeFileSync('scripts/seed-plans.ts', s2);

let s3 = fs.readFileSync('src/actions/admin.actions.ts', 'utf8');
s3 = s3.replace(/status: "REJECTED"/g, 'status: "CANCELLED"');
fs.writeFileSync('src/actions/admin.actions.ts', s3);

let s4 = fs.readFileSync('src/actions/director.actions.ts', 'utf8');
s4 = s4.replace(/const isExpired = session\.null \? new Date\(session\.null\) < new Date\(\) : true;/g, 'const isExpired = true;');
s4 = s4.replace(/const isSubscriptionActive = session\.false;/g, 'const isSubscriptionActive = false;');
fs.writeFileSync('src/actions/director.actions.ts', s4);
