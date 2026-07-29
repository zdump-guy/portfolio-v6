const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Specifically target text-charcoal, text-slate, bg-offwhite
      if (content.includes('text-charcoal')) {
        content = content.replace(/\btext-charcoal\b/g, 'text-text-primary');
        changed = true;
      }
      if (content.includes('text-slate')) {
        content = content.replace(/\btext-slate\b/g, 'text-text-secondary');
        changed = true;
      }
      if (content.includes('bg-offwhite')) {
        content = content.replace(/\bbg-offwhite\b/g, 'bg-bg-primary');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}
replaceInDir('f:/portfolio-v6/components');
replaceInDir('f:/portfolio-v6/app');
console.log('Done replacing theme classes.');
