const fs = require('fs');
const path = require('path');
const dirs = ['users', 'madrasas', 'plans', 'subscription', 'approval', 'pages'];
dirs.forEach(d => {
  const src = path.join('src/app/dashboard', d);
  const dest = path.join('src/app/dashboard/admin', d);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved ${src} to ${dest}`);
  }
});
