// ═══════════════════════════════════════════════════════════
//  MINIFY — Cabañas Catamarca
//  Usa html-minifier-terser via API (más estable que execSync)
//  Uso: node minify.js
// ═══════════════════════════════════════════════════════════

const { minify } = require('html-minifier-terser');
const fs = require('fs');
const path = require('path');

const inputFile = path.resolve('index.html');
const outputFile = path.resolve('index.min.html');

if (!fs.existsSync(inputFile)) {
  console.error(`❌ No se encontró ${inputFile}`);
  process.exit(1);
}

const originalSize = fs.statSync(inputFile).size;
const inputContent = fs.readFileSync(inputFile, 'utf8');

console.log('🚀 Minificando con html-minifier-terser (API directa)...\n');

minify(inputContent, {
  collapseWhitespace: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeTagWhitespace: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
  collapseBooleanAttributes: true,
  conservativeCollapse: true,
  decodeEntities: true,
}).then((minified) => {
  fs.writeFileSync(outputFile, minified, 'utf8');

  const minSize = fs.statSync(outputFile).size;
  const saved = originalSize - minSize;
  const savings = ((saved / originalSize) * 100).toFixed(1);

  console.log('✅ Minificación exitosa!');
  console.log(`📄 Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`📦 Minificado: ${(minSize / 1024).toFixed(1)} KB`);
  console.log(`💾 Ahorro: ${savings}%`);
  console.log(`📁 Archivo generado: ${outputFile}`);
}).catch((err) => {
  console.error('❌ Error durante la minificación:');
  console.error(err.message);
  process.exit(1);
});
