// ═══════════════════════════════════════════════════════════
//  UNIFICAR — Cabañas Catamarca
//  Lee index.html (source of truth) y genera los 3 parciales
//  de Google Apps Script:
//    - style.html        (solo CSS extraído)
//    - script.html       (solo JS app-logic extraído)
//    - index-gas.html    (template con includes GAS)
//
//  Uso: node unificar.js
//  Sin dependencias externas — solo fs y path
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const INPUT  = path.resolve('index.html');
const OUTPUT_STYLE  = path.resolve('style.html');
const OUTPUT_SCRIPT = path.resolve('script.html');
const OUTPUT_GAS    = path.resolve('index-gas.html');

// ── Leer fuente única de verdad ────────────────────────────
const html = fs.readFileSync(INPUT, 'utf8');

// ── 1. Extraer CSS: todos los <style>...</style> ──────────
const styleRegex = /<\s*style\s*>([\s\S]*?)<\/style\s*>/gi;
const styleBlocks = [];
let match;
while ((match = styleRegex.exec(html)) !== null) {
  styleBlocks.push(match[1]);
}
const styleContent = styleBlocks.join('\n\n');

const styleHeader = [
  '/* ═══════════════════════════════════════════════════════',
  '   Generado automáticamente por unificar.js',
  '   NO editar manualmente — los cambios se pierden',
  '   ═══════════════════════════════════════════════════════ */',
  ''
].join('\n');

fs.writeFileSync(OUTPUT_STYLE, styleHeader + styleContent, 'utf8');
console.log('✅  style.html generado (' + styleBlocks.length + ' bloque(s))');

// ── 2. Extraer scripts: identificar 1ro (config) y 2do (app logic) ─
const scriptRegex = /<\s*script\b[^>]*>([\s\S]*?)<\/script\s*>/gi;
const scriptBlocks = [];
while ((match = scriptRegex.exec(html)) !== null) {
  scriptBlocks.push(match[1]);
}

if (scriptBlocks.length < 2) {
  console.error('❌ Error: se esperaban al menos 2 bloques <script> en index.html');
  process.exit(1);
}

const scriptContent = scriptBlocks[1]; // 2do script = app logic (índice 1)

const scriptHeader = [
  '// ═══════════════════════════════════════════════════════',
  '//  Generado automáticamente por unificar.js',
  '//  NO editar manualmente — los cambios se pierden',
  '// ═══════════════════════════════════════════════════════',
  ''
].join('\n');

fs.writeFileSync(OUTPUT_SCRIPT, scriptHeader + scriptContent, 'utf8');
console.log('✅  script.html generado');

// ── 3. Generar index-gas.html ─────────────────────────────
let gasContent = html;

// 3a. Reemplazar TODOS los <style>...</style> por include
gasContent = gasContent.replace(
  /<\s*style\s*>[\s\S]*?<\/style\s*>/gi,
  '<?!= include(\'style\') ?>'
);

// 3b. Reemplazar SOLO el 2do <script>...</script> por include
let scriptIndex = 0;
gasContent = gasContent.replace(
  /<\s*script\b[\s\S]*?<\/script\s*>/gi,
  (match) => {
    scriptIndex++;
    if (scriptIndex === 2) return '<?!= include(\'script\') ?>';
    return match; // 1er script (config vars) queda inline
  }
);

const gasHeader = [
  '<!-- ═══════════════════════════════════════════════════════',
  '     Generado automáticamente por unificar.js',
  '     NO editar manualmente — los cambios se pierden',
  '     ═══════════════════════════════════════════════════════ -->',
  ''
].join('\n');

fs.writeFileSync(OUTPUT_GAS, gasHeader + gasContent, 'utf8');
console.log('✅  index-gas.html generado');

console.log('\n🎉 Todos los archivos generados correctamente.');
