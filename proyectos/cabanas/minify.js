// ═══════════════════════════════════════════════════════════
//  MINIFY — Cabañas Catamarca
//  Usa html-minifier-terser (instalado globalmente)
//  Uso: node minify.js
// ═══════════════════════════════════════════════════════════

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputFile = path.resolve('index.html');
const outputFile = path.resolve('index.min.html');

if (!fs.existsSync(inputFile)) {
  console.error(`❌ No se encontró ${inputFile}`);
  process.exit(1);
}

const originalSize = fs.statSync(inputFile).size;

console.log('🚀 Minificando con html-minifier-terser...\n');

try {
  const cmd = [
    'html-minifier-terser',
    `"${inputFile}"`,
    `-o "${outputFile}"`,
    '--collapse-whitespace',
    '--remove-comments',
    '--remove-optional-tags',
    '--remove-redundant-attributes',
    '--remove-script-type-attributes',
    '--remove-tag-whitespace',
    '--use-short-doctype',
    '--minify-css true',
    '--minify-js true',
    '--collapse-boolean-attributes',
    '--conservative-collapse',
    '--decode-entities',
  ].join(' ');

  execSync(cmd, { stdio: 'pipe' });

  const minSize = fs.statSync(outputFile).size;
  const saved = originalSize - minSize;
  const savings = ((saved / originalSize) * 100).toFixed(1);

  console.log('✅ Minificación exitosa!');
  console.log(`📄 Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`📦 Minificado: ${(minSize / 1024).toFixed(1)} KB`);
  console.log(`💾 Ahorro: ${savings}%`);
  console.log(`📁 Archivo generado: ${outputFile}`);
} catch (err) {
  console.error('❌ Error durante la minificación:');
  console.error(err.message);
  process.exit(1);
}
