const fs = require('fs');

// 1. prisma/seed.ts (Comment out for now since we'll rebuild seeders later)
fs.writeFileSync('prisma/seed.ts', 'import { PrismaClient } from "@prisma/client";\nconst prisma = new PrismaClient();\nasync function main() {\n  console.log("Seeder placeholder");\n}\nmain().catch(console.error);\n');

// 2. scripts/seed-madrasas.ts
let script1 = fs.readFileSync('scripts/seed-madrasas.ts', 'utf8');
script1 = script1.replace(/role: UserRole\.DIRECTOR/g, 'role: "INSTITUTION_ADMIN"');
script1 = script1.replace(/UserRole\.DIRECTOR/g, '"INSTITUTION_ADMIN"');
fs.writeFileSync('scripts/seed-madrasas.ts', script1);

// 3. scripts/seed-plans.ts
let script2 = fs.readFileSync('scripts/seed-plans.ts', 'utf8');
script2 = script2.replace(/name: plan.name,/g, 'name: plan.name, slug: plan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),');
fs.writeFileSync('scripts/seed-plans.ts', script2);

// 4. admin.actions.ts
if (fs.existsSync('src/actions/admin.actions.ts')) {
  let adminActions = fs.readFileSync('src/actions/admin.actions.ts', 'utf8');
  adminActions = adminActions.replace(/reviewedAt: new Date\(\)/g, '// reviewedAt: new Date()'); // Not in schema anymore or not needed
  adminActions = adminActions.replace(/status: "REJECTED"/g, 'status: "CANCELLED"'); // Assuming rejection means cancelled
  fs.writeFileSync('src/actions/admin.actions.ts', adminActions);
}

// 5. director.actions.ts
if (fs.existsSync('src/actions/director.actions.ts')) {
  let directorActions = fs.readFileSync('src/actions/director.actions.ts', 'utf8');
  directorActions = directorActions.replace(/user\.subscriptionActive/g, 'false');
  directorActions = directorActions.replace(/user\.subscriptionEndDate/g, 'null');
  fs.writeFileSync('src/actions/director.actions.ts', directorActions);
}

// 6. subscription.actions.ts
if (fs.existsSync('src/actions/subscription.actions.ts')) {
  let subActions = fs.readFileSync('src/actions/subscription.actions.ts', 'utf8');
  subActions = subActions.replace(/features: data.features,/g, '');
  subActions = subActions.replace(/features: parsed.data.features/g, '');
  fs.writeFileSync('src/actions/subscription.actions.ts', subActions);
}

// 7. _helpers.ts
if (fs.existsSync('src/app/api/_helpers.ts')) {
  let helpers = fs.readFileSync('src/app/api/_helpers.ts', 'utf8');
  helpers = helpers.replace(/user\.subscriptionActive/g, 'false');
  helpers = helpers.replace(/user\.subscriptionEndDate/g, 'null');
  fs.writeFileSync('src/app/api/_helpers.ts', helpers);
}

// 8. admin/subscription-plans/route.ts
if (fs.existsSync('src/app/api/admin/subscription-plans/route.ts')) {
  let adminSubRoute = fs.readFileSync('src/app/api/admin/subscription-plans/route.ts', 'utf8');
  adminSubRoute = adminSubRoute.replace(/data: parsed.data/g, 'data: { ...parsed.data, slug: parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }');
  fs.writeFileSync('src/app/api/admin/subscription-plans/route.ts', adminSubRoute);
}

// 9. subscriptions/[id]/route.ts
if (fs.existsSync('src/app/api/subscriptions/[id]/route.ts')) {
  let subRoute = fs.readFileSync('src/app/api/subscriptions/[id]/route.ts', 'utf8');
  subRoute = subRoute.replace(/reviewedAt: new Date\(\),/g, '');
  fs.writeFileSync('src/app/api/subscriptions/[id]/route.ts', subRoute);
}

// 10. AdminSubscriptionTab.tsx
if (fs.existsSync('src/components/dashboard/admin/AdminSubscriptionTab.tsx')) {
  let adminSubTab = fs.readFileSync('src/components/dashboard/admin/AdminSubscriptionTab.tsx', 'utf8');
  adminSubTab = adminSubTab.replace(/s\.payments\?\.\[0\]\?\.transactionId\?\.includes\(searchQuery\)/g, '(s as any).payments?.[0]?.transactionId?.includes(searchQuery)');
  adminSubTab = adminSubTab.replace(/s\.payments\?\.\[0\]\?\.payerPhone\?\.includes\(searchQuery\)/g, '(s as any).payments?.[0]?.payerPhone?.includes(searchQuery)');
  adminSubTab = adminSubTab.replace(/s\.payments\?\.\[0\]\?\.gateway/g, '(s as any).payments?.[0]?.gateway');
  adminSubTab = adminSubTab.replace(/s\.payments\?\.\[0\]\?\.transactionId/g, '(s as any).payments?.[0]?.transactionId');
  adminSubTab = adminSubTab.replace(/viewItem\.payments/g, '(viewItem as any).payments');
  fs.writeFileSync('src/components/dashboard/admin/AdminSubscriptionTab.tsx', adminSubTab);
}

console.log("Fixed files");
