/**
 * build.js — Inline CSS/JS from src/ into index.html for production.
 *
 * Reads:  src/index.html  (references style.css + app.js externally)
 *         src/style.css
 *         src/app.js
 * Writes: index.html       (everything inlined, ready for unificar.js + minify.js)
 *
 * Usage:  node build.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const css  = fs.readFileSync(path.join(SRC, 'style.css'),  'utf8');
const js   = fs.readFileSync(path.join(SRC, 'app.js'),     'utf8');

/**
 * Safe string replace — avoids $1, $&, $', etc. interpretation
 * when the replacement contains dollar signs.
 */
function safeReplace(str, search, replacement) {
  const idx = str.indexOf(search);
  if (idx === -1) return str;
  return str.slice(0, idx) + replacement + str.slice(idx + search.length);
}

// 1) Replace <link rel="stylesheet" href="style.css"> with inline <style>
const LINK_MARKER  = '<link rel="stylesheet" href="style.css">';
let out = safeReplace(html, LINK_MARKER, '<style>\n' + css + '\n</style>');

// 2) Replace <script src="app.js"></script> with inline <script>
const SCRIPT_MARKER = '<script src="app.js"></script>';
out = safeReplace(out, SCRIPT_MARKER, '<script>\n' + js + '\n</script>');

// 3) Write to root index.html
const OUT = path.join(__dirname, 'index.html');
fs.writeFileSync(OUT, out, 'utf8');

console.log('✅ build.js — index.html generado con CSS/JS inline');
console.log(`   src/index.html  (${html.length} bytes) → index.html`);
console.log(`   src/style.css   (${css.length}  bytes)`);
console.log(`   src/app.js      (${js.length}   bytes)`);
console.log(`   index.html      (${out.length}  bytes)`);
